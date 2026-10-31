---
name: performance-review
description: "Use when reviewing performance problems in a StarDust pull request: N+1 queries, unbounded lists, missing indexes and expensive work on a hot path."
---

# How to review: performance

Read these repository documents at `base_sha` with
`GITHUB_GET_REPOSITORY_CONTENT` (`ref` equal to `base_sha`), never at `head_sha`, so
that the pull request cannot weaken the rule that reviews it. Start with
`documentation/rules/rules.md`, the Rules router, and read only the Rules that match
the changed paths:

- `documentation/rules/database-rules.md`: queries, repositories and indexes;
- `documentation/rules/rest-layer-rules.md`: pagination and lists;
- `documentation/rules/ui-layer-rules.md`: web rendering and data fetching;
- `documentation/rules/ai-layer-rules.md`: model calls.

## Procedure

1. For each changed query, check the limit, the pagination and access inside loops.
2. For each new access pattern, check whether an index exists in the migration or the schema.
3. On the web, look for expensive work executed on every render.
4. For each changed use case, service or repository method that loads related entities or lists in a loop, in a `Promise.all` over items or with one `findById` per item, read the function body at `head_sha` when the diff does not show the whole loop and report the N+1 or the unbounded access on the line of the per-item call, in a single finding per function.
5. Report only when there is a concrete performance impact.
6. Respect the tool budget of the shared process: at most 10 tool calls, each file read once, at most 6 files besides the skill's Rules, and at most 8 findings grouped by root cause.

Use the text of the Rules as the authority. This guide points to where to look and does
not replace or summarize any Rule.
