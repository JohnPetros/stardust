# StarDust Architecture

## Overview

StarDust uses a **Hexagonal (Ports and Adapters)** architecture where the `@stardust/core` package acts as a framework-agnostic core, and the applications (`web`, `server`, `backoffice`) act as adapters. It is a monorepo managed by TurboRepo with a Next.js frontend and a Hono/Node.js backend.

## Apps and Packages

- **Web (`apps/web/`)**: Main frontend in Next.js 15 with React Server Components. UI organized by domain following the Widget pattern (View + Hook + Index).
- **Server (`apps/server/`)**: REST API in Hono/Node.js. Processes HTTP requests, exposes an authenticated MCP endpoint at `/mcp` and runs asynchronous jobs via Inngest.
- **Backoffice (`apps/backoffice/`)**: Internal administrative application in React Router v7.
- **Crew (`apps/crew/`)**: Independent engineering tool in Mastra, with five parallel PR reviewers through the direct Anthropic API. Uses its own PostgreSQL (`CREW_DATABASE_URL`), `crew`/`mastra` schemas, read-only GitHub access via Composio and an authenticated runs API. Does not import product apps. The port's own conventions are in `documentation/rules/crew-app-rules.md`.
- **Core (`packages/core/`)**: Pure business rules with tactical DDD. No framework dependencies. Contains Entities, Structures, Aggregates, Use Cases and Interfaces.
- **Validation (`packages/validation/`)**: Validation schemas with Zod, shared across the apps.
- **Email (`packages/email/`)**: Email templates built with React Email for sending emails.
- **Studio (`packages/studio/`)**: Independent local tool to create and preview Lottie animations, ported from Shifu. Uses React, Vite and CanvasKit/Skottie; the development plugin reads and writes the files in `public/projects`. Keeps the port's UI structure and does not depend on the Server, authentication or database.
- **LSP (`packages/lsp/`)**: Implementation of the Delegua Programming Language for analysis, execution, autocomplete and editor configuration.

## Data Flow (summary)

**PR review**: GitHub Actions `Crew PR review` → CI applicable to the diff → Crew's authenticated `/pr-reviewer/v1/runs` API → `COMMENT` review with a summary and inline findings on GitHub. The caller replaces Hermes' code review, uses only code and policies from the trusted base and never executes PR code. The diff is treated as data; results from another SHA or outside the added lines are rejected. Partial or blocked reviews are identified and fail the check. Hermes remains responsible for the release E2E.

**Crew deploy**: relevant push to `main` or manual run on that branch → `Crew app CD` workflow → authenticated Coolify webhook → deployment tracking and SHA verification → `GET /health` with HTTP 200 and `status: ok`. Deploys are serialized and do not cancel a deployment in progress. The container uses `Dockerfile.crew`, port 4111 and its own PostgreSQL; Crew migrations are applied at startup, without running the product apps' migrations. Runtime and database secrets are configured in Coolify, and are not provided to the build or to the CD job.

**RPC**: Route/Controller → Action.execute(call) → Use Case → call.redirect() or call.json()

**REST**: Service → RestClient (Axios/Fetch) → external API → RestResponse\<T\>

**MCP**: Hono `/mcp` → API key auth + badge verification → Toolkit/Tool → Use Case

**Cross-cutting rate limiting**: CORS → per-IP limit → Supabase/authentication → per-account limit → REST or MCP route. The Core exposes only the `RateLimiterProvider` port; the Server uses a dedicated ioredis adapter with a fixed window, general/sensitive policy, fail-open and a local circuit breaker. IP and account are independent dimensions and the identity used in the keys is an opaque SHA-256.

**Queue**: Event Dispatcher → Inngest → Job.handle(amqp) → Use Case

**Product analytics**: Use cases confirm business facts → publish domain events → Inngest `AnalyticsFunctions` normalizes payloads and uses `context.event.id` as `$insert_id` → `TrackAnalyticsEventJob` runs `ServerAnalyticsProvider.trackEvent(...)` inside `amqp.run(...)` → PostHog. In the browser, `ClientProviders` initializes PostHog with the authenticated account's bootstrap, captures pageviews/session recording and `AuthContextProvider` identifies social login/sign-up or resets on logout.

