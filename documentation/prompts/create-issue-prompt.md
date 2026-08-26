---
name: create-issue
description: Router compatível para encaminhar feature e bug issues aos workflows dedicados e criar chore issues técnicas com approval.
---

# Criar Issue — router

Classifique o pedido e encaminhe imediatamente:

- feature/task de produto → `create-feat-issue`;
- falha observada → `create-bug-issue`;
- manutenção sem mudança de comportamento → continue como chore abaixo.

## Chore

Leia `AGENTS.md`, Architecture, Tooling, `documentation/rules/rules.md`, Rules afetadas e paths
reais. Antes do draft, pesquise `documentation/**/prd.md`, `documentation/prds/*.md` e milestones
abertas/fechadas; identifique o PRD mais próximo pelo módulo, lifecycle e comportamento
preservado. Para chore, essa referência é contexto e não transforma manutenção em feature. Se
nenhum PRD for relevante, registre `None — <busca executada e motivo>`.

Crie uma issue técnica com título nominal, labels existentes (`refactor`, `infra` ou
`documentation`, mais `web`/`server`/`studio`) e sem milestone de produto por inferência.

```md
## Objetivo

<resultado técnico e risco mitigado>

## Escopo técnico

- <mudança incluída>
- **Fora do escopo:** <limite>

## Critérios de verificação

- [ ] <resultado verificável>

## Contexto de produto

- **PRD mais relevante:** <URL/path ou None com motivo>
- **Requisito do PRD:** <anchor/ID, documento completo ou Não aplicável>

## Referências na codebase

- `<path real>` — <relevância>
```

Apresente título, body, labels, milestone (`None` por padrão), PRD/requisito selecionado e
justificativa antes de publicar. Crie no GitHub somente após aprovação explícita. Este router não
implementa, cria branch, commit ou PR.
