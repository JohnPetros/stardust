# Spec-Driven Development (SDD) no StarDust

## Objetivo

O SDD transforma uma demanda em uma entrega verificável. O fluxo ocorre na
mesma task e o Orchestrator coordena Builders, Judges, sensores e os artefatos
documentais.

```text
Demanda
→ Spec
→ Judge Spec
→ Plan opcional
→ Judge Plan
→ Implementação
→ sensores locais
→ Judge Implementation único da implementação integrada
→ preflight
→ evaluation.md
→ PR / Quality Gate / build no CI
→ Spec concluída
```

O Plan não é obrigatório:

- Specs pequenas e coesas usam `implement-spec`.
- Implementações grandes, com fases dependentes ou risco que exija um ledger
  operacional usam `create-plan` + `implement-plan`.

## Artefatos e fontes de verdade

Para novas entregas, a organização é:

```text
documentation/features/<domínio>/<feature>/
├── spec.md
├── plan.md          # opcional
└── evaluation.md    # obrigatório após implementação ou julgamento
```

Para uma mudança posterior, correção ou evolução de uma feature já concluída:

```text
changes/<nome-da-mudanca>/
├── spec.md
└── evaluation.md
```

Artefatos históricos que ainda estejam em `specs/`, `plans/` ou `reports/` não
precisam ser migrados incidentalmente. Toda nova entrega deve usar a
organização atual.

Cada descoberta deve ser persistida imediatamente pelo Orchestrator no artefato
correto:

| Descoberta | Artefato | Registro esperado |
| --- | --- | --- |
| Mudança de requisito, Contract ou escopo | `spec.md` | amendment, revisão e novo Judge Spec quando necessário |
| Tarefa, dependência ou finding operacional | `plan.md` | tarefa, estado, tentativa, dependência ou próxima ação |
| Evidência, decisão ou lição específica da feature | `evaluation.md` | evidência, decisão, warning, finding ou lição |
| Regra reutilizável para o projeto | `documentation/rules/` | atualização da Rule aplicável |

Se uma implementação direta produzir um finding operacional que exija tarefas
ou fases, o Orchestrator cria `plan.md` antes de continuar. Sem Plan, findings
curtos e sua resolução ficam registrados em `evaluation.md`.

A precedência é:

1. revisão humana explícita;
2. origem declarada da demanda;
3. Contract da Spec;
4. Architecture e Rules;
5. solução técnica da Spec;
6. Plan, quando existir;
7. implementação atual;
8. evidências registradas em `evaluation.md`.

### Regra transversal: fidelidade Pencil-to-code

Quando o escopo possuir uma referência `.pen`, os nodes declarados na Spec são
a fonte visual canônica do código. A implementação deve preservar, para cada
node e estado aplicável, a composição, hierarquia, dimensões, espaçamento,
tipografia, cores, bordas, elevação, ícones/assets, densidade e variantes
observáveis. A tradução para HTML semântico, acessibilidade, interação, dados e
reflow responsivo é permitida quando necessária, mas não pode substituir,
simplificar ou reinterpretar a referência visual.

Toda divergência deve ser registrada como decisão ou amendment, vinculada ao
node e ao `CA-*` afetado, com motivo verificável e aprovação antes da
implementação. Um node ausente, contradito ou alterado sem aprovação é finding
bloqueante. A validação exige comparação independente Pencil/Web no mesmo
viewport e estado, além do fluxo real no Playwright; screenshot isolado ou a
afirmação de que a tela foi “verificada visualmente” não é evidência suficiente.

Quando não houver fonte visual canônica, isso deve ser declarado na Spec. Não
invente arquivo, Node ID ou detalhe visual para preencher a lacuna.

## Spec

Uma Spec pode nascer de PRD, Issue, Report ou demanda direta. O PRD não é
obrigatório para correções ou tarefas técnicas, mas toda Spec possui Contract.

```yaml
---
title: <título>
status: draft
revision: 1
source:
  type: <prd|issue|report|direct-request>
  ref: <path|url|codex-task>
scope:
  - <workspace|diretório|arquivo>
last_updated_at: YYYY-MM-DD
---
```

Estados válidos: `draft`, `open`, `in_progress`, `completed` e `cancelled`.
`failed` é veredito de Judge; `blocked` é estado operacional de tarefa ou fase.

