---
name: increase-test-coverage
description: Aumentar cobertura comportamental no StarDust sem enfraquecer baselines, Rules, integridade de testes ou o workflow SDD.
---

# Aumentar cobertura de testes

Use este workflow para uma solicitação explícita de aumento ou preservação da
cobertura automatizada em uma implementação existente do StarDust. Ele é um
workflow de manutenção de testes; não substitui Issue, PRD, Spec ou Plan.

Se a mudança necessária alterar comportamento de produto, autorização,
persistência, contrato público, arquitetura ou resultado de PRD, interrompa o
trabalho de cobertura e encaminhe a alteração pelo workflow SDD normal. Uma
correção de produção só pode entrar nesta tarefa quando for mínima,
behavior-preserving, explicitamente autorizada e registrada no handoff.

## Objetivo e invariantes

Melhore a cobertura comportamental dos workspaces afetados por meio de cenários
significativos. Percentuais são sinais de diagnóstico; não são, sozinhos,
critério de aceite.

Nunca:

- reduza qualquer métrica registrada em `coverage-baseline.json`;
- diminua thresholds, altere exclusões ou enfraqueça `check:test-integrity`;
- adicione assertions superficiais, branches artificiais, sleeps, snapshots sem
  valor ou casos duplicados apenas para elevar uma métrica;
- transforme uma falha real de produto em uma mudança silenciosa de comportamento;
- trate teste unitário mockado como prova de autenticação, persistência,
  integração ou jornada real.

Um baseline pode ser atualizado somente com evidência atual, revisão explícita
e justificativa registrada no `evaluation.md`. CI deve continuar falhando se
qualquer métrica do workspace ficar abaixo do baseline versionado.

## Roteamento antes de editar

Antes de criar ou modificar testes:

1. Determine se a demanda é somente cobertura. Se houver mudança de produto ou
   contrato, pare e use `create-issue`/`create-spec`.
2. Identifique o workspace e o boundary comportamental dono do código.
3. Se existir uma Spec ou Plan aberto relacionado, preserve sua revisão,
   paths, RF/CA, assignment e exits; registre a atividade no `evaluation.md`.
4. Se não houver Contract e a alteração continuar sendo apenas manutenção de
   testes, não invente uma Spec apenas para aumentar um número.

## Autoridades obrigatórias

Leia antes da implementação:

1. `AGENTS.md`;
2. `documentation/architecture.md`, `documentation/tooling.md` e
   `documentation/rules/rules.md`;
3. as Rules específicas dos paths afetados:
   `domain-objects-testing-rules.md`, `use-cases-testing-rules.md`,
   `handlers-testing-rules.md`, `server-routes-testing-rules.md`,
   `web-app-routes-testing-rules.md` e `widget-tests-rules.md`;
4. `documentation/modules.md`, PRD e Design quando o comportamento envolver
   uma capacidade de produto ou UI;
5. source, testes existentes, configuração do runner, fixtures e
   `coverage-baseline.json`.

Use somente comandos declarados nos `package.json` e em `documentation/tooling.md`.
Não use credenciais, tokens, storage state ou dados do `.env.development` em
arquivos versionados, testes ou logs.

## Targets permitidos e integridade

O `check:test-integrity` exige pareamento para source executável alterado
somente nestes targets:

- objetos de domínio: `entities`, `structures` e `aggregates`;
- use-cases;
- controllers REST;
- jobs;
- hooks;
- widgets/views;
- rotas Web (`app/page`, `app/layout`, `app/route`);
- rotas Server;
- RPC actions;
- AI tools.

Testes novos devem seguir as localizações permitidas pelas Rules e pelo checker,
normalmente uma subpasta `tests/` do boundary correspondente ou
`scripts/tests/**`. Um teste fora do allowlist falha com `forbiddenTestPaths`.

Não crie testes diretos para services/repositories genéricos, providers,
gateways, clients, mappers, factories, constantes, interfaces, stores,
contexts, barrels, fakers, fixtures, mocks, tipos, código gerado ou
infraestrutura de testes. Cubra source indireto pelo consumidor permitido ou
registre a exclusão com justificativa.

É permitido remover um teste obsoleto quando o comportamento deixou de existir,
mas a remoção deve estar no escopo e o comportamento restante deve continuar
coberto. O checker deve continuar falhando para redução de casos/assertions,
aumento de `skip`/`todo` ou source testável alterado sem teste correspondente.

## Baseline e descoberta

Antes de editar, registre o estado do workspace:

```bash
npm run check:test-integrity -- --base <commit-base>
npm run test:coverage -w <workspace>
npm run check:coverage -- <workspace>
```

Inspecione o resumo textual e o
`<workspace>/coverage/coverage-summary.json`. Registre para `statements`,
`branches`, `functions` e `lines`:

- baseline versionado;
- valor atual;
- arquivos, funções, branches e linhas não cobertos;
- boundary responsável;
- motivo para testar diretamente, testar indiretamente ou excluir.

Priorize risco de produção, não o menor percentual: regras de domínio,
validação, autorização/tenant, persistência, falha de provider, retry e
idempotência, mapeamento de erros REST, efeitos colaterais, estados loading,
empty, error e recovery, além de interações acessíveis de teclado.

