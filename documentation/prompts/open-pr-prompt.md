---
name: open-pr
description: Publish or update a Stardust Pull Request with Issue, PRD and SDD traceability, plus current validation evidence.
---

# Prompt: Create or Update Pull Request

## Goal

Publish a coherent Stardust delivery to GitHub. Use only `gh`, preserve the
user's worktree, and update an existing PR of the same delivery instead of
creating a duplicate.

This task does not create a Spec, PRD, Issue, or Report. It only consumes the
documents that already exist and the direct request when the delivery has no SDD
documentation.

## Inputs and sources of authority

Read, when they exist and are applicable:

- the implemented Spec or Bug Report;
- `evaluation.md`;
- the actual diff of the delivery;
- `documentation/sdd.md`;
- `documentation/tooling.md`;
- applicable rules;
- `documentation/rules/commit-rules.md`;
- the GitHub Issue and milestone used for traceability.

When the delivery comes from a Spec, confirm that `evaluation.md` uses the
canonical structure of `documentation/templates/evaluation.md` and has current
evidence for the exact revision of the Spec.

When the delivery comes from a direct request, do not invent a Spec, PRD, Issue,
requirements, or external records to fill in the PR.

Require explicit authorization before committing, running `push`, and creating or updating
the PR. In standalone use, invoke `commit` for pending changes in the
scope. When called by `conclude-spec`, reuse the commits already prepared.

## Delivery inspection

Before publishing, inspect the full worktree and the delivery history:

```bash
git status --short
git diff --stat
git diff
git diff --cached --stat
git diff --cached
git log -10 --format='%h %s'
```

Identify:

- staged, modified, and untracked files;
- generated artifacts, migrations, seeds, and configurations;
- affected applications and packages;
- user changes unrelated to the delivery;
- secrets or local data that cannot go into the PR.

Preserve others' changes and keep them out of the commits. If the relationship between
a file and the delivery is ambiguous, stop and report the ambiguity instead
of including the file by assumption.

## Branch and PR preparation

1. Inspect the staged and unstaged changes.
2. Finish the authorized commits of the delivery and confirm that the worktree is
   clean before starting the merge with `main`.
3. Fetch the actual integration branch without switching the worktree:

   ```bash
   git fetch origin main --prune
   ```

4. Look up open and closed PRs related to the delivery:

   ```bash
   gh pr list --state all --search "<terms from the Spec, Issue, or delivery>"
   ```

5. Verify base, head, SHA, and ancestry. The branch name does not prove
   incorporation.
6. Use `main`/`origin/main` as the integration base, unless explicitly instructed
   otherwise.
7. Mandatorily incorporate the latest `origin/main` into the delivery branch
   per the following section.
8. Compute and review the full diff against the PR base after the merge.
9. If a PR of the same delivery already exists, update its head and body.
   Otherwise, create a single PR for the coherent delivery.

Do not use destructive Git operations, do not bypass hooks, do not create dependent
branches by accident, and do not mix unrelated changes. Separate
deliveries require real semantic boundaries and an explicit dependency order.

## Mandatory synchronization with `main`

Before creating or updating the PR, merge the latest `origin/main` into the
delivery branch. Do not replace this step with `rebase` and do not publish a
branch that does not yet contain the remote SHA of `main` observed immediately
before publishing.

With a clean worktree, run:

```bash
git fetch origin main --prune
git merge --no-edit origin/main
```

When the merge completes without conflicts, review the new diff and repeat
the validations affected by the incorporated content.

### Minor and unambiguous conflicts

Automatically resolve only mechanical conflicts whose correct result
can be determined without choosing between competing behaviors. Examples:

- import ordering or formatting;
- independent changes in documentation;
- independent additions that must coexist;
- generated artifacts that can be recreated by an official and
  deterministic repository command.

Before resolving, inspect the three sides of the conflict and confirm that the
solution fully preserves the intent of `main` and of the delivery. Then:

1. edit only the conflicting files;
2. run `git add -- <resolved-files>` with explicit paths;
3. complete the merge without changing the default message;
4. review the resulting diff;
5. rerun the affected checks.

Do not classify a conflict as minor merely because of the number of files or
lines involved.

### Complex or ambiguous conflicts

Stop the flow and ask the user for guidance when the resolution requires
deciding which behavior must prevail. This includes, among others:

- competing domain logic or business rules;
- incompatible API contracts, public types, or schemas;
- conflicting migrations, seeds, or persistence changes;
- authentication, authorization, or security;
- dependency versions or lockfiles whose intent cannot be inferred;
- a file removed on one side and modified on the other;
- workflows, infrastructure, or environment variables with diverging
  strategies;
- tests that express incompatible functional expectations.

When asking for guidance:

1. list the conflicting files and hunks;
2. explain the observable intent of `main` and of the delivery branch;
3. present the impact of each possible resolution;
4. do not silently choose an alternative;
5. do not run `git add`, commit, `push`, or publish the PR;
6. keep the merge paused, unless the user explicitly requests
   `git merge --abort`.

