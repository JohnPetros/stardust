# Tooling

Run commands from the root to take advantage of Turbo and the cache. During
implementation, use `--filter` or `-w` to limit the feedback to the changed
workspace; before the PR, validate the integrated scope.

The project's helper scripts are ES modules and must be run with
Node.js:

```bash
node ./scripts/setup-project.mjs
node ./scripts/create-worktree.mjs feature/exemplo
node ./scripts/sync-agents.mjs
```

The `setup-project.mjs` script configures the project's skills, commands and MCP
configuration. The environment export scripts print assignments for
the current shell; load them with `eval`:

```bash
eval "$(node ./scripts/export-backoffice-app-e2e-env.mjs)"
eval "$(node ./scripts/export-web-app-e2e-env.mjs)"
```

## Quality scripts

| Script                       | Tool               | Behavior                                           |
| --- | --- | --- |
| `pnpm run format`             | Biome              | formats and writes files                           |
| `pnpm run check:code`         | Biome              | read-only lint/check                               |
| `pnpm run check:types`        | TypeScript         | typecheck without emit                             |
| `pnpm run check:architecture` | dependency-cruiser | validates dependencies between layers/apps         |
| `pnpm run check:complexity`   | CodeMultiVitals    | fails when complexity or quality gets worse relative to the baseline |
| `pnpm run test:unit`          | Jest/Vitest        | runs unit tests per workspace                      |
| `pnpm run test:integration`   | Jest/Playwright    | runs the integrations declared by the workspaces   |
| `pnpm run check:spec-implementation` | Node.js       | validates the Spec's `Path | Change | ...` map against Git and the filesystem |

Short-cycle examples:

```bash
pnpm run format --filter=@stardust/core
pnpm run check:code --filter=@stardust/core
pnpm run check:types --filter=@stardust/core
pnpm --filter @stardust/core run test:unit <test-files>
```

## Scoped local execution

Full suites are not the local default. Run only the checks that the scope of the
change requires: the Spec's behavior, the changed production boundaries and the
directly affected consumers. Determine the impact by the diff and the real
dependencies, not by similarly named files nor by the fact that an app was touched. A
presentation change on the Web does not require Server tests; a Server change with no
observable effect in the browser does not require browser tests. Shared contracts
add the tests of the consumers that are actually affected, not all modules.

| Check | During implementation | Integrated verification | After a fix |
| --- | --- | --- | --- |
| Unit/component | Run the affected test files as the behavior becomes coherent. | Confirm the results of the behavior in scope and of the affected consumers. | Rerun the files that failed or were invalidated. |
| Server integration | Write the boundary assertions; use unit and static feedback during construction. | Group the affected controller, route or migration files after integration, with disposable fixtures. | Rerun the affected selection in sequence. |
| Web integration (Playwright) | Write the affected route or journey scenarios; use component and static feedback during construction. | Run only the affected scenario files. | Rerun the affected scenarios. |
| Types | Check after changing public types, schemas, signatures or consumers. | Run the typecheck of the affected workspaces and of the consumers, with the real configuration. | Rerun the impacted producer and consumer projects. |
| Lint | `check:code` on the changed workspace, without writing. | Confirm the scope's lint. | Recheck the edited paths. |
| Complexity | `check:complexity -w <workspace>` when the changed logic could worsen the baseline and whenever creating or extracting a new code file, including Views (error limit of 70 lines per function). | Run `check:complexity` on the affected workspace before publishing: it compares with the baseline and fails new functions at warning level. Review the per-function entries and, if accepted, regenerate with `update:complexity-baseline`. Record the result and the limits. | Recheck the changed logic; never relax rules or update the baseline just to pass. |
| Architecture and build | `check:architecture` when dependencies, exports or composition change. | Run the required gates; the build happens in the integrated verification, not on every edit. | Rerun the gates whose inputs or assertions changed. |

Integration is a checkpoint, not a per-edit ritual. Group related Server
selections to reuse the fixtures setup and serialize the commands that use
containers, so independent processes do not compete for ports and services. Independent
read-only checks can run in parallel when they do not compete for resources; generation,
dependent builds and the validation of their outputs remain sequential.

