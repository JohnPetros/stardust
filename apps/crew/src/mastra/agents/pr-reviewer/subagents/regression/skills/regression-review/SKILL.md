---
name: regression-review
description: "Use when reviewing regressions in a StarDust pull request: files out of scope, removals, schema and migration changes, invented APIs and broken contracts."
---

# How to review: regression

Read these repository documents at `base_sha` with
`GITHUB_GET_REPOSITORY_CONTENT` (`ref` equal to `base_sha`), never at `head_sha`, so
that the pull request cannot weaken the rule that reviews it. Start with
`documentation/rules/rules.md`, the Rules router, and read only the Rules that match
the changed paths:

- `documentation/rules/database-rules.md`: schemas, models and migrations;
- `documentation/rules/core-package-rules.md`: shared contracts;
- `documentation/rules/rest-layer-rules.md`: route contracts;
- `documentation/rules/queue-layer-rules.md`: events and jobs.

## Procedure

1. Start from `regression_facts`: for each deleted file, look for references that still exist at `base_sha`.
2. For each changed migration, assess data loss, table locks and compatibility with the deployed code.
3. Check in the repository that each new API, function or property used by the diff really exists.
4. Compare the producer and the consumer of each changed contract.
5. Respect the tool budget of the shared process: at most 10 tool calls, each file read once, at most 6 files besides the skill's Rules, and at most 8 findings grouped by root cause.

Use the text of the Rules as the authority. This guide points to where to look and does
not replace or summarize any Rule.
