## Overview

Stardust is hosted on a Hostinger VPS (KVM 2 — 2 vCPU, 8 GB RAM, 100 GB NVMe) with **Coolify v4** as the deployment platform. Coolify manages the build, deploy and SSL certificates of all applications via Docker.

**Key decisions:**

- Environment variables centralized in Coolify (no Infisical)
- Deploy via multi-stage Dockerfiles with `turbo prune`
- CI on GitHub Actions, CD via Coolify webhook
- DNS managed on Cloudflare
- Studio migrated from Vercel to Coolify

---

## Services

| Service                | App           | Type                        | Port  | Domain                                           |
| ---------------------- | ------------- | --------------------------- | ----- | ------------------------------------------------ |
| `stardust-web`         | `apps/web`    | Next.js SSR (standalone)    | 3000  | `stardust-app.com.br`, `www.stardust-app.com.br` |
| `stardust-web-staging` | `apps/web`    | Next.js SSR (standalone)    | 3000  | `staging.stardust-app.com.br`                    |
| `stardust-server`      | `apps/server` | Hono API (Node.js)          | 3333  | `api.stardust-app.com.br`                        |
| `stardust-studio`      | `apps/backoffice` | React Router v7 SPA (Nginx) | 80    | `studio.stardust-app.com.br`                     |
| Crew                  | `apps/crew`   | Mastra / review API    | 4111  | `crew.stardust-app.com.br`                      |

---

## VPS

- **Provider:** Hostinger
- **Plan:** KVM 2
- **Resources:** 2 vCPU / 8 GB RAM / 100 GB NVMe SSD
- **OS:** Ubuntu 24.04 LTS
- **IP:** `2.25.181.108`
- **Swap:** 4 GB configured to absorb build peaks
- **Location:** USA (Brazil slots were unavailable at the time of purchase)

---

## Coolify

- **URL:** `https://coolify.stardust-app.com.br`
- **Version:** v4.x
- **Timezone:** `America/Sao_Paulo`
- **Proxy:** Traefik (managed by Coolify)
- **SSL:** Let's Encrypt (automatic)

### Service configuration

Each service uses **Build Pack: Dockerfile** with the following Dockerfiles at the repository root:

| Service           | Dockerfile          | Base Directory |
| ----------------- | ------------------- | -------------- |
| web / web-staging | `Dockerfile.web`    | `/`            |
| server            | `Dockerfile.server` | `/`            |
| backoffice            | `Dockerfile.backoffice` | `/`            |
| crew              | `Dockerfile.crew`   | `/`            |

### Environment variables

Variables are configured directly in Coolify, separated by scope:

**Web (Build + Runtime):** `NEXT_PUBLIC_WEB_APP_URL`, `NEXT_PUBLIC_SERVER_APP_URL`, `NEXT_PUBLIC_CDN_URL`, `NEXT_PUBLIC_DISCORD_CHANNEL_URL`, `GOOGLE_ANALYTICS_ID`

**Web (Runtime only):** `INNGEST_SIGNING_KEY`, `INNGEST_EVENT_KEY`

**Server (Runtime only):** `MODE`, `PORT`, `BASE_URL`, `STARDUST_WEB_URL`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL`, `REDIS_URL`, `TRUSTED_PROXY_CIDRS`, `S3_ACCOUNT_ID`, `S3_BUCKET_NAME`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `DROPBOX_REFRESH_TOKEN`, `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET`, `DISCORD_WEBHOOK_URL`, `SENTRY_DSN`

The Server keeps a dedicated Redis Provider for the rate limiter. `REDIS_URL` may
use `rediss://` to preserve TLS; the connection uses a 250 ms timeout and the
middleware operates fail-open with a local 30-second breaker. The client
address is resolved by the trusted proxy: Traefik must produce
`X-Forwarded-For` and the connection address must belong to one of the CIDRs in
`TRUSTED_PROXY_CIDRS`. Only in that case does the Server use the rightmost address;
otherwise, it ignores the header and falls back to the actual connection address.
In production, `TRUSTED_PROXY_CIDRS` is mandatory to prevent IP spoofing
by clients that reach the Server directly. No Redis key or identity
is sent to telemetry.

