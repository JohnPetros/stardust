---
name: conclude-spec
description: Verify a Stardust delivery, complete its SDD artifacts and publish or update the PR after the Implementation Reviewer, the checks and the CI of the PR HEAD.
---

# Conclude Spec

Close the current delivery by reconciling the Spec Contract, the Evaluation evidence, the
findings and the publication references. The main task drives the closure within the
current task; do not create a new thread. Consume the valid implementation evidence:
the conclusion does not start another broad validation or review cycle.

Invoking `conclude-spec` does not, by itself, authorize any external mutation. Commit, `push`,
creating or updating a PR (the `commit` → `open-pr` chain) and syncing
with `main` require explicit, separate authorization from the user, given in the request itself. Without
it, conclude locally, stop before any external mutation and report publication as
not requested; a local-only request skips commit and PR. Even when authorized, publication
never authorizes merging the delivery into `main`, deploying or writing to external services
beyond the PR. Automatic continuation from `implement-spec` does not widen the authorization.

## Preconditions and continuity

Read `AGENTS.md`, `documentation/sdd.md`, the exact Spec revision and its Verification
Contract (`Validation Contract` in legacy Specs), the Evaluation, the relevant Rules and tooling, and the integrated diff. Verify the
canonical PRD in `documentation/prds/` and the recorded revision; reuse a complete and
current read in the same context and re-read if the revision changed or the authority is
uncertain. Report authority conflicts; return the affected Spec to `draft` for
reconciliation by `create-spec` and resume the implementation. Never silently change the
product intent, module ownership, Architecture, Rules or the acceptance
contract.

Require:

- the current Spec is `in_progress`, every row of its `plan.md` is `completed` and the
  Evaluation is `ready` for that revision;
- every required `RF-*`, `CA-*`, `AV-*`, `MV-*` and `VV-*` verification has current approved evidence or an
  explicit, justified not-applicable disposition; implementation progress comes from
  `plan.md` and verification from the Evaluation;
- the required independent implementation and visual reviews cover the candidate (an
  Implementation Reviewer accepted for the matching HEAD and, with design-backed UI, the
  Visual Reviewer with a disposition for every inventory row);
- no blocking finding remains; and
- traceability to the PRD/Issue/Report, the scope and the exclusions are correct.

A required check that failed, is missing, unavailable, skipped, waived or stale is not
a pass and cannot produce readiness or conclusion. Reconcile the `plan.md` rows, Check Results, Criteria evidence,
Findings and the real candidate; a `passed` status without observed proof is insufficient. Keep the
Evaluation `in_progress` while there is pending evidence or a pending fix, and retain a
factual Handoff: verification per criterion, unfinished `plan.md` rows, current candidate, reusable and stale
results, unfinished work, blockers and the concrete next action.

For a defect within the Contract, add an `ACH-*`, invalidate only the affected evidence and
route directly to `implement-spec` in the current task. The responsible Builder fixes; the designated
verification runner updates the affected checks until they pass. Resume the conclusion
when the Evaluation is `ready`. Do not stop at a next-step suggestion for a
fix that is already authorized.

## Sync before the final integration verification

When publication is authorized:

1. Confirm that the current branch is the delivery branch (not `main` nor production) and check
   its configured remote and the real `main` ref.
2. Inspect staged, unstaged and untracked changes. Preserve unrelated changes;
   never reset, stash, autostash, switch branches or overwrite work to force
   a merge. Pause only if Git cannot safely preserve the work.
3. Fetch and merge the latest `main` of that remote into the delivery branch; do not use
   rebase or an unqualified `git pull`. Record the fetched commit and the resulting candidate
   in the Evaluation. If the fetched ref was already incorporated, reuse the result.
4. On conflicts, follow `resolve-merge-conflicts`, preserve both intents, stage
   the exact paths, complete the pending merge and inspect the integrated diff. Coordinate the
   integration run with the designated runner.
5. Inspect what the sync introduced. If the checks already passed and the sync
   changed covered behavior, fixtures, dependencies or configuration, reopen only the affected
   checks and review scope. An ancestry-only merge or an unaffected change does not require a
   general rerun.

If `main` advances during publication, apply the same scoped invalidation rule. A failed fetch,
unknown remote authority and unresolved conflicts block publication.

## Reconcile conformance and evidence

Inspect the full worktree and delivery diff:

```bash
git status --short
git diff --stat
git diff
git diff --cached --stat
git diff --cached
git log -10 --format='%h %s'
```

Classify the exact delivery paths, the required factual documentation, the operational
ledger changes and the unrelated work. Include the required factual documentation in the
ordinary commits; explicitly preserve and exclude the unrelated work. Read the
Penpot file only through the Penpot MCP.

For each selected criterion, confirm that the current implementation satisfies the Spec and its
concrete sensor. Passing tests alone do not establish full coverage of the
Contract. Record boundaries, exclusions, sensor evidence and known limitations.
Use stable identifiers and preserve failures and their resolutions.

