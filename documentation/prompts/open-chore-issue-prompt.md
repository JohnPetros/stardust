---
name: open-chore-issue
description: Create a technical GitHub chore issue for maintenance with no behavior change or PRD relation.
---

# Create Chore Issue

Turn a technical maintenance task into a single coherent tracking issue. A chore is not
product: it has no PRD, PRD requirement or product milestone. Do not implement, create a branch,
commit, PR or Spec.

Write the title, the body, the Grilling questions and the justifications in Brazilian Portuguese
(PT-BR). Preserve technical identifiers, paths, URLs and official label names.

## Classification

Use this workflow only when the result does not change user behavior, business
rules, permissions, tenancy, public contracts, API semantics or product outcome.

- change of behavior or capability → `open-feat-issue`;
- observed failure → `open-bug-issue`;
- behavior-preserving structural refactoring → `open-refactor-issue`;
- technical maintenance independent of product → continue in this workflow.

Do not reclassify a task as a chore merely to avoid product clarification or Spec
work.

## Authority and research

Read `AGENTS.md`, `documentation/architecture.md`, `documentation/tooling.md`,
`documentation/rules/rules.md`, `documentation/modules.md` and the Rules applicable to the real paths.
Inspect implementation, tests, configuration and dependencies only enough to describe
the technical problem with evidence.

Do not research, select, mention or associate PRDs, PRD requirements or product milestones.
Do not invent product context to justify the maintenance. Search open and closed issues
of the repository to avoid duplication and check existing labels before the draft.

## Mandatory Grilling gate

After the factual research and before the draft, run the **Grilling gate** defined in
[`sdd.md#grilling-gate`](../sdd.md#grilling-gate). Model as a design tree the still-open decisions about technical outcome,
mitigated risk, boundaries, preserved contracts, verification criteria, affected application and
metadata.

Ask the whole available frontier with a recommendation and leave dependent decisions for later
rounds. Record decisions, discarded alternatives, dependencies and contradictions. An empty frontier
and the confirmation of shared understanding allow preparing the draft, but do not replace
the approval gate of the exact version to be published.

The Stardust project does not use sprints. Treat sprint as not applicable: do not ask about sprint,
do not include sprint in the draft or in the issue metadata.

## GitHub metadata

- repository: `JohnPetros/stardust`;
- use only existing labels, such as `refactor`, `infra`, `documentation`, `web`, `server` and
  `studio`, when really applicable;
- do not use `feature` or `bug`;
- milestone: `None`;
- do not associate with a PRD, PRD requirement or product milestone;
- do not add to Project 2 by product inference.

## Title and body

Use a nominal title, with no commit prefix, describing the technical outcome. Create exactly one
issue, unless decomposition is explicitly requested. Structure every body with these headings, in this
order (the issue itself is written in PT-BR, so the template below stays in Portuguese; the glosses are
"Objective", "Expected Deliverable" and "Dependencies / Constraints"):

```md
## 🎯 Objetivo

<resultado técnico pretendido e risco mitigado>

## 📦 Entregável Esperado

- <artefatos, mudanças ou resultado técnico verificável, incluindo local de registro quando aplicável>
- <validação esperada quando ajudar a definir o resultado concluído>

## ⚠️ Dependências / Restrições

- <dependências, limites técnicos, contratos a preservar ou exclusões relevantes>
- <responsável pretendido, somente quando conhecido ou definido pelo usuário>
- <paths reais da codebase relevantes, com breve justificativa>
```

Keep the issue at the technical delivery level. Include verification criteria alongside the expected
deliverable when they are needed to make the result observable. Record preserved contracts,
dependencies, exclusions and references in the Dependências / Restrições (Dependencies / Constraints) section. Do not invent an owner;
when the assignment is still pending, record that only if it is relevant for tracking.

Do not add milestone, PRD, PRD requirement, signatures, file inventory, detailed technical
flow, new architecture or speculative tasks.

## Approval gate

Before publishing, present the title, body, labels, milestone `None`, confirmation that there is no
relation to a PRD and the technical justification. Do not include sprint in the metadata presented. Publish
only after explicit approval of the current version. The approval authorizes only the submission of the issue;
it does not authorize implementation, branch, commit, PR or Spec.

After publishing, return number/URL, title, labels, milestone `None` and a summary of the technical
outcome.
