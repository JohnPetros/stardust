---
title: Drizzle and SSE first cutover runbook
status: approved-procedure-not-executed
spec: ./spec.md
spec_revision: 8
---

# First production cutover

This procedure coordinates the first Server and Web release that uses Drizzle persistence. It is an operational checklist, not evidence that Dev or production has matching schema, a usable backup, or a deployed release. The procedure has not been run against either remote project; EV-05 remains pending until an authorized operator records a complete execution in `evaluation.md`.

## Release record

Before the window, record the operator, approval/change reference, UTC start time, current and target Server/Web SHAs, artifact identifiers, previous deploy identifiers, database backup identifier, restore rehearsal evidence, and the selected rollback owner. Never record database URLs, passwords, publishable keys, tokens, OTPs, or user data.

## Preconditions

- Confirm the Dev and production preflights against the versioned legacy manifest. Stop if either catalog, migration history, access grants, extensions, or role memberships differ.
- Restore the selected production backup into an isolated database and rehearse adoption, migration, rollback, and legacy-version access there. Preserve the rehearsal report and checksums.
- Confirm the exact Server and Web artifacts and prior artifacts. Both releases must correspond to the reviewed candidate and be retrievable for rollback.
- Confirm the existing ingress, Coolify, Inngest, and cron controls needed to block new traffic and pause/drain application writers. This repository does not define a maintenance endpoint. If an existing control cannot be operated or verified, do not start the window.
- Confirm the protected `production` GitHub Environment requires an authorized reviewer for every referencing job and prevents self-approval. It must contain `DATABASE_URL`, `COOLIFY_API_TOKEN`, both deployment webhooks, non-secret `SERVER_PROD_HEALTH_URL` / `WEB_PROD_HEALTH_URL` variables, and `PRODUCTION_RELEASES_PAUSED` set to the string `false` outside a maintenance window. The health URLs must return 2xx only when each application is ready. Do not put a connection URL or credential in workflow inputs.

## Cutover sequence

1. Set the protected Environment variable `PRODUCTION_RELEASES_PAUSED=true`, cancel queued independent Server/Web release runs, and wait for any active shared-group release to finish. Then open the approved maintenance window and record its start. Put the existing ingress in maintenance, stop new application job intake, pause application cron/writers, and drain active writers. Keep Supabase Auth and infrastructure services available. Record the observable state for each control.
2. Dispatch **Server app CD** with `initial_cutover=true` from the reviewed release SHA. Its shared `stardust-production-release` concurrency group prevents an independent Web release from overlapping. The job preflights the legacy phase, adopts the captured baseline without replaying legacy DDL, applies the server-owned access migration, and verifies server-owned parity.
3. The coordinator requests the Server and Web deployments and retains the shared lock while it polls both Coolify deployment records. It requires successful terminal status, an exact commit match to the reviewed SHA, and 2xx from both configured health URLs. Any missing UUID/status/SHA, failed deployment, timeout, or failed health check fails the job; keep maintenance active and follow rollback. A webhook acknowledgement alone never releases the gate.
4. After automated checks pass, the workflow pauses at its second protected `production` job, `operator-signoff`, while retaining the shared lock. While that job waits, verify the approved authenticated smoke path, PostgreSQL persistence, and that direct Data API access to application tables and functions is denied while Auth and storage infrastructure remain available. Reopen ingress and resume job/cron writers only after those checks succeed, then set `PRODUCTION_RELEASES_PAUSED=false`. A different authorized reviewer then approves `operator-signoff`; that approval records completion and releases the lock. If any manual check or reopening step fails, keep the pause set to `true`, reject or cancel the current run to release its lock, cancel any queued independent releases, and then follow rollback. Record only route/operation, status, SHA, and outcome.

Do not run a second migration manually alongside the workflow. Normal Server pushes preflight `server-owned` before the migration runner and fail closed while the database remains `legacy` or `adopted`; only the explicit initial-cutover dispatch can adopt `legacy` and advance `adopted`. Normal Server pushes and independent Web releases also fail closed unless `PRODUCTION_RELEASES_PAUSED=false`. Server pushes and independent Web releases share the same group and keep it until their requested deployment reaches a successful status, exact expected SHA, and 2xx health response. The explicit cutover and rollback dispatches require `PRODUCTION_RELEASES_PAUSED=true` and retain the group through the second protected approval, including manual verification and traffic reopening.

## Failure and rollback

If an automated or manual verification fails, keep maintenance active and do not resume writers. Leave `PRODUCTION_RELEASES_PAUSED=true`; independent Server pushes and Web releases fail closed while paused. Cancel any queued independent release runs. If `operator-signoff` is awaiting approval, reject it or cancel that workflow run to release the shared lock; leaving it pending is only for investigation and blocks rollback in the same concurrency group. After the current run has ended, dispatch **Server app CD** with `rollback_access=true` in the protected production Environment. It runs the transactional inverse for migration `0002_server_owned_access.sql` under the shared database advisory lock and verifies adopted-phase catalog parity, then pauses at `operator-signoff` with the shared lock held. Restore the previous Server and Web artifacts with the existing Coolify controls, verify the legacy application access model and approved smoke path, and reopen traffic only after the rollback checks pass. Set `PRODUCTION_RELEASES_PAUSED=false` after reopening; a different authorized reviewer then approves the pending gate to release the lock. Do not drop application schemas, truncate application data, repair the ledger manually, or mark migrations applied by hand.

If the inverse or old artifacts fail, keep the application in maintenance and follow the incident/change-control process. Do not improvise a remote reset or direct SQL repair.

## Evidence to record

Record the operator/change reference, UTC timestamps, artifact and deployed SHAs, backup/restore rehearsal identifier, preflight/adopt/migrate/rollback command names and exit codes, Coolify deployment status and commit, health/smoke route statuses, Data API denial result, Auth/storage availability, pause/drain/reopen results, and any deviations. Keep evidence free of URLs containing credentials, tokens, SQL result rows, and personal data. Distinguish an isolated rehearsal from a production cutover; EV-05 is complete only when the authorized production procedure succeeds and its evidence is reviewed.
