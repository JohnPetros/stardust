---
name: implement-plan
description: Orquestrar um Plan de feature com Builders irmãos, sensores e um Implementation Reviewer por Builder na task atual.
---

# Implementar Plan

Leia `plan.md`, Spec, Architecture, Rules e `documentation/sdd.md`. A task principal mantém o Plan e todo o
fluxo ocorre na task atual.

A seleção de checks segue
`documentation/tooling.md#execução-de-checks-por-impacto`. Use feedback
unitário/estático focado por Builder e agrupe integrações afetadas após integrar
os escopos. Fases/waves e Reviewers não exigem repetir provas válidas nem suites
completas. Serialize comandos que compartilham serviços. Amplie seleções somente
com impacto demonstrado, lacuna concreta ou pedido do usuário e registre o motivo.
Cobertura focada não prova o ratchet agregado obrigatório do CI; execução local
completa segue os limites de Tooling, sem relaxar baselines.

Antes de criar Builders, a task principal verifica a integridade do Plan contra
a revisão vigente da Spec. Se o Plan mudou materialmente, repita esse gate.

Depois do integrity gate, registre no Plan que cada Builder terá um
`Implementation Reviewer` read-only pareado. Cada Reviewer avalia somente o
escopo e o diff do Builder correspondente; não existe aceite compartilhado
entre Builders. Fases podem ser paralelas, e cada par Builder/Reviewer pode
aguardar seus sensores aplicáveis.

Para cada fase, em qualquer modo:

1. confirme revisão da Spec, dependências, critérios, paths e evidências; em UI,
   confirme também o `design/handoff.md`, sua fonte/Node IDs, estados, variantes,
   viewports, receitas, extensões e divergências aprovadas;
2. marque fase/tarefa como `in_progress`/`implementing`;
3. crie `Builder F<n>` para o escopo principal;
4. identifique tarefas prontas, independentes e sem paths sobrepostos;
5. quando houver paralelismo real, crie até dois `Builder F<n>-T<m>` irmãos;
6. após cada Builder, crie imediatamente seu `Implementation Reviewer F<n>`
   (ou `Implementation Reviewer F<n>-T<m>`), envie somente o diff/paths desse
   Builder e aguarde o veredito antes de marcar a tarefa `verified`;
7. inspecione e integre o diff; para UI, use o handoff como contrato offline e compare cada
   node canônico com a Web no mesmo viewport/estado antes de considerar a tarefa `verified`;
8. execute `npm run check:spec-implementation -- <spec> --base <commit-base>`
   antes dos sensores e novamente após qualquer correção de path contratado;
   execute `npm run check:spec-definition -- <spec>` e
   `npm run check:plan-definition -- <plan>` após alterações documentais;
   depois confirme evidência válida e execute checks ausentes/invalidados:
   testes selecionados, lint sem escrita, tipos e `check:test-integrity`;
   acrescente complexidade, arquitetura, build e integrações afetadas no
   candidato integrado conforme Tooling, não a cada fase ou retry;
9. marque tarefas `verified` somente após o Reviewer pareado e os sensores aplicáveis;
10. registre a fase como aguardando a avaliação integrada e avance somente após
   os sensores aplicáveis;
11. registre findings imediatamente, crie Builder Fix e seu Reviewer pareado,
    reabra as tarefas
    afetadas e repita os sensores aplicáveis, criando um novo Reviewer para
    cada Builder afetado.

Builders não criam subagentes nem editam Plan. O Implementation Reviewer não
edita arquivos. A task principal registra no Plan decisões, evidências resumidas, findings,
tentativas e próxima ação; registra na Spec as avaliações formais.

### Validação focada por Builder

- `Builder Core`, `Builder Server`, `Builder Studio` e `Builder Web` executam
  os sensores aplicáveis de código, tipos e testes do próprio escopo;
- alterações de comportamento no Server incluem cenários focados contra o
  servidor real quando exigido pela Spec, cobrindo status/body, validação,
  autenticação, autorização, persistência e efeitos colaterais;
- cada grupo de rotas HTTP alterado mantém o `.rest` correspondente em
  `apps/server/rest-client/`, com uma requisição rotulada por rota e contrato
  atual, sem credenciais;
- cada hook de comportamento `use-*.ts` sob o escopo possui teste
  `tests/use-*.test.ts`, salvo exceção explícita da Rule Pack;
- `Builder Web` usa Playwright para interações/estados afetados, incluindo
  teclado, foco, viewport estreito, console, falhas de request e screenshots
  atuais quando houver Design Contract.

Os Builders reportam comandos, seleção, contagens, resultados, tempo e ambiente,
mas o relatório não é evidência oficial. A task principal verifica os exits e
artefatos no candidato integrado e registra a freshness no `evaluation.md`;
reroda somente checks ausentes ou invalidados, não a suíte para confirmar o relato.

