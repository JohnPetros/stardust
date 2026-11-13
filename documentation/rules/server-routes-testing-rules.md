# Server Route Testing Rules

This documentation defines the standards and practices for writing HTTP route
tests in `apps/server`, based on the existing tests in
`apps/server/src/tests/routes`.

## 1. Overview

Server route tests are integration tests of the HTTP edge. They must
validate the application mounted with Hono, exercising authentication, validation,
authorization, error mapping and effects persisted in the database.

Unlike handler and use case tests, the focus here is not on mocking internal
dependencies. The test must go through the route's real stack whenever
possible.

## 2. Location and Naming

- **Location:** `apps/server/src/tests/routes/<domain>/...`
- **Naming:** `[RouteName].test.ts`
- **Organization:** mirror the domain and the tested resource, as in
  `profile/achievements`.
- **Granularity:** create exactly **one test file per HTTP route**.
  Do not group multiple different routes in the same file, even if they belong
  to the same resource or router.

Examples:

- `apps/server/src/tests/routes/profile/achievements/CreateAchievementRoute.test.ts`
- `apps/server/src/tests/routes/profile/achievements/FetchAchievementsRoute.test.ts`

## 3. Stack and Tools

- Test runner: Jest.
- HTTP client: `supertest`.
- Server under test: `HonoFixture`.
- Database for setup and cleanup: `SupabaseFixture`.
- Real authentication for protected scenarios: `AuthFixture`.
- Seed and reading of auxiliary data: domain fixtures, such as `ProfileFixture`.

## 4. Execution Prerequisites

Before running the integration tests of the server app, prepare the local Supabase
with the workspace's test script:

```bash
pnpm --filter @stardust/server run db:test
pnpm --filter @stardust/server run test:integration
```

`db:test` prepares the Supabase stack from the root `docker-compose.yml` using the
local variables from `.env.local` and runs the `supabase-db-reset` one-shot, which
rebuilds the schema from the versioned migrations without applying a seed. Do not
start another stack through `supabase start` for these tests. The Auth fixture
confirms each ephemeral account through the email captured in the local Mailpit; keep
email confirmation enabled and never record the OTP, token or message body.

The tests in `apps/server/src/tests/routes/**` depend on the local Supabase even
when run by the Jest `server` project, since they use `SupabaseFixture`,
`AuthFixture`, real repositories and validation of persisted effects.

## 5. Base Test Structure

The observed pattern is:

1. Instantiate the fixtures once in the `describe` scope.
2. Run `honoFixture.setup()` in `beforeAll` to register middlewares,
   routes and error handling.
3. Clean the database in `beforeEach`.
4. Create an authenticatable account in `beforeEach` when the route requires a session.
5. Reset mutable global state, such as `ENV.godAccountIds`, when the flow uses
   special authorization.

```ts
import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/achievements', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })
})
```

## 6. Shared Fixtures

### 6.1. `HonoFixture`

Use it to bring up the real Hono application and expose `honoFixture.server` to
`supertest`.

### 6.2. `SupabaseFixture`

Use it to clean the persisted state between tests. Each `it` must start with the
database isolated.

### 6.3. `AuthFixture`

Use it to create a real account in Supabase Auth and obtain the authorization header:

```ts
.set(authFixture.getAuthorizationHeader())
```

Also use `authFixture.getAccountId()` when the scenario depends on the id of the
authenticated account.

### 6.4. Domain fixtures

Use specific fixtures to prepare support data or verify side effects,
such as:

- `ProfileFixture` to create achievements, users and query the final state.
- Real repositories when the scenario requires preparing specific relations,
  such as `SupabaseUsersRepository`.

### 6.5. Module fixtures

When data preparation for a module starts to repeat across route tests
of the same domain, prefer extracting that logic into a dedicated fixture in
`apps/server/src/tests/fixtures/`.

Use a module fixture when there is a need to:

- recurrently create related entities of the same domain;
- encapsulate cleanup of data created during the test;
- centralize reading of the persisted state for integration assertions;
- avoid duplicated local helpers across multiple test files.

Expected naming examples:

- `ProfileFixture`
- `SpaceFixture`

Rules for these fixtures:

1. The fixture must represent a module or functional aggregate, not a specific
   route.
2. Prefer high-level methods, such as `createStar()`, `createAccountUser()` or
   `getUserCoins()`.
3. If the logic comes to be used by more than one test file, move local helpers
   to the shared fixture.
4. Avoid creating a new fixture if `HonoFixture`, `SupabaseFixture`, `AuthFixture`
   and already existing fixtures already solve the case clearly.
5. Fixtures are test support infrastructure and do not receive dedicated test
   files. Do not create `*.test.*` or `*.spec.*` in
   `apps/server/src/tests/fixtures/`.
6. Validate a fixture through the route test that uses it, observing the HTTP
   response and, when the scenario produces persisted effects, the persisted
   state. Routes without mutation may validate the observable result without that
   assertion. Do not test the fixture's internal calls.

## 7. Coverage Patterns

Each route must cover, when applicable:

