---
name: create-bug-report
description: Diagnose an approved GitHub bug issue into a factual Stardust Bug Report and recommend a direct fix or a Correction Spec.
---

# Create Bug Report

Turn an approved GitHub bug issue into a durable technical diagnosis. The Bug Report is
a fix input, not a Spec: do not include `CA-*`, a manual verification script, tasks,
signatures, a proposed file inventory or detailed implementation.

## Input

- GitHub bug issue with problem, expected behavior, reproduction and context;
- optional technical context: environment, browser/device, frequency and evidence.

Without an existing issue, stop and route to `open-bug-issue`; this workflow neither creates nor
updates the issue.

## Authority and Rules

Read `AGENTS.md`, `documentation/sdd.md`, `documentation/rules/rules.md`,
`documentation/architecture.md`, `documentation/modules.md`, the associated milestone and the linked
versioned PRD when one exists. Select and read in full the Rules of the affected layers and test
types. Use them to validate boundaries, without turning the report into a Spec.

Milestone and PRD define expected behavior. If the requested expectation changes the product,
stop and route to amendment/feature; do not classify a behavior change as a bug.

## Diagnostic research

Organize the task's direct research into bounded lanes:

- one lane for a narrow boundary;
- independent lanes when two or more boundaries are affected;
- choose only real lanes, such as Core, Server, Web, Backoffice, Database or Integration;
- define symptom, expectation, initial paths, Rule Pack and diagnostic question;
- record exact paths/declarations, evidence, probable cause, risk and uncertainty.

The main task researches each lane, resolves conflicts by direct inspection and separates fact from
hypothesis. Do not create research agents.

## Diagnosis with Playwright

Playwright can and should be used to diagnose frontend bugs, UI, client-side routes,
authentication or any failure that depends on the real browser. It is not reserved for the final
validation of the fix.

When the symptom involves the browser:

- reproduce the route and the observable flow with Playwright before concluding the cause;
- for protected routes, authenticate using the local variables defined in `AGENTS.md`, never
  literal credentials, and access at least one protected route in the same context;
- record `console`, `pageerror`, `requestfailed` and `response`, including method, path and status
  of the relevant endpoints, without recording headers or bodies that contain tokens, cookies or
  personal data;
- use `waitForURL`, `waitForRequest`, `waitForResponse` or `waitForFunction` to synchronize
  states; do not use `waitForTimeout` as the sole evidence;
- inspect the state actually observed: DOM, computed styles, attributes, loading,
  navigation, remounts, timing and HTTP responses; for visual failures, capture a screenshot when it
  helps distinguish composition, stacking context, asset or hydration;
- if the flow fails due to authentication, separate credential/API failure, session propagation,
  CORS, middleware, refresh and screen loading. Confirm the login endpoint and the subsequent
  calls without exposing the sensitive values;
- treat the Playwright execution as diagnostic evidence for the report. The final document must not
  gain a manual validation, acceptance, tasks or implementation section because of this
  investigation.

For the Web App and Backoffice, follow the environments, credential export scripts, ports and
authenticated flow described in `AGENTS.md`. Use the Playwright CLI both for the formal reproduction and
for ad hoc visual exploration; do not use another browser automation tool in this
project.

## Workflow

1. check the real issue and the reported reproduction;
2. separate the observed failure from the expected behavior;
3. associate milestone, PRD and real requirement when applicable, without changing their state;
4. inspect the implicated entry point, state, transport, use case, persistence and integration;
5. when applicable, reproduce and instrument the real flow with Playwright according to the
   browser diagnosis section;
6. save or update
   `documentation/features/<domain>/<feature>/reports/<slug>-bug-report.md`;
7. recommend in the final summary:
   - **Direct fix:** narrow, well understood, low risk and with no durable Contract; or
   - **Correction Spec:** ambiguous, cross-layer, coordinated or of material risk, requiring
     `RF-*`, `CA-*`, `AV-*`, `MV-*` or `VV-*`.

Do not write the delivery route inside the Bug Report and do not create the Spec in this workflow.

## Required structure

```md
---
title: <short title>
issue: <GitHub issue URL>
milestone: <URL or null>
prd: <path/requirement or null>
apps:
  - <web|server|studio>
status: open
last_updated_at: YYYY-MM-DD
---

# Bug Report: <title>

## Diagnosis

### Observed failure

<confirmed behavior and conditions>

### Expected behavior

<product contract, Spec, Design or established behavior>

### Root cause

<explanation backed by evidence; remaining hypotheses explicitly marked>

### Affected areas

- `<relative path>` — <responsibility in the defect>

### Regression risk

<related behaviors that the fix must preserve>

## Fix boundary

<what must be fixed and what must remain unchanged>
```

## Constraints

- use GitHub Issues and real relative paths;
- do not invent execution, cause, method, contract or file;
- do not include acceptance, a manual validation section, tasks or file plan; Playwright
  evidence can support the cause, but must be synthesized into the factual sections of the report;
- do not edit Spec, Evaluation, PRD or Rule;
- do not expose credentials, private data or sensitive logs;
- at the end, report issue, path and recommended route.
