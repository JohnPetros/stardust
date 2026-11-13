---
description: Create release Pull Requests from a release branch to production, with SemVer, affected PRDs, Web App E2E validation on staging and post-merge publishing.
---

# Prompt: Create Release PR

## Objective

Standardize the creation of release Pull Requests from `release/vX.Y.Z` to
`production`, always from a snapshot of `main`. The PR must identify
exactly the changes and the PRDs included in the version,
record the `head SHA` targeted by the validation on the existing staging, and provide the
notes used in the GitHub Release after the merge.

Use exclusively the GitHub CLI (`gh`) for GitHub interactions. This
task does not require and must not create a Spec.

## Input

- Optional target version in the format `vX.Y.Z`.
- Branch `main` containing the changes that are candidates for production.
- Branch `release/vX.Y.Z` created exactly from the SHA of `origin/main`.
- Branch `production` representing the currently published version.
- Regular PRs merged into `main`, each with a PRD explicitly
  related or marked as `Não aplicável` (not applicable).

When no version is given, determine the next SemVer version from the
changes since the last published release.

## Responsibilities

This prompt is responsible for:

1. preparing and presenting the complete draft of the release PR for approval;
2. creating or updating the PR only after the user's explicit approval;
3. identifying and recording the affected PRDs;
4. recording the `head SHA` targeted by the E2E validation on the existing staging;
5. tracking the release checks without directly running the deploy or the
   E2E tests;
6. providing notes compatible with the later creation of the tag and the GitHub
   Release.

The workflow `.github/workflows/hermes-e2e-testing.yaml` is responsible for:

- verifying the availability of the staging Web App, without starting a deploy;
- running, on the staging Web App, the E2E tests of the affected PRDs with the Hermes
  `e2e-tester` profile and the `playwright` MCP server;
- publishing the requirements matrix and the evidence references on the PR;

The workflow `.github/workflows/create-release.yaml` is responsible for:

- creating the tag and the GitHub Release after the merge into `production`;

The `*-production-cd.yaml` workflows are responsible for:

- triggering the production deploy.

## Mandatory rules

- The release PR must use `release/vX.Y.Z` as `head` and `production` as
  `base`, with the branch name matching exactly the version in the title.
- The release branch must be created from the exact SHA of `origin/main` and must not
  receive additional commits before the PR is opened.
- Do not commit pending local changes.
- Do not open more than one release PR for the same `head SHA`.
- Do not create or update the PR on GitHub before presenting the complete title and body
  and receiving explicit approval from the user.
- Use the exact SHA of `origin/main` to create the release branch and preserve it as
  the `head SHA` throughout the process.
- Do not treat changed paths as the source of truth for PRD association.
- Require an unambiguous classification in `## PRD` in the body of each included PR.
- Do not include more than ten affected PRDs in a single release.
- Do not invent PRDs, requirements, evidence, CI results or validations.
- Do not include secrets, credentials or internal URLs in the PR.
- The final approval of the release remains human.

## Workflow

### 1. Check the repository state

1. Run `git status --short` and stop if there are local changes.
2. Update the remote references of `main`, `production` and tags.
3. Confirm that `origin/main` and `origin/production` exist.
4. Record:
   - the current SHA of `origin/main` as `head SHA`;
   - the current SHA of `origin/production` as `base SHA`;
   - the Git tree corresponding to each SHA.
5. Confirm that `main` contains changes not yet present in `production`.
6. Check whether there is an open release PR with `release/vX.Y.Z` as `head` and
   `production` as `base`.

Stop when:

- there are no changes to publish;
- the branches are missing or diverge in an incompatible way;
- there are merge conflicts;
- a release PR already exists for the same `head SHA`.

### 2. Identify the included PRs

List the commits present in `origin/main` and absent from
`origin/production`. For each commit, identify the merged PR that
introduced it when that association exists on GitHub. Record separately the
direct commits with no associated PR; they are part of the release, but do not originate
PRD classifications or E2E runs.

Produce a deduplicated list containing:

- PR number and URL;
- title;
- merge commit or associated commits;
- related issues;
- value declared in the `## PRD` section.