### Verification before publishing

Immediately before the `push` and the creation or update of the PR, refresh
the reference again and confirm ancestry:

```bash
git fetch origin main --prune
git merge-base --is-ancestor origin/main HEAD
```

If the verification fails, incorporate `origin/main` again, handle conflicts
by the same rules, and repeat the affected validations. Do not publish while
`origin/main` is not an ancestor of `HEAD`.

## Validation evidence

Use the delivery's current evidence and run only the additional checks
approved by the repository that are needed to validate the publication state. Do not replace exact commands from `documentation/tooling.md` with
presumed generic commands.

When there is a Spec, confirm before publishing:

- exact frozen revision of the Spec;
- all changed paths within the recorded scope;
- mandatory file and widget tree preserved;
- contracts met;
- no affected evidence is stale.

If this conformance fails, stop the publication and route the fix through
`implement-spec`. Do not fix the implementation directly within the PR
creation flow.

For design-based UI, use the Penpot `stardust` frames declared in the Spec.
Confirm in `evaluation.md` the independent comparison of each mandatory state and viewport, including:

- route, state, and name of the reference frame;
- target viewport;
- result of the manual validation in a browser;
- capture of the implementation or the artifact identifier;
- comparison of structure, content, hierarchy, spacing, dimensions,
  tokens, interactions, and responsiveness;
- accessibility and DOM observations;
- resolved visual findings.

Do not create a separate visual evidence section in the PR body. When there is a
UI change, summarize the result in `## Testes manuais` and reference
`evaluation.md` in `## Validações automatizadas` or `## Limitações conhecidas`.

Review migrations, generated artifacts, and lockfiles when affected. Do not declare
as executed a check, manual flow, review, or deploy that was not observed.
Record environment limitations, failed attempts, and omitted commands without
turning them into success evidence.

## Generated artifacts and migrations

When the delivery changes persistence or generated content:

- compare migrations, snapshots, and journals with `origin/main`;
- resolve numbering collisions preserving earlier entries;
- run the documented generation or verification command once;
- review the generated SQL and metadata against the delivery source;
- confirm that seeds, generated routes, lockfiles, and other derived files are
  current and included only when necessary.

Never manually edit generated artifacts to hide divergences. Never
treat a generation failure or an unavailable environment as a passed check.

## PR contract

The body must use exactly the sections below, in the same order. The PR title and body are written in PT-BR (Brazilian Portuguese), so the section headings and literal texts shown in the code blocks below stay in PT-BR (glosses in parentheses are for the reader only). Some of them (such as `## PRD` and `Não aplicável`) are also matched by CI workflows.

### Objective

Use the heading (`Objetivo` = Objective):

```markdown
## Objetivo
```

Describe the problem, the expected outcome, the scope, and the relevant exclusions.

### PRD

Always use the heading:

```markdown
## PRD
```

When there is a PRD, give the path of the canonical PRD in `documentation/prds/` and, for the
release process, the full URLs of the Stardust milestones, one per
line:

```markdown
## PRD

<path do PRD canônico em documentation/prds/>
https://github.com/JohnPetros/stardust/milestone/40
```

(`<path do PRD canônico em documentation/prds/>` = path of the canonical PRD in `documentation/prds/`.)

When there is no PRD, use:

```markdown
## PRD

Não aplicável — alteração exclusivamente técnica.
```

(“Not applicable — exclusively technical change.”)

Do not omit this section. It is the main source used by the release process
to select which PRDs will have E2E.

### Affected requirements

Include this section only when there is a PRD (`Requisitos afetados` = Affected requirements):

```markdown
## Requisitos afetados

- `RP-01` — requisito de produto resumido.
- `JN-01` — jornada afetada, quando aplicável.
```

(“`RP-01` — summarized product requirement. `JN-01` — affected journey, when applicable.”)

Use only identifiers that exist in the canonical PRD. For legacy PRDs,
preserve the original identifier and record the crosswalk to `RP-*` when
there is one. Functional requirements of the Spec must be cited as `RF-*` only
when the PR's technical traceability requires it.

### Related issues

Use the heading (`Issues relacionadas` = Related issues):

```markdown
## Issues relacionadas
```

List only real Issues. Use `resolve #123` only when the merge of this PR
must close the Issue. When there is no Issue, write `Nenhuma.` (“None.”)
When there is Jira Shifu tracking, include the `SHI-*` key alongside the related
issue; never invent a key.

### Technical implementation

Use the heading (`Implementação técnica` = Technical implementation):

```markdown
## Implementação técnica
```

Summarize the coherent slices of frontend, backend, domain, persistence, and
tests, citing only the most relevant paths.

### Business rule changes

Include this section only when product behavior, validation, authorization, or
workflow are changed. Record previous behavior, new
behavior, reason, and evidence. (Heading in the PR: `Alterações de regras de negócio`.)

### Manual tests

Use the heading (`Testes manuais` = Manual tests):

```markdown
## Testes manuais
```

Give prerequisites, reproducible steps, expected result, and error or
recovery flows. For UI changes, include here a summary of the visual
validation, without creating a dedicated visual evidence section.