Use these command forms with file paths verified in the code. The paths are
relative to the workspace. Name filters require names verified in the code; avoid broad
globs or keyword searches that include unrelated tests.

| Boundary | Directory | Command form |
| --- | --- | --- |
| Core, Server, Backoffice or Web unit | Root | `pnpm run test:unit -w @stardust/<workspace> -- <test-files>` |
| Server integration | Root | `pnpm --filter @stardust/server run test:integration <test-files>`, after `pnpm --filter @stardust/server run db:test` |
| Web integration | Root | `pnpm --filter @stardust/web run test:integration <test-files>` |

The full scripts (`test:unit`, `test:integration`, `test:coverage` and `check:coverage`)
are available commands, not a mandatory local checklist. Widen the selection only when the
demonstrated impact covers the suite, for example shared Web tokens and components, Core
contracts, global Server composition, or root route, session and layout with
several journeys, or when the user asks for the measurement. Record the dependency and the reason.

The CI independently runs, for each PR, the architecture, lint, complexity,
types, tests with coverage and ratchet, integration and build jobs of each app or package, and is the proof
of the full suites. The scoped local tests and the coverage ratchet do not replace it.
An empty or skipped selection does not pass just because the command finished successfully: confirm the
test count and the result. Record in `evaluation.md` the files and scenarios, the
commands run, the counts, the result and the evaluated candidate, keeping the
unit, Server integration and Web integration results separate.

The dependency-cruiser boundaries live in `.dependency-cruiser.cjs`. Change this
configuration only to represent legitimate boundaries, never to hide a
regression.

The complexity check uses `.code-multivitals.json` for the limits and a
shared baseline in `.code-multivitals-baseline.json`. The CI runs the
check on the main scope of each app or package (`apps/server`, `apps/web`,
`apps/backoffice` and `packages/core`), tolerating existing debt and blocking
new violations. To update the baseline, run:

```bash
pnpm run update:complexity-baseline
```

The update must be done only when the complexity change is
intentional and reviewed. Clone detection is disabled in the current
ratchet to avoid noise and disproportionate cost in the monorepo; the gate is
centered on per-function metrics.

## Scripts per workspace

The descriptions below reflect the scripts declared in the current `package.json` files.
Use `pnpm --filter <workspace> run <script>` to run a workspace script from the
root.

### Root (`stardust`)

| Script               | Description                                                                                         |
| --- | --- |
| `setup`              | Runs `scripts/setup-project.mjs` to configure skills, commands and MCP.                             |
| `prepare`            | Initializes the Husky hooks after the dependencies are installed.                                   |
| `dev`                | Starts the development processes defined by the workspaces via Turbo.                               |
| `prod`               | Starts the production processes defined by the workspaces via Turbo.                                |
| `build`              | Builds the workspaces and replaces package imports with the build paths.                            |
| `build:server`       | Builds the Server without cache and replaces the package imports.                                   |
| `build:backoffice`       | Builds only the Backoffice.                                                                             |
| `dev:backoffice` | Starts the administrative panel at `http://localhost:8000`. |
| `dev:studio` | Starts the local animation editor, preferring port `3030`. |
| `build:studio` | Builds the animation player of the `@stardust/studio` package. |
| `build:web`          | Builds only the Web App.                                                                            |
| `build:core`         | Builds only the Core package.                                                                       |
| `format`             | Formats the workspaces' files via Turbo.                                                            |
| `check:code`         | Runs the workspaces' Biome checks via Turbo.                                                        |
| `check:types`        | Runs the workspaces' typechecks via Turbo.                                                          |
| `check:architecture` | Checks the dependencies between layers with dependency-cruiser.                                     |
| `check:complexity` | Checks complexity and maintainability against `.code-multivitals-baseline.json`. |
| `update:complexity-baseline` | Updates the shared baseline after an explicit review of the complexity changes. |
| `test`               | Alias for `test:unit`.                                                                              |
| `test:unit`          | Runs the workspaces' unit tests via Turbo.                                                          |
| `test:coverage`      | Runs workspace coverage with the ratchet enabled.                                                   |
| `check:coverage`     | Compares the coverage reports with `coverage-baseline.json` and fails when a baseline decreases.    |
| `check:test-integrity` | Fails when tests are weakened or changed testable code has no corresponding test. |
| `check:spec-implementation` | Validates the Spec's canonical path map against the Git diff and the filesystem. |
| `test:spec-implementation` | Runs the tests of the Spec conformance checker.                                                     |
| `test:scripts`       | Runs the tests of all helper scripts in `scripts/tests/`.                                           |
| `test:integration`   | Runs the integration tests declared by the workspaces via Turbo.                                    |
| `test:server`        | Runs the unit tests of `@stardust/server`.                                                          |
| `test:backoffice`        | Runs the unit tests of `@stardust/backoffice`.                                                      |
| `test:web`           | Runs the unit tests of `@stardust/web`.                                                             |
| `test:core`          | Runs the unit tests of `@stardust/core`.                                                            |

