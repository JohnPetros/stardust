---
name: create-plan
description: Criar um Plan SDD como ledger de fases, progresso, evidências e handoff para uma Spec de feature.
---

# Criar Plan

Crie `plan.md` somente quando a Spec `open` possuir fases dependentes, múltiplos
workspaces, migration relevante, risco elevado ou necessidade real de ledger.
Para Spec pequena, use `implement-spec` diretamente.

O Orchestrator cria `documentation/features/<domínio>/<feature>/plan.md` na
task atual e mantém a relação com a revisão da Spec:

```yaml
spec: ../specs/<nome>-spec.md
spec_revision: 1
status: pending
```

Inclua:

- objetivo, escopo e fora de escopo;
- fases ordenadas e dependências;
- tarefas com paths, resultado observável e IDs `RF-*`/`CA-*`;
- campo `parallelizable` e motivo quando aplicável;
- sensores e evidências esperados por fase;
- riscos, findings ativos, tentativas, estado e próxima ação;
- veredito do `Judge Plan` antes da implementação;
- vereditos do Judge Implementation por fase.

Estados de tarefa: `pending`, `implementing`, `validating`, `verified`.
Estados de fase: `pending`, `in_progress`, `awaiting_judgment`, `failed`,
`accepted`.

Depois de criar o Plan, acione `judge-plan-agent` como `Judge Plan` read-only.
Somente após `accepted` o Orchestrator deve encaminhar para `implement-plan`.
Em `failed`, persista os findings, corrija o Plan e repita o julgamento antes de
criar Builders.

Somente o Orchestrator atualiza o Plan. Builders implementam; Judges avaliam
read-only. Tarefas, dependências e findings operacionais devem ser persistidos
imediatamente no Plan. Evidências, decisões e lições da feature pertencem ao
`evaluation.md`, criado após implementação ou julgamento. Todos são
subagentes da task atual. Não use nova thread.
