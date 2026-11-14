---
name: create-plan
description: Create or reconcile the plan.md progress tracker of an SDD delivery from the Spec's canonical path map, after the Spec is open and before implement-spec starts.
---

# Create Plan

`plan.md` is the single source of **implementation progress** of a delivery. It has one
row per row of the Spec's canonical path map, and each row is linked to the `RF-*`/`CA-*`
it serves. It does not redefine behavior, paths, schemas or decisions (`spec.md` owns the
Contract) and it records no evidence, findings or handoff (`evaluation.md` owns them).
Follow [`documentation/sdd.md`](../sdd.md).

```text
create-spec (Spec open) → create-plan → implement-spec
```

Run this prompt after the Spec Reviewer is `clear`, the user approved the written Spec and
the Spec is `open`. Run it again after a Contract amendment increments the Spec revision,
to reconcile the plan with the new revision. `implement-spec` does not start without a
`plan.md` for the current Spec revision.

## Location

```text
documentation/features/<domain>/<feature>/plan.md
```

For a later change: `changes/<change-name>/plan.md`. A legacy `<name>-spec.md` pairs with
`<name>-plan.md` in the same directory.

## Preconditions

Read `AGENTS.md`, `documentation/sdd.md` and the exact Spec revision. Stop and report the
blocker instead of creating the plan when:

- the Spec is not `open` (or `in_progress`, when reconciling after an amendment);
- the Technical Contract has no canonical `Path | Change | ...` map, or the map is
  ambiguous (the checker does not interpret ambiguous formats);
- a path cannot be linked to any `RF-*`/`CA-*` from the Spec's `Declaration`, `Contract`,
  Implementation Contract and Verification Contract. This is a Contract gap and goes back
  to `create-spec`.

There is no Grilling gate: the rows are derived from the Spec, so no material decision is
left to ask. If deriving them exposes a material ambiguity, stop and route it to
`create-spec` instead of deciding it here.

## Derivation

1. Read every table of the canonical path map. Create one row per map row, in the same
   order and grouping, with the same path text and the same `Change` (`Create`, `Modify`,
   `Generate` or `Remove`, plain text without backticks).
2. Link each row to every `RF-*`/`CA-*` it serves, comma-separated. Use only IDs that exist
   in the Spec. Every row has at least one ID.
3. Reach every `CA-*` through at least one row. A criterion that is only verified against
   existing behavior and has no contracted path goes in
   `Criteria without a contracted path`, with the reason.
4. Initialize every row as `pending` with the note `none`.
5. Do not add tasks, phases, waves, estimates, owners or acceptance text. Those would be a
   second Contract or an execution ledger.

Repeating `Path` and `Change` from the Spec is a deliberate decision, not an oversight. A
progress row needs a stable key that the checker can reconcile with the Spec and with Git. The
Spec stays the only owner of the Contract (`Declaration`, `Contract`, `Dependencies` and
`Tests` are never copied), and `--plan-only` and `--require-plan` report drift in both
directions, so the copy cannot diverge silently.

## Template

```md
---
title: <feature title> — plan
spec: ./spec.md
spec_revision: <revision>
evaluation: ./evaluation.md
status: in_progress
updated_at: YYYY-MM-DD
---

# Plan — <feature title>

## Progress

### <application or layer, same grouping as the Spec map>

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `packages/core/src/...` | Modify | RF-01, CA-01 | pending | none |

## Criteria without a contracted path

- None | `CA-04` — <why no path is contracted>
```

The first two cells of each row are fixed (`Path`, then `Change`); the checker reads the
remaining cells by position: `RF/CA`, `Status`, `Notes`.

`status` is `in_progress` from creation and `completed` when the delivery concludes.
`spec_revision` equals the `revision` of the Spec the rows were derived from.

## Maintaining progress

Only the main task edits `plan.md`. Builders and Reviewers report; the main task updates the
rows at each significant checkpoint, not at every file edit.

| Status | Meaning |
| --- | --- |
| `pending` | no work has started on the path |
| `in_progress` | work started, was reopened by a finding or is blocked |
| `completed` | the contracted change is in the integrated candidate and matches the Spec |

- A failure or blocker does not create a new status: the row stays `in_progress` and
  `Notes` links the `ACH-*` finding.
- A finding that invalidates delivered work reopens the affected rows to `in_progress`.
- A `CA-*` counts as implemented when every row that links it is `completed`. Whether it
  is *proven* is recorded only in the Evaluation's `Verification` column.
- Mark a row `completed` only after inspecting the diff for that path. Evidence, command
  output and verdicts stay in `evaluation.md`.

## Reconciliation after an amendment

When a Contract change increments the Spec revision, run this prompt again on the same
`plan.md`:

- drop rows for paths the new revision removed from the map;
- add rows for new paths as `pending`;
- update `Change` and `RF/CA` when the Spec changed them, and reopen to `in_progress` any
  `completed` row whose contracted change moved;
- keep the status of unaffected rows;
- set `spec_revision` to the new revision.

## Verification before saving

Run `pnpm run check:spec-implementation <spec> --plan-only`. It validates the plan against
the Spec without requiring the contracted paths to be delivered yet: every Spec path has
exactly one row with the same `Change`, no row has a path missing from the Spec, every
linked ID exists in the Spec, statuses are valid and `spec_revision` matches. Fix every error
before saving. Later, `implement-spec` and `conclude-spec` run the same checker with
`--require-plan`, which also requires every row to be `completed` and to match Git and the
filesystem.

## Rules

- Do not edit `spec.md`, `evaluation.md`, the PRD, Rules or Architecture.
- Do not invent paths, IDs or rows that are not in the Spec's path map.
- Do not mark any row beyond `pending` when creating the plan.
- Do not copy the `Declaration`, `Contract`, `Dependencies` or `Tests` cells: the Spec is the
  only place for them.
- Write `Notes` in the language of the Spec; keep headings and keys exactly as above.

## Report

Return the link to `plan.md`, the Spec revision, the number of rows per `Change`, any
criteria without a contracted path and the result of `--plan-only`.
