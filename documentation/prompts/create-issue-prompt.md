---
name: create-issue
description: Router compatível para encaminhar feature e bug issues aos workflows dedicados e criar chore issues técnicas com approval.
---

# Criar Issue — router

Classifique o pedido e encaminhe imediatamente:

- feature/task de produto → `create-feat-issue`;
- falha observada → `create-bug-issue`;
- refatoração estrutural sem mudança de comportamento → `create-refactor-issue`;
- manutenção técnica sem mudança de comportamento → `create-chore-issue`.

Este router apenas classifica e encaminha. Os workflows dedicados definem sua própria pesquisa,
Grilling, template, metadata e approval gate. Não implemente, crie branch, commit, PR, Spec ou Plan.