Use `plan.md` for implementation progress and the Evaluation's Criteria evidence and Check
Results instead of another acceptance matrix. Criteria evidence maps `CA`/`RF` to
`AV`/`MV`/`VV` and `EV` IDs. The Manual (`MV`) and Visual (`VV`) verifications have explicit pass conditions; the
baseline checks stay in the same results record. Confirm the current separate
dispositions for types (`check:types`), lint/code (`check:code`) and complexity for
the scoped changes and the affected consuming projects. Reuse applicable
results; configured complexity lint does not prove a quantitative metric, and
required tooling that is missing blocks closure.

The evidence includes the exact command and working directory, the result, the code
revision or worktree identity, the relevant fixture/configuration and the criteria
covered. Results remain valid when their covered Contract, code and
dependencies, fixtures and configuration have not changed. Explain reuse across
candidate SHAs; ledger edits do not invalidate results. Fixes invalidate the affected
evidence until updated; unknown impact requires checking the widest potentially affected
scope. Do not overwrite an old evidence ID with a materially different result.

For HTTP changes, compare each affected controller route group with its
`apps/server/rest-client/<module>/<group>.rest`: one request labeled per route, current
parameters/headers/body/status/error contracts and reusable variables without
secrets. Each `use-*.ts` behavior hook in scope has its `tests/use-*.test.ts`,
unless a recorded exception applies. These artifact checks do not replace real
HTTP, authorization and persistence evidence.

For server-backed criteria, require evidence through the real application boundary
(authorization, persistence, transaction, events, providers and relevant retries); mocked
transport does not prove a real-integration claim.

For UI criteria, consume the happy-path interaction assertions and the inspected
captures of the exact routes/states/viewports of the Spec: keyboard/focus, responsive
behavior, final URL, console/network result and relevant persisted effects.
Screenshots do not prove authentication or persistence. Negative, loading,
empty, error, recovery and unusual scenarios belong to the automated tests; do not add
manual scenarios or captures during closure without an affected Contract or a
concrete fix that requires them. Code review and visual review run in parallel on the same
candidate. Also confirm the `ui-layer-rules.md` audit recorded in the Evaluation.

For design-backed UI, confirm that the recorded visual comparisons used current
Penpot MCP exports of the Design Contract's pages, boards and components, and that the matrix
proves design-to-code fidelity at the current HEAD. A missing frame, a contradicted one, one added
without approval, or a divergence without a traceable decision keeps the Spec `in_progress` and requires
a fix or amendment. Reuse accepted and current comparisons; closure, by itself,
does not require new exports.

## Verification ownership and failure cycle

The verification runner designated in the main task owns the Server, browser and jobs
integration selections after full integration. Select local tests only for
in-scope changes and directly affected consumers; the conclusion does not add unrelated
suites. Broader selections require demonstrated dependency impact or a concrete
gap in the scope's proof; a full local suite requires a scope that covers it or an explicit
user request. Fix failures and rerun the checks that failed or were
affected until they pass, keeping the unaffected proof. The PR's CI runs its
configured commands independently.

Consume the current unit/component, lint, types, architecture, build, integration and
manual evidence defined by the Spec and the Rules. Use only commands that exist in manifests and
tooling; never invent a generic checker. Closure, Reviewers, commit and PR reuse
that evidence. Additional runs require a missing result, a covered
behavior/dependency/fixture/configuration change or a concrete unresolved finding. Record checks skipped or blocked by the environment as limitations, never as
successes; repeat transient infrastructure failures only with concrete evidence.

Before calling `commit`, confirm the mandatory sensors from `AGENTS.md`
(`check:code` and `check:types` in the affected workspaces and consumers, `test:unit` with the
affected files), `check:spec-implementation -- <spec> --base <base-commit> --require-plan` and
`check:test-integrity -- --base <base-commit>` against the final HEAD. Coverage/ratchet
(`test:coverage`, `check:coverage`) and full suites only apply with demonstrated impact on the
workspace, a Spec requirement or a user request; CI runs them. Reuse the current
recorded results and run only what is missing or stale. A green local build
is a precondition for calling `commit`; if there is no current build evidence, run
it once. A result other than `passed` prevents the conclusion.

## Delivery disposition and lessons

Map the selected PRD requirements, by `RF-*` and `CA-*`, to the accepted evidence:

| RP/JN | RF coverage | CA coverage | Evidence | Delivery disposition |
| --- | --- | --- | --- | --- |
| RP-01 / JN-01 | RF-01 | CA-01 | EV-01 | implemented |

Use `implemented`, `partially_implemented`, `not_implemented` or `not_applicable` with
evidence. A partial delivery never counts as a complete implementation. Product requirements
remain canonical in the versioned PRD; do not change them without an explicit request and
the applicable authority workflow.