`check:test-integrity` requires a changed test in the same workspace only for
executable source in testable targets: controllers, jobs, use-cases, domain
objects (`entities`, `structures`, `aggregates`), hooks, views/widgets, Web
routes (`app/page`, `app/layout`, `app/route`), Server routes (`tests/routes`),
RPC actions and AI tools.
Barrels (`index.*`), generic services/repositories, constants, interfaces,
types and generated code, fixtures, mocks and the test infrastructure itself
are outside this pairing; the JSON result lists these paths in
`excludedSourcePaths`. Allowed test files live in `scripts/tests/**`
or in the `tests/` directory of the layer itself: domain objects
(`domain/entities|structures|aggregates`), use-cases, REST controllers,
jobs, hooks, widgets/views, Web pages/routes, Server routes, RPC actions and AI
tools. Colocated tests of views and hooks of `contexts`
(`ui/**/contexts/**/tests`) are also allowed locations; dedicated tests of
constants, providers and fixtures continue to be rejected. A test outside these
locations appears in `forbiddenTestPaths` and fails the CI.

### `apps/server`

| Script             | Description                                                                              |
| --- | --- |
| `dev`              | Starts the API in watch mode with `.env.local`.                                    |
| `lint`             | Runs the lint of `src` at error diagnostic level.                                        |
| `format`           | Formats `src` and writes the changes.                                                    |
| `check:code`       | Checks `src` with Biome, without applying fixes.                                         |
| `check:types`      | Runs TypeScript without emitting files.                                                  |
| `check:complexity` | Checks the `apps/server` scope against the shared baseline.                               |
| `check:architecture` | Checks the Server's architectural dependencies with dependency-cruiser.                |
| `check:updates`    | Lists dependency updates with `ncu`.                                                     |
| `build`            | Builds the Server with tsup.                                                             |
| `prod`             | Starts the Server build using `.env`.                                                    |
| `db:test`          | Starts the required Supabase services and resets the local test database.                |
| `db:migrate`       | Applies the Drizzle migrations with `tsx scripts/migrate-database.ts`.                   |
| `db:prod`          | Links the Supabase CLI to the production project.                                        |
| `db:dev`           | Links the Supabase CLI to the development project.                                       |
| `db:pull`          | Downloads the Auth, Public, Storage and Realtime schemas.                                |
| `db:push`          | Applies migrations to the linked Supabase project.                                       |
| `db:types`         | Generates the TypeScript types of the development database.                              |
| `db:revert`        | Marks a migration as reverted; the migration ID is a positional argument.                |
| `update`           | Updates a specific dependency with `ncu`; the dependency name is a positional argument.  |
| `test:unit`        | Runs the unit tests of the Server project.                                               |
| `test:coverage`    | Runs the Server unit tests with a JSON coverage report.                                  |
| `test:coverage:merge` | Consolidates the unit coverage and the coverage of the six Server integration shards before the ratchet. |
| `test:integration` | Runs the Server integration tests.                                                       |

Database command examples:

```bash
pnpm --filter @stardust/server run db:dev
pnpm --filter @stardust/server run db:migrate
pnpm --filter @stardust/server run db:revert 20240101000000
pnpm --filter @stardust/server run update package-name
```

The `db:prod`, `db:push` and `db:revert` commands change external state or the
migration history. Confirm the project and the parameters before running
them.

