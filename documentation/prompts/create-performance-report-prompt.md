---
description: Prompt to conduct a performance diagnosis in the StarDust project, covering bundle, data fetching, queries, jobs and runtime across all architecture layers (web and server).
---

# Prompt: Performance Diagnosis — StarDust

## Goal

Conduct a performance diagnosis oriented to the StarDust architecture, identifying bottlenecks, waterfalls, bundle waste and runtime problems across all layers of the system (Build, UI, RPC, REST, Queue, Database, Provision, Assets). The result must be a report with issues classified by area and effort, with fix recommendations aligned with the project conventions.

---

## Inputs

- **Required:**
  - Target application `{APP}` (e.g. `web`, `server`, `backoffice`)
  - Diagnosis scope `{SCOPE}` (e.g. module `auth`, route `/space`, feature `lesson`, or `full`)
  - Target files or paths `{TARGETS}` (e.g. `apps/web/src/rpc/`, `apps/server/src/queue/`)
- **Optional:**
  - Observed metrics or symptoms `{SYMPTOMS}` (e.g. "high LCP on the landing page", "slow /auth/account endpoint", "XP job takes too long")
  - Success criteria `{CRITERIA}` (e.g. "reduce JS bundle by 50%", "eliminate auth waterfalls", "reduce endpoint latency to <100ms")
  - Constraints `{CONSTRAINTS}` (e.g. "do not change the database schema", "preserve functional behavior")

---

## Applicable Rules

Before classifying a recommendation as safe, read:

- `documentation/rules/rules.md` — index of the rules per layer.
- `documentation/rules/code-conventions-rules.md` — general conventions that affect recommended refactors.
- Rules of the layers touched by each performance issue:
  - `documentation/rules/web-application-rules.md`
  - `documentation/rules/backoffice-application-rules.md`
  - `documentation/rules/server-application-rules.md`
  - `documentation/rules/ui-layer-rules.md`
  - `documentation/rules/rpc-layer-rules.md`
  - `documentation/rules/rest-layer-rules.md`
  - `documentation/rules/database-rules.md`
  - `documentation/rules/queue-layer-rules.md`
  - `documentation/rules/provision-layer-rules.md`
  - `documentation/rules/realtime-rules.md`
  - `documentation/rules/ai-layer-rules.md`
  - `documentation/rules/validation-layer-rules.md`

Performance recommendations must not break layer contracts. When an optimization requires a new architectural pattern, record it as a structural recommendation and cite the rule that will need to be updated.

---

## Area Map for Diagnosis

Before starting, identify which areas are in scope and the relevant rule files:

### `apps/web`

| Area | Key Files | Typical Problems |
|------|-----------|------------------|
| **Build** | `apps/web/next.config.js`, `package.json` | Minification disabled (`minimizer = []`), `optimizePackageImports` missing |
| **Bundle / Frontend** | `apps/web/src/ui/**/index.tsx`, `lotties.ts` | Static imports of heavy libs without `next/dynamic`, inlined Lottie JSONs, barrel imports of icons |
| **Data Fetching / RPC** | `apps/web/src/rpc/next-safe-action/clients/`, `apps/web/src/rpc/actions/` | `authActionClient` with sequential calls without cache, fetches that should be `Promise.all` |
| **Data Fetching / REST** | `apps/web/src/rest/next/NextRestClient.ts`, `apps/web/src/rest/controllers/` | `isCacheEnabled: false` as default, `fetchAccount` called before checking for a public route |
| **Middleware** | `apps/web/src/rest/controllers/auth/VerifyAuthRoutesController.ts` | Unconditional API call on every request, including public routes |
| **Re-renders / Runtime** | `apps/web/src/ui/**/contexts/`, `hooks/` | Missing `useMemo` on object creation, `form.watch()` without a field, scroll listeners without throttle |
| **Assets** | `apps/web/public/lotties/`, `apps/web/public/audios/` | Uncompressed WAV files, Lottie JSONs imported statically |

### `apps/server`