**Backoffice:** `VITE_*` variables, including `VITE_CDN_URL`, as Build Variables (if applicable).

**Crew (Runtime only):** `CREW_ENV=prod`, `CREW_HOST=0.0.0.0`, `CREW_PORT=4111`,
`CREW_DATABASE_URL`, `ANTHROPIC_API_KEY`, `COMPOSIO_API_KEY`, `COMPOSIO_USER_ID`,
`COMPOSIO_GITHUB_CONNECTED_ACCOUNT_ID` and `PR_REVIEWER_API_KEY`. Use a dedicated
persistent PostgreSQL with pgvector support; do not use the product apps' database.
The Coolify proxy and health check must point to the internal port `4111`,
with `GET /health`. Credentials are not passed to the build or to the CD job.

> The `NEXT_PUBLIC_*` and `VITE_*` variables must be marked as **Available at Buildtime** in Coolify, since they are embedded in the bundle during the build.

### Auto-deploy

| Service     | Auto-deploy            | Actual trigger                                                                                         |
| ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------ |
| web prod    | Disabled               | GitHub Actions workflow on `release: published` triggers the Coolify webhook                           |
| web staging | Enabled                | Push to `main` (paths: `apps/web/**`, `packages/core/**`, `packages/validation/**`, `packages/lsp/**`) |
| server      | Depends on preference  | Push to `main` (paths: `apps/server/**`, `packages/core/**`, `packages/validation/**`) via workflow    |
| backoffice      | Enabled                | Push to `main` (paths: `apps/backoffice/**`)                                                               |
| crew        | Disabled in Coolify | Relevant push to `main` or manual run of the `Crew app CD` workflow, which triggers the webhook and verifies revision and health |

---

## DNS (Cloudflare)

**Nameservers:** `gabe.ns.cloudflare.com`, `sneh.ns.cloudflare.com`

| Type | Name                | Content                                 | Proxy    |
| ---- | ------------------- | --------------------------------------- | -------- |
| A    | `@`                 | `2.25.181.108`                          | DNS only |
| A    | `www`               | `2.25.181.108`                          | DNS only |
| A    | `api`               | `2.25.181.108`                          | DNS only |
| A    | `staging`           | `2.25.181.108`                          | DNS only |
| A    | `studio`            | `2.25.181.108`                          | DNS only |
| A    | `coolify`           | `2.25.181.108`                          | DNS only |
| MX   | `send`              | `feedback-smtp.us-east-1.amazonses.com` | DNS only |
| TXT  | `_dmarc`            | `v=DMARC1; p=none;`                     | DNS only |
| TXT  | `resend._domainkey` | (Resend DKIM key)                  | DNS only |
| TXT  | `send`              | `v=spf1 include:amazonses.com ~all`     | DNS only |
| TXT  | `@`                 | Google Site Verification (×2)           | DNS only |

> The Cloudflare proxy (orange cloud) is **turned off** so that Let's Encrypt can validate the domains via HTTP challenge. It can be enabled later with SSL mode **Full (Strict)** on Cloudflare.

---

## CI/CD

### Workflows

| Workflow                          | Trigger                      | What it does                                                                                 |
| --------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------- |
| `server-app-ci.yaml`              | PR → `main` (server paths)   | Codecheck, typecheck, tests, build                                                           |
| `server-app-cd-coolify.yml`       | Push → `main` (server paths) | Migrates database (Supabase CLI) → triggers Coolify webhook                                  |
| `web-app-ci.yaml`                 | PR → `main` (web paths)      | Codecheck, typecheck, tests, build                                                           |
| `web-app-cd-coolify.yaml`         | Release published            | Triggers Coolify webhook → notifies Discord                                                  |
| `web-app-staging-cd-coolify.yaml` | Push → `main` (web paths)    | Triggers Coolify webhook → notifies Discord                                                  |
| `crew-pr-review.yaml`             | PR → `main` (`pull_request_target`) | Waits for the applicable CIs, calls the deployed Crew and publishes a summary and inline findings; runs only trusted base code |
| `crew-app-production-cd.yaml`     | Relevant push to `main` or manual run on `main` | Requests a deploy on Coolify, waits for the expected SHA to be deployed and requires `/health` with HTTP 200 and `status: ok` |
| `hermes-e2e-testing.yaml`         | PR from `release/vX.Y.Z` → `production` | Verifies staging and validates the affected PRDs/milestones with Playwright MCP    |
| `create-release.yaml`             | Release PR merge             | Confirms the Hermes E2E, creates the tag and publishes the GitHub Release                    |