### `apps/backoffice`

| Script            | Description                                                            |
| --- | --- |
| `dev`             | Starts the Backoffice development server on port `8000`.                   |
| `build`           | Generates the Backoffice build with React Router.                          |
| `start`           | Serves the Backoffice static files from `build/client`.                    |
| `lint`            | Runs the lint of `src` at error diagnostic level.                      |
| `format`          | Formats `src` and writes the changes.                                  |
| `check:code`      | Checks `src` with Biome, without applying fixes.                       |
| `check:types`     | Generates the React Router types and runs TypeScript.                  |
| `check:complexity` | Checks the `apps/backoffice` scope against the shared baseline.           |
| `check:architecture` | Checks the Backoffice's architectural dependencies with dependency-cruiser. |
| `test:unit`       | Runs the Backoffice unit tests.                                            |
| `test:coverage`   | Runs the Backoffice unit tests with a JSON coverage report.                |
| `test:unit:watch` | Runs the Backoffice unit tests in watch mode.                              |

### `apps/web`

| Script                     | Description                                                             |
| --- | --- |
| `dev`                      | Starts the Web App in development on port `3000`.                       |
| `build`                    | Generates the Web App production build with Next.js.                    |
| `start`                    | Starts the standalone build using the port defined in `PORT`.           |
| `check:code`               | Checks `src` with Biome, without applying fixes.                        |
| `check:types`              | Runs TypeScript without emitting files.                                 |
| `check:complexity`         | Checks the `apps/web` scope against the shared baseline.                |
| `check:architecture`       | Checks the Web App's architectural dependencies with dependency-cruiser. |
| `lint`                     | Runs the lint of `src` at error diagnostic level.                       |
| `format`                   | Formats `src` and writes the changes.                                   |
| `test:unit`                | Runs the Web App unit tests.                                            |
| `test:coverage`            | Runs the Web App unit tests with a JSON coverage report.                |
| `test:unit:watch`          | Runs the Web App unit tests in watch mode.                              |
| `test:integration`         | Runs the Playwright tests with the integration configuration.           |
| `test:integration:ui`      | Opens the Playwright interface for the integration tests.               |
| `test:integration:debug`   | Runs the Playwright tests in debug mode.                                |
| `test:integration:install` | Installs the Chromium browser used by the integration.                  |

### `packages/core`

| Script          | Description                                                          |
| --- | --- |
| `build`         | Builds the Core package with tsup.                                   |
| `check:types`   | Runs TypeScript without emitting files.                              |
| `check:code`    | Checks `src` with Biome, without applying fixes.                     |
| `check:complexity` | Checks the `packages/core` scope against the shared baseline.     |
| `check:architecture` | Checks the Core's architectural dependencies with dependency-cruiser. |
| `lint`          | Runs the lint of `src` at error diagnostic level.                    |
| `format`        | Formats `src` and writes the changes.                                |
| `test:unit`     | Runs the Core unit tests.                                            |
| `test:coverage` | Runs the Core unit tests with a JSON coverage report.                |

### `packages/email`

| Script        | Description                                 |
| --- | --- |
| `dev`         | Starts the email editor on port `3001`.     |
| `build`       | Exports the email templates to `build`.     |
| `format`      | Formats the templates and partials.         |
| `check:code`  | Checks templates and partials with Biome.   |
| `check:types` | Runs TypeScript without emitting files.     |
| `check:complexity` | Checks the email templates against the shared baseline. |

### `packages/studio`

Local Lottie animation authoring tool, independent of the administrative
panel in `apps/backoffice`. Use `pnpm run dev:studio` at the root.
Vite prefers port `3030` and reports another port if it is busy.
It does not require the Server, Supabase, credentials or environment variables.

| Script | Effect |
| --- | --- |
| `dev` | Starts the Vite editor and the local file backend. |
| `build` | Checks types and generates the static player in `dist`. |
| `preview` | Serves the static build, without editing endpoints. |
| `check:code` | Checks UI, plugin and scripts with Biome. |
| `check:types` | Runs TypeScript without emit. |
| `format` | Formats the code with Biome. |
| `postinstall` | Copies the CanvasKit WASM to `public`, without versioning the binary. |

