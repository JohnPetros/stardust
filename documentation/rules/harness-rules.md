# Regras do Harness de Agentes

## Objetivo

Este documento define o protocolo de execução do SDD com agentes separados no
StarDust. A Spec reúne o Contract observável e a solução técnica. O Plan é
opcional e concentra tarefas, progresso e handoff. Pareceres completos permanecem
no chat dos Judges; arquivos persistem apenas o estado necessário para retomar.
Código só é considerado concluído após gates determinísticos e avaliação
independente.

## Papéis

### Orchestrator Agent

- Controla o workflow e mantém a fonte de verdade operacional.
- É o único papel autorizado a atualizar estado, tentativas e findings ativos
  no Plan.
- Congela a revisão da Spec e o commit-base usados em cada avaliação.
- Aciona Builder, aguarda Workers, executa sensores e aciona Judges.
- Não substitui o Judge nem aceita a declaração de conclusão do Builder.

### Builder Agent

- Implementa o escopo recebido e integra os resultados dos Workers.
- Pode acionar Workers somente quando houver paralelismo real e paths de
  escrita independentes.
- Não atualiza Plan, não fecha Spec e não aprova o próprio trabalho.
- Reporta divergências factuais ou contratuais ao Orchestrator antes de agir
  fora do contrato.

### Worker Agent

- Executa uma única tarefa atômica, com resultado observável e paths definidos.
- Não cria outros subagentes.
- Não altera Plan, Spec, PRD, Architecture ou Rules sem tarefa documental
  explícita.
- Reporta arquivos alterados, resultado atingido e qualquer bloqueio ao
  Builder.

### Judge Agent

- É sempre um subagente separado de quem produziu o artefato avaliado.
- Opera em modo read-only por instrução: não corrige código ou documentos.
- Avalia apenas contra as fontes normativas e critérios fornecidos.
- Não cria requisitos e não transforma sugestões fora do contrato em
  bloqueios.
- Todo finding bloqueante deve citar critério, evidência concreta e correção
  necessária.

Existem três etapas independentes de julgamento:

- `judge-spec-agent`: avalia se a Spec está correta, completa e implementável.
- `judge-implementation-agent`: avalia uma fase integrada do Plan ou uma
  implementação direta contra a Spec.
- `judge-conclusion-agent`: avalia a entrega integrada antes do fechamento.

## Fontes de Verdade

Use a seguinte precedência:

1. Revisão humana explícita.
2. PRD na milestone do GitHub para comportamento de produto.
3. Parte Contract da Spec para comportamento verificável.
4. Architecture e Rules para limites e padrões do projeto.
5. Parte técnica da Spec para a solução de implementação.
6. Plan para ordem, estado e handoff.
7. Implementação atual.

Conflitos entre essas fontes não podem ser reconciliados por suposição.

## Separação de Contexto

- Judges devem ser iniciados com contexto limpo e receber apenas o material
  necessário à avaliação.
- O Judge recebe Spec, critérios, Rules, diff e sensores; não recebe a narrativa
  persuasiva do Builder.
- Workers recebem apenas a tarefa, contratos consumidos, paths e Rules
  aplicáveis; não recebem o Plan completo.
- O Judge nunca é filho do Builder. Ele é acionado pelo Orchestrator depois que
  a árvore de implementação terminar.

## Nomenclatura dos Subagentes

Todo despacho deve usar um nome que identifique papel e escopo. Quando a
plataforma aceitar título de exibição, use a coluna **Nome visível**. Para
identificadores técnicos do Codex, use apenas letras minúsculas, números e
underscore.

| Contexto | Nome visível | Identificador técnico |
| --- | --- | --- |
| Builder de fase | `Builder F<n>` | `builder_f<n>` |
| Worker de tarefa | `Worker F<n> T<m>` | `worker_f<n>_t<m>` |
| Judge de fase | `Judge F<n>` | `judge_f<n>` |
| Implementação direta | `Builder Direct` | `builder_direct` |
| Judge direto | `Judge Direct` | `judge_direct` |
| Judge da Spec | `Judge Spec` | `judge_spec` |
| Judge da conclusão | `Judge Conclusion` | `judge_conclusion` |
| Pesquisa por app na criação da Spec | `Research <app>` | `research_<app>` |

Não use nomes aleatórios quando a ferramenta permitir fornecer um identificador.
Reutilize o mesmo nome lógico nas novas tentativas do mesmo escopo; tentativas
continuam diferenciadas pelo histórico do Plan, não pelo nome do agente.

## Estados

### Plan