O corpo deve conter:

1. contexto e objetivo;
2. escopo e fora de escopo;
3. Contract;
4. estado atual;
5. solução técnica;
6. plano de validação;
7. avaliações previstas;
8. alinhamento documental;
9. amendments.

Use somente `RF-*` e `CA-*` como IDs obrigatórios. A matriz deve relacionar
cada `CA-*` à evidência esperada e, depois, à evidência real em
`evaluation.md`.

Toda interface, port, repository ou service criado ou alterado pela solução deve
ter seus métodos especificados com nome, entrada e retorno. Não deixe assinaturas
de contratos para decisão do Builder ou apenas para o Plan; detalhes internos de
implementação continuam fora do Contract quando não afetam comportamento.

Uma alteração de Contract, requisito ou escopo depois de `open` exige pausa,
revisão da Spec, amendment, incremento de `revision` e novo Judge Spec. Uma
alteração puramente técnica pode atualizar a solução e exigir nova avaliação de
implementação apenas quando invalidar evidências ou critérios.

## Plan opcional

O Plan só é criado quando houver fases dependentes, múltiplos workspaces,
migração relevante, risco elevado ou necessidade real de ledger operacional.

Ele registra:

- objetivo, escopo e fora de escopo;
- fases ordenadas e dependências;
- tarefas com paths, resultado observável e IDs `RF-*`/`CA-*`;
- paralelismo e sua justificativa;
- sensores e evidências esperados por fase;
- riscos, findings, tentativas, estado e próxima ação;
- veredito do Judge Plan antes da implementação;
- escopo, evidências e veredito do único Judge Implementation Final.

Estados de tarefa: `pending`, `implementing`, `validating` e `verified`.
Estados de fase: `pending`, `in_progress`, `awaiting_judgment`, `failed` e
`accepted`.

Somente o Orchestrator atualiza o Plan. Tarefas e findings operacionais devem
ser registrados nele imediatamente.

## Orquestração de agentes

Todos os subagentes são criados diretamente pelo Orchestrator e são irmãos:

```text
Orchestrator
├── Builder Direct
├── Builder F<n> / Builder F<n>-T<m>
├── Builder Fix QG-<n>
└── Judge Spec / Judge Plan / Judge Implementation
```

O Builder é o único papel de implementação. O Judge é read-only e não corrige
o próprio objeto de avaliação.

O Orchestrator deve:

- classificar a demanda e escolher Spec direta ou Plan;
- congelar a revisão da Spec e o commit-base antes da implementação;
- garantir paths sem sobreposição entre Builders;
- executar ou delegar sensores determinísticos aplicáveis;
- persistir descobertas imediatamente no artefato correto;
- criar o `evaluation.md` antes do PR, com evidências reais e vereditos;
- encaminhar a entrega para `create-pr` e, depois, `conclude-spec`.

Para um Plan, o único Judge Implementation ocorre depois da integração de todas
as fases. As fases passam por sensores, mas não recebem aceite independente de
Judge. O `conclude-spec` não cria um segundo Judge: usa o veredito final já
registrado e só pode concluir se nenhuma alteração posterior tiver invalidado o
diff ou as evidências avaliadas.

## Sensores, preflight e CI

Sensores locais:

| Comando | Uso |
| --- | --- |
| `npm run format` | aplicar formatação; não é gate |
| `npm run check:code` | lint e consistência estática |
| `npm run check:types` | contratos TypeScript |
| `npm run test:unit` | comportamento isolado |
| `npm run check:architecture` | fronteiras, quando aplicável |
| `npm run test:integration` | APIs, banco e fluxos integrados, quando aplicável |

Para frontend, a validação de `ui-layer-rules.md` é um gate separado. O
`check:architecture` verifica dependências e fronteiras de módulos, mas não
verifica o Widget Pattern, a separação Entry Point/View/Hook ou a fidelidade ao
Pencil. O Orchestrator deve registrar uma auditoria determinística da UI com
paths e linhas dos widgets alterados.

O ciclo curto usa `format`, `check:code`, `check:types` e `test:unit`. O
preflight executa todos os sensores aplicáveis no escopo integrado antes da
criação do PR.

Quality Gate e build final pertencem ao CI:

- o Quality Gate repete os checks aplicáveis;
- o build roda depois do Quality Gate;
- o build não precisa rodar a cada fase ou retry;
- `check:dead-code` não é sensor oficial;
- Playwright MCP pode fornecer evidência de browser, mas não substitui um
  `test:integration` automatizado quando o comportamento precisa ser protegido.

## Evaluation

`evaluation.md` é obrigatório depois da implementação ou do primeiro
julgamento relevante e deve existir antes do PR. Ele é o registro de fatos da
entrega, não uma cópia da Spec.

Deve registrar:

- revisão da Spec, commit-base e commit avaliado;
- matriz de `CA-*` com evidências reais;
- resultado do Judge Spec e do Judge Implementation;
- auditoria das Rules aplicáveis, incluindo Entry Point/View/Hook quando houver
  UI;
- matriz visual separada para Pencil e Playwright, com node, viewport, estado,
  rota, commit e screenshot/comparação;
- divergências Pencil-to-code aprovadas, com node, motivo, impacto e decisão;
- sensores locais e preflight;
- Quality Gate e build do CI, inicialmente `pending` quando o PR ainda não
  existe;
- warnings e findings, com estado e resolução;
- decisões tomadas e lições aprendidas;
- alinhamento documental e alterações posteriores.

Toda evidência nova, decisão ou lição deve ser acrescentada imediatamente ao
`evaluation.md`. O documento acompanha a entrega até o CI ficar verde.

## Falhas e retries

Se um Judge falhar, a Spec continua `in_progress`. O Orchestrator registra o
finding no Plan, quando existir, ou no `evaluation.md`, cria `Builder Fix` e
repete os sensores afetados. O único Judge Implementation Final é repetido
quando o diff ou qualquer evidência de Contract, Rule, Pencil ou Playwright for
invalidada. Qualquer alteração depois do veredito final invalida o aceite
anterior, mesmo que a alteração seja uma correção técnica.

Se o Quality Gate ou o build do CI falhar:

1. registrar a falha imediatamente em `evaluation.md`;
2. manter a Spec `in_progress`;
3. criar `Builder Fix QG-<n>` quando a correção estiver no escopo;
4. repetir os sensores afetados;
5. repetir o Judge Final sempre que o diff ou a evidência tiver sido invalidada;
6. atualizar `evaluation.md` com a nova evidência e decisão.

Depois de três falhas consecutivas pelo mesmo motivo, o Orchestrator apresenta
o histórico e pede decisão ao usuário.

## Entrega e conclusão

`create-pr` só atua depois do preflight e da criação do `evaluation.md`. Ele
organiza commits pendentes, cria o PR, inclui o resumo da Spec e da avaliação,
solicita review e permanece aberto acompanhando o CI até o Quality Gate e o
build passarem no HEAD atual.

Se o CI falhar, `create-pr` registra a falha em `evaluation.md`, cria ou
encaminha um `Builder Fix QG-*`, repete os sensores afetados, atualiza a branch
e aguarda o CI novamente. O loop continua até o CI verde; após três falhas
consecutivas pelo mesmo motivo, a decisão é escalada ao usuário.

`conclude-spec` só fecha a entrega quando:

- a implementação ou todas as fases foram aceitas;
- não há findings bloqueantes;
- `evaluation.md` está completo;
- Quality Gate e build do CI estão verdes;
- review e conversas bloqueantes foram resolvidos;
- o HEAD avaliado é o HEAD final;
- o Judge Final permanece válido para esse HEAD, sem alterações posteriores não
  julgadas;
- toda validação visual aplicável possui evidência independente de Pencil e
  Playwright.

Então o Orchestrator atualiza `evaluation.md`, alinha a documentação aplicável,
altera a Spec para `completed` e conclui o Plan, se existir.

## MCPs

MCPs são ferramentas de contexto, não sensores:

- Serena: navegar pela codebase;
- Context7: consultar documentação atualizada;
- Pencil: consultar e validar design;
- Playwright: inspecionar fluxos reais no navegador;
- Supabase Dev/Prod: verificar schema e integrações autorizadas.

## Regras de documentação

Atualizações normativas necessárias para orientar a implementação acontecem
antes do Builder. Alinhamentos factuais e lições generalizáveis são resolvidos
na conclusão; mudanças de produto, novas Rules globais, fronteiras
arquiteturais ou expansão material de escopo exigem decisão do usuário.