The general `pnpm run dev` does not start this tool. `pnpm run build:studio`
generates its build from the root. The general code and type checks include the package
via Turbo. The manual smoke opens a scene, validates playback, controls and recording
in `lottie.json`; it does not use the authenticated flow of the administrative Backoffice.

### `packages/lsp`

| Script        | Description                                         |
| --- | --- |
| `build`       | Builds the LSP package with tsup.                   |
| `check:types` | Runs TypeScript without emitting files.             |
| `check:code`  | Checks `src` with Biome, without applying fixes.    |
| `check:complexity` | Checks the `packages/lsp` scope against the shared baseline. |
| `lint`        | Runs the lint of the TypeScript files in `src`.     |
| `format`      | Formats the TypeScript files in `src`.              |
| `test:unit`   | Runs the LSP Node tests with the tsx loader.        |

### `packages/validation`

| Script        | Description                                               |
| --- | --- |
| `build`       | Builds the Validation package with tsup.                  |
| `check:types` | Runs TypeScript without emitting files.                   |
| `check:code`  | Checks `src` with Biome, without applying fixes.          |
| `check:complexity` | Checks the `packages/validation` scope against the shared baseline. |
| `lint`        | Runs the lint of `src` at error diagnostic level.         |
| `format`      | Formats `src` and writes the changes.                     |

## Local seed per module

The seed is independent of `db:test` and uses a versioned snapshot of the content of
Supabase staging (`rveubqzvfbqbcpmuevnm`), exported on 2026-10-10. It does not access
staging during execution. The entry point is
`apps/server/src/database/seed.ts`; each domain has its seeder in
`apps/server/src/database/seeders/<Domain>Seeder.ts`, with `clear()` and `run(seed)`.

Prepare the stack and apply the migrations with `pnpm --filter @stardust/server run db:test`.
The local accounts are fixed public fixtures defined in
`apps/server/src/database/seeders/seed-accounts.json`: `explorer@stardust.local`
and `studio@stardust.local`. Their IDs end in `0001` and `0002`, respectively.
The seed does not use `WEB_APP_E2E_*` or `BACKOFFICE_APP_E2E_*`. Include the full UUID of the
Backoffice (`00000000-0000-4000-8000-000000000002`) in `GOD_ACCOUNT_IDS` of the root and of the
local Server. For manual Playwright, load the corresponding exporter with
`--seed`; without that option it keeps support for the private credentials of the root.

```bash
# Validates configuration and snapshot without connecting to the database
pnpm --filter @stardust/server run db:seed --check

# Replaces application data and local Auth users
pnpm --filter @stardust/server run db:seed
```

The command exports the local connection from the root `.env.local` with
`scripts/export-local-database-env.mjs` and loads the credentials only in the
process. It refuses remote hosts, other databases, connection parameters that
redirect the target and production mode. Cleanup and insertion happen in a
single transaction, with a lock to serialize concurrent runs. A failure
also reverts the Auth reset; the pool closes on completion or failure.

The snapshot contains 55 avatars, 10 rockets, 2 insignias, 6 tiers, 17 achievements,
8 planets, 39 stars, 27 challenges that are public or associated with stars,
60 category links, 10 categories and 10 guides. Texts, stories and questions
embedded in the stars are applied by the `LessonSeeder`; the separate questions table
is empty in staging. Challenge authorship is replaced by the local Backoffice
account. No users, emails, sessions, password hashes,
API keys, private challenges without a star or staging activity history are exported.
Staging roadmaps are not part of the current local schema and are not imported.

The two local accounts receive a profile, initial items and first star
unlocked. Ranking, score, snippet, comment, conversation and feedback are
fictional. The seed does not publish events, send messages or generate files;
names and references of catalog images/audios are preserved, but their
files are not copied by the database command. The seeders persist directly
to PostgreSQL at the administrative boundary; they do not add reset methods to the Core
ports nor become dependencies of the routes or jobs.

