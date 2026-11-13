---
name: open-feat-issue
description: Create a product GitHub feature issue in Stardust from an approved milestone, PRD or request, with approval and Project 2.
---

# Create Feature Issue

Turn a product capability or outcome into a single coherent issue. Do not implement,
create a branch, commit, PR or Spec.

Write the title, the body, the Grilling questions and the justifications in Brazilian Portuguese (PT-BR).
Preserve technical identifiers, paths, URLs and official label names.

## Authority

Read `AGENTS.md`, `documentation/rules/rules.md`, `documentation/modules.md` and the given product
milestone. When the milestone links the canonical PRD in `documentation/prds/`, read both. Read the
Architecture and the layer Rules only when a material constraint needs to be preserved; details of
paths, declarations, runtime and commands belong to the Spec.

Consume the real structure of the authority:

- New PRDs: Outcome, Actors, Consumes, Provides, Capabilities, Experience and User Journeys;
- Legacy PRDs/milestones: description, requirements, business rules, UI/UX, criteria, flows and
  out of scope.

Do not treat the dependency graph or textual order as implementation. Preserve checkboxes/status. If
the milestone, PRD, code and request conflict materially, clarify before the draft.

## Mandatory PRD gate

Before the draft:

1. derive the requested module, actors, outcome, capabilities and lifecycle;
2. search the canonical PRD in `documentation/prds/*.md` and the feature PRDs in `documentation/**/prd.md`;
3. search open and closed milestones via GitHub and follow their PRD links;
4. compare candidates by the full contract and by the User Journeys/flows, not just by
   title or path proximity;
5. select exactly one main PRD and the most specific `RP-*` that covers the issue;
6. do not treat the milestone as a PRD; if no canonical PRD in `documentation/prds/` governs the outcome,
   route first to `create-prd`.

A feature issue cannot reach the approval gate with an unknown PRD. If no candidate
governs the outcome, route first to `create-prd` or an amendment. If two candidates are
materially equivalent or conflicting, ask for a decision before drafting.

When the PRD governs the flow but **does not cover** the requested behavior (for example, the `RP-*`
only describes the generic failure), do not block the issue for that: cite the most specific `RP-*`,
record under “Rastreabilidade” (Traceability) that the rule does not yet exist in the PRD and declare the PRD amendment as a
prerequisite of the Spec. Take the choice between this approach and first creating a new `RP-*` via
`create-prd` to the Grilling.

## Mandatory Grilling gate