Record material findings as `ACH-*` with evidence, severity, affected checks, state
and resolution in Findings. Read the Lessons learned and identify lasting guidance for
Architecture, Modules, Design, Infrastructure, Tooling, Rules or workflow; keep
feature-specific details local. State a concrete `No change` reason when the existing
guidance is sufficient, instead of inventing a lesson. Analyze all
findings, warnings and failures of the delivery (Reviewers, sensors and manual verification) and
identify causes that may recur. Recurring process, Architecture,
tooling or Rules gaps update the corresponding normative documentation; reusable implementation
errors use `register-antipattern` in the layer's Rule. Record in the Evaluation one
preventive action per finding (cause, updated document or `not applicable` with
justification, evidence and state).

For documentation updates beyond the routine Spec/Evaluation closure, reuse
the scope and authorization already granted. Otherwise, prepare the exact target, the
proposed change, the supporting `ACH`/`EV` lesson and the reason, and obtain approval before applying.
Permission to conclude, by itself, does not authorize a new global policy; a partial approval
covers only the approved changes. Normative changes that alter product, Contract, global
Rules or architectural boundaries require a user decision and keep the Spec open until
approval. Record proposed/applied/rejected/deferred updates in Lessons learned
and Delivery. Deferred optional improvements do not block closure; required alignment that is
unresolved or a material authority conflict blocks. Do not promote transient failures to global
policy or silently weaken Rules.

## Complete artifacts and publish

Reconcile `plan.md` and all sections of the Evaluation (current state, criteria evidence, check results,
findings, lessons, handoff and delivery) and keep the Spec's documentation alignment and revision
history correct, with the detailed proof and the delivery state in the Evaluation.
Preserve failed attempts, previous PR heads, the evidence scope and current facts about
process/dirty paths. Routine closure/status updates do not increment the
revision.

For local closure, when publication is not requested or is explicitly
local, mark the Spec, the Plan and the Evaluation as `completed` after all local requirements
pass; record publication as not requested, with the reason. For authorized publication, keep the Spec and the Plan `in_progress` and the Evaluation `ready`
during the commit/PR handoff until publication, the required CI of the current HEAD and the blocking review
conversations are resolved. A publication failure records a blocker and
cannot be reported as a completed delivery. Do not create a commit just to update the
operational ledger; include the required factual documentation in the delivery's normal commits.

For an explicitly authorized publication:

1. Verify the branch, the sync result, the scoped diff and the current evidence.
2. Invoke `commit` to create the delivery's intentional commits, respecting its
   staging, grouping, message and path gates.
3. Invoke `open-pr` to publish or update a single delivery PR, reusing the prepared
   commits and the valid verification evidence, request the Codex Review and
   track the CI of the newly created HEAD.
4. Verify base, head SHA, title/body traceability and the publication state;
   record the branch, commit hashes and the PR URL.

`open-pr` and `commit` keep their own authorization gates. Without authorization,
stop before any external mutation and request it. If there are staged changes, out-of-scope
changes or grouping ambiguity, preserve them and stop according to the rules of the
called workflows. Do not create duplicate PRs or use ad hoc publication to bypass the
workflow. If publication is unavailable, report the blocker and keep the states
ready for publication; do not claim an authorized publication or delivery as completed.

For each current head of the delivery PR, inspect the path filters of the versioned CI
workflows and the current checks with the authenticated `gh` and wait for the terminal results. The
CI result stays in the PR: do not record it in the Evaluation. Inspect the repository
state instead of assuming the workflows exist. Missing, pending,
cancelled CI or CI from a previous head is not an approved current CI; if no applicable workflow
exists, treat it as not applicable. A required CI run on the current head is distinct from
repeating local suites.

For actionable CI failures, route the fix through `implement-spec` (with `Builder Fix`
when the fix is in scope). If the fix invalidates already recorded evidence,
reopen the Evaluation and update only that evidence; the CI failure itself is not recorded. Commit
and update the existing PR when authorized, repeating the Reviewer when the diff or the
evidence was invalidated. Rerun the same SHA only for a proven transient failure. Do not change the
product disposition unless the failure establishes a product defect.

Mark the published Spec, Plan and Evaluation as `completed` only after all required CI
of the current head passes and the blocking review conversations have verified resolutions.
Do not wait indefinitely for hypothetical future feedback. Later feedback
on an open PR may reopen the same Spec (`resolve-pr-feedback`); after the merge, a defect
uses a Bug Report and new behavior uses a change Spec. Do not merge the delivery into
`main` or deploy without separate authority.

## Output

Return concise clickable links to the Spec, the Plan, the Evaluation and the PR; the Spec revision and the
final states; branch/commits and Issue/PRD references; the criteria/sensor coverage
and the reused evidence; the delivery dispositions; the CI and publication state; resolved
findings, remaining limitations, factual documentation updates and preserved
exclusions. State only results actually observed and recorded.