The images of planets, achievements, avatars, tiers and rockets are versioned in
`seeders/assets/images/planets/`, `seeders/assets/images/achievements/` and
`seeders/assets/images/avatars/`, `seeders/assets/images/rankings/` and
`seeders/assets/images/rockets/`.
Run `pnpm --filter @stardust/server run db:seed:assets` after preparing the local
MinIO. The command uses the root `.env.local`, requires an HTTP endpoint on
`127.0.0.1`, preserves the catalog names and publishes 110 images, including six
extras. It confirms via anonymous HTTP the 104 files referenced by the eight
planets, the 17 achievements, the 55 avatars, the six tiers and the 10 rockets. It does not change the database; it can be run again to update the
files. The existing policy is preserved and receives public read permission
only for `images/planets/*`, `images/achievements/*`, `images/avatars/*`, `images/rankings/*` and `images/rockets/*`. Uploads and other folders do not receive permissions.
Configure `NEXT_PUBLIC_CDN_URL` in the Web and `VITE_CDN_URL` in the Backoffice with the URL
printed by the command (`http://127.0.0.1:<MINIO_API_PORT>/<MINIO_BUCKET>`).
The avatars preserve the catalog's `.jpg` names; the Content-Type matches
the original bytes (JPEG, AVIF or WebP). The HTTP verification compares the bytes
received with the versioned file. Files of other items still need to be
provided.

To update the snapshot in `seeders/data/seed-catalog.json`, export only
the catalog tables listed in `seed-data.ts` through read-only queries on
Supabase Dev. Filter challenges by `is_public OR star_id IS NOT NULL`, keep
only the links of the included challenges and replace `user_id` with
`00000000-0000-4000-8000-000000000002` before saving. Update `exportedAt`,
review the content and references and run the local validations. Never version
a dump of Auth or of personal tables.

```bash
node --test scripts/tests/seed-database.test.mjs

# Explicit and destructive validation, exclusively on the local database
eval "$(node scripts/export-local-database-env.mjs)"
STARDUST_LOCAL_SEED_TEST=1 node --env-file=.env.local --test scripts/tests/seed-database.integration.test.mjs
```

The integration recreates the seed twice, authenticates the accounts through the local GoTrue,
verifies their profiles and forces an insertion failure to confirm rollback.
Without `STARDUST_LOCAL_SEED_TEST=1`, this test does not change the database.

## Local Supabase

The root Docker Compose is the only source of the local Supabase. Configure the
local variables in the root `.env.local` and keep that file ignored by
Git. Pass it to Compose with `--env-file`; do not load the file with `source`.
The values must never be copied to versioned commands, documentation or
logs.

Bring up the persistent services and wait for the health checks. Then, run
the one-shot MinIO initializer; it creates the local bucket idempotently:

```bash
docker compose --env-file .env.local up -d --wait \
  inngest redis supabase-postgres supabase-mailpit supabase-templates minio \
  supabase-auth supabase-rest supabase-realtime supabase-kong
docker compose --env-file .env.local run --rm minio-init
```

`supabase-role-init` is started as a dependency of Auth, PostgREST and Realtime.
It prepares the local roles, including when `docker/volumes/postgres/` already
contains data. To clean the Auth and the public schema and reapply the versioned
migrations, run the one-shot reset; it does not apply the seed:

```bash
docker compose --env-file .env.local --profile test run --rm supabase-db-reset
```

The Server integration flow prepares the same stack and resets the database before
the suite:

```bash
pnpm --filter @stardust/server run db:test
pnpm --filter @stardust/server run test:integration
```

The default host ports are Kong `54321`, PostgreSQL `54322`, Mailpit HTTP
`54324`/SMTP `54325`, Redis `6379` and MinIO API `9000`/console `9001`, always
published on loopback. When another stack occupies these ports, configure in the root
`.env.local` `SUPABASE_API_PORT`, `SUPABASE_DATABASE_PORT`,
`SUPABASE_MAILPIT_HTTP_PORT`, `SUPABASE_MAILPIT_SMTP_PORT`, `REDIS_PORT`,
`MINIO_API_PORT` and `MINIO_CONSOLE_PORT`. The apps must use the same ports
in the `.env.local` URLs; `apps/server/.env.testing` must point to the API and
PostgreSQL of the test stack. The default values remain valid when the
overrides are omitted. The guards accept any port only on loopback
and with the expected local protocol. The MinIO bucket uses a locally
configurable name, with `stardust-bucket-local` as the default. Do not put the MinIO
access values in Git.

