---
name: review-design
description: Review existing Stardust Penpot boards against their PRD and design.md with check:design and the Design Reviewer, report the verified findings and record the review when it passes, without changing the design.
---

# Review Design

Review boards of the Penpot file `stardust` that already exist, without drawing or
changing anything, and tell the user what is missing, contradicted or weak. Use it for
boards drawn outside the `design` workflow, before a Spec when the review record is stale,
or whenever the user wants an independent look at a screen. To change boards, use the
`design` workflow (`/design`), which runs this same review at its end.

```text
PRD (+ RP-*/JN-* in scope) and the boards
→ check:design
→ Design Reviewer
→ verified findings for the user
→ review record, only when the review passes
```

## Input

- The canonical PRD (`documentation/prds/<module>/<slug>-prd.md`) and the `RP-*`/`JN-*`
  in scope.
- The boards to review, by page and name, or the PRD alone: then find the boards of its
  module by their section and board names and confirm the list with the user before
  reviewing.

Without a PRD, review only the critique, `design.md` and `check:design`, say so in the
report, and do not write a record: `create-spec` accepts only reviews tied to a PRD.

## Rules

- Do not change the boards, the PRD or the design baseline. This workflow only reads; fixes
  go through `/design` or a PRD change the user approves.
- Use only the Penpot MCP for the file, and confirm with `penpot.currentFile.name` that it is
  `stardust`. Locate boards by name; do not switch pages that another session may be using
  without asking.
- Do not run `impeccable critique` yourself and do not form your own critique before the
  Reviewer reports: the review is meant to be independent of the main task.

## Steps

1. **Check.** For each board, save a full report outside the repository:
   `pnpm run check:design --board "<name>" --all --json > <scratch path>`.
2. **Review.** Activate one read-only `design-reviewer-agent` with the PRD path, the
   `RP-*`/`JN-*` in scope, the exact page and board names and the report paths. Do not pass
   your own conclusions or earlier findings.
3. **Verify.** Check each finding against the boards and the PRD before reporting it.
   Discard the ones that do not hold, and say why.
4. **Report.** Present the verified findings to the user, most severe first, grouped as
   `missing`, `contradicted`, `weak` and `debt`, each with the board or PRD item, the
   observed fact and the smallest fix. Include the coverage table and the critique's score
   table from the Reviewer. Then ask, following the interview protocol, how to handle each
   `weak` and `debt` finding: fix it with `/design`, or keep it with a reason.
5. **Record.** Only when no verified `missing` or `contradicted` finding remains and the user
   has decided every `weak` and `debt` finding, write or update
   `documentation/design-reviews/<module>/<prd-slug>.md` in the format defined by the
   `design` workflow (`documentation/prompts/design-prompt.md`, section "Review record"),
   with `verdict: pass`, the decisions and the digests from
   `pnpm run check:design --digest --board "<name>"`. Otherwise, do not write or update the
   record, and tell the user which boards need `/design`.

## Completion

Finish when the user has the verified findings and either the record is written with the
current digests or the boards that block it are named. Report what was reviewed, the
verdict, the decisions recorded and the next step.