**Web integration tests**: Playwright → local web app in `MODE=testing` → test-only route `/api/tests/server` registers fake HTTP responses consumed by SSR and the browser → `ClientProviders` injects `ProfileChannelMock` into `RealtimeContextProvider` → real `/auth/sign-up` route validates requests, UI states and profile creation events without depending on the real backend or on real polling.

**Daily active users report**: Backoffice `DailyActiveUsersChart` → Server `GET /profile/users/daily-active-users-report?days=N` → `GetDailyActiveUsersReportUseCase` → `AnalyticsReportingProvider` → PostHog Query API → `DailyActiveUsersDto [{ date, web, mobile }]`

**Lesson audio generation/removal**: REST `/lesson/text-blocks` → use cases of the `lesson` module → Inngest events (`requested`, `batch requested`, `generated`, `cancelled`, `audio-file.removed`) → fan-out jobs, TTS/upload, physical file cleanup and final persistence of `audio` in `stars.texts[blockIndex].audio`

**Challenge code executions**: Web `ChallengeCodeEditorSlot` → authenticated Server `POST /challenging/challenges/:challengeId/code-executions` → `RunChallengeCodeUseCase` runs Delegua via `LspProvider`, classifies the status and persists `challenge_code_executions` in Supabase → `Execucoes` tab (UI label, "Executions") lists the paginated history per user/challenge → challenge/star challenge reward validates the last accepted execution and the error count on the server, without trusting browser counters.

**Backoffice signed upload**: Backoffice `ImageInput` → `StorageService.createSignedUploadUrl(...)` → Server `POST /storage/signed-upload-url` → `CreateSignedUploadUrl` → storage provider selected on the Server → browser sends the file directly to the signed URL.

**Local and production upload**: Backoffice `ImageInput` → Server `POST /storage/signed-upload-url` → `StorageMiddleware` composes the provider per environment → MinIO via `S3FileStorageProvider` in development or Cloudflare R2 in production → browser sends the file directly to the signed URL. The concrete providers are separated per provider in `apps/server/src/provision/storage/s3/` and `dropbox/`; the `FileStorageProvider` contract remains in the Core.

**Local development infrastructure**: `docker-compose.yml` starts Supabase PostgreSQL, GoTrue, PostgREST, Realtime, Envoy, Mailpit, MinIO, Redis and Inngest. Envoy forwards Auth, REST and Realtime and translates the opaque publishable key to the internal credential; internal credentials stay only in the root `.env.local` and are not passed to the apps. The Server uses `SUPABASE_PUBLISHABLE_KEY`; the Web has no Supabase client or variables. Mailpit captures SMTP and exposes the local API; the separate `supabase-templates` service serves the versioned confirmation and recovery templates. The Server keeps PostgREST for the current repositories (`supabase.from(...)`) and uses `DATABASE_URL` only for administrative feedback operations after God Account authorization; the future adoption of Drizzle and the broad removal of RLS are left for a separate task. `pnpm --filter @stardust/server run db:test` applies the reset and the versioned migrations without a seed; the route tests confirm ephemeral accounts through the link/token hash extracted from the Mailpit message. Only PostgreSQL and MinIO persist under `docker/volumes/`; the other local services are disposable. Host ports are configurable in the root `.env.local`, limited to loopback by the applications' guards.

**Feedback history and conversations**: authenticated Web `FeedbackLayout` → `ReportingService` → Server `mine` controllers with the request JWT → Core user-history use cases → Supabase repositories/RLS filtered by `auth.uid()`; initial and message attachments use contextual signed-upload endpoints and upload directly to storage before report/message persistence. God Account feedback administration authenticates in Server and uses its direct PostgreSQL connection, without a Supabase service-role API key. User replies publish the existing idempotent feedback event for the Inngest Discord job, while the UI re-queries history, detail and unread count instead of opening a realtime channel.

## Main Patterns

- **Widget** in the UI to separate View (rendering), Hook (logic/state) and Index (integration).
- **Action/RPC** to connect routes to the domain without coupling the framework to the Core.
- **MCP Toolkit** on the server to compose tools with `inputSchema`/`outputSchema` at the edge and delegate behavior to the Core.
- **RestClient** as an adapter over Axios/Fetch for external HTTP calls.
- **Analytics Providers** to isolate external SDKs/APIs such as PostHog behind Core contracts (`ServerAnalyticsProvider`, `ClientAnalyticsProvider`, `AnalyticsReportingProvider`).
- **RateLimiterProvider** in the Core, implemented by `IORedisRateLimiterProvider` on the Server; the Hono middleware applies IP before authentication and account after the REST/API key identity is verified.
- **ProvisionContext in the Backoffice** to resolve client-side infrastructure providers, such as direct upload via signed URL, without mixing this responsibility into the domain or the widget.
- **Job** for asynchronous, scheduled or failure-prone tasks (email, reports).
- **Factory Functions** instead of `new Class()` for Services and Controllers.

