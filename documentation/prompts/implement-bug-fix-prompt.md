---
name: implement-bug-fix
description: Implement a direct fix derived from a Stardust Bug Report, with an automated regression test and real validation when applicable.
---

# Implement Bug Fix

Implement a direct fix from a diagnosed Bug Report. The Bug Report is the
authority on the symptom, the root cause and the boundary of the fix; this workflow turns that
diagnosis into a small, tested and validated change. Do not use this prompt to implement
a product change, an ambiguous fix or a Contract change.

## Input

- path of the Bug Report, preferably in
  `documentation/features/<domain>/<feature>/reports/`;
- related code and issue available in the workspace;
- optional context about the environment, reproduction or failures found after the diagnosis.

If the Bug Report does not exist, lacks a supported cause or recommends a Correction Spec, stop and
route to `create-bug-report` or `create-spec`. Do not invent the scope of the fix.

## Authority and Rules

Read `AGENTS.md`, `documentation/sdd.md`, the Bug Report, `documentation/rules/rules.md`,
`documentation/architecture.md`, `documentation/modules.md` and the Rule Pack of the affected layers.
Also read `documentation/rules/code-conventions-rules.md` when there is a code change and the
test-specific Rules when coverage is changed.

Preserve the milestone, the PRD, the expected behavior and the existing contracts. If the cause
requires changing an API, schema, event, public route, requirement, design or any other Contract,
pause the direct implementation, record the divergence and route to `create-spec`.

## Gate before editing

Before editing code:

1. confirm the Bug Report, issue, status and boundary of the fix;
2. confirm the real paths, the entry point, the affected flow and the cause through direct inspection;
3. reproduce the failure when possible and capture a minimal baseline;
4. define the regression test that would fail before the change;
5. confirm that the change remains narrow, without creating an artificial Spec or Contract.

If the reproduction contradicts the diagnosis, do not force the implementation: update the diagnosis
through `create-bug-report` or reassess the routing.

## Bug Report as a living record

The Bug Report must stay aligned with the real state of the fix throughout the workflow. Update it
whenever there is any relevant change in:

- reproduced symptom, root cause, discarded hypothesis or boundary of the fix;
- affected paths, automated regression test, validation evidence or blocker;
- regression risk, expected behavior, dependencies or status of the fix.

If the implementation reveals a complementary cause, a divergence from the diagnosis or a new risk,
stop before widening the scope, record the finding in the Bug Report and confirm whether the fix is still
direct. Do not leave the report outdated until the closing step. The report must record
observed facts and validation commands/results, without turning into a Spec or task list.

## Implementation

1. Write the regression test first at the right level: unit for isolated logic, widget for
   View/Hook, route for App Router composition and Playwright for the behavior published in the
   browser.
2. Implement only the boundary described in the Bug Report, respecting architecture, dependencies,
   naming, factories, error handling and boundaries between layers.
3. Preserve success, error, loading, retry, navigation and authentication states and related
   consumers that are not part of the defect.
4. Do not change credentials, `.env.development`, migrations, issue, Spec or Evaluation without
   explicit authorization and without the corresponding workflow.
5. Keep the Bug Report updated as the implementation progresses; if the code or the tests
   change the diagnosis, the scope, the evidence or the risk, update the report before
   proceeding.

## Diagnosis and validation with Playwright CLI

For any fix involving frontend, UI, a client-side route or authentication, use the Playwright
CLI also as a diagnosis tool and for the final validation.

During the reproduction and the rerun:

- load credentials only through the local variables and scripts defined in `AGENTS.md`;
- authenticate in the same browser context and exercise the relevant protected route;
- record `console`, `pageerror`, `requestfailed` and `response`, keeping only the method, path,
  status and non-sensitive evidence;
- wait for authentication, requests, visual states and navigation with `waitForResponse`,
  `waitForFunction` and `waitForURL`, without relying on a lone `waitForTimeout`;
- confirm observable success and error states, in addition to loading and navigation when they are
  part of the flow;
- run versioned tests with `pnpm --filter @stardust/web run test:integration <file>` or
  `pnpm exec playwright test ...` from `apps/web`; use the integration environment with
  `ServerMock` in the versioned tests and the real flow on `localhost:3000`/local API for authenticated
  inspection outside the suite;
- for the Backoffice, use the server, the port and the credentials defined in `AGENTS.md`, and validate login and
  at least one protected route;
- after each fix, repeat the complete authenticated flow through the Playwright CLI. A login screen, an isolated mock or
  a unit render are not enough to declare the fix functional.

Do not record tokens, cookies, passwords, sensitive bodies, `.env` values or logs that allow
reconstructing them.

## Detectors and tests

After any change, run the `AGENTS.md` detectors in the affected scope:

- `pnpm run check:code -w <workspace>`;
- `pnpm run check:types -w <workspace>`;
- `pnpm run test:unit -w <workspace> -- <test-files>`, including the bug's regression test;
- the applicable Playwright flow, only on the affected files.

If a detector fails because of an external state, such as a busy port, preserve the foreign process, record
the exact blocker and run all safe alternatives. Do not declare global success based on
a partial test.

## Conclusion

After validating the change:

1. inspect `git diff` and `git diff --check`;
2. confirm that there are no accidental files or credentials in the diff;
3. mandatorily update the Bug Report with all findings, paths, tests, evidence,
   blockers and relevant status changes; even without a cause divergence, record the final evidence
   when it is not yet documented;
4. invoke `conclude-bug-report` to consolidate the evidence and close the report only when the
   fix is truly validated;
5. report the changed paths, tests run, manual/Playwright validation, blockers and the final status
   of the Bug Report.

## Restrictions

- do not implement a Correction Spec in this workflow;
- do not turn a report into evidence: record commands, scenarios and observed results;
- do not invent paths, tests, contracts, HTTP responses or root cause;
- do not make destructive changes nor kill external processes to free ports;
- do not commit, push, update an issue or open a PR without an explicit request;
- keep the fix minimal and reversible, with an automated regression test proportional to the risk.

## Output template

```md
## Fix implemented

- Bug Report: <path>
- Confirmed cause: <summary>
- Changed paths: <paths>

## Evidence

- Automated tests: <commands and results>
- Playwright/manual: <scenario, endpoints/status and observed state>
- Blockers: <none or exact description>

## Handoff

- Bug Report: <open|closed|blocked>
- Next step: <conclude-bug-report|create-spec|none>
```
