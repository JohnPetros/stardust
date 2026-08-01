---
name: judge-plan
description: Avaliar independentemente se um Plan SDD está pronto para implementação.
---

# Julgar Plan

O Orchestrator aciona `judge-plan-agent` como subagente read-only irmão na task
atual, depois de criar o `plan.md` e antes do primeiro Builder.

Envie a Spec `open`, sua revisão, o Plan, Architecture, Rules, pesquisa dos
paths envolvidos, riscos e decisões registradas. O Judge não edita arquivos,
não cria tarefas e não resolve decisões de produto ou arquitetura.

- `accepted`: persista o veredito no Plan e encaminhe para `implement-plan`;
- `failed`: persista cada finding bloqueante no Plan, corrija o Plan sob
  responsabilidade do Orchestrator e acione novo `Judge Plan`;
- não inicie Builders enquanto o veredito estiver `failed` ou `pending`.

O resultado deve usar o formato definido em
`documentation/agents/judge-plan-agent.md`.