## Architectural Decisions

- The Core stays pure: no Next.js, Hono or Axios — only interfaces and domain logic.
- Dependencies always point inward: Apps import Core, never the other way around.
- TurboRepo ensures code sharing and script orchestration across the apps.
- Strict TypeScript across the whole project for maximum type safety.

## Technology Stack

| Technology | Package/Tool | Purpose |
| :--- | :--- | :--- |
| **Language** | TypeScript 5.8+ | Static typing across the whole project |
| **Frontend** | Next.js 15, React 19 | Server Components and main UI |
| **Backend** | Hono, Node.js | Lightweight and fast REST API |
| **Internal App** | React Router v7 | Administrative tools |
| **Database** | Supabase (PostgreSQL) | Relational persistence and BaaS |
| **Queue/Jobs** | Inngest | Background jobs and asynchronous workflows |
| **Styling** | Tailwind CSS, Radix UI | Utility-first CSS and accessible primitives |
| **Validation** | Zod | Schemas shared across apps |
| **Monorepo** | TurboRepo, pnpm | Orchestration and dependency management |
| **Linter/Formatter** | Biome | Code quality and standardization |
| **Tests** | Jest, Vitest (Crew), Playwright | Unit and composition tests, and real browser flows |

## General Directory Structure

```
stardust/
├── apps/
│   ├── web/
│   ├── server/
│   ├── backoffice/
│   └── crew/
└── packages/
    ├── core/
    ├── validation/
    ├── email/
    ├── studio/
    └── lsp/
```

## Approved transition: Drizzle (Issue #602)

The implemented state is still the one described above. The approved target for Issue #602 is PostgreSQL via Drizzle on the Server for all relational persistence, keeping Supabase Auth on the Server and S3 for files. The Spec at `documentation/features/global/supabase-replacement-with-drizzle/spec.md` defines the transition; this text does not declare the implementation complete.

The Drizzle organization follows the Scoops pattern of models, types inferred into types/entities, mappers, repositories and migrations, adapted to the StarDust Database layer: apps/server/src/database/drizzle is the single root, grouped by StarDust domains; schema.ts aggregates models and migrations live inside the adapter. This organization reference does not introduce Scoops modules or dependencies.

In the target state, REST, MCP and jobs compose Drizzle repositories at the edge. The Core ports remain agnostic. Account identity is verified by Auth/API key before composition; God Account and ownership remain on the Server. The API key bootstrap preserves the internal lookup by hash before identity: the public context only authorizes findByHash in ApiKeysRepository for validation, without HTTP exposure of keys; after validating, the edge composes the business repositories with the resulting account. Public, account, God and system contexts are explicit; the absence of identity does not grant system privilege. RLS on the application's public tables stops being an authorization boundary and direct anon/authenticated access to the application's tables, views, sequences and functions is revoked, including privileges inherited from PUBLIC. Cron infrastructure policies remain.

The browser detects profile creation by polling (`PollingProfileChannel`, Issue #643), without a long-lived connection: every 2 s (backoff up to 8 s, 120 s timeout) it queries `GET /profile/users/id/:id` with the session verified in the confirmations, or `GET /api/auth/onboarding-attempt` in the sign-up prior to login. On this same-origin route, the Web uses the restricted temporary receipt kept in an HttpOnly cookie and forwards it to the Server at `GET /profile/onboarding-attempt`. There is no SSE stream or Supabase Realtime client in the Web. Closing the page ends the queries, but the jobs continue. Returning resumes the attempt while the receipt is still valid.

Drizzle migrations are applied in the pipeline, never at boot. The first transition requires a coordinated maintenance window for Server, Web and asynchronous writers, adoption without a reset on the existing databases, a rehearsed rollback and validation before reopening. The PostgreSQL pool is single per process. After delivery, the previous passages about PostgREST, feedback RLS and public Supabase variables in the Web must be replaced by the verified state.