| Area | Key Files | Typical Problems |
|------|-----------|------------------|
| **API / Controllers** | `apps/server/src/rest/controllers/`, `apps/server/src/app/hono/routers/` | Handlers without pagination, excessive entity serialization, N+1 across repositories in the controller |
| **API / Middleware** | `apps/server/src/app/hono/middlewares/` | Heavy middlewares running on routes that do not need them (e.g. auth on a public route) |
| **Database / Repositories** | `apps/server/src/database/supabase/repositories/` | `select('*')` on tables with many columns, N+1 across repositories, missing `calculateQueryRange`, heavy joins without an index |
| **Database / Mappers** | `apps/server/src/database/supabase/mappers/` | Synchronous loops over large arrays, missing type normalization (numeric Supabase fields arriving as `string \| null`) |
| **Queue / Jobs** | `apps/server/src/queue/jobs/`, `apps/server/src/queue/inngest/functions/` | Independent steps in sequence instead of `Promise.all`, IO outside `amqp.run`, jobs without idempotency |
| **Provision / Cache** | `apps/server/src/provision/cache/UpstashCacheProvider.ts` | Cache unused on stable read endpoints, missing or too short TTL |
| **Provision / Telemetry** | `apps/server/src/provision/monitor/SentryTelemetryProvider.ts` | Errors silenced without reporting to Sentry, missing spans on critical operations |
| **REST Client / Axios** | `apps/server/src/rest/axios/AxiosRestClient.ts` | No timeout configured, no retry on transient failures |
| **Build** | `apps/server/package.json`, `tsup.config.ts` | Unnecessary dependencies in the production bundle |

---

## Diagnosis Checklist per Area

### `apps/web` — 📦 Build and Bundle

- [ ] `next.config.js` does not disable `config.optimization.minimizer` (removes 40-60% of the production JS)
- [ ] Heavy libs use `next/dynamic({ ssr: false })`: Three.js, tsparticles, swiper, react-confetti, typewriter-effect, html-to-image
- [ ] Lottie JSONs are not imported statically — use `fetch('/lotties/${name}.json')` or dynamic `import()`
- [ ] `@phosphor-icons/react` imported from `/dist/ssr` to benefit from `optimizePackageImports`
- [ ] `next.config.js` has `optimizePackageImports` configured for icon/component libs

### `apps/web` — 🌐 Data Fetching

- [ ] `VerifyAuthRoutesController` checks `isPublicRoute` **before** calling `fetchAccount()` — public routes make no API call
- [ ] `ServerProviders` does not duplicate the `fetchAccount()` already done in the middleware — use `isCacheEnabled: true` or pass `accountDto` via props
- [ ] `authActionClient` does not make 2 sequential non-cached calls (`fetchAccount` + `fetchUserById`) on every server action
- [ ] `NextRestClient` uses `isCacheEnabled: true` as default for stable read endpoints (planets, achievements, challenges metadata)
- [ ] Independent fetches within the same action use `Promise.all` instead of sequential `await` (ref: `FetchLessonStoryAndQuestionsAction`)
- [ ] Next.js parallel slots (e.g. `@tabContent/comments`) do not refetch data already loaded on the parent page

### `apps/web` — 🔄 Re-renders and Runtime

- [ ] Domain objects created during render are memoized with `useMemo` (e.g. `User.create(userDto)` in `AuthContext`)
- [ ] react-hook-form's `form.watch()` specifies concrete fields — no `watch()` without an argument
- [ ] Global scroll listeners use throttle or `IntersectionObserver` (ref: `useToast`)
- [ ] Large contexts split into data vs actions to avoid re-render cascades (e.g. `AuthContext`)
- [ ] Long lists with growth potential use virtualization (`@tanstack/react-virtual`) — Ranking, Comments, Solutions

### `apps/web` — 🗃️ Assets

- [ ] Audio files in MP3/OGG — not WAV (~80% savings)
- [ ] Lottie animations loaded on demand — not inlined in the JS bundle
- [ ] Images with `next/image` for lazy loading and automatic optimization

### `apps/server` — 🗄️ Database and Queries

- [ ] Supabase queries use an explicit `.select('col1, col2')` — no `select('*')` on tables with many columns
- [ ] Repositories that need related data use Supabase joins instead of separate N+1 queries (e.g. `select('*, users(...)')`)
- [ ] Resource listings use `calculateQueryRange` for pagination — no unrestricted `findAll()` on unbounded-growth tables
- [ ] Mappers do not run heavy synchronous loops over large arrays
- [ ] Numeric database types are normalized in the mappers before reaching the Core (e.g. `Number(value)` — ref: `SupabasePlanetMapper` bug)

### `apps/server` — ⚡ API and Controllers

- [ ] Controllers return minimal DTOs — no serializing full entities when only subsets are needed
- [ ] Auth middlewares applied only on the routes that need them — no overhead on public routes
- [ ] Stable read endpoints use `UpstashCacheProvider` to avoid unnecessary round-trips to Supabase
- [ ] `AxiosRestClient` has a timeout configured — no indefinitely pending requests in external integrations

### `apps/server` — 🎞️ Queue and Jobs (Inngest)

