---
name: implement-spec
description: Autonomously implement an open or resumed Stardust Spec, verify the integrated candidate and preserve the evidence for continuation.
---

# Implement Spec

Follow [`documentation/sdd.md`](../sdd.md). The Spec fixes behavior, contracts,
exclusions and required sensors. Organize the execution directly in the current task. Use
focused delegation when the scopes are independent; there is no per-phase or per-task
approval sequence. This prompt is the only
implementation entry point: do not ask the user to choose another prompt and do not
create another thread.

```text
implement-spec
→ Builder Direct or bounded Builders
→ integrated candidate
→ check:spec-implementation + sensors + real manual verification
→ Implementation Reviewer (+ Visual Reviewer in parallel, when there is UI)
→ evaluation.md ready
→ conclude-spec
```

## Persistence and stop rule

Own the implementation and verification until the Evaluation is `ready`. Do not stop
when a check passes, the code is complete or a Reviewer responds while
required and actionable obligations remain. A question about a check drives the Spec in
progress, unless the user explicitly restricts or cancels the goal.

1. Reconcile all `AV-*`/`MV-*`/`VV-*` and baseline verifications, the `CA-*` mapping,
   the open `ACH-*` and the independent review with `evaluation.md` before
   choosing the next action.
2. Run the pending checks, diagnose failures, fix causes within the
   Contract and rerun the affected verification. After each fix, inspect the entire
   set of remaining obligations and preserve the current proof that is not affected.
3. Investigate local setup failures within the existing authorization: service health and
   configuration, expired browser state, accounts/data defined at the
   source and outdated fixtures/seeds. Use isolated fixtures or the task's own
   environments. A first failure or missing setup calls for diagnosis, not an immediate handoff.
4. Obtain the required reviews and rechecks, resolve blocking findings and
   reconcile the documentation alignment. Never remove checks or weaken assertions or
   thresholds just to pass; material changes go through Contract reconciliation.
5. Before yielding control, audit each remaining check/finding and keep going whenever
   there is a safe and authorized action that moves it forward. The handoff describes a
   real interruption or blocker; it does not replace executable work.

An outdated fixture/seed source is actionable when the intended data is
defined in the Contract. Inspect its consumers and the applicable Rules, fix the
definition at the source, validate it and rerun the check that was originally blocked. Distinguish
fixing the source from applying a seed: inspect the actual behavior of the
reset/seed command and use disposable or isolated targets. Never reset/reseed shared
data (including Supabase Dev) without explicit authorization. Ask only
when the intended data is materially ambiguous or when a necessary shared
operation lacks authorization after the isolated alternatives have been investigated.

Stop unfinished work only for an explicit stop/restriction, a genuinely missing material
decision or authorization, or an unavailable external dependency
after the permitted diagnosis and recovery. Finish the independent work first; record the affected IDs, the recovery and the proof attempted, why an
external action is necessary and the exact input or change required. Do not invent
non-applicability nor mark missing proof as `passed`. Resume when the blocker
disappears, without asking for authority again.

## Establish or resume the Contract

Read `AGENTS.md`, `documentation/sdd.md`, the current Spec and `evaluation.md`,
Architecture, Modules, the Rules selected by the affected paths,
`documentation/tooling.md` and the Design Contract with the pages, boards and components of the
Penpot `stardust` file through the Penpot MCP. Reuse complete sources still current in this
context. Inspect `git status` and the diffs and preserve unrelated work. Use
CodeGraph for each new code exploration, per `AGENTS.md`.

Initial implementation requires an `open` Spec; resumed work requires the same revision and
an Evaluation with unfinished criteria or findings. Do not activate the Spec Reviewer for
implementation evidence. A material Contract change goes through `create-spec`:
preserve the history, reconcile source/design/sensors, increment the revision and
invalidate the affected proof.