1. Authentication failure (`401`) when the route is protected.
2. Authorization failure (`401` or `403`) when there is a permission rule.
3. Validation failure (`400`) for invalid `params`, `query` or `body`.
4. Domain errors mapped to HTTP, such as `404` and `409`.
5. Success path with validation of the returned payload.
6. Verification of the persisted effect after mutations, by doing a new read or
   database query.

## 8. Assertion Patterns

### 8.1. HTTP status

Always use `HTTP_STATUS_CODE` instead of literal numbers.

```ts
expect(response.status).toBe(HTTP_STATUS_CODE.ok)
```

### 8.2. Error body

For known errors, compare with `expect.objectContaining` and the instance of the
expected error.

```ts
expect(response.body).toEqual(
  expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
)
```

(`'Conta não autorizada'` is the PT-BR error message returned by the application ("Unauthorized account"); it stays in Portuguese.)

For validation errors, validate the relevant fields:

```ts
expect(response.body).toEqual(
  expect.objectContaining({
    ...new ValidationError([
      { name: 'achievementId', messages: ['Invalid uuid'] },
    ]),
  }),
)
```

### 8.3. Success body

Prefer comparing the response with real objects created by fixtures or fakers.
This makes the test more explicit and avoids generic assertions such as
`expect.any(String)` when the expected value can be known.

```ts
const achievement = AchievementsFaker.fakeUniqueDto()

const response = await request(honoFixture.server)
  .post('/profile/achievements')
  .set(authFixture.getAuthorizationHeader())
  .send(achievement)

expect(response.body).toEqual(
  expect.objectContaining({
    ...achievement,
  }),
)
```

Use `expect.any(...)` only as a fallback for fields that are truly
non-deterministic or derived at runtime, such as an id generated by the application,
timestamps or positions computed from the current state.

```ts
expect(response.body).toEqual(
  expect.objectContaining({
    ...achievement,
    id: expect.any(String),
    position: lastPosition + 1,
  }),
)
```

### 8.4. Responses without a body

For `204 No Content`, validate the status and an empty body.

```ts
expect(response.status).toBe(HTTP_STATUS_CODE.noContent)
expect(response.text).toBe('')
```

## 9. Data Preparation

Always use the domain fakers to build payloads and support entities.

Observed examples:

- `AchievementsFaker.fakeUniqueDto()`
- `AchievementsFaker.fakeManyUniqueDto()`
- `Id.create().value` for valid ids in params

Avoid building objects manually when a faker already exists in the core.

## 10. Rules for Protected Routes

When the route requires authentication:

1. Have a test without the `Authorization` header.
2. Have an authenticated test for the happy path.
3. If there is additional authorization, prepare the state explicitly.

Recurring example:

```ts
ENV.godAccountIds = []
ENV.godAccountIds.push(authFixture.getAccountId())
```

Always reset this kind of state in `beforeEach` to avoid leakage between
scenarios.

## 11. Persistence Verification

On mutation routes (`POST`, `PUT`, `PATCH`, `DELETE`), do not stop at the
immediate response. Also validate the final effect on the system.

Accepted patterns:

1. Do a `GET` before and after the operation.
2. Query the database through a fixture.
3. Query real repositories when necessary.

Observed examples:

- Reloading `/profile/achievements` after creating, updating, reordering or deleting.
- Reading the user's `coins` after redeeming an achievement.
- Confirming the removal of links in association tables.

## 12. What to Avoid

- Do not mock controllers, use cases, middlewares or repositories inside the route
  test, except in exceptional need.
- Do not couple the test to the route's internal implementation; validate the HTTP contract and
  the observable effect.
- Do not group several routes in a single test file.
- Do not share state between tests.
- Do not use magic numbers for status codes.

## 13. Checklist

Before considering a route test complete, confirm:

1. The route was exercised with `supertest` over `honoFixture.server`.
2. The database was cleaned in `beforeEach`.
3. Authentication was prepared with `AuthFixture` when needed.
4. There is only one test file for the covered route.
5. If there was repeated data preparation in the module, the use or
   creation of a shared fixture was evaluated.
6. Relevant error scenarios of the HTTP edge were covered.
7. The test validated the returned body.
8. In mutations, the test validated the persisted state after the call.

## Tooling

- Server workspace: `pnpm --filter @stardust/server run test:unit`
- Server integration: `pnpm --filter @stardust/server run db:test` before
  `pnpm --filter @stardust/server run test:integration`
- Global (Turbo): `pnpm run test`
- Quality before opening a PR: `pnpm --filter @stardust/server run check:types` and
  `pnpm --filter @stardust/server run check:code`
- General reference: `documentation/tooling.md`

## Approved transition: Drizzle (Issue #602)

For Issue #602, SupabaseFixture keeps its client exclusively for Auth and starts preparing/cleaning data via Drizzle. The fixture's legacy name does not authorize PostgREST for persistence. The examples with SupabaseUsersRepository are replaced by the equivalent Drizzle repository after the implementation. db:test resets only the local database, applies Drizzle migrations and does not seed. The tests keep real Auth, real Hono and one file per route; grouped legacy scenarios and dedicated database tests are transferred to these allowed boundaries.