- [ ] Independent steps within a job use `Promise.all` instead of sequential `await`
- [ ] All external IO (repository, provider) runs inside `amqp.run` to ensure traceability and retries
- [ ] Jobs are idempotent — reprocessing by Inngest does not cause duplication (e.g. duplicated XP, achievement granted twice)
- [ ] Jobs with large payloads do not carry unnecessary data — minimal payload, data fetched inside `amqp.run`
- [ ] Cron jobs (`CRON_EXPRESSION`) do not run in high-traffic windows without need

### `apps/server` — 🔭 Observability

- [ ] Critical errors in controllers and jobs are reported via `SentryTelemetryProvider` — no silent `try/catch`
- [ ] Slow operations have identifiable tracing spans in Sentry
- [ ] Structured logs present on high-volume operations to ease latency diagnosis

---

## Execution Guidelines

### Step 1: Scope Mapping

- Identify which areas and modules are in `{SCOPE}` and which app is being analyzed.
- For `web`: map the flow browser → middleware → server component → action → UI.
- For `server`: map the flow HTTP request → Hono router → middleware → controller → use case → repository → response.
- For jobs: map event → Inngest function → job handler → steps → effects.
- Explicitly mark the I/O points (Supabase, Upstash, Axios, Inngest) and CPU points (parse, serialization, mapping).

### Step 2: Evidence Collection

- Read only the files needed to support the evidence — do not read the whole project.
- For each suspected bottleneck, locate the specific file and line.
- If in doubt about lib behavior (e.g. Supabase query planner, Inngest steps, Next.js cache), consult the official documentation before classifying it as an issue.
- Without real metrics available, flag it as an **estimate from static analysis** and state how to measure it.

### Step 3: Issue Classification

| Effort | Criterion |
|--------|-----------|
| **S** | Targeted change in 1 file, under 30 min (e.g. add an explicit `select`, `Promise.all`, swap an import) |
| **M** | Change in 2-5 files, 1-3h (e.g. add cache to an endpoint, refactor a mapper, adjust pagination) |
| **L** | Structural change, 1+ days (e.g. new consolidated endpoint, split contexts, database index with migration) |

| Impact | Criterion |
|--------|-----------|
| 🔴 **High** | Affects all requests or the initial load — middleware, N+1 in listings, jobs without idempotency |
| 🟡 **Medium** | Affects specific routes or authenticated users — sequential fetches, queries without pagination, context re-renders |
| 🟢 **Low** | Affects an isolated component or one-off operation — scroll listener, individual assets, mapper without normalization |

### Step 4: Report

Produce the report following the template below.

---

## Output Template (Required Structure)

```md
---
app: {APP}
status: open|closed
last_updated_at: {DATE}
---

# Performance Diagnosis - `apps/{APP}`

## Scope

- **Task:** {TASK}
- **Target:** `apps/{APP}` -- {TARGET_DESCRIPTION}
- **Success criteria:** {CRITERIA}
- **Constraints:** {CONSTRAINTS}

---

## Assumptions and Pending Items

**Assumptions:**
- {ASSUMPTION_1}
- {ASSUMPTION_2}

**Pending items:**
- {PENDING_ITEM_1}
- {PENDING_ITEM_2}

---

## Flow Map

[For web]
```text
[Browser] --(HTTP)--> [Next.js Middleware / VerifyAuthRoutesController]
                           |
                           v
                      [Server Component / Layout / ServerProviders]
                           |
                           v
                      [RPC Action via authActionClient]
                           |
                           v
                      [Response -> React Render -> Client Hydration -> SWR]
```

[For server]
```text
[HTTP Client] --(HTTP)--> [Hono Router]
                                |
                                v
                           [Middlewares: verifyAuthentication, validationMiddleware]
                                |
                                v
                           [Controller.handle(http)]
                                |
                                v
                           [UseCase.execute(dto)]
                                |
                                v
                           [Repository -> Supabase Query -> Mapper -> Entity/DTO]
                                |
                                v
                           [http.send(dto)]
```

[For jobs]
```text
[Event via InngestBroker]
        |
        v
[Inngest Function (composition root)]
        |
        v
[Job.handle(amqp)]
        |
        v
[amqp.run("step", () => UseCase.execute())]
        |
        v
