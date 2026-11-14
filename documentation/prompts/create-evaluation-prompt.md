---
name: create-evaluation
description: Create and maintain the mandatory evaluation.md of an SDD delivery with real evidence, reviews, preflight, findings, decisions and lessons.
---

# Create Evaluation

`evaluation.md` is the factual record of the delivery. It is created after
implementation or the first relevant judgment and must exist before the PR.
It does not replace `spec.md`; it consolidates the
evidence needed to close the feature.

## Location

For a feature:

```text
documentation/features/<domain>/<feature>/evaluation.md
```

For a later change:

```text
changes/<change-name>/evaluation.md
```

## Immediate persistence

The main task updates this document at each significant checkpoint (accepted
Builder work, sensor execution, finding or decision, lesson discovered), instead of one
update per file edit. Evidence is invalidated by the claim and affected
dependencies, not by the age of the commit. Requirements belong to `spec.md`; implementation progress belongs to `plan.md`; evidence and
operational findings belong to this document.

## Template

Use this format as the canonical Stardust structure. `evaluation.md` is a
living ledger, not a report written only at wrap-up: preserve the order
of the sections and update it after each change to implementation, tests, browser,
migration, artifact, documentation or validation.

Use stable IDs: `EV-*` for each piece of evidence, `AV-*` for automated verifications, `MV-*` for manual verifications, `VV-*` for
visual verifications, and `ACH-*` for findings. The Evaluation does not record PR CI results (workflows, checks, build); those stay in the PR itself. Visual
comparisons are also `EV-*` evidence, with viewport, state and reference
recorded. Mark affected evidence as `stale`;
do not reuse a capture or result that predates the last relevant change.
For each material finding, keep the concrete entry in `Warnings and findings`
and a lesson/disposition in `Lessons learned` or `Preventive analysis of findings`.

```md
---
title: <evaluation title>
spec: ./spec.md
plan: ./plan.md
spec_revision: <revision or sha>
status: in_progress
base_commit: <sha>
evaluated_commit: <sha>
last_updated_at: YYYY-MM-DD
---

# Evaluation — <title>

## Evaluated scope

- Spec: `./spec.md`
- Plan: `./plan.md`
- Base commit: `<sha>`
- Evaluated commit: `<sha>`

## Criteria evidence

One row per `CA-*`. Only verification is recorded here
(`Pending`/`Partial`/`Passed`/`Failed`/`Blocked`/`Stale`). The implementation progress of a
criterion is derived from the `plan.md` rows that link it and is never repeated in this table.

| Criterion | Verification | Real evidence | Remaining work |
| --------- | ------------ | ------------- | -------------- |
| CA-01     | Passed       | EV-01 — test, browser, sensor or diff | none |

## Reviews

### Spec Reviewer

- Verdict: `clear` | `blocking_findings`
- Revision: `<revision>`
- Scope: compatibility with `architecture.md` and Rules before implementation
- Findings: none | `<IDs and state>`

### Implementation Reviewer

- Verdict: `PASS` | `FAIL` | `BLOCKED`
- Commit: `<sha>`
- Findings: none | `<IDs and state>`

### Visual Reviewer

- Verdict: `PASS` | `FAIL` | `BLOCKED` | not applicable (no design-backed UI)
- Commit: `<sha>`
- Disposition per manual/visual inventory row: `<VV-* → disposition>`
- Findings: none | `<IDs and state>`

The Reviewers' reports are advisory input; the main task verifies each
finding and records the accepted ones as `ACH-*` in the findings section.

For frontend, also record:

| Gate                  | State  | Evidence                                                                             |
| --------------------- | ------ | ------------------------------------------------------------------------------------ |
| UI Layer Audit        | passed | widget, paths and lines of Entry Point/View/Hook                                     |
| Penpot/Web comparison | passed | frame, viewport, state, route, HEAD, anchors, divergence/approval and screenshot/diff |

When the Spec declares frames of the Penpot `stardust` file, inspect them through the Penpot MCP and record a matrix per frame. It must
identify the frame name, viewport, state/variant, route, dimension and
anchors of the reference, Web capture in the same context, evaluated HEAD and any approved
divergence. `match` and `approved adaptation` are the only acceptable
states; a frame that is missing, contradicted or added without approval keeps the
evaluation blocked.

Penpot boards are design inputs, not runtime evidence. The Evaluation must
record separately the implementation capture, the visual comparison, the
responsiveness/accessibility observations and the corresponding `EV-*`. If the Design Contract declares a state,
viewport or supplementary extension, the absence of the required evidence keeps the Evaluation
`in_progress`.

## Manual and visual inventory

One row per journey (`MV-*`) or per rendered state/viewport (`VV-*`) required by the Spec. Distinct
states (page, dialog, mobile) are distinct rows; the evidence of one does not prove another.

| MV/VV | CA | Surface/route | State | Viewport | Penpot board | Candidate | Artifact | Observed result | Reviewer disposition |
| ----- | ---- | ------------- | ----- | -------- | ------------ | --------- | -------- | --------------- | -------------------- |
| VV-01 | CA-01 | `/space` | content | desktop | `<page/board>` | `<sha>` | `test-results/...` | pending | pending |

## Sensors and preflight

| Command                                 | State  | Evidence                                  |
| --------------------------------------- | ------ | ----------------------------------------- |
| `pnpm run check:code`                    | passed | summarized output                         |
| `pnpm --filter <workspace> run test:coverage`  | passed | summary per metric and workspace          |
| `pnpm run check:coverage <workspace>` | passed | compared baseline and ratchet result      |

## Warnings and findings

- None | `<ID> — description, impact, state and resolution>`

## Preventive analysis of findings

| Finding | Cause | Preventive action/document | State |
| ------- | ----- | -------------------------- | ----- |
| `<ID>` | one-off | not applicable — justification | completed |

Analyze findings from the Reviewer, sensors and manual verifications. When an item
reveals a recurring gap in process, architecture, tooling or Rule, update
the corresponding normative document before completion. For a reusable
implementation anti-pattern, record it in the layer's Rule with the
`register-antipattern` workflow. Record the evidence of the decision or the pending
user approval in this matrix.

## Decisions

- `<decision>` — reason and impact.

## Lessons learned

- `<reusable lesson or confirmation that there was none>`.

## Documentation alignment

- Spec: aligned | `<pending action>`
- Rules/Architecture/Overview: aligned | not applicable | `<pending action>`

## Handoff

Small factual record for whoever resumes the delivery; it is not a phase plan nor a
second Contract.

- Spec revision and branch/candidate: `<revision, branch, sha>`
- Criteria verified / unverified: `<IDs>` (implementation progress is in `plan.md`)
- Interrupted or uncommitted paths and their ownership: `<paths>`
- Latest reusable results and stale evidence: `<EV-*>`
- Processes/ports started by the task and cleanup: `none` | `<session, port>`
- Specific blockers: `none` | `<blocker and required input>`
- Next action: `<action>`

## Conclusion

- State: `in_progress` | `accepted` | `completed` | `blocked`
- Next action: `<action>`
```

Failures of sensors, local builds or verifications must be recorded here immediately as
`EV-*` and, when there is a problem to fix, as `ACH-*`. PR CI results are not
recorded in the Evaluation. The Spec remains `in_progress`; scope corrections use `Builder Fix ACH-*`, with
a new sensor and a new Reviewer whenever the diff or any Contract,
Rule, Penpot or Playwright evidence is invalidated. Any change after the
Reviewer invalidates the previously evaluated commit, including when it affects design-to-code
fidelity.
