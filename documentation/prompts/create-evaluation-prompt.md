---
name: create-evaluation
description: Criar e manter o evaluation.md canônico como ledger vivo de critérios, evidências, findings, CI e lições de uma entrega SDD.
---

# Criar Evaluation

Materialize `evaluation.md` ao lado da Spec no kickoff de `implement-spec`, antes de qualquer
edição de feature, usando a estrutura canônica abaixo. Atualize após cada mudança, sensor,
browser, migration, artifact, finding ou correção. Evidência anterior afetada vira `stale`.

```md
---
feature: "<domínio>/<feature>"
spec: ./spec.md
plan: ./plan.md # omitir no direto
spec_revision: 1
status: in_progress
updated_at: YYYY-MM-DD
---

# Evaluation

Current result: <resultado atual>

## Acceptance matrix

| Criterion | Evidence | Status |

## Automated and runtime evidence

| ID | Layer | Command or scenario | Result | Status |

## Manual evidence

| ID | Scenario | Criteria | Expected | Observed | Status |

## Visual evidence

| ID | Surface and state | Viewport | Reference | Implementation | Differences | Status |

## Rule and documentation compliance

| Authority | Reference | Result | Notes |

## Findings

| ID | Classification | Source | Affected evidence | Status | Resolution |

## PR CI quality gate

| ID | Workflow | Head SHA | Result | Run |

## Lessons learned

| Lesson | Source finding | Authority disposition |

## History

| Date/Time | Event |
```

Use IDs estáveis `EV-*`, `MV-*`, `VIS-*`, `FND-*` e `CI-*`. Status de evidência:
`pending`, `passed`, `failed`, `stale`, `not_applicable`; finding: `active`, `resolved`,
`accepted_non_blocking`, `superseded`; Evaluation: `in_progress`, `ready`, `completed`.

Relatos de Builder/Reviewer não são evidência oficial. Registre comandos realmente executados,
expected e observed, ambiente sem segredos, artifact IDs, respostas HTTP/persistência e freshness.
A tabela de CI só é preenchida por `conclude-spec` para o HEAD do PR.