[Effect: persistence / notification / cache invalidation]
```

**Critical I/O points:**
1. {IO_POINT_1}
2. {IO_POINT_2}

---

## Evidence Collected

All the evidence below was verified directly in the source code.

---

## Performance Issues (Priority)

### ISSUE-01: {TITLE}

- **Area:** Build | Frontend/Bundle | API/Middleware | API/RPC | API/REST | API/Controllers | Database/Queries | Database/Mappers | Queue/Jobs | Provision/Cache | Frontend/Re-renders | Assets
- **App:** web | server
- **Symptom:** {SYMPTOM}
- **Probable cause:** {CAUSE} (`path/to/file.ts:line`)
- **Evidence:** `path/to/file.ts:lines`:
  ```ts
  // problematic code snippet
  ```
- **Impact:** {IMPACT} (e.g. "N+1 queries on every listing", "~200ms of waterfall per page load")
- **Risk:** Low | Medium | High. Possible regression: {REGRESSION_RISK}
- **Fix (quick win):** {QUICK_FIX}
- **Fix (robust):** {STRUCTURAL_FIX} _(optional)_
- **How to validate:** {VALIDATION} (e.g. count queries in the Supabase log before/after)
- **Estimate:** S | M | L

---

## Recommendations (Staged Plan)

### Stage 1: Quick Wins (1-2 days)

| # | Action | App | Issues | Estimated Impact |
|---|--------|-----|--------|------------------|
| 1 | ... | web | ISSUE-01 | ... |
| 2 | ... | server | ISSUE-02 | ... |

### Stage 2: Structural Fixes (3-5 days)

| # | Action | App | Issues | Estimated Impact |
|---|--------|-----|--------|------------------|
| 1 | ... | server | ISSUE-XX | ... |

### Stage 3: Hardening (1 week+)

| # | Action | App | Issues | Impact |
|---|--------|-----|--------|--------|
| 1 | ... | server | ISSUE-XX | ... |

---

## Instrumentation and Measurement

| KPI | App | Where to Measure | How to Measure | Baseline |
|-----|-----|------------------|----------------|----------|
| Total JS bundle | web | Build output | `next build` -> `.next/static` total size | Run before the fixes |
| TTFB | web | Browser/Lighthouse | `pnpm dlx lighthouse http://localhost:3000 --output json` | Measure now |
| LCP | web | Browser | Lighthouse or `web-vitals` lib | Measure now |
| API calls per page load | web | Backend logs | Count requests to `/auth/account` per page view | Measure now |
| Endpoint latency | server | Sentry / logs | Average response time per route | Measure now |
| Queries per request | server | Supabase logs | Count SQL queries per HTTP request | Measure now |
| Job duration | server | Inngest dashboard | Execution time per function | Measure now |

---

## Verification Checklist

- [ ] Did not change functional behavior (tests pass: `pnpm --filter @stardust/{APP} run test:unit`)
- [ ] Build completes successfully (`pnpm --filter @stardust/{APP} run build`)
- [ ] Typecheck passes (`pnpm --filter @stardust/{APP} run check:types`)
- [ ] Quality passes (`pnpm --filter @stardust/{APP} run check:code`)
- [ ] Metrics compared before/after (bundle size, latency, query count)
- [ ] Idempotent jobs validated with manual reprocessing in the Inngest dashboard _(if applicable)_
- [ ] {SCOPE_SPECIFIC_VALIDATION}

---

## References

- `documentation/architecture.md`
- `documentation/rules/rules.md`
- `documentation/rules/web-application-rules.md`
- `documentation/rules/backoffice-application-rules.md`
- `documentation/rules/ui-layer-rules.md`
- `documentation/rules/rpc-layer-rules.md`
- `documentation/rules/rest-layer-rules.md`
- `documentation/rules/server-application-rules.md`
- `documentation/rules/database-rules.md`
- `documentation/rules/queue-layer-rules.md`
- `documentation/rules/provision-layer-rules.md`
- `documentation/rules/realtime-rules.md`
- `documentation/rules/ai-layer-rules.md`
- `documentation/rules/validation-layer-rules.md`
- `documentation/reports/web-app-performance-report.md`
- `{OTHER_FILES_CONSULTED}`
```

---

## Constraints

- **Do not invent** file paths, APIs, module names or metrics without evidence in the codebase.
- Always cite the file and line of the problem — no generic issues without a location.
- Separate fact (evidence found in the code) from hypothesis (suspicion without confirmation) and from experiment (suggestion of how to measure).
- Do not propose fixes that violate the contracts between layers defined in `documentation/rules/` (e.g. a job cannot import Inngest directly, core cannot depend on `apps/`, a provider cannot expose SDK types).
- Database fixes must be compatible with the core's repository interface — do not change contracts without assessing the impact on the domain.
- If a fix affects the auth flow, include explicit validation (public routes, redirect to `/space`, cookies) in the checklist.
- When no real metrics are available, flag it as **static analysis** and include the measurement instrument in the pending items.
- Issues without a concrete `How to validate` must not be included in the report.
