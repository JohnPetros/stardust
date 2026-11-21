---
name: review-design
description: Critique the design choices of existing Stardust Doop frames with the impeccable critique, through the Design Reviewer, and report the verified findings without changing the design or writing a review record.
---

# Review Design

Critique the design choices of frames of the Doop canvas `StarDust` that already exist,
the way the `impeccable` critique does: is the design good for its users, authored for this
product and easy to use. Do not draw or change anything. Use it when the user wants an
independent design opinion on a screen. It does not check PRD coverage, fidelity to
`design.md`, and it does not write the review record that `create-spec`
requires: the `design` workflow (`/design`) does all of that and also changes frames.

```text
frames (+ PRD for context)
→ Design Reviewer (impeccable critique only)
→ verified critique for the user
```

## Input

- The frames to review, by page and name.
- Optionally the canonical PRD (`documentation/prds/<module>/<slug>-prd.md`) and the
  `RP-*`/`JN-*` in scope, only so the Reviewer knows the audience and the goal of the
  screen. Without frames, find the frames of the PRD's module by their section and frame
  names and confirm the list with the user before reviewing.

## Rules

- Do not change the frames or the PRD. This workflow only reads; fixes
  go through `/design`.
- Use only the Doop MCP for the canvas, and confirm with `get_canvas` that it is
  `StarDust`. Locate frames by name; do not switch pages that another session may be using
  without asking.
- Do not run `impeccable critique` yourself and do not form your own critique before the
  Reviewer reports: the review is meant to be independent of the main task.

## Steps

1. **Review.** Activate one read-only `design-reviewer-agent` in critique-only mode: tell it
   to run only the **Critique** step of its review and to skip Coverage, Fidelity, Design
   system and Automated findings. Pass the exact page and frame names and, when given, the
   PRD path and scope as context. Do not pass your own conclusions.
2. **Verify.** Check each finding against the frames before reporting it. Discard the ones
   that do not hold, and say why.
3. **Report.** Present the critique in the structure of the impeccable critique: the design
   specificity verdict, the Nielsen heuristics score table with the applicable maximum, the
   cognitive load assessment, what is working, the priority issues (most severe first, each
   with the frame, the observed fact and the smallest fix), persona red flags and minor
   observations. Then ask, following the interview protocol, which findings the user wants
   to fix with `/design`.

## Completion

Finish when the user has the verified critique. Report what was reviewed, the main
strengths and priority issues, and the next step. Do not write or update
`documentation/design-reviews/`; a record exists only after the `design` workflow.