Also produce a list of commits without a PR containing SHA, URL and message. Do not
omit them or block the release merely because of the absence of a retrospective association,
but do not derive PRDs from these commits.

Do not consider as part of the release a PR that did not introduce commits in the
compared range.

### 3. Identify the affected PRDs

The `## PRD` section of regular PRs is the only traceability source accepted by the
release workflow. It must contain one or more repository milestone URLs
or the value `Não aplicável`, without combining the two classifications.

For each included PR:

1. read the `## PRD` section;
2. validate that each URL belongs to an existing Stardust milestone;
3. deduplicate the milestones by number;
4. record which PRs originated each association;
5. record separately the PRs marked as `Não aplicável`.

Stop when a PR has no `## PRD`, does not contain an unambiguous classification
or combines milestone URLs with `Não aplicável`. Request the
human classification and update the original PR body before creating or
updating the release PR. Do not derive the classification from issues, changed
files, Specs or reports, as those sources are not accepted by the workflow.

Also stop when the release affects more than ten PRDs. Split the content
into smaller releases instead of omitting associations.

### 4. Build the release manifest

Build a logical manifest associated with the `head SHA`, containing at least:

```json
{
  "repository": "JohnPetros/stardust",
  "pull_request": 999,
  "version": "vX.Y.Z",
  "head_sha": "<sha of origin/main>",
  "base_sha": "<sha of origin/production>",
  "head_branch": "release/vX.Y.Z",
  "base_branch": "production",
  "pull_requests": [
    {
      "number": 123,
      "html_url": "https://github.com/JohnPetros/stardust/pull/123",
      "title": "PR title"
    },
    {
      "number": 124,
      "html_url": "https://github.com/JohnPetros/stardust/pull/124",
      "title": "Technical change"
    }
  ],
  "affected_prds": [
    {
      "number": 40,
      "url": "https://github.com/JohnPetros/stardust/milestone/40",
      "source_pull_requests": [123]
    }
  ],
  "pull_requests_without_prd": [124],
  "unassociated_commits": [
    {
      "sha": "<sha>",
      "html_url": "https://github.com/JohnPetros/stardust/commit/<sha>",
      "message": "Commit message"
    }
  ]
}
```

The manifest can be reproduced in the PR body and persisted as a workflow
artifact. Do not create or version a file in the repository just to store it.

### 5. Determine the version

Inspect the last GitHub Release, the corresponding tag and all later changes.
Choose the largest applicable increment:

- **major:** incompatible change that requires adaptation;
- **minor:** compatible functionality added;
- **patch:** fix, performance, refactoring, documentation, tests, build,
  CI or maintenance.

Use `v0.1.0` on the first release, unless explicitly instructed otherwise.

Stop if:

- the version or tag already exists for another commit;
- the given version is not greater than the last published version;
- the changes require a larger increment than the one requested.

### 6. Record existing validations

Read the actual results of the workflows run on the included PRs and on the
`head SHA`. Do not rerun the whole regular CI while creating the release
PR and do not declare a missing or pending check as passed.

Record separately:

- CI of the regular PRs;
- health check of the staging Web App;
- E2E validation of the release.

The last two items remain pending until the release PR workflows.

### 7. Present the draft for approval

Before any `gh pr create` or `gh pr edit` command:

1. present the proposed title;
2. present the complete PR body exactly as it will be published;
3. highlight the version, the `base SHA`, the `head SHA`, the included PRs, the affected
   PRDs and the checks that will remain pending;
4. request explicit approval to publish the draft on GitHub.

Stop and wait for the user's response. Do not interpret silence, a previous
approval of another draft or the initial request to create the
release as approval to publish this draft. If the user requests
adjustments, generate and present the complete revised draft again before asking for
a new approval.

### 8. Create or update the PR

Only after the explicit approval of the draft, create the release branch pointing
to the `head SHA` of `origin/main` and then open the PR from `release/vX.Y.Z` to
`production`:

```bash
release_branch="release/vX.Y.Z"
gh api \
  --method POST \
  "repos/JohnPetros/stardust/git/refs" \
  -f ref="refs/heads/$release_branch" \
  -f sha="$head_sha"

gh pr create \
  --base production \
  --head "$release_branch" \
  --title "Release vX.Y.Z" \
  --body-file <temporary-file>
```