- `pending`: ainda não iniciado.
- `in_progress`: possui execução ativa ou fases aceitas parcialmente.
- `blocked`: depende de decisão humana ou mudança externa indispensável.
- `completed`: todas as fases foram aceitas e o Judge de conclusão aprovou.

### Fase

```text
pending
→ in_progress
→ awaiting_judgment
→ evaluation_failed
→ in_progress
→ accepted
```

Uma revisão humana pode mover `accepted → changes_requested → in_progress`.
Dependências consumidoras só são liberadas quando a fase antecedente estiver
`accepted`.

### Tarefa

```text
pending
→ implementing
→ validating
→ verified

validating
→ implementing
```

Uma revisão humana pode mover `verified → changes_requested → implementing`.

O checkbox `[x]` de tarefa significa exclusivamente `verified` pelo
Implementation Gate. `accepted` é reservado à fase aprovada pelo Judge ou à
implementação direta sem Plan. Builder e Worker nunca marcam o próprio trabalho
como concluído.

## Gates e Sensores

Sensores produzem evidência determinística. Gates combinam sensores e condições
de estado para autorizar uma transição. Judges avaliam apenas o que não pode ser
decidido deterministicamente. O Orchestrator executa os gates oficiais; relatos
do Builder não substituem a execução real.

A implementação da CLI segue `CommanderApp -> Router -> Command`. Routers não
executam regras nem sensores. Cada `Command` registra sua entrada no Commander e
concentra a execução da própria operação.

### Definition Gate

Execute depois de criar ou alterar a Spec:

```bash
npm run harness -- gate definition --spec=<path>
```

Depois do check determinístico, acione `judge-spec-agent`. A Spec só muda de
`draft` para `open` quando o check e o Judge passarem.

### Readiness Gate

Execute antes de cada despacho ao Builder:

```bash
npm run harness -- \
  gate readiness \
  --spec=<path> \
  --revision=<hash> \
  [--plan=<path> --task=<ID>]
```

O gate valida revisão, Plan/tarefa quando existirem, dependências e prontidão
documental. Falha impede o Builder de iniciar.

### Implementation Gate

Execute depois do Builder para verificar cada tarefa e novamente sobre o escopo
agregado antes de julgar a fase. No modo direto, execute antes de julgar a
implementação:

```bash
npm run harness -- \
  gate implementation \
  --spec=<path> \
  --base=<commit> \
  --allowed-path=<path-ou-glob> \
  --package=<npm-package> \
  --test-path=<path-relativo-ao-pacote>
```

O runner combina `scope-check`, `codecheck`, `typecheck`, `test:unit`,
`architecture-check`, `migration-check` e `contract-check`.
O `contract-check` não executa comandos `test:integration`; ele valida a
rastreabilidade das evidências e executa somente comandos não integrados.
Integração, build, Playwright, runtime, código morto e migrations executáveis
entram por comandos explícitos do Builder ou do Conclusion Gate. A aprovação do gate da tarefa
permite marcá-la `verified`, sem acionar o Judge. Quando `--package` é informado,
os sensores de código e teste são executados somente nesse pacote; `--test-path`
restringe o teste unitário aos arquivos indicados. Sem `--package`, o runner
preserva o modo monorepo completo apenas no Conclusion Gate; o Implementation
Gate exige ao menos um pacote. Quando todas as tarefas estiverem verificadas,
execute o gate agregado da fase; somente depois dele passar acione
`judge-implementation-agent`. No modo direto, acione o Judge após o único gate
da implementação. O `quality-ratchet` não pertence aos Implementation Gates
locais.

### Conclusion Gate

Execute sobre o diff integrado antes do fechamento:

```bash
npm run harness -- \
  gate conclusion \
  --spec=<path> \
  --base=<commit> \
  --allowed-path=<path-ou-glob>
```

Adicione os comandos condicionais aplicáveis. O `quality-ratchet` não roda
localmente; sua evidência oficial vem do CI do PR. Depois do runner passar,
acione `judge-conclusion-agent`. Falha reabre a implementação; sucesso autoriza
fechamento, commit e criação do PR.

Quando existir Plan, registre apenas gate, estado resumido, finding ativo e
próxima ação. Saída completa, stack traces, traces de browser e pareceres dos
Judges não pertencem ao Plan.

## Avaliação

O Orchestrator só aciona `judge-implementation-agent` depois do Implementation
Gate agregado da fase, ou do modo direto, passar. O veredito no chat do Judge
deve ser:

- `accepted`: todos os critérios aplicáveis possuem evidência e não há finding
  bloqueante.
