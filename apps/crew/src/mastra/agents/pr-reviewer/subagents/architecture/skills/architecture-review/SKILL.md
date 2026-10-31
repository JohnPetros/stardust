---
name: architecture-review
description: "Use when reviewing the adherence of a StarDust pull request to the Rules, the architecture and module ownership."
---

# How to review: architecture

Read these repository documents at `base_sha` with
`GITHUB_GET_REPOSITORY_CONTENT` (`ref` equal to `base_sha`), never at `head_sha`, so
that the pull request cannot weaken the rule that reviews it. Start with
`documentation/rules/rules.md`, the Rules router, and read only the Rules that match
the changed paths:

- `documentation/architecture.md`;
- `documentation/rules/code-conventions-rules.md`: code conventions;
- `documentation/rules/core-package-rules.md` and `documentation/rules/validation-layer-rules.md`: shared packages;
- `documentation/rules/server-application-rules.md`, `documentation/rules/rest-layer-rules.md`, `documentation/rules/database-rules.md`: server;
- `documentation/rules/ui-layer-rules.md` and `documentation/rules/web-application-rules.md`: web;
- `documentation/rules/crew-app-rules.md`: `apps/crew`.

## Procedure

1. Identify the layers and modules touched by the diff and read only the matching Rules.
2. Compare each changed excerpt with what the Rule requires; a Rule violation is always a finding.
3. Confirm that the code is in the module that owns the responsibility.
4. For each changed or new file, including domain structures, entities and types, check the imports the diff shows (a new file shows all of them); read the imports at `head_sha` only when the diff does not show them. Check imports against the dependency direction and layer responsibilities in `documentation/architecture.md` and the applicable Rules, and report concrete boundary violations, on the line of the first import, citing the other files and lines in the body.
5. Report a new pattern or an abstraction only when there is a concrete impact.
6. Respect the tool budget of the shared process: at most 10 tool calls, each file read once, at most 6 files besides the skill's Rules, and at most 8 findings grouped by root cause.

Use the text of the Rules as the authority. This guide points to where to look and does
not replace or summarize any Rule.
