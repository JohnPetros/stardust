---
name: design
description: Draw or change the Penpot boards for a Stardust PRD, check them with check:design, have the Design Reviewer review them, fix what it finds and record the review.
---

# Design

Draw or change the boards of the Penpot file `stardust` that a PRD needs, and finish
only when they are checked, independently reviewed and recorded. The main task runs this
workflow and owns the boards, the decisions and the record; the Design Reviewer only
advises. A Spec with UI is written from boards that went through this workflow:
`create-spec` checks for the review record and does not review the design itself. To
review boards without changing them, use `review-design` (`/review-design`).

```text
PRD (+ RP-*/JN-* in scope)
→ research and interview
→ draw or change the boards in Penpot
→ check:design (no new errors on the touched boards)
→ Design Reviewer → fixes → review of the affected boards again
→ review record in documentation/design-reviews/
```

## Input

- The canonical PRD (`documentation/prds/<module>/<slug>-prd.md`) and the `RP-*`/`JN-*`
  in scope, or a change request for existing boards with the PRD it belongs to.
- The pages to work on (`🖥️ Desktop`, `📱 Mobile`, `🧩 Components`).

Without a PRD, ask for one or for the user's explicit decision to proceed without it;
then the review covers only the critique, `design.md` and `check:design`.

## Authorities

Read before the first edit:

- `AGENTS.md`, section "Penpot MCP": only the Penpot MCP, never `design/stardust.fig`,
  locate pages and boards by name, use the library components and tokens, verify with
  `export_shape`, and draw dialogs as standalone frames.
- `documentation/design.md`: the visual language, tokens, type, radius and spacing.
- The PRD in full, including business rules, experience rules and journeys.
Invoke these skills; do not paraphrase them from memory:

- `penpot-uiux-design`, once, before the first `execute_code` call: the Penpot API,
  layout and validation patterns used to build the boards.
- `impeccable`, for the visual direction: run its context setup once, then load its
  `reference/craft-floor.md` immediately before drawing. Use its `critique` only through
  the Design Reviewer below; do not run it yourself, so the review stays independent.

Confirm with `penpot.currentFile.name` that the connected file is `stardust`, and read
the existing boards of the module before drawing, so new boards reuse their patterns.

## Interview

Follow `documentation/prompts/interview-prompt.md` for every product or visual decision
the authorities do not settle, before drawing what depends on it. Report a PRD gap or
conflict to the user instead of designing around it; change the PRD only with the user's
approval, in PT-BR, and keep its `last_updated_at` current.

## Drawing

- Group boards in a page section named `<Área> · <Tópico>` and name each board
  `<Módulo> / <Página> / <Componente> / <Estado ou variante> / <Desktop|Mobile>`, as
  `documentation/rules/penpot-rules.md` defines: the viewport is always the last segment,
  and the component and state segments are omitted when they do not apply. Rename a board
  that still uses the previous pattern only when the task changes it. The name is the
  contract that Specs and reviewers use.
- Keep sections apart: a new or grown section must not overlap another one.
- Draw every state the PRD names and the ones it implies: empty, loading, error, locked,
  first use, maximum, long text, and the owner versus visitor view when they differ.
  Draw the desktop and mobile versions of each screen.
- Bind colors, radius and spacing to tokens and reuse library components; change a
  library component only when the user asks.
- Use realistic PT-BR copy in the PRD's vocabulary and illustrative data that is
  consistent across boards.
- Keep `execute_code` calls small, inspect by name after a timeout before redoing work,
  and export the touched boards (or their sections, for tall boards) to verify them.

## Automated check

Run `check:design` for every touched board:

```bash
pnpm run check:design --board "<board name>"
```

Fix every new error. Fix new warnings or record why they stay. Do not update the design
baseline to hide a finding of the boards you drew; existing debt outside them stays in the
baseline.

## Independent review

1. Save a full report for the boards outside the repository:
   `pnpm run check:design --board "<name>" --all --json > <scratch path>`.
2. Activate one read-only `design-reviewer-agent` with the PRD path, the `RP-*`/`JN-*` in
   scope, the exact page and board names and the report paths. Do not pass your own
   conclusions.
3. Verify each finding against the boards and the PRD before acting on it.
   - `missing` and `contradicted`: fix the board or, with the user's approval, the PRD.
     A state that will deliberately have no board is recorded as such in the record.
   - `weak` and `debt`: fix them or decide with the user; record each decision.
4. After fixes, run `check:design` again and resume the same Reviewer only for the
   affected boards. Repeat until no `missing` or `contradicted` finding remains. If a
   finding is still open after two rounds on the same board, stop and ask the user.

The Reviewer's report is advice, not evidence: its verdict does not replace your check of
each finding.

## Review record

Write or update `documentation/design-reviews/<module>/<prd-slug>.md`, in English:

```md
---
prd: documentation/prds/<module>/<slug>-prd.md
prd_last_updated_at: <the PRD's last_updated_at>
reviewed_at: <YYYY-MM-DD>
penpot_revn: <file revision from check:design>
verdict: pass
boards:
  - page: 🖥️ Desktop
    board: <board name>
    digest: <digest>
---

# Design review: <PRD title>

## Scope

<RP-*/JN-* reviewed, and the boards that cover them>

## Resolved findings

- <finding> → <fix or PRD change>

## Decisions

- <weak or debt finding kept, or state without a board> → <decision and reason>
```

Take the digests from `pnpm run check:design --digest --board "<name>"` **after** the
last fix. A digest changes whenever the board's content changes, which makes the record
stale for `create-spec`. Do not paste the raw Reviewer report.

## Completion

Finish only when every touched board has no new `check:design` error, no `missing` or
`contradicted` finding is open, and the record lists the current digest of every reviewed
board. Report to the user the boards drawn or changed, the review verdict, the decisions
taken and anything left for them to decide.