## Matriz de cenários

Antes de implementar, crie uma matriz pequena por boundary contendo:

| Campo | Conteúdo obrigatório |
| --- | --- |
| Source e entry point | arquivo, função pública e boundary dono |
| Teste | arquivo permitido que será criado ou alterado |
| Sucesso | resultado observável e efeitos esperados |
| Alternativas | entrada inválida, ausência, autorização e falhas de dependência |
| Estado/efeitos | transição, persistência, evento, provider ou recuperação |
| Aceite | comportamento que o cenário protege |
| Exclusões | path indireto, gerado, defensivo ou não aplicável e justificativa |

Teste o menor boundary capaz de provar o comportamento. Reutilize fakers,
factories, fixtures e convenções existentes. Assertions devem verificar retorno,
estado e efeitos observáveis, não apenas que um mock foi chamado.

Para UI, cubra o widget ou route boundary com locators acessíveis e os estados
relevantes. Para fluxo real, use Playwright conforme `AGENTS.md`, registre
`console`, `pageerror`, `requestfailed` e respostas HTTP, e nunca declare uma
tela autenticada funcional apenas por uma suíte baseada em mocks.

## Subagentes e ownership

Use subagentes somente quando existirem workstreams independentes e isso reduzir
risco ou tempo. Não paralelize cenários acoplados, fixtures compartilhados ou
paths sobrepostos.

Cada assignment deve informar:

- um workspace e boundary únicos;
- source e test paths exatos que podem ser inspecionados/editados;
- cenários e gaps de cobertura sob responsabilidade do agente;
- Rules, fixtures, comandos e evidências esperadas;
- paths proibidos e proibição de editar Spec, Plan, Evaluation ou Rules.

A task principal mantém decisões compartilhadas, integra diffs, resolve
conflitos e executa a validação final. Relatório de subagente não é evidência:
verifique o diff integrado e repita testes, cobertura e checks.

Quando a cobertura fizer parte de um Plan, mantenha ownership por Builder e um
`Implementation Reviewer` read-only pareado por Builder. Qualquer correção após
um veredito invalida a evidência do Builder afetado e exige nova revisão.

## Implementação dos testes

1. Crie ou ajuste somente testes em targets e paths permitidos.
2. Preserve Arrange-Act-Assert, isolamento por teste e as convenções do runner.
3. Cubra primeiro sucesso e depois branches significativos de erro, autorização,
   ausência, persistência, side effects e recovery.
4. Para controllers, actions, jobs e tools, valide entrada, orquestração e
   saída no contrato público do handler.
5. Para rotas Server, use a borda Hono/HTTP e persistência real quando a Rule
   exigir; não substitua integração por mock interno.
6. Para páginas Web, diferencie teste de composição da página, widget e fluxo
   Playwright real.
7. Se precisar de um refactor mínimo para testabilidade, explique-o no
   `evaluation.md` e prove que o comportamento não mudou.

Não altere thresholds, exclusões, classificação de source ou Rules para fazer o
check passar. Não versione coverage output, screenshots locais, credenciais ou
artefatos gerados.

## Gate de validação

Execute primeiro o teste focado e depois os sensores aplicáveis:

```bash
npm run check:test-integrity -- --base <commit-base>
npm run test:coverage -w <workspace>
npm run check:coverage -- <workspace>
npm run check:code
npm run check:types
npm run test:unit
```

Acrescente conforme os paths e Rules:

```bash
npm run check:architecture
npm run test:integration
npm run test:scripts
npm run check:spec-definition -- <spec>
npm run check:plan-definition -- <plan>
npm run check:spec-implementation -- <spec> --base <commit-base>
```

Para Core, Server, Studio e Web, `test:coverage` e `check:coverage` são
obrigatórios. `lsp`, `validation`, `typescript-config` e `email` permanecem
fora do quality ratchet de cobertura. Use validação de banco, browser, build ou
geração somente quando o boundary exigir.

O gate só passa quando:

- todos os testes novos passam;
- `check:test-integrity` passa sem forbidden paths ou source testável sem par;
- cada métrica do workspace permanece no mínimo no baseline;
- nenhuma threshold, exclusão ou classificação foi enfraquecida;
- evidências de UI, runtime, persistência, autorização e integração estão
  atuais quando aplicáveis;
- gaps restantes têm boundary, motivo e próximo passo explícitos.

## Evaluation e handoff

Se houver `evaluation.md`, atualize-o como ledger vivo após cada mudança,
registrando comando, resultado, SHA/base, freshness, path afetado, cenário,
finding e decisão. Evidência anterior a uma mudança fica `stale`.

Entregue um relatório com:

1. workspaces e source/test paths afetados;
2. gaps escolhidos e cenário que cada teste prova;
3. statements, branches, functions e lines antes/depois;
4. comandos exatos e resultados;
5. evidências de integridade, cobertura, integração, browser, persistência e
   autorização, quando aplicáveis;
6. gaps restantes, justificativa e follow-up;
7. qualquer alteração behavior-preserving feita para permitir testabilidade.

Não declare que cobertura, sozinha, prova aceite de feature, autorização,
persistência, integração ou conclusão da jornada do usuário.