- `failed`: existe violação da Spec, Rule, escopo ou evidência obrigatória.

Observações fora do contrato são não bloqueantes. Em caso de reprovação, o
Orchestrator registra apenas findings ativos e próxima ação no Plan, quando
existir, reabre a tarefa responsável ou cria tarefa corretiva na fase e devolve
os findings bloqueantes ao Builder. Não existe arquivo `evaluation.md`.

O julgamento por tarefa não faz parte do modo planejado. O Judge avalia a fase
como incremento integrado, incluindo a interação entre suas tarefas. Um parecer
antecipado é permitido apenas para risco crítico de contrato, migration,
segurança ou fronteira arquitetural; ele é consultivo e não substitui o
veredito final da fase.

Use no máximo três tentativas pelo mesmo motivo. Depois disso, escale ao usuário
com histórico e evidências.

## Alterações da Spec Durante a Implementação

O prompt `update-spec` não faz parte do pipeline. A atualização ocorre dentro
de `implement-spec` ou `implement-plan`, com o contexto fresco da execução.

### Correção factual

Pode ser aplicada de forma cirúrgica pelo Orchestrator quando não altera
comportamento, escopo, contrato, arquitetura ou critérios de avaliação. Atualize
`last_updated_at`, registre a nova revisão e reavalie apenas o que for afetado.

### Amendment contratual

Mudanças de requisito, escopo, payload, regra de negócio, decisão arquitetural
ou critério de aceite exigem:

1. Pausar a fase e a tarefa ativa.
2. Identificar requisitos, critérios e documentos afetados.
3. Consultar o usuário quando houver conflito com PRD, Architecture ou Rules.
4. Atualizar a Spec de forma cirúrgica.
5. Registrar revisão anterior, nova revisão, motivo e tarefas afetadas no Plan.
6. Invalidar avaliações de fases baseadas no contrato anterior.
7. Atualizar ou criar tarefas.
8. Retomar pelo Builder e reavaliar pelo Judge.

No modo direto, um amendment que introduza múltiplas tarefas, handoff, mudança
arquitetural, Rule ou PRD promove a execução para `create-plan` +
`implement-plan`.

## Atualizações de PRD, Architecture e Rules

- Builder e Worker podem detectar e propor; não mudam fontes normativas por
  iniciativa própria.
- Violação de Rule existente deve ser corrigida no código. Alterar a Rule para
  legitimar a violação exige decisão explícita do usuário.
- Novo padrão aprovado gera tarefa documental no Plan e deve ser documentado no
  mesmo ciclo da implementação.
- Mudança de produto atualiza primeiro a milestone do PRD e depois a Spec.
- `conclude-spec` verifica e consolida essas atualizações; não deve ser o
  primeiro momento em que divergências materiais são descobertas.

## Revisão Humana

Feedback humano explícito prevalece sobre qualquer `verified` ou `accepted`
anterior.

- Se o código viola a Spec, registre finding `HR-*`, reabra a fase e a tarefa
  responsável.
- Se o comportamento desejado muda o contrato, aplique amendment antes do
  código.
- Se amplia materialmente o escopo, crie nova Spec.
- Antes do merge, Spec e Plan podem ser reabertos preservando o histórico.
- Depois do merge, use bug report + Spec de correção ou uma nova Spec; não
  reescreva o ledger histórico.

## Modos de Execução

### Direto

Use `implement-spec` para uma entrega observável, curta e concluível na mesma
sessão. O fluxo continua usando Builder e Judge separados, mas não cria Plan.

### Planejado

Use `create-plan` + `implement-plan` quando houver múltiplas tarefas,
dependências, Workers, tentativas relevantes ou necessidade de handoff. Se o
modo direto adquirir essas características, interrompa e promova a execução.

## Conclusão

`conclude-spec` só inicia quando todas as tarefas estiverem `verified`, todas as
fases estiverem `accepted` ou a implementação direta tiver sido aceita. O
Orchestrator executa sensores finais e aciona `judge-conclusion-agent`, que
avalia integração entre fases, critérios globais e coerência documental sem
repetir a avaliação detalhada de cada fase. Se houver reprovação, reabre a
execução. Se houver aprovação, fecha Spec e Plan, consolida
PRD/Architecture/Rules, cria commits e PR, solicita `@codex review` e aguarda o
CI. O workflow só termina quando o `HEAD` atual possuir Codex Review concluído,
todos os checks — incluindo o `quality-ratchet` — estiverem verdes, não houver
conversas bloqueantes e o PR estiver mergeable. Mudança feita durante esse ciclo
reabre e revalida as fases afetadas.