Before any feature edit, create or reconcile `evaluation.md` per the
Contract of [`create-evaluation`](create-evaluation-prompt.md) and change the Spec to
`in_progress`. Record the current Contract, the Spec revision, the base commit, the
branch/candidate, the known baseline facts and the assignment (mapped RP/JN, RF/CA and
SHI-*, allowed and forbidden paths, Rule Pack, Design references and
exits). Initialize one Progress row per `CA-*`, separating implementation from
verification, plus Check Results, Findings, Lessons, Handoff and Delivery. Read the existing
failure reports; do not launch integration suites for a baseline nor
to fulfill the kickoff. Environment availability may be inspected without starting
a behavioral suite.

On continuation, compare the recorded progress and evidence with the current tree. A
completed criterion remains completed only when the covered behavior and the
proofs have not changed. Inspect recorded process sessions and active ports before
starting services. Recover unfinished work from the diff and the findings and choose
the next action without rebuilding a task ledger.

## Fail-closed invariants

If one of these conditions cannot be verified, stop before editing source,
tests, migrations or generated artifacts and record the blocker:

- `implement-spec` is the only implementation entry point; do not reactivate removed
  workflows nor simulate old roles;
- the Spec, its paths, contracts, exclusions and states are the authority; existing code,
  an isolated screenshot or a passing test does not replace them;
- `pnpm run check:spec-implementation <spec> --base <base-commit>` runs before the
  integrated sensors and again after any fix that changes, creates, generates or
  removes a contracted path;
- any implementation, test, browser, network, console, migration, CI or
  visual error within the Contract is an automatic fix: record it, invalidate the
  affected evidence, fix it within scope and rerun the checks;
- required manual/runtime scenarios are fail-closed: unavailability, timeout or
  failure blocks the affected item; do not use a mock nor old evidence as a substitute;
- for Server, confirm real behavior, authorization, persistence and side
  effects per `AGENTS.md`; local Supabase is the default and Supabase Dev only comes in
  when the task requires the remote project;
- local execution is scoped (see "Scoped local execution" in `documentation/tooling.md`):
  coverage/ratchet (`test:coverage`, `check:coverage`) and full suites are left to CI,
  unless there is demonstrated impact on the whole workspace, a Spec requirement or a user request; LSP,
  Validation, TypeScript Config and Email remain excluded from the ratchet.

## Autonomous execution and bounded ownership

The main task decides the order, the implementation structure, the dependencies and the
recovery within the approved Contract and the Rules. Resolve routine and
reversible choices directly. Ask only when an unresolved choice materially changes
product behavior, scope, ownership, public or persistent contracts, or a consequential
technical commitment. Existing internal trees guide placement; they do not require an amendment
for each helper or widget.

The PRD dependency graph is a product authority, not an execution order. Derive
the order only from the Technical Contract, the affected paths, the runtime dependencies
and the layer boundaries.

Implement directly when the work is cohesive (`Builder Direct`, in the main
context, without a subagent). For independent flows, assign sibling Builders named
by ownership (`builder_core`, `builder_server`, `builder_web` or equivalent) with:

- Spec path and revision and the relevant `RF`/`CA` outcomes;
- exact allowed and forbidden boundaries and shared dependencies;
- Rule Pack, design references and existing findings;
- unit/component/static feedback commands and the expected result.

Builders do not create other subagents. Keep concurrent ownership disjoint, warn
them that they are not alone in the worktree and must preserve others' edits. Coordinate
shared contracts, generated artifacts, migrations, lockfiles and
cross-boundary changes in the main task. Inspect each returned diff and incorporate only
work that adheres to the Contract. Delegate by ownership/cohesive outcome, not by file
nor by ceremonial phase.

Builders write or update tests from the acceptance claims, including
failures, recovery and enumerated states, and run focused unit/component and
static checks during implementation. Server, browser, jobs and migrations integration
belongs to the final integrated verification cycle, not to each Builder output. Prefer
the real CI commands and explicit reproducible configuration over
developer secrets.

Follow the selected test-boundary Rules: use cases mock ports; controllers
exercise the registered app and real persistence; jobs exercise the registered durable
execution; Web tests use the boundary of the owning widget/hook/Page/Layout. Keep meaningful
existing coverage and assertions. Do not weaken a check, do not skip a
failure, do not remove valid scenarios nor invent a command to report green.

