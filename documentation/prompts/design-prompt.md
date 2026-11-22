---
name: design
description: Draw or change the Doop frames for a Stardust PRD, have the Design Reviewer review them, fix what it finds and record the review.
---

# Design

Draw or change the frames of the Doop canvas `StarDust` that a PRD needs, and finish
only when they are checked, independently reviewed and recorded. The main task runs this
workflow and owns the frames, the decisions and the record; the Design Reviewer only
advises. A Spec with UI is written from frames that went through this workflow:
`create-spec` checks for the review record and does not review the design itself. To
review frames without changing them, use `review-design` (`/review-design`).

```text
PRD (+ RP-*/JN-* in scope)
→ research and interview
→ draw or change the frames in Doop
→ Design Reviewer → fixes → review of the affected frames again
→ review record in documentation/design-reviews/
```

## Input

- The canonical PRD (`documentation/prds/<module>/<slug>-prd.md`) and the `RP-*`/`JN-*`
  in scope, or a change request for existing frames with the PRD it belongs to.
- The pages to work on (`🖥️ Desktop`, `📱 Mobile`, `🧩 Components`).

Without a PRD, ask for one or for the user's explicit decision to proceed without it;
then the review covers only the critique and `design.md`.

## Authorities

Read before the first edit:

- `AGENTS.md`, section "Doop MCP": only the Doop MCP, never `design/stardust.fig`,
  locate pages and frames by name, use the canvas components and tokens, verify with
  `get_frame_screenshot`, and draw dialogs as standalone frames.
- `documentation/design.md`: the visual language, tokens, type, radius and spacing.
- The PRD in full, including business rules, experience rules and journeys.
  Invoke these skills; do not paraphrase them from memory:

- The Doop guide: `get_guide` with `doop-instructions` once, and with `components` before the
  first component change: the review checkpoints, token, component and layout patterns used to
  build the frames.
- `impeccable`, for the visual direction: run its context setup once, then load its
  `reference/craft-floor.md` immediately before drawing. Use its `critique` only through
  the Design Reviewer below; do not run it yourself, so the review stays independent.

Confirm with `get_canvas` that the connected canvas is `StarDust`, and read
the existing frames of the module before drawing, so new frames reuse their patterns.

## Interview

Follow `documentation/prompts/interview-prompt.md` for every product or visual decision
the authorities do not settle, before drawing what depends on it. Report a PRD gap or
conflict to the user instead of designing around it; change the PRD only with the user's
approval, in PT-BR, and keep its `last_updated_at` current.

## Drawing

- Group frames in a page section named `<Área> · <Tópico>` and name each frame
  `<Módulo> / <Página> / <Componente> / <Estado ou variante> / <Desktop|Mobile>`, as
  `documentation/rules/doop-rules.md` defines: the viewport is always the last segment,
  and the component and state segments are omitted when they do not apply. Rename a frame
  that still uses the previous pattern only when the task changes it. The name is the
  contract that Specs and reviewers use.
- Keep sections apart: a new or grown section must not overlap another one.
- Draw every state the PRD names and the ones it implies: empty, loading, error, locked,
  first use, maximum, long text, and the owner versus visitor view when they differ.
  Draw the desktop and mobile versions of each screen.
- Bind colors, radius and spacing to tokens and reuse library components; change a
  library component only when the user asks.
- Use realistic PT-BR copy in the PRD's vocabulary and illustrative data that is
  consistent across frames.
- Keep calls small, inspect by name after a timeout before redoing work, and capture the
  touched frames (or their sections, for tall frames) with `get_frame_screenshot` to verify them.

## Independent review

1. Activate one read-only `design-reviewer-agent` with the PRD path, the `RP-*`/`JN-*` in
   scope and the exact page and frame names. Do not pass your own conclusions.
2. Verify each finding against the frames and the PRD before acting on it.
   - `missing` and `contradicted`: fix the frame or, with the user's approval, the PRD.
     A state that will deliberately have no frame is recorded as such in the record.
   - `weak` and `debt`: fix them or decide with the user; record each decision.
3. After fixes, resume the same Reviewer only for the affected frames. Repeat until no `missing` or `contradicted` finding remains. If a
   finding is still open after two rounds on the same frame, stop and ask the user.

The Reviewer's report is advice, not evidence: its verdict does not replace your check of
each finding.

## Review record

Write or update `documentation/design-reviews/<module>/<prd-slug>.md`, in English:

```md
---
prd: documentation/prds/<module>/<slug>-prd.md
prd_last_updated_at: <the PRD's last_updated_at>
reviewed_at: <YYYY-MM-DD>
doop_updated_at: <newest updatedAt of the reviewed frames, from get_frame>
verdict: pass
frames:
  - page: Desktop
    frame: <frame name>
    updated_at: <the frame's updatedAt, from get_frame>
---

# Design review: <PRD title>

## Scope

<RP-_/JN-_ reviewed, and the frames that cover them>

## Resolved findings

- <finding> → <fix or PRD change>

## Decisions

- <weak or debt finding kept, or state without a frame> → <decision and reason>
```

Take each `updatedAt` from `get_frame` **after** the last fix. It changes whenever the
frame's content changes, which makes the record stale for `create-spec`. Do not paste the raw Reviewer report.

## Completion

Finish only when no `missing` or `contradicted` finding is open and the record lists the
current `updatedAt` of every reviewed frame. Report to the user the frames drawn or changed, the review verdict, the decisions
taken and anything left for them to decide.
