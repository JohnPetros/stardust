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
- `judge-implementation-agent`: avalia uma tarefa ou implementação direta contra a
  Spec.
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

## Estados

### Plan

- `pending`: ainda não iniciado.
- `in_progress`: possui execução ativa ou tarefas aceitas parcialmente.
- `blocked`: depende de decisão humana ou mudança externa indispensável.
- `completed`: todas as tarefas foram aceitas e o Judge de conclusão aprovou.

### Tarefa

```text
pending
→ implementing
→ validating
→ evaluation_failed
→ implementing
→ accepted
```

Uma revisão humana pode mover `accepted → changes_requested → implementing`.

O checkbox `[x]` significa exclusivamente `accepted`. Builder e Worker nunca
marcam o próprio trabalho como concluído.

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

Execute depois do Builder e antes de aceitar a tarefa ou implementação direta:

```bash
npm run harness -- \
  gate implementation \
  --spec=<path> \
  --base=<commit> \
  --allowed-path=<path-ou-glob> \
  --workspace=<core|server|web|studio>
```

O runner combina `scope-check`, `codecheck`, `typecheck`, `test:unit`,
`quality-ratchet`, `architecture-check`, `migration-check` e `contract-check`.
Integração, build, Playwright, runtime, código morto e migrations executáveis
entram por opções explícitas declaradas na Spec. Somente depois da parte
determinística passar acione `judge-implementation-agent`.

### Conclusion Gate

Execute sobre o diff integrado antes do fechamento:

```bash
npm run harness -- \
  gate conclusion \
  --spec=<path> \
  --base=<commit> \
  --allowed-path=<path-ou-glob> \
  --workspace=<workspace>
```

Adicione todos os workspaces e comandos condicionais aplicáveis. Depois do
runner passar, acione `judge-conclusion-agent`. Falha reabre a implementação;
sucesso autoriza fechamento, commit e PR.

Quando existir Plan, registre apenas gate, estado resumido, finding ativo e
próxima ação. Saída completa, stack traces, traces de browser e pareceres dos
Judges não pertencem ao Plan.

## Avaliação

O Orchestrator só aciona `judge-implementation-agent` depois do Implementation
Gate passar. O veredito no chat do Judge deve ser:

- `accepted`: todos os critérios aplicáveis possuem evidência e não há finding
  bloqueante.
- `failed`: existe violação da Spec, Rule, escopo ou evidência obrigatória.

Observações fora do contrato são não bloqueantes. Em caso de reprovação, o
Orchestrator registra apenas findings ativos e próxima ação no Plan, quando
existir, e devolve os findings bloqueantes ao Builder. Não existe arquivo
`evaluation.md`.

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

1. Pausar a tarefa.
2. Identificar requisitos, critérios e documentos afetados.
3. Consultar o usuário quando houver conflito com PRD, Architecture ou Rules.
4. Atualizar a Spec de forma cirúrgica.
5. Registrar revisão anterior, nova revisão, motivo e tarefas afetadas no Plan.
6. Invalidar avaliações baseadas no contrato anterior.
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

Feedback humano explícito prevalece sobre qualquer `accepted` anterior.

- Se o código viola a Spec, registre finding `HR-*` e reabra a tarefa.
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

`conclude-spec` só inicia quando todas as tarefas estiverem `accepted` ou a
implementação direta tiver sido aceita. O Orchestrator executa sensores finais
e aciona `judge-conclusion-agent`. Se houver reprovação, reabre a execução; se houver
aprovação, fecha Spec e Plan, consolida PRD/Architecture/Rules e prepara commit e
PR.
