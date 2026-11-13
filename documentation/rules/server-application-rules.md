# What is it for?

It is the application responsible for exposing the StarDust Core features via HTTP (API) for consumption by the Web, the Backoffice and other clients. Besides REST routes, the application runs asynchronous tasks and event-based workflows through Inngest, integrates with external services (e.g., Supabase, cache, storage, telemetry and AI providers) and can expose authenticated MCP endpoints when the integration needs to make domain tools available to external clients.

# Development

## Technologies and libraries

- HTTP framework: [Hono](https://hono.dev/) (Node)
- TypeScript runtime (dev): `tsx`
- Background jobs / workflows: [Inngest](https://www.inngest.com/)
- Data validation: [Zod](https://zod.dev/)
- Database and Auth: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- Supabase client API key: `SUPABASE_PUBLISHABLE_KEY`; do not configure a `secret`/`service_role` API key in the Server runtime. Administrative feedback operations use direct PostgreSQL only after the `God Account` authorization.
- Cache / vector: Upstash (Redis / Vector)
- Telemetry: Sentry (`@sentry/node`)
- AI: Vercel AI SDK (`ai`) and Mastra
- HTTP client: Axios
- Quality: Biome (lint/format)
- Tests: Jest
- Build: `tsup`

> For more details about dependencies and versions, see the [package.json](https://github.com/JohnPetros/stardust/blob/main/apps/server/package.json) file.

## Running the application

**Navigate to the server application folder**

```bash
cd ./stardust/apps/server
```

**Install the dependencies**

```bash
pnpm install
```

**Run the application in development mode**

```bash
docker compose up -d redis inngest
pnpm run dev
```

> The HTTP server starts, by default, at `http://localhost:3333` when `PORT` is not set. The local Inngest runtime must be started via `docker compose`, is available at `http://127.0.0.1:8288` and performs discovery at `http://host.docker.internal:3333/inngest`.

## Running the tests

```bash
pnpm run test
```

> [!NOTE]
> Set the development environment variables in the `.env.local` file.
> Use `apps/server/.env.example` as a reference for what needs to be filled in.

## Tooling

- Scripts of the `@stardust/server` workspace:
  - Dev (HTTP): `pnpm --filter @stardust/server run dev`
  - Dev (HTTP, explicit alias): `pnpm --filter @stardust/server run dev:server`
  - Local Inngest: `docker compose up -d ingest`
  - Build: `pnpm --filter @stardust/server run build`
  - Production: `pnpm --filter @stardust/server run prod`
  - Quality: `pnpm --filter @stardust/server run check:code` (`lint` + `format`)
  - Types: `pnpm --filter @stardust/server run check:types`
  - Tests: `pnpm --filter @stardust/server run test:unit`
  - Database (Supabase CLI): `pnpm --filter @stardust/server run <db:local|db:pull|db:push|db:types>`
- General reference: `documentation/tooling.md`.

## Supabase CLI

- The CLI configuration lives in `apps/server/supabase/config.toml`.
- SQL migrations live in `apps/server/supabase/migrations`.
- The production deploy must apply migrations in the pipeline before the app release, not on server boot.

## Folder structure

```
Server
├─ src
│  ├─ ai
│  │  └─ mastra
│  │     └─ toolkits
│  ├─ app
│  │  └─ hono
│  │     ├─ middlewares
│  │     ├─ routers
│  │     └─ types
│  ├─ constants
│  ├─ database
│  │  └─ supabase
│  ├─ provision
│  ├─ queue
│  │  └─ inngest
│  ├─ rest
│  └─ main.ts
└─ supabase
```

## Relevant app conventions

- HTTP MCP endpoints must live in `src/app/hono/routers/mcp`.
- MCP authentication and authorization must happen at the app edge before the tools run.
- MCP toolkits must live in `src/ai/mastra/toolkits` and concentrate Zod schemas and the composition of concrete dependencies.
- MCP tools must delegate business rules to `use cases` and entities from `@stardust/core`.

## Approved transition: Drizzle (Issue #602)

The Supabase CLI section and the use of Supabase for the database above describe the legacy. In the delivery of Issue #602, persistence uses Drizzle/PostgreSQL and the Supabase SDK remains for Auth. Business repositories are composed after authentication/authorization, for users as well as for God Account, MCP and jobs. The API key bootstrap admits only the internal lookup by hash needed by AuthenticateApiKeyUseCase, with no business access before validation; it does not restrict direct PostgreSQL to administrative feedback only.

The new scripts and paths are contracted in the Spec. The Supabase CLI stops being the migrations runner. Drizzle migrations run in the pipeline, before traffic is reopened in the coordinated initial window, never on boot. The local Supabase stack remains the source of PostgreSQL/Auth for real tests. Local ports and credentials follow AGENTS.md and tooling.md.