Update the `.rest` examples of the route group together with the owning implementation, in
`apps/server/rest-client/`, with one labeled request per route, the current contract and
reusable variables without secrets. Each `use-*.ts` behavior hook in scope
has `tests/use-*.test.ts`, unless an explicit exception of the Rule Pack is recorded in the
Evaluation. Generate routes and other artifacts with the repository's commands.

## Implementation with design

Read the Spec's Design Contract and inspect the named boards and components of the Penpot
`stardust` file through the **Penpot MCP** (the Builder and the Visual Reviewer use the MCP directly),
exporting them when you need a rendered reference.
Map the variables bound to the repository tokens; do not copy values without a
variable, do not invent missing details and use existing primitives and semantic tokens,
accessible pt-BR copy and the selected UI/routing Rules. Preserve the
canonical design: any unapproved simplification, substitution, addition or divergence
is a blocking finding. Do not save exports in the feature folder nor edit the
Penpot file, unless the Spec includes it in scope.

The Spec defines the happy-path rendered states and the required viewports. Cover
loading, empty, error, recovery, concurrency and unusual outcomes with automated
tests; do not turn each board into another manual scenario. The required visual evidence
comes from the integrated candidate, after the last affected UI edit, with
route/state/viewport/fixture and artifact path. An earlier capture of unchanged UI
may remain valid when its dependencies and the rendered state have not changed;
explain the retained evidence in the Evaluation.

### Manual and visual evidence inventory

Before running or delegating the verification, enumerate in the Evaluation each Manual
and Visual obligation of the Contract, with one row per journey or per required rendered
state/viewport: `MV`/`VV`/`CA` IDs, surface/route, state, viewport, Penpot board, candidate,
artifact path, observed result and review disposition. Keep the inventory in the
Evaluation, without creating another planning artifact nor scenarios beyond the Contract.

Page, dialog, mobile states and other surfaces are distinct obligations when
required: the evidence of one surface does not establish the result of another, even if
they share components. A capture remains `pending` until it is inspected against a
current export of the specific board. Record concrete observations about the required visual
properties and any approved deviation; the mere existence of the image is not proof.
Manual behavior and visual appearance have separate results: a journey that
works does not prove design match, and a matching image does not prove real
authentication or persistence.

## Integrated verification and failure cycle

Run the Automated (`AV-*`), Manual (`MV-*`) and Visual (`VV-*`) verifications of the Verification Contract and all applicable baseline
gates from Rules and Tooling. For contracted finite sets, verify the
defined combinations; for unbounded inputs, use the equivalence classes and the
contracted limits. Required tooling that is unavailable leaves the check `blocked`; coverage
does not replace it. Do not install a runner as an incidental action.

After integrating all implementation flows and the generated artifacts:

1. Compare the full diff with the Spec's outcomes, boundaries, public contracts, persistent
   invariants, exclusions and sensor coverage.
2. Run `pnpm run check:spec-implementation <spec> --base <base-commit>`. This
   preflight requires the canonical `Path | Change | ...` map of the Technical Contract and
   confirms that each `Create`, `Modify`, `Generate` or `Remove` matches the diff and the
   filesystem. It is structural and does not replace tests, sensors, Reviewers nor Evaluation.
3. Run `format`, `check:code` and `check:types` in the affected workspaces and in their
   consumers, `test:unit` with the affected test files, `check:test-integrity` and
   `check:architecture` when applicable, per "Scoped local execution" in
   `documentation/tooling.md`. Coverage/ratchet and full suites only come in with demonstrated
   impact on the workspace, a Spec requirement or a user request (CI runs them).
   Run `check:complexity -w <workspace>` when the scope requires it. Record each static
   category explicitly. A runner designated in the main task owns the integration
   commands and results.
4. Run the contracted integration selections (Server, browser, jobs) against the
   integrated candidate, with exact files/scenarios and CI-compatible fixtures,
   showing that the intended tests ran. Select local tests only for the
   scope's changes and their directly affected consumers; widen only in the face of demonstrated
   dependency impact or a concrete gap in the scope's proof. A full local
   suite requires a scope that covers it or an explicit user request.
