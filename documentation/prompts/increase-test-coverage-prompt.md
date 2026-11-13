---
name: increase-test-coverage
description: Increase behavioral coverage in StarDust without weakening baselines, Rules, test integrity or the SDD workflow.
---

# Increase test coverage

Use this workflow for an explicit request to increase or preserve automated
coverage in an existing StarDust implementation. It is a test
maintenance workflow; it does not replace Issue, PRD or Spec.

If the required change alters product behavior, authorization,
persistence, public contract, architecture or a PRD outcome, stop the
coverage work and route the change through the normal SDD workflow. A
production fix may only enter this task when it is minimal,
behavior-preserving, explicitly authorized and recorded in the handoff.

## Goal and invariants

Improve the behavioral coverage of the affected workspaces through meaningful
scenarios. Percentages are diagnostic signals; they are not, on their own,
an acceptance criterion.

Never:

- reduce any metric recorded in `coverage-baseline.json`;
- lower thresholds, change exclusions or weaken `check:test-integrity`;
- add superficial assertions, artificial branches, sleeps, snapshots without
  value or duplicate cases just to raise a metric;
- turn a real product failure into a silent behavior change;
- treat a mocked unit test as proof of authentication, persistence,
  integration or a real journey.

A baseline may only be updated with current evidence, explicit review
and a justification recorded in `evaluation.md`. CI must keep failing if
any workspace metric falls below the versioned baseline.

## Routing before editing

Before creating or modifying tests:

1. Determine whether the request is coverage-only. If there is a product or
   contract change, stop and use `open-feat-issue`/`create-spec`.
2. Identify the workspace and the behavioral boundary that owns the code.
3. If there is a related open Spec, preserve its revision,
   paths, RF/CA, assignment and exits; record the activity in `evaluation.md`.
4. If there is no Contract and the change remains just test
   maintenance, do not invent a Spec just to raise a number.

## Mandatory authorities

Read before implementation:

1. `AGENTS.md`;
2. `documentation/architecture.md`, `documentation/tooling.md` and
   `documentation/rules/rules.md`;
3. the specific Rules for the affected paths:
   `domain-objects-testing-rules.md`, `use-cases-testing-rules.md`,
   `handlers-testing-rules.md`, `server-routes-testing-rules.md`,
   `web-app-routes-testing-rules.md` and `widget-tests-rules.md`;
4. `documentation/modules.md`, PRD and Design when the behavior involves
   a product capability or UI;
5. source, existing tests, runner configuration, fixtures and
   `coverage-baseline.json`.

Use only commands declared in the `package.json` files and in `documentation/tooling.md`.
Do not use credentials, tokens, storage state or data from `.env.development` in
versioned files, tests or logs.

## Allowed targets and integrity

`check:test-integrity` requires pairing for changed executable source
only in these targets:

- domain objects: `entities`, `structures` and `aggregates`;
- use cases;
- REST controllers;
- jobs;
- hooks;
- widgets/views;
- Web routes (`app/page`, `app/layout`, `app/route`);
- Server routes;
- RPC actions;
- AI tools.

New tests must follow the locations allowed by the Rules and by the checker,
normally a `tests/` subfolder of the corresponding boundary or
`scripts/tests/**`. A test outside the allowlist fails with `forbiddenTestPaths`.

Do not create direct tests for generic services/repositories, providers,
gateways, clients, mappers, factories, constants, interfaces, stores,
contexts, barrels, fakers, fixtures, mocks, types, generated code or
test infrastructure. Cover indirect source through the allowed consumer or
record the exclusion with a justification.

Removing an obsolete test is allowed when the behavior no longer exists,
but the removal must be in scope and the remaining behavior must stay
covered. The checker must keep failing for a reduction in cases/assertions,
an increase in `skip`/`todo` or changed testable source without a corresponding test.

## Baseline and discovery

Before editing, record the workspace state:

```bash
pnpm run check:test-integrity --base <base-commit>
pnpm --filter <workspace> run test:coverage
pnpm run check:coverage <workspace>
```

Inspect the textual summary and
`<workspace>/coverage/coverage-summary.json`. Record for `statements`,
`branches`, `functions` and `lines`:

- versioned baseline;
- current value;
- uncovered files, functions, branches and lines;
- responsible boundary;
- reason to test directly, test indirectly or exclude.