GoTrue sends messages to Mailpit and loads the versioned sign-up and
recovery templates through the internal `supabase-templates` service. The service
does not publish a port on the host. For Google and GitHub OAuth, keep IDs and
secrets only in the root `.env.local` and register with the providers the local
callback `http://127.0.0.1:<SUPABASE_API_PORT>/auth/v1/callback` (default port
`54321`).

The Web App no longer consumes `postgres_changes` from the local Realtime: the success of
Sign-up and of confirmations comes from REST polling (`PollingProfileChannel`). The
Realtime tenant, the `supabase_realtime` publication of `public.users` and the
`SELECT` for `anon`/`authenticated` remain only until the infrastructure
follow-up that removes them. If `/profile` returns 500 with `Can't resolve 'apexcharts'`, reinstall the dependencies at the root.

`docker compose --env-file .env.local down` preserves the local PostgreSQL and
MinIO data in `docker/volumes/`. Redis, Auth, PostgREST, Realtime,
Mailpit, Inngest, Kong and templates are disposable.

## Integration tests

The Web App integration tests use Playwright, the `apps/web/.env.testing`
environment and the test server started by the suite's configuration. Do not point
this flow at production nor use the real Backoffice credentials:

```bash
pnpm --filter @stardust/web run test:integration:install
pnpm --filter @stardust/web run test:integration
pnpm --filter @stardust/web run test:integration:debug
```

For an authenticated manual inspection, start the API and the Web App in separate
terminals, load the local environment with the corresponding script and validate a
protected route beyond the login screen. Credentials must remain in
`.env.local` and never be recorded in the repository or in logs.

## Recommended order

1. `format`, `check:code`, `check:types` and `test:unit` during the short cycle.
2. `check:architecture` when the structure/imports stabilize.
3. `test:integration` for integration changes or before completion when
   declared in the Spec.
4. Manual validation in the browser for frontend, UI or client-side route
   changes.
5. Local preflight with all applicable sensors before the PR.
6. Checks in CI, including `check:architecture`, integration and the applicable
   preflight checks.
7. Build in CI, after the applicable checks.

The PR checks are the composition of the regular checks. Coverage has a
quality ratchet per workspace for Core, Server, Backoffice and Web; the thresholds
versioned in `coverage-baseline.json` can never decrease without a reviewed
change to that file.

On the Server, the ratchet considers the joint coverage of the unit tests and of the
six integration shards, including the Drizzle adapters exercised by the
real routes. Prepare the local stack, run `test:integration:ci` and
`test:coverage` in the `@stardust/server` workspace, then `test:coverage:merge` and
`pnpm run check:coverage @stardust/server`. In this local flow, the consolidation
requires the seven complete reports (one unit and six integration); an isolated
unit report does not approve this ratchet.
In the Server CI, each of the six integration shards runs in its own job
(`Integration tests (shard N/6)`), with an isolated local stack, and uploads its report
as an artifact. The unit tests are also split into two shards
(`Unit tests (shard N/2)`), and the tests in `scripts/tests` run only in the
first. The `Tests` job downloads the eight reports, consolidates with
`test:coverage:merge --unit-shards=2` and verifies the ratchet. The stack setup
lives in the `.github/actions/prepare-server-stack` action.
The Server CI runs Node 24 for the V8 collection; running on Node 22 revealed
a native abort in the inspector during coverage instrumentation. The Crew review
caller waits up to 45 minutes for the applicable checks before starting
the review.

`check:dead-code` is not part of the official sensors. Playwright MCP can
inspect real flows and Hermes can run release E2E validations, but
neither replaces automated `test:integration` when it is
applicable. The GitHub Actions E2E workflows are described in
`documentation/infrastructure.md`.

## Approved transition: Drizzle and SSE (Issue #602)

The scripts listed above still describe the implemented state. For the delivery of Issue #602, the tooling contract is:

| Server script | Approved target |
| --- | --- |
| `db:generate` | Drizzle Kit generate over src/database/drizzle/schema.ts aggregating models; out in src/database/drizzle/migrations; local execution, no implicit remote introspection. |
| `db:migrate` | Applies pending Drizzle migrations; URL per environment, no reset, no execution at boot. |
| `db:preflight` | Compares catalog/history with the baseline, read-only; does not print data or credentials. |
| `db:adopt` | Adopts the baseline in an existing database only after parity; never marks the revocation migration as already applied. |
| `db:test` | Prepares Compose with the root .env.local, exclusively local reset, Drizzle migrations without seed. |

Supabase CLI scripts for diff/push/pull/repair and Database.ts generation are removed; the Web does not generate database types. pnpm/`pnpm-lock.yaml` remain the source of versions. Before any remote application, preflight of Dev and production and a rollback rehearsal in an isolated restore are required, with evidence in the SDD workflow. The unavailability of these environments at the time of this authoring is not evidence of parity. The initial window is coordinated, with no compatible intermediate release.

The script list describes the current runtime only after the verified implementation; also update the infrastructure's migrations section in that delivery.

## Crew

`apps/crew` is an independent pnpm workspace for PR review with Mastra and
direct Anthropic. `pnpm run crew` loads the root `.env.local` and starts Crew;
`pnpm run dev` excludes this workspace. Configure the variables listed in
`apps/crew/.env.example`, including `CREW_DATABASE_URL`, `CREW_PORT` and `CREW_HOST`,
to keep database/port/host separate from the product apps. Start the database with
`docker compose --env-file .env.local --profile crew up -d --wait crew-db`.

Use `pnpm --filter @stardust/crew run <script>` for `check:code`, `check:types`,
`check:architecture`, `test:unit`, `test:integration` and `eval`; use
`pnpm run build:crew` to build. The unit tests use simulated models;
integrations need Docker; evals make paid calls to Anthropic and to
Composio. Node 24.11+ is recommended for the build toolchain. Its own CI
validates the workspace and the image without inference secrets.

`Crew PR review` replaces `Hermes code review`. The workflow uses
`pull_request_target`, runs `scripts/run-crew-pr-review.mjs` from the trusted base
without installing dependencies or running PR code, waits only for the
applicable CIs (including Crew when triggered) and publishes a summary and inline
comments via the Actions token. Configure the secrets `CREW_API_URL` and
`PR_REVIEWER_API_KEY` for the already deployed Crew service. The caller stays active after
being merged into `main`; it does not deploy. The first review of a PR is `full`;
subsequent pushes are `incremental`, from the bot's last commit with a full
review, limited to what belongs to the PR (without what came from merges of
`main`), with a fallback to `full` when the history was rewritten. The applicable CIs
continue to be evaluated for the whole PR. Partial or blocked reviews fail
the check. An unexpected failure records only a safe summary (error class, code, command,
exit and HTTP status, repository endpoint), never messages, subprocess outputs or
secrets. Since the script runs from `main`, a fix in it only applies to the following PRs. Deterministic tests: `node --test scripts/tests/run-crew-pr-review.test.mjs`.

`Crew app CD` uses `.github/workflows/crew-app-production-cd.yaml` and
`scripts/deploy-crew.mjs` for deploys on Coolify after relevant pushes to
`main` or manual execution on that branch. Configure `COOLIFY_WEBHOOK_CREW_PROD`,
`COOLIFY_API_TOKEN` and `CREW_API_URL` in GitHub; the runtime credentials live
in Coolify. The job verifies the deployment SHA and requires `/health` with HTTP 200 and
`status: ok`, without treating the webhook acceptance as deploy completion. The
deploys are serialized and respect the `production` environment. The Crew CI
also validates the CD script: `node --test scripts/tests/deploy-crew.test.mjs`.

The exporter `scripts/export-backoffice-app-e2e-env.mjs` uses
`BACKOFFICE_APP_E2E_EMAIL` and `BACKOFFICE_APP_E2E_PASSWORD`. During the migration,
it also accepts the legacy local keys `STUDIO_APP_E2E_*`, but always exports
the variables with the `BACKOFFICE_APP_E2E_` prefix. The seed's fixed accounts and
the browser session namespace are preserved.