### GitHub Actions E2E workflows

`hermes-e2e-testing.yaml` runs for release PRs from a `release/vX.Y.Z` branch
to `production`. The flow:

1. identifies the PRDs and milestones affected by the PR;
2. checks the availability of the existing staging Web App;
3. starts a run of the Hermes E2E profile for each milestone, in parallel;
4. uses Playwright MCP to validate the application's observable behavior;
5. publishes a consolidated conclusion on the PR.

The `create-release.yaml` workflow checks the corresponding E2E run before
creating the tag and publishing the GitHub Release. Publishing the release
triggers the production Web App deploy via the CD workflow.

The textual validation results are published on the PR. Binary evidence
generated by Hermes remains in the agent's local environment when the Runs API
does not offer transfer to GitHub Actions.

### Release flow

A release is promoted by a Pull Request from the `release/vX.Y.Z` branch to
`production`. This branch must be created pointing exactly to the `main` SHA
that will be published. The PR must be opened in the repository itself, must not
be a draft and must use the exact title `Release vX.Y.Z`, following the semantic
versioning format.

#### 1. E2E preparation

`hermes-e2e-testing.yaml` is triggered when the PR is opened, updated,
reopened, marked as ready for review or edited. The `prepare` job:

- confirms the `release/vX.Y.Z` → `production` direction and validates that the
  branch matches the release title;
- compares the SHAs of `production` and the release branch, associates each commit with a
  PR merged into `main` and records commits without a PR;
- derives the milestones from the `## PRD` section of each included PR and requires
  an unambiguous classification per milestone or `Não aplicável` (not applicable);
- compares the derived classification with `## PRDs afetados` (affected PRDs) and `## PRs sem PRD` (PRs without PRD)
  of the release PR, preventing a body edit from omitting coverage;
- queries the milestones on GitHub, limits the matrix to 10 PRDs and generates the
  manifest with source PRs, SHAs and classifications;
- publishes the manifest as an artifact for 14 days.

If all included PRs are explicitly classified as
`Não aplicável`, the staging availability is still validated, but no browser
session is started.

#### 2. Validation on the existing staging

The `verify-staging` job does not trigger Coolify and does not require the deploy secrets. It
waits for the health check of `https://web-staging.stardust-app.com.br/` and uses the
version already available in that environment. The release workflow records the head SHA
as the validation target, but does not claim that this SHA was deployed by the
workflow itself.

The release E2E and the normal staging CD share the
`stardust-web-staging` concurrency group. The workflows are serialized without cancellation
to prevent a concurrent deploy from changing the environment during validation.

After the health check, the `e2e` job creates one run per milestone in a matrix
with at most two simultaneous runs. Each run of Hermes's `e2e-tester` profile:

1. receives the milestone, its issues and the expected SHA, while the trusted instructions are
   loaded from `AGENTS.md` at the base SHA of `production`, not from the release head;
2. queries only the `REQ-*` requirements explicitly associated with the
   milestone in the context provided by the workflow;
3. uses only Playwright MCP on the staging Web App with the authenticated session provided
   by the bootstrap;
4. validates the complete observable flow and collects screenshots, console errors,
   page errors and network failures;
5. returns a JSON in pt-BR with the result of each requirement;
6. receives a cancellation request through the Runs API if the job ends before
   the run reaches a terminal state.