Follow the **Grilling gate** defined in
[`sdd.md#grilling-gate`](../sdd.md#grilling-gate) in full. This prompt only
applies the protocol to the context of a Feature Issue; do not duplicate it or create parallel rules.

Apply the round format of [`grilling-prompt.md`](grilling-prompt.md) **from the first
round** (`## Grilling — round <n>`, questions `Q<n>` with options `(a)`/`(b)` and a line `➡️ I recommend`,
continuous IDs across the session). Do not use free numbered lists or question tools; the
questions go directly in the conversation.

After the factual research and before the draft, model as a design tree the still-open decisions
about outcome, actors, scope, observable criteria, out of scope, milestone and priority, without
anticipating the Spec's Technical Contract. In every feature issue, ask whatever remains
materially open among:

- handling of the PRD when it does not cover the behavior;
- milestone;
- one issue or a decomposition (for example, `web` and `server` together or separate);
- permission and backend authority over new actions, including reusing an existing endpoint;
- usage limits (cooldown, rate limit) when the action can be repeated;
- design coverage (viewports and states) when there is UI;
- priority.

Recompute the frontier per round, ask all the available decisions with a recommended answer and
wait for confirmation of shared understanding before preparing the draft. This confirmation
does not replace the approval gate of the exact version to be published.

## GitHub metadata

- repository: `JohnPetros/stardust`;
- required label: `feat`;
- required assignee: `JohnPetros` on every feature issue;
- add `web`, `server` and/or `studio` when confirmed;
- use `infra` or `documentation` only when they are a real part of the deliverable;
- use only existing labels;
- associate exactly one product milestone;
- after it is created, add it to Project 2, set `Status: Todo` and the approved priority
  (`HIGH`, `MEDIUM` or `LOW`), querying current IDs via GraphQL instead of hardcoding.

If the milestone or priority is not available, obtain it before the final approval.

When the issue involves UI, check in the Penpot `stardust` file (page, board and frame, by name) the
frames of each viewport and state that the issue will cite. If any is missing, take to the Grilling the
decision of whether to draw it first or to cite only what exists; if it is drawn, cite the
exact names created. States that follow an existing pattern (for example, loading and toast) do
not require a new frame, but the issue must say which pattern they follow.

To publish, write the body to a file in the scratchpad and use `gh issue create --body-file`,
with `--label`, `--assignee` and `--milestone` by title. For Project 2, query via GraphQL
the project `JohnPetros`/`projectV2(number: 2)` and the `Status` and `Priority` fields, add the item
and write both fields. Re-read the written values before reporting.

## Title and body

Use a noun-phrase title, without a commit prefix and outcome-oriented, following the repository's current
pattern.

The issue body is written in PT-BR, so the template below keeps its literal Portuguese headings and
placeholders; an English gloss follows the block.

```md
## 🎯 Objetivo

<resultado para usuário ou negócio>

## 📦 Escopo da Entrega

- <comportamento/capacidade incluída>
- <restrição material de produto, Design ou integração>
- <board do Penpot `stardust` exato (página e nome) quando fornecido>

## ✅ Critérios de Aceitação

- <sucesso observável>
- <validação/erro observável>
- <autorização/tenant quando aplicável>
- <responsividade/acessibilidade quando aplicável>
- <critério adicional observável>

## 🧪 Validação

Backend (quando afetado):

- <comandos e testes relevantes para os contratos do servidor>

Frontend (quando afetado):

- <comandos e testes relevantes para as aplicações de interface>

Evidências esperadas:

- <testes automatizados, validação manual ou E2E relevantes>
- <validação visual, responsiva e de acessibilidade quando aplicável>

## 🔗 Rastreabilidade

- PRD principal: <path do PRD canônico em documentation/prds/ e versão>
- PRD complementar: <path e versão ou Não aplicável>
- Requisitos: <RP-* principal e requisitos complementares aplicáveis>
- Jornadas: <JN-* aplicáveis ou Não aplicável>
- Issue/User Story de origem: <identificador existente ou Não aplicável>
- Design: <arquivo e node/frame exatos ou Não aplicável>
- Spec: <status ou Pendente conforme o processo>
- PR: <URL ou Pendente — será vinculada pelo workflow open-pr>
- Milestone: <URL>

## 🚫 Fora de Escopo

- <comportamento ou capacidade explicitamente excluído>
- <alteração adjacente que não pertence a esta entrega>
```

English gloss of the template (not part of the issue body):

- `Objetivo` (Objective): outcome for the user or the business.
- `Escopo da Entrega` (Delivery Scope): included behavior/capability, material product/Design/integration constraints and the exact Penpot `stardust` board (page and name) when provided.
- `Critérios de Aceitação` (Acceptance Criteria): observable success, validation/error, authorization/tenant, responsiveness/accessibility and any additional observable criterion.
- `Validação` (Validation): relevant commands and tests for the backend and frontend when affected, and the expected evidence (automated tests, manual validation or E2E, visual/responsive/accessibility validation).
- `Rastreabilidade` (Traceability): main PRD, complementary PRD, requirements, journeys, source Issue/User Story, Design, Spec, PR (`Pendente` — pending — until linked by the `open-pr` workflow) and Milestone; `Não aplicável` means not applicable.
- `Fora de Escopo` (Out of Scope): explicitly excluded behavior or capability and adjacent changes that do not belong to this delivery.

Do not include a sprint: the Stardust project does not use sprints. The “Requisito” (requirement) field must contain the
reference of the selected main requirement, and only applicable complementary requirements
must be listed as support.

Keep the issue at the product delivery level. Do not include signatures, file inventory, detailed
technical flow or new architecture decisions. Preserve design frame names exactly
when provided.

## Approval gate

Before publishing, present the exact title, body, labels, assignee, milestone, selected PRD/requirement,
relevance justification, Project, Status and priority. Publish only after explicit
approval of the current version. Approval does not authorize implementation, branch, commit, PR or Spec.

Confirmation of shared understanding, or a request such as “publique” (publish), given before the
user has seen the complete draft, is not approval: present the exact draft and ask for approval of that
version. If the user asks for a change, re-present the current version before publishing.

After publishing, return the number/URL, title, milestone, PRD/requirement, labels,
Project/Status/Priority and a summary of the scope.

## Constraints

- one issue unless a decomposition is explicitly requested;
- preserve module boundaries and backend authority for permissions, economy and tenancy;
- no cleanup, dependencies or speculative behavior;
- do not publish a feature issue without an identified main PRD;
- do not change a requirement's checkbox/status;
- do not invent metadata, milestone, project field or evidence.
