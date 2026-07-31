---
name: create-plan
description: Criar um Plan SDD como ledger de fases, progresso, evidências e handoff para uma Spec de feature.
---

# Criar Plan

Crie Plan somente quando a Spec `open` possuir fases dependentes, múltiplos
workspaces, migration relevante, risco elevado ou necessidade real de ledger.
Para Spec pequena, use `implement-spec` diretamente.

O Orchestrator cria o Plan na task atual e mantém a relação com a revisão da
Spec:

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
- vereditos do Judge Implementation por fase.

Estados de tarefa: `pending`, `implementing`, `validating`, `verified`.
Estados de fase: `pending`, `in_progress`, `awaiting_judgment`, `failed`,
`accepted`.

Somente o Orchestrator atualiza o Plan. Builders implementam; Judges avaliam
read-only. Todos são subagentes da task atual. Não use nova thread.
