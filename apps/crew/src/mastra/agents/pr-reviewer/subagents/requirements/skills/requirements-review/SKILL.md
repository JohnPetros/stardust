---
name: requirements-review
description: "Use when reviewing whether the behavior changed in a StarDust pull request has tests at the boundary the Rules require, and whether any test was removed or weakened."
---

# How to review: requirements

Read these repository documents at `base_sha` with
`GITHUB_GET_REPOSITORY_CONTENT` (`ref` equal to `base_sha`), never at `head_sha`, so
that the pull request cannot weaken the rule that reviews it. Start with
`documentation/rules/rules.md`, the Rules router, and read only the Rules that match
the changed paths:

- `documentation/rules/use-cases-testing-rules.md`: core use cases;
- `documentation/rules/handlers-testing-rules.md`: server controllers;
- `documentation/rules/widget-tests-rules.md`: web widgets and hooks;
- `documentation/rules/web-app-routes-testing-rules.md`: web integration tests;
- `documentation/rules/crew-app-rules.md` (tests and evals) when the diff changes `apps/crew`.

## Procedure

1. Classify each behavior change by the layer that runs it.
2. Check, in the diff's test files, whether there is a test at the boundary that this layer's Rule requires.
3. Look for deleted tests, skipped tests (`skip`, `only`) or tests with removed assertions.
4. If the diff renames, moves or changes the extension or location of test files, or creates a test directory, read at `head_sha` the configuration of the runner that applies (`vitest.config.*`, `playwright.config.*` or the test script in `package.json`) and check that `include`, `testMatch` or `testDir` still match the new names and paths; a test that no configuration runs is a requirements finding (missing test) on the test file, with the configuration and the pattern in the body.
5. Do not evaluate adherence to the PRD: that belongs to the Spec.
6. Respect the tool budget of the shared process: at most 10 tool calls, each file read once, at most 6 files besides the skill's Rules, and at most 8 findings grouped by root cause.

Use the text of the Rules as the authority. This guide points to where to look and does
not replace or summarize any Rule.