Confirm that the branch points to the same `head SHA` and has no additional
commits. If it already exists, stop when it points to another SHA or
contains commits outside the `origin/main` snapshot.

The title must follow exactly:

```text
Release vX.Y.Z
```

The version declared in the title will be used by the post-merge workflow to create the
tag and the GitHub Release.

If a compatible release PR already exists and needs to be updated, present
and approve the new draft through the same process before running `gh pr edit`.

## PR body

The body will also be used as the basis for the GitHub Release notes. Do not use a
`#`-level heading, speculative statements or empty sections.

The PR body is written in PT-BR, as every Pull Request in this project is, so the template below stays in Portuguese. Only the technical identifiers (versions, SHAs, paths, commands) are not translated. An English gloss of the template sections follows the block.

```markdown
## Objetivo

Explique o resultado entregue pela versão.

## Versão

- Versão: `vX.Y.Z`
- Base SHA: `<production SHA>`
- Head SHA validado: `<main SHA>`

## Principais mudanças

### Web

- Mudanças relevantes de frontend.

### Server

- Mudanças relevantes de API, persistência e jobs.

### Backoffice

- Mudanças relevantes da aplicação administrativa.

### Core e packages

- Mudanças relevantes em domínio e packages compartilhados.

### Infraestrutura

- Mudanças relevantes de Docker, Coolify, CI/CD ou tooling.

## Correções

- Correções incluídas ou `Nenhuma correção específica nesta versão.`

## PRs incluídos

- #123 — título do PR.
- #124 — título do PR.

## PRDs afetados

| PRD                                                                 | PRs de origem | Status E2E |
| ------------------------------------------------------------------- | ------------- | ---------- |
| [Milestone 40](https://github.com/JohnPetros/stardust/milestone/40) | #123          | Pendente   |

## PRs sem PRD

- #124 — alteração técnica sem PRD associado.

## Migrações e deploy

- Migrações, variáveis de ambiente, ordem de execução e cuidados de deploy.

## Breaking changes

- Incompatibilidades e adaptações necessárias ou `Nenhum breaking change identificado.`

## Issues relacionadas

resolve #456
```

English gloss of the template (the PR itself stays in PT-BR):

- `## Objetivo` (Objective): explain the result delivered by the version.
- `## Versão` (Version): version, base SHA and validated head SHA.
- `## Principais mudanças` (Main changes): subsections per area, namely Web (frontend), Server (API, persistence and jobs), Backoffice (administrative application), Core e packages (domain and shared packages) and Infraestrutura (Docker, Coolify, CI/CD or tooling).
- `## Correções` (Fixes): included fixes or "No specific fix in this version."
- `## PRs incluídos` (Included PRs): list of `#number — PR title`.
- `## PRDs afetados` (Affected PRDs): table with PRD, source PRs and E2E status (`Pendente` means pending).
- `## PRs sem PRD` (PRs without PRD): technical changes with no associated PRD.
- `## Migrações e deploy` (Migrations and deploy): migrations, environment variables, execution order and deploy cautions.
- `## Breaking changes`: required incompatibilities and adaptations, or "No breaking change identified."
- `## Issues relacionadas` (Related issues): `resolve #456`.

Omit `## Issues relacionadas` when no issue is known. Omit
`## PRDs afetados` only when all PRs are explicitly
marked as `Não aplicável`. Omit `## PRs sem PRD` when all PRs
have a PRD.

## Release E2E validation

After the PR is opened or updated, the release workflow must:

1. validate that the PR uses `release/vX.Y.Z` as `head` and `production` as
   `base`;
2. wait for the Web App health check on the existing staging; the workflow does not
   start a deploy nor confirm that the environment runs the `head SHA`;
3. create a Hermes `e2e-tester` profile run for each affected PRD,
   with at most two simultaneous runs;
4. provide each run with the full content of `AGENTS.md` obtained from the trusted
   `base SHA` of `production`, the release PR number, the `head SHA` and
   the assigned milestone;
5. use exclusively the `playwright` MCP server, connected to the isolated Chromium
   via CDP, to exercise the staging Web App in a real browser;
