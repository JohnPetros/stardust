---
name: create-plan
description: Criar um Plan SDD como ledger de fases, progresso, evidências e handoff para execução orquestrada.
---

# Criar Plan

O Orchestrator cria o Plan na task atual quando a Spec `open` exigir fases
dependentes, coordenação entre apps, migration relevante, risco alto ou retomada
futura. Para escopo pequeno, use `implement-spec` sem Plan.

Leia Spec, Architecture, Rules e `documentation/rules/sdd-rules.md`. Crie
`documentation/features/<domínio>/<feature>/plans/<nome>-plan.md` com:

- `status: pending`, revisão da Spec e commit-base;
- objetivo, escopo e fora de escopo;
- fases ordenadas e dependências;
- tarefas com paths, resultado observável e IDs `RF-*`, `CA-*` e `RN-*`;
- sensores/evidências esperados por fase;
- riscos, findings ativos, tentativas, estado atual e próxima ação;
- espaço para veredito do Judge de cada fase e da conclusão.

Estados de tarefa: `pending`, `implementing`, `validating`, `verified`. Marque
`[x]` somente depois que o Orchestrator executar os sensores aplicáveis.
Estados de fase: `pending`, `in_progress`, `awaiting_judgment`, `failed`,
`accepted`.

Builders e Workers não editam o Plan. Judges avaliam read-only. Todos serão
subagentes da mesma task durante `implement-plan`; nunca crie outra thread.