The workflow accepts only the states `passou` (passed) and `não_aplicável` (not applicable). The states
`falhou` (failed) or `bloqueado` (blocked), an invalid response, a timeout or a Hermes failure make the
job unsuccessful. The validation requires unique IDs, evidence for exercised requirements
and consistency between the individual results and the overall status.
Each valid result is published as an artifact for 14 days.

#### 3. E2E conclusion

The `conclusion` job consolidates the matrix results into a PR comment,
including the target SHA, the environment, the health check state, the number of
requirements and the summary per milestone. The comment is updated on repeated runs using
a stable marker, avoiding duplication. The set of milestones received is
compared with the manifest, and the summaries produced by the agent are limited and
sanitized before publication.

#### 4. Merge and release creation

After approval and merge of the PR into `production`, `create-release.yaml` is
triggered. The job only continues when the PR was actually merged, came from a
release branch whose name matches the version, belongs to the same repository
and has `production` as its target. It then:

1. checks out the merge commit with full history;
2. validates the `Release vX.Y.Z` title again;
3. compares the Git trees of the SHA targeted by the E2E validation and of the commit incorporated
   into `production`, blocking the release if they differ;
4. looks for the most recent `Hermes release E2E testing` run for the exact SHA and
   PR and requires status `completed` with conclusion `success`;
5. creates or validates an annotated tag `vX.Y.Z` pointing to the merge commit;
6. creates or validates the corresponding GitHub Release, using the PR body as
   release notes;
7. publishes on the PR the links to the tag, the GitHub Release and the deploys.

A published GitHub Release triggers `web-app-production-cd.yaml`, which calls the
Coolify production webhook. The Web App deploy can be followed through the
GitHub Actions workflows and the Coolify panel.

### Required GitHub Secrets

| Secret                          | Usage                                                              |
| ------------------------------- | ------------------------------------------------------------------ |
| `COOLIFY_API_TOKEN`             | Authentication on the Coolify API                                  |
| `COOLIFY_WEBHOOK_SERVER_PROD`   | Webhook of the stardust-server service                             |
| `COOLIFY_WEBHOOK_WEB_PROD`      | Webhook of the stardust-web service                                |
| `COOLIFY_WEBHOOK_WEB_STG`       | Webhook of the normal `stardust-web-staging` CD (not used by the release E2E) |
| `COOLIFY_WEBHOOK_CREW_PROD`     | Coolify HTTPS webhook for a single Crew application (`/api/v1/deploy?uuid=...`) |
| `SERVER_TEST_ENV`               | Contents of the server's `.env.testing` (for CI)                   |
| `WEB_DEV_ENV`                   | Contents of the web dev `.env` (for CI)                            |
| `WEB_TEST_ENV`                  | Contents of the web `.env.test` (for CI)                           |
| `SUPABASE_ACCESS_TOKEN`         | Supabase CLI access token (for migrations)                         |
| `SUPABASE_DB_PASSWORD`          | Supabase database password (for migrations)                        |
| `DISCORD_WEBHOOK_URL`           | Deploy notifications on Discord                                    |
| `HERMES_API_URL`                | Hermes Runs API endpoint                                           |
| `HERMES_E2E_TESTER_API_KEY`     | Authentication of Hermes's `e2e-tester` profile                    |
| `CREW_API_URL`                | Base HTTPS URL of the deployed Crew service, without the reviewer path |
| `PR_REVIEWER_API_KEY`          | Authentication of `pr-reviewer` on the Crew service               |
| `HERMES_GITHUB_APP_ID`          | ID of the GitHub App used to publish the E2E conclusion            |
| `HERMES_GITHUB_APP_PRIVATE_KEY` | Private key of the GitHub App used to publish the E2E conclusion   |

---

## Dockerfiles

### Dockerfile.server

Multi-stage: `builder` (turbo prune) → `installer` (pnpm install + build) → `runner` (Node.js 22 Alpine). Environment variables injected by Coolify at runtime via `process.env`. Does not use an `.env` file.