### Automated validations

Use the heading (`Validações automatizadas` = Automated validations):

```markdown
## Validações automatizadas
```

List exact commands and observed results, including failures, limitations, and
omitted checks.

### Known limitations

Use the heading (`Limitações conhecidas` = Known limitations):

```markdown
## Limitações conhecidas
```

Record non-blocking gaps or write `Nenhuma.` (“None.”)

Do not add generic sections such as `Changelog`, `Impacto e compatibilidade`
(Impact and compatibility), `Observações` (Notes), or `Evidências visuais` (Visual evidence). Do not copy the whole diff. Do not invent
Issues, requirements, test results, or human approvals. Do not include a
`Codex Review Summary` section or any automated review summary in the
PR body.

## Title

Use a short noun phrase in PT-BR, without a Conventional Commit prefix or an
invented Issue key. Do not start the title with a verb.

Examples (the titles stay in PT-BR):

- `Configuração da listagem de produtos` (Product listing configuration)
- `Correção da navegação para a tela de catálogo` (Fix of the navigation to the catalog screen)
- `Cobertura do cadastro com testes de integração` (Sign-up coverage with integration tests)

For fixes, include in the body the proven cause and the solution applied.

## Publishing and return

`push` the prepared branch and create or update the PR with `gh`. The Hermes
workflow starts automatically after the applicable checks pass for the
current head SHA.

### All PR operations use only `gh`

- Create, update, link, and follow the PR exclusively with the GitHub CLI (`gh`):
  `gh pr create`, `gh pr edit`, `gh pr view`, `gh pr checks`, `gh run view`,
  `gh run rerun`, and `gh api`. Do not use the app's `ccd_pr` tools, the browser,
  `WebFetch`, or an external monitor, and do not depend on one being on.
- Auto-fix is always applied by this flow, without asking for confirmation: after creating
  or updating the PR, follow the checks with `gh`, fix every failure within the scope
  of the delivery, commit and `push`, and repeat until all checks are green, as
  described in the next section.
- Read checks and conclusions with `gh pr checks <number>` and
  `gh pr view <number> --json statusCheckRollup,commits` (the last commit in `commits`
  is the published HEAD). Read logs with `gh run view <run-id> --log-failed` and, for a job
  completed in a run still in progress, with
  `gh api repos/<owner>/<repo>/actions/jobs/<job-id>/logs`.
- For a proven intermittent failure (for example, out of memory in a job unrelated
  to the diff), rerun with `gh run rerun <run-id>`; this version of `gh` does not
  accept `--failed`. Record each rerun and do not rerun indefinitely: a failure
  that repeats is treated as a defect and brought to the user.
- Review comments also arrive through `gh` (`gh pr view <number> --comments` and
  `gh api repos/<owner>/<repo>/pulls/<number>/comments`); handle them with
  `resolve-pr-feedback`.

## Mandatory CI after publishing

After creating or updating the PR, you must wait for all
workflows and checks applicable to the published HEAD to complete. Do not end the run with
checks `pending`, `queued`, `in_progress`, `failure`, `cancelled`, `timed_out`,
or `action_required`.

Poll through the GitHub CLI until the rollup contains checks and none of them
is incomplete:

```bash
while true; do
  total=$(gh pr view <number> --json statusCheckRollup --jq '.statusCheckRollup | length')
  pending=$(gh pr view <number> --json statusCheckRollup --jq '[.statusCheckRollup[] | select(.status != "COMPLETED")] | length')
  if [ "$total" -gt 0 ] && [ "$pending" -eq 0 ]; then break; fi
  sleep 10
done
gh pr checks <number>
```

Then check the conclusions in `statusCheckRollup`; the cycle may only
end when all applicable checks are green.

When any workflow or check fails:

1. inspect the workflow, job, and failure logs with `gh run view` and `gh run view --log-failed`;
2. identify the proven cause and fix the code, test, configuration, or documentation within the scope of the delivery;
3. rerun the affected local validations and record the current result;
4. commit the fix following the repository's rules, update the branch, and `push`;
5. confirm that the PR points to the new HEAD and wait again for all checks;
6. repeat this cycle until all mandatory workflows and checks finish successfully.

Do not treat a failure as a known limitation, do not mark the delivery as ready
with pending CI, and do not create a second PR to fix the first. For
intermittent failures, confirm the cause by repeating the workflow or the local validation before
concluding that the branch is green. If the fix requires new authority or
a decision outside the scope, stop and report the blocker without declaring the PR
complete.

Then, obtain the actual metadata:

```bash
gh pr view <number> \
  --json number,url,headRefName,baseRefName,headRefOid,commits,statusCheckRollup
```

Return:

- PR URL and number;
- base, head, and head SHA;
- summary of the changed paths;
- PRD or `Não aplicável` (“Not applicable”);
- affected requirements;
- final state of the checks, all completed successfully, and reviews.

Do not merge or deploy. Later review comments are handled by
`resolve-pr-feedback`.