6. reuse the Playwright MCP's secure authentication bootstrap, without exposing
   credentials to the model or sending them in prompts and tool arguments;
7. use the read-only context of the milestone and its issues loaded by the
   workflow to identify its `RP-*` requirements and `JN-*` journeys;
8. validate the requirements of that PRD that apply to the Web App and can
   be exercised by the available staging environment;
9. collect screenshots, final visible state, console, page failures,
   network requests and other evidence made available by Playwright;
10. store screenshots and other files in the Hermes persistent volume,
    organized by PR, SHA, milestone and requirement;
11. return in the JSON the local paths of the evidence without claiming they were
    transferred to GitHub;
12. store the manifest and the JSON results in GitHub Actions Artifacts;
13. publish or update a single consolidated matrix on the release PR.

The Playwright MCP of the `e2e-tester` profile is the executor of the agentic
release acceptance E2E. It must use only the staging Web App, keep the
authenticated session prepared by the profile bootstrap and produce evidence
associated with the PRD, requirement and `head SHA` of the run.

The Hermes Runs API does not expose the files generated in the container. Until there is
an authenticated transfer endpoint, the workflow must publish
only the structured results and the local references. Never present
a local file as an artifact or a link accessible from GitHub.

The Playwright tests versioned in the repository remain part of the regular
CI. They are deterministic, repeatable and oriented to technical regression.
The Hermes run with Playwright MCP is oriented to the requirements of the affected
PRDs and neither replaces nor should unnecessarily duplicate the versioned
suite.

In this first version, the agent must not access the production Backoffice nor
run E2E validation directly on the Server. Requirements exclusive to the Backoffice,
Server or another environment must be classified as `not applicable to the
Web staging scope`, with a justification. This classification cannot be presented
as a validated requirement.

Each requirement must receive exactly one of the values of the JSON contract
(these values stay in Portuguese because the workflow matches them literally):

- `passou` (passed);
- `falhou` (failed);
- `bloqueado` (blocked);
- `não_aplicável` (not applicable).

Results of `falhou` or `bloqueado` must fail the release check. The merge
decision remains human even when all requirements pass.

When all included PRs are explicitly marked as `Não
aplicável`, the workflow must finish successfully, record that there is no applicable
product E2E and not start browser sessions.

## Updates and reruns

When receiving a new commit on the release branch:

1. preserve the active run that shares the staging environment;
2. keep the new run in the shared queue, allowing GitHub to
   replace a still-pending run with the most recent revision;
3. recompute the affected PRs and PRDs;
4. generate a new manifest for the new `head SHA`;
5. wait for the availability of the existing staging;
6. rerun the applicable E2E;
7. update the existing conclusion instead of publishing duplicate comments.

The staging deploy and release E2E workflows must share the concurrency group
`stardust-web-staging` with `cancel-in-progress: false`. This way, the
environment does not change during an active validation.

Never reuse evidence produced for another SHA.

## Post-merge: tag, GitHub Release and production

After the release PR is merged into `production`, the post-merge workflow must:

1. confirm that the merged PR had `release/vX.Y.Z` as `head` and
   `production` as `base`;
2. extract and validate `vX.Y.Z` from the title `Release vX.Y.Z`;
3. record the `head SHA` targeted by the E2E validation and the merge commit SHA;
4. confirm that the merge commit has the same Git tree as the validated
   `head SHA`;
5. check whether the tag or the GitHub Release already exist;
6. create an annotated tag `vX.Y.Z` pointing to the merge commit on
   `production`;
7. create the GitHub Release with title `Release vX.Y.Z` and notes derived from the
   PR body;
8. publish the GitHub Release, whose event separately triggers the
   `*-production-cd.yaml` workflows responsible for the production deploy;
9. publish on the PR the links to the tag, the GitHub Release and the deploy.

The process must be idempotent. If the tag or the release already exist, confirm
that they point to the correct commit and do not create duplicates. Stop if
they point to another commit.

## Return

After creating the PR, return:

- URL and number of the release PR;
- chosen version;
- base SHA and head SHA;
- included PRs;
- affected PRDs;
- PRs without PRD;
- checks still pending.

Do not declare the release published before the merge, the creation of the tag, the GitHub
Release and the confirmation of the production deploy.