### Dockerfile.web

Multi-stage: `builder` (turbo prune) → `installer` (pnpm install + Next.js build with `output: 'standalone'`) → `runner` (Node.js 22 Alpine). `NEXT_PUBLIC_*` variables must be available at build time.

### Dockerfile.backoffice

Multi-stage: `builder` (turbo prune) → `installer` (pnpm install + Vite build) → `runner` (Nginx Alpine serving static files). Nginx config with `try_files` for SPA fallback.

### Dockerfile.crew

Multi-stage on Node 24 Alpine: installs the dependencies from the workspace
manifests, builds only Crew and copies the Mastra output and the generated
migrations to the non-root runtime. The image uses `CREW_ENV=prod`,
`CREW_HOST=0.0.0.0`, port `4111` and a local health check at `/health`.
Crew migrations are applied at startup, per the exception documented
in `crew-app-rules.md`; the CD does not run Server migrations or resets.
The deploy workflow is serialized, respects the `production` environment and fails
if the deployed commit diverges from the requested SHA or if the database is not
healthy. Configuration and recovery: `apps/crew/README.md`.

---

## Migrations

Database migrations run **before** the deploy, in the `migrate-database` job of the `server-app-cd-coolify.yml` workflow:

```
supabase link --project-ref <project-id>
supabase db push
```

The server container does **not** contain the Supabase CLI or `postgresql-client`. Migrations are the exclusive responsibility of CI/CD.

---

## External services

| Service             | Usage                                 | Managed by       |
| ------------------- | ------------------------------------- | ---------------- |
| Supabase            | Database, authentication, storage     | Supabase Cloud   |
| Inngest             | Queues and asynchronous jobs          | Inngest Cloud    |
| Resend / Amazon SES | Sending transactional emails          | SaaS             |
| Dropbox             | Backup storage                        | Dropbox API      |
| Sentry              | Error monitoring                      | Sentry Cloud     |
| Discord             | Deploy notifications                  | Discord Webhooks |
| Cloudflare          | DNS and (future) CDN/DDoS protection  | Cloudflare       |

---

## Operational notes

- **Parallel builds:** avoid on the KVM 2 VPS (2 vCPU). Configure concurrency in the workflows and in Coolify to serialize them.
- **Swap:** 4 GB of swap configured (`/swapfile`) to absorb memory peaks during Docker builds.
- **VPS renewal:** the KVM 2 promotional price (R$ 43.99/month) renews at R$ 77.99/month. Consider upgrading to KVM 4 if builds become slow.
- **Cloudflare proxy:** can be enabled (orange cloud) after confirming that all Let's Encrypt certificates have been generated. Requires setting SSL mode to **Full (Strict)** on Cloudflare.
- **Inngest:** after the full migration, update the callback URLs in the Inngest Cloud panel to the new domains.

## Approved transition: Drizzle and SSE (Issue #602)

The Supabase CLI pipeline above is the legacy one. The goal of Issue #602 is to apply Drizzle migrations through the Server workflow; the runtime container does not run migrations. On the first deployment, Server and Web are coordinated in a single maintenance window with writers paused, a rehearsed backup/restore, preflight, adoption, revocation of direct access, deploy of both apps, smoke test and reopening. An accepted Coolify webhook does not prove that the revision is serving traffic: the runbook must verify the deployed revision and the apps' health before reopening. No application maintenance mechanism was verified at the time of writing; the runbook operates pause/reopen through the environment's existing controls and records its execution, without inventing maintenance endpoints.

## Admin panel rename

The panel code now lives in `apps/backoffice`, with workspace
`@stardust/backoffice` and `Dockerfile.backoffice`. The local animation player
uses `packages/studio` and `@stardust/studio`.

In Coolify, the existing panel resource must point to
`Dockerfile.backoffice`. The workflow keeps the `COOLIFY_WEBHOOK_STUDIO` secret
so it continues using the already configured webhook. The public domain
`studio.stardust-app.com.br` and the names of the deployed resources remain
as they are until an explicit infrastructure migration.