### Reforço de Rules após findings

Quando um finding revelar Rule ausente, ambígua ou repetidamente violada,
classifique-o antes de retomar o trabalho. Se a Rule já for clara, registre
`No change` e corrija apenas a implementação. Caso contrário, atualize a Rule
da camada ou use `register-antipattern` com padrão proibido, alternativa
obrigatória e prova de validação; recompute o Rule Pack, invalide evidências
afetadas e rerode o correction path. Cada finding material deve ter entrada em
`Findings` e, quando reutilizável, em `Lessons learned`, com a autoridade e a
disposição registradas no `evaluation.md`.

## Persistência obrigatória após cada mudança

Depois de **cada mudança de implementação**, a task principal deve atualizar
imediatamente o `plan.md` e o `evaluation.md`, antes de iniciar outra mudança,
executar o próximo sensor ou avançar a tarefa/fase. Isso vale individualmente
para:

- implementação inicial e qualquer `Builder Fix`;
- alterações de seed, fixture, configuração ou ambiente, inclusive mudanças
  remotas e variáveis usadas localmente (sem registrar segredos);
- artefatos gerados, snapshots, migrations, arquivos derivados ou saídas de
  geradores;
- testes novos ou alterados, incluindo testes adicionados apenas para cobrir
  um finding;
- correções após review, falhas de sensor ou CI.

No `plan.md`, registre a tarefa/fase, tentativa, motivo, paths e artefatos
afetados, RF/CA relacionados, estado, dependências e próxima ação. No
`evaluation.md`, registre a mudança como evidência factual, seu impacto nos
critérios, sensores/evidências invalidados ou ainda pendentes, commit/HEAD e
eventuais decisões, warnings e findings. Para seeds/ambiente, registre também
escopo, comando ou procedimento reproduzível e cleanup; para artefatos
gerados, registre a fonte, o gerador e o output; para testes, registre o
comportamento protegido e o comando de execução.

Não agrupe várias mudanças em um único registro retrospectivo. Se a mudança
invalidar afirmações/dependências de Contract, Rule, Pencil ou Playwright,
marque somente a prova/veredito afetado como invalidado e registre o
sensor/Reviewer necessário. Novo SHA ou ledger sozinho não exige nova execução.
Uma tarefa não pode ser marcada `verified` enquanto os dois
artefatos não refletirem a mudança mais recente.

Após todas as fases, execute sensores integrados e o preflight. Consolide em
`evaluation.md` os vereditos de todos os Reviewers pareados, o Contract, Rules,
Architecture, diff integrado, resultados dos sensores, auditoria UI e
evidências Pencil/Playwright. Uma revisão adicional integrada só pode ser criada
quando houver uma interação cross-boundary que não pertença a nenhum Builder.
Execute `npm run check:plan-definition -- <plan>` para confirmar que a definição,
o estado do ledger e os exits correspondem ao status final antes de encaminhar a conclusão.

Antes de encaminhar para `create-pr` ou `conclude-spec`, faça um gate explícito.
Não conclua nem encaminhe enquanto qualquer pré-condição estiver pendente:

- a Spec deve estar no estado de implementação previsto pelo workflow e ter
  passado pelo veredito final; uma Spec ainda `open` não pode ser concluída;
- todas as fases e tarefas devem estar aceitas/verificadas, e cada Builder deve
  ter um Reviewer pareado aceito, sem fase `failed`, como F3 com IR-08;
- nenhum finding bloqueante pode estar aberto, incluindo findings de validação
  manual como IR-09;
- a validação manual autenticada do frontend deve ter sido executada no
  navegador real, cobrindo login, rota protegida, resultado e endpoints
  essenciais `2xx`; diagnósticos detalhados somente para falha inesperada;
- `evaluation.md` deve registrar as evidências atuais, todos os Reviewers
  pareados, o preflight e os SHAs avaliados.
- para frontend, deve existir auditoria de `ui-layer-rules.md` por widget e
  comparação independente dos nodes Pencil aplicáveis com a Web real, com
  dimensões/anchors, divergências aprovadas e evidência no HEAD avaliado; node
  ausente, contradito ou desvio não aprovado bloqueia o encaminhamento;
- a revisão deve cobrir o diff do Builder pareado; mudanças nas afirmações ou
  dependências avaliadas exigem retomar a revisão afetada, sem repetir provas
  independentes válidas por mudança isolada de SHA ou ledger.

Se o gate falhar, registre a pendência no Plan/evaluation, crie o Builder Fix ou
a ação de validação apropriada e permaneça no workflow de implementação. Só
depois do gate atendido encaminhe para `create-pr` e, após o CI verde, para
`conclude-spec`.

Não crie outro papel de implementação, fork ou nova thread para o fechamento.