5. On failure, record the command/result and the mapped finding, fix within the
   Contract and rerun the integration checks that failed and the affected ones until all required
   selections pass. Selections that passed and were not affected keep their
   evidence; broader reruns require a changed shared dependency or
   a concrete coverage gap. Preserve historical failures of full runs:
   a focused fix establishes focused results, not an inferred full pass.
   Avoid repeating unchanged full tests when a real coverage command already
   runs them.
6. Run the concise happy-path manual scenarios required by the Spec with Playwright
   in a real browser, following the manual verification section of `AGENTS.md`: local
   services, login and protected route when applicable, main visible result and
   `2xx` status of the essential endpoints, plus final URL, persistence,
   keyboard/focus, narrow viewport and console/network as applicable. Capture the required
   visuals during these journeys. Do not manually explore error, loading or
   recovery states, nor add negative matrices or repeated accounts/fixtures without an
   acceptance obligation.
7. Inspect the real captures against the references and record the concrete
   differences and the limits of the evidence. A screenshot does not prove persistence nor
   authorization; mocked transport does not replace a required real journey.
8. Shut down only the disposable processes and fixtures started by this task; preserve
   shared services and data per `AGENTS.md`.

Required services, accounts or fixtures that are unavailable are blockers, never approved
checks. Continue the useful independent work and report the exact unavailable proof.
Repeat a transient environment failure when there is a sign that it may succeed.
An explicit user waiver is recorded as `waived`, with no claim of approval
nor removal of the automated acceptance obligations.

## Parallel review and fixes

Activate the independent [Implementation Reviewer](../agents/implementation-reviewer-agent.md)
over the integrated diff, the current Spec, the selected Rules and the current acceptance
evidence. For design-backed UI, activate the
[Visual Reviewer](../agents/visual-reviewer-agent.md) **in parallel** over the same
candidate and the already existing required captures and references. Do not add a third
serial Reviewer; additional specialists require a distinct material risk, not a
package count nor a task boundary.

The Reviewers inspect the assertions and the scope/freshness of the evidence for each
`CA-*`. They consume the recorded integration results and do not rerun green
suites just to fill another role. Missing, stale or unsupported proof generates a
concrete finding and the specific sensor required. The main task reconciles the
reports, verifies the findings and records the `ACH-*` IDs and their disposition.

Hand the Visual Reviewer the complete inventory of required visual states, including
missing captures, and ask for a disposition for each row. Reconcile the reviewed
scope with the inventory yourself: an overall PASS or the review of only some captures
does not close the remaining rows. Required states that are missing, uninspected, stale or
divergent remain `pending`, `stale` or `failed` and prevent the visual check from passing.
Complete the remaining authorized work and request the affected review before claiming
completion.

Fix findings within the Contract autonomously. Rerun only the invalidated sensors and
visual comparisons and resume only the affected review scope. A
fix that crosses code and visuals reactivates both Reviewers in parallel. A Contract
conflict goes back to `create-spec`; implementation findings stay in this fix
cycle. Do not silently reduce the acceptance nor change PRDs. Create `Builder Fix ACH-<n>`
only when the original Builder cannot be resumed or the fix is
genuinely independent. After three materially identical failures, ask the
user for a decision only if the resolution cannot be obtained from the authorities, the codebase or the
environment.

### Fix versus Contract change

Classify any request or discrepancy against the current revision before changing
code or artifacts:

- **Implementation fix:** keep the revision, record an `ACH-*`, reopen the
  Evaluation and the affected work, mark as `stale` only the affected evidence,
  resume the Builder and rerun its exits.
- **Contract change:** pause, return the Spec to `draft`, invoke `create-spec`
  to obtain authority and update PRD, Architecture, Modules, Design, Tooling or Rules
  when necessary; increment the revision, reconcile the Evaluation and only then resume.

Do not request authorization to fix a discrepancy within the Contract. Ask
only when the classification, the product outcome, an authority, security or the
environment cannot be resolved from the project sources. Changes outside the Spec
stay outside the candidate and the Evaluation, unless they affect the evaluated paths,
contaminate the evidence or cause a regression.

## Reinforcing Rules and findings

When a finding reveals missing, ambiguous or repeatedly violated guidance:

