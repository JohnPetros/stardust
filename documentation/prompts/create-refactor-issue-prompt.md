---
name: create-refactor-issue
description: Create a scoped GitHub refactor issue for evidence-backed, behavior-preserving structural improvements, technical debt, dependency cleanup, or maintainability work.
---

# Prompt: Create Refactor Issue

## Objective

Turn a technical refactor request into one concise, actionable GitHub issue for the current
repository.

The issue describes why the current structure should change, which behavior and contracts must
remain stable, and what observable evidence proves the refactor complete. Do not implement code,
create or edit a Spec, create a branch, commit changes or open a pull request.

## Input

- **Refactor request:** the structure, boundary, dependency or technical debt to improve.
- **Context (optional):** motivation, affected module or application, known constraints, evidence,
  related issue, migration concern or desired end state.

Research repository facts directly before asking questions. Do not invent coupling, duplication,
risk, affected paths, compatibility requirements or validation evidence.

## Classification gate

Use this workflow only when the intended result preserves approved product behavior and external
contracts.

- If delivered behavior violates the current product or technical contract, route to
  `create-bug-issue`.
- If the request adds or changes user-visible behavior, business rules, permissions, validation,
  workflows, API semantics or product outcomes, route to `create-feat-issue` and amend the owning
  PRD when required.
- If the request is documentation-only, dependency installation, infrastructure configuration or
  routine maintenance without a structural refactor, use the corresponding documentation or
  infrastructure workflow.
- If the request mixes refactoring with a bug fix or feature, separate the behavior-preserving
  refactor only when it has an independent outcome and the user approves the split. Otherwise
  route the complete request through the bug or feature workflow.

Do not create a refactor issue merely to avoid product clarification or Spec work.

## Grilling protocol

Build a decision tree for the issue after repository research. Resolve the available frontier in
rounds:

- Ask every currently answerable material question in one round.
- Number questions and provide an evidence-backed recommended answer.
- Research facts directly; keep actual scope, tradeoffs and compatibility decisions with the user.
- Record resolved decisions and challenge contradictions.
- When the frontier is empty, present the shared understanding and request explicit confirmation.
- Do not draft or publish the issue before that confirmation.

Use this format:

```yaml
❓ **Q1** - **<question title>**: <question body, including choices when useful>

➡️ <recommended answer>

---
```

At minimum resolve, when applicable:

- the concrete maintenance, ownership, coupling, duplication, testability or reliability problem;
- the boundary and contracts that may change internally;
- the product, transport, persistence and public interfaces that must remain unchanged;
- compatibility, migration, rollout and rollback requirements;
- explicit exclusions and adjacent cleanup that should not enter scope;
- the evidence that proves both the structural improvement and behavioral preservation.

## Required repository context

Before drafting the issue:

1. Read `AGENTS.md` and applicable nested instructions.
2. Read `documentation/rules.md`, select the Rules matching both affected paths and behavior, and
   read each selected Rule in full.
3. Read `documentation/architecture.md` and `documentation/modules.md` when the refactor affects
   system layers, ownership, persistence, authentication, integrations or module boundaries.
4. Read the owning PRD when product behavior or module capabilities could be affected, using it to
   define the behavior-preservation boundary.
5. Read `documentation/tooling.md` before changing tooling, dependencies, migrations, Docker, CI or
   configuration assumptions.
6. Inspect the relevant implementation, tests, configuration and dependency paths closely enough
   to state the current structural problem with evidence.
7. Search open and closed GitHub issues for an existing equivalent or superseding issue.
8. Verify current GitHub labels and milestones before proposing metadata.

Documentation is architectural intent. If documentation and implementation disagree, surface the
discrepancy and determine whether the issue restores conformance or requires an authority change.
Do not silently encode a new architecture or product rule as refactoring.

## Scope rules

- Create exactly one issue unless the user explicitly requests decomposition.
- Keep the issue small enough for one coherent implementation and review.
- Describe the desired structural properties and preserved contracts, not a line-by-line solution.
- Include specific paths only when they are evidence or a hard scope boundary; exact implementation
  files belong in a later Spec.
- Preserve module ownership and dependency direction.
- Keep framework, provider, ORM and transport types out of Core contracts unless the current
  architecture explicitly requires them.
- When persistence changes, require data preservation, forward migration, compatibility and
  rollback evidence without prescribing unsafe history rewrites.
- When public interfaces must change, this is not a behavior-preserving refactor; reclassify it or
  obtain approval for a separate feature/contract change.
- Do not include unrelated cleanup, speculative abstractions or dependency upgrades that are not
  necessary for the stated outcome.
- Treat PRD Implemented checkboxes as read-only.

## GitHub metadata

Use only existing repository metadata:

- `refactor` — required;
- `server` and/or `web` — add when those applications are affected;
- `infra` — add when the structural work materially affects framework, library, persistence,
  deployment or infrastructure configuration;
- `documentation` — add only when documentation changes are a material deliverable of the
  refactor;
- do not add `bug` or `feat` to a behavior-preserving refactor issue.

Assign the owning module's PRD milestone only when the refactor directly supports that module's
contract. For cross-cutting shared infrastructure with no single business owner, propose no
milestone and explain why. Never create a label or milestone from this workflow.

## Issue title

Use:

```text
Refactor <short structural boundary or responsibility>
```

Name the responsibility or boundary being improved. Avoid vague titles such as `Refactor code`,
task lists, presumed root causes or filenames unless a file is itself the durable boundary.

## Issue body

Use exactly this structure:

```md
## Motivation

<Evidence-backed explanation of the current structural problem and why it matters.>

## Scope

- <Desired structural outcome or ownership boundary.>
- <Internal contract, compatibility, migration or architectural constraint.>
- **Preserve:** <Observable behavior and external contracts that must remain unchanged.>
- **Not included:** <Explicitly excluded adjacent behavior or cleanup.>

## Acceptance criteria

- <Observable structural result.>
- <Architecture, ownership or dependency result.>
- <Compatibility, migration or rollback result when applicable.>
- <Behavior-preservation and regression evidence.>
- <Required static, automated and runtime validation at the affected boundaries.>

## References

- Evidence: <actual path, issue, PR, report or documentation link>
- Architecture or Rule: <actual link when applicable>
- PRD requirement: <actual link, or omit when not applicable>
- Dependency: <actual issue or external dependency link, or omit when not applicable>
```

Keep Motivation factual and concise. Acceptance criteria must prove the desired structure and
the absence of unintended behavior changes; avoid implementation checklists and generic criteria
such as “code is cleaner.”

## Approval gate

Before writing to GitHub:

1. Present the exact proposed title, body, labels and milestone.
2. Ask the user to approve the complete draft or request changes.
3. Revise and present the complete draft again when requested.
4. Create or update the issue only after explicit approval of the current draft.

Approval authorizes only the issue submission. It does not authorize implementation, a Spec,
branch, commit, pull request or external-system mutation.

## Completion

After creating the issue, report:

- issue number and URL;
- title;
- labels and milestone;
- the preserved behavior boundary; and
- a one-sentence summary of the structural outcome.

Recommend `create-spec` next when the refactor crosses multiple layers, changes persistence,
requires migration or rollback, or carries material security or operational risk. Otherwise note
that direct maintenance may be appropriate under repository rules. Do not invoke implementation
unless the user requests it.