Prioritize production risk, not the lowest percentage: domain rules,
validation, authorization/tenant, persistence, provider failure, retry and
idempotency, REST error mapping, side effects, loading,
empty, error and recovery states, plus accessible keyboard interactions.

## Scenario matrix

Before implementing, create a small matrix per boundary containing:

| Field | Required content |
| --- | --- |
| Source and entry point | file, public function and owning boundary |
| Test | allowed file that will be created or changed |
| Success | observable result and expected effects |
| Alternatives | invalid input, absence, authorization and dependency failures |
| State/effects | transition, persistence, event, provider or recovery |
| Acceptance | behavior the scenario protects |
| Exclusions | indirect, generated, defensive or not-applicable path and justification |

Test the smallest boundary capable of proving the behavior. Reuse existing fakers,
factories, fixtures and conventions. Assertions must verify return value,
state and observable effects, not just that a mock was called.

For UI, cover the widget or route boundary with accessible locators and the relevant
states. For a real flow, use Playwright per `AGENTS.md`, record
`console`, `pageerror`, `requestfailed` and HTTP responses, and never declare an
authenticated screen functional based only on a mock-based suite.

## Subagents and ownership

Use subagents only when there are independent workstreams and it reduces
risk or time. Do not parallelize coupled scenarios, shared fixtures or
overlapping paths.

Each assignment must state:

- a single workspace and boundary;
- exact source and test paths that may be inspected/edited;
- scenarios and coverage gaps the agent is responsible for;
- Rules, fixtures, commands and expected evidence;
- forbidden paths and a prohibition on editing Spec, Evaluation or Rules.

The main task keeps shared decisions, integrates diffs, resolves
conflicts and runs the final validation. A subagent report is not evidence:
verify the integrated diff and repeat tests, coverage and checks.

When coverage is part of a Spec, use a read-only `Implementation Reviewer`.
Any fix after a verdict invalidates the affected evidence and
requires a new review.

## Test implementation

1. Create or adjust only tests in allowed targets and paths.
2. Preserve Arrange-Act-Assert, per-test isolation and the runner's conventions.
3. Cover success first and then significant branches of error, authorization,
   absence, persistence, side effects and recovery.
4. For controllers, actions, jobs and tools, validate input, orchestration and
   output on the handler's public contract.
5. For Server routes, use the Hono/HTTP edge and real persistence when the Rule
   requires it; do not replace integration with an internal mock.
6. For Web pages, distinguish page composition tests, widget tests and real
   Playwright flows.
7. If a minimal refactor is needed for testability, explain it in
   `evaluation.md` and prove that the behavior did not change.

Do not change thresholds, exclusions, source classification or Rules to make the
check pass. Do not version coverage output, local screenshots, credentials or
generated artifacts.

## Validation gate

Run the focused test first and then the applicable sensors:

```bash
pnpm run check:test-integrity --base <base-commit>
pnpm --filter <workspace> run test:coverage
pnpm run check:coverage <workspace>
pnpm run check:code
pnpm run check:types
pnpm run test:unit
```

Add according to the paths and Rules:

```bash
pnpm run check:architecture
pnpm run test:integration
pnpm run test:scripts
pnpm run check:spec-implementation <spec> --base <base-commit>
```

For Core, Server, Backoffice and Web, `test:coverage` and `check:coverage` are
mandatory. `lsp`, `validation` and `email` remain
outside the coverage quality ratchet. Use database, browser, build or
generation validation only when the boundary requires it.

The gate only passes when:

- all new tests pass;
- `check:test-integrity` passes with no forbidden paths or testable source without a pair;
- each workspace metric stays at least at the baseline;
- no threshold, exclusion or classification was weakened;
- UI, runtime, persistence, authorization and integration evidence is
  current when applicable;
- remaining gaps have an explicit boundary, reason and next step.

## Evaluation and handoff

If there is an `evaluation.md`, update it as a living ledger after each change,
recording command, result, SHA/base, freshness, affected path, scenario,
finding and decision. Evidence that predates a change becomes `stale`.

Deliver a report with:

1. affected workspaces and source/test paths;
2. chosen gaps and the scenario each test proves;
3. statements, branches, functions and lines before/after;
4. exact commands and results;
5. integrity, coverage, integration, browser, persistence and
   authorization evidence, when applicable;
6. remaining gaps, justification and follow-up;
7. any behavior-preserving change made to enable testability.

Do not claim that coverage, on its own, proves feature acceptance, authorization,
persistence, integration or completion of the user journey.