- if the Rule is already clear, fix the implementation and record `No change` with the
  justification;
- if the reusable convention is not clear, pause the dependent work, update the
  authority through the appropriate workflow and recompute the Rule Pack;
- for a reusable implementation anti-pattern, use `register-antipattern` on the layer's
  Rule, with forbidden pattern, mandatory alternative and validation proof;
- invalidate affected evidence, record the change in the Evaluation and rerun the fix
  path and its sensors.

Every accepted finding has the concrete problem in `Findings` and, when there is
reusable guidance, an entry in `Lessons learned` with the affected authority and its
disposition. Update PRD, Architecture, Design, Tooling, Rules or prompts when the
lesson is durable; local details, an isolated typo, a transient failure or an already
documented rule receive an explicit no-change disposition. Changes to product,
Contract, architectural ownership or global policy require user authority.

## Evidence and readiness

Follow the structure of the [Evaluation](create-evaluation-prompt.md). Progress has one row
per `CA-*` with Implementation (`Pending`/`Partial`/`Complete`) and Verification
(`Pending`/`Partial`/`Passed`/`Failed`/`Blocked`/`Stale`) separate, mapped
checks/evidence and remaining work. Check Results includes the baseline checks and uses `Pending`,
`Passed`, `Failed`, `Blocked`, `Stale` or `Not applicable`, with `EV-*` IDs, exact
procedures, real test selection and count, expected/observed results,
candidate/date, environment/fixtures, artifact paths and limits. Preserve failed or
interrupted attempts and limitations. Use stable `CA`/`AV`/`MV`/`VV`/`EV`/`ACH` IDs and record
significant checkpoints (accepted Builder work, sensor execution, resolved findings)
instead of one ledger update per file edit.

Invalidate evidence by the claim and affected dependencies, not by commit age.
A change to implementation, fixtures, environment or Contract reopens the checks it affects.
Unchanged approved evidence remains valid across role transitions, ledger
edits, review and completion; record the retained evidence and the reason. Changed seed, fixture,
configuration or environment record scope, reproducible procedure and
cleanup without secrets; generated artifacts record source, generator and output; new
or changed tests record the protected behavior and the command.

Keep a small, factual Handoff: Contract revision, branch/candidate, completed and
unfinished criteria, interrupted or uncommitted paths and their ownership, latest
results, process sessions/ports started by the task and cleanup, blockers and the
next action. Keep the blockers specific; do not turn this section into phases,
task trees, estimates nor a second Contract.

Record reusable lessons with supporting `ACH`/`EV` references and the documentation action or
the reason for no change. A trivial fix does not need to become a lesson nor a global
policy. Keep the Delivery (source verification, documentation alignment, publication
state and limitations) factual, without PR CI results.

When all criteria have current approved proof or justified non-applicability,
the applicable sensors pass and the blocking findings are resolved, mark the
Evaluation as `ready` and proceed directly to `conclude-spec`. Conclusion reuses
these results; it does not start another broad integration run. The exact records of
automation, manual, review, waiver and limitations must support each readiness
claim. A waiver does not turn a required `failed`/`blocked`/`stale` check into
approval nor into readiness. Publication still requires the existing authority, and the published
conclusion waits for the CI of the current HEAD and the resolution of blocking conversations.

Before changing the readiness status or reporting that all manual/visual
validations passed, reconcile the full set required by the Spec with the
inventory, the real artifacts, the observed results and the Reviewers' dispositions.
Each required row must have current approved and supported evidence or non-applicability
authorized by the Contract. Do not silently exclude a page, viewport or state, do not
infer full coverage from a Reviewer's summary nor present partial verification as
complete. If an earlier completion claim was not supported, preserve it and correct it
in the Evaluation, reopen the affected check and report the correction explicitly.

## Report

Return links to the Spec and the Evaluation, revision/candidate, implemented outcomes,
sensor results, Reviewers' findings and dispositions, remaining criteria/blockers
and the next action. Keep the runtime and visual limitations explicit.
Reusable guidance revealed by a defect may be recorded as a grounded lesson;
repository-wide authority changes and external writes follow
their authorization boundaries.
