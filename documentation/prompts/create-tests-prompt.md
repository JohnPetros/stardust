---
description: Prompt to create unit and integration tests following the project's testing standards.
---

# Prompt: Create tests

## Objective

Guide the creation of **standardized** and **efficient** unit and integration tests, ensuring:

- integrity of the business logic
- correct orchestration of `handlers`
- fidelity of the HTTP boundary in the server application routes
- fidelity of the web app entry points based on `Next.js App Router`
- functional fidelity of UI components

## Applicable Rules

Before creating any test, identify the artifact type and read the corresponding rule:

- `documentation/rules/domain-objects-testing-rules.md`
- `documentation/rules/use-cases-testing-rules.md`
- `documentation/rules/handlers-testing-rules.md`
- `documentation/rules/server-routes-testing-rules.md`
- `documentation/rules/web-app-routes-testing-rules.md`
- `documentation/rules/widget-tests-rules.md`

Also read `documentation/rules/code-conventions-rules.md` when you need to create fakers, mocks, file names or new test helpers.

## Allowed scope

In StarDust, **tests may only be created for**:

- domain objects (`Entity`, `Structure`, `Aggregate`)
- `Use Case`
- `View` or `Hook`
- `handlers` (`Controller`, `Job`, `Action`, `Tool`)
- HTTP routes of the server app (`apps/server`) via integration tests
- pages and flows of the web app (`apps/web/src/app/**`)

**It is not allowed to create new tests** for `repository`, `service`, `provider`,
`gateway`, `client`, `mapper`, `factory`, `config`, infrastructure
adapters or composition files. If the input points to a file
outside this scope, do not generate a test directly for it; instead, identify the
domain object, use case, widget, handler or route responsible for the
behavior and concentrate the coverage there.

## Input

- **Source code:** file to be tested (`Entity`, `Structure`, `Use Case`, `Controller`, `Action`, `Tool`, `Hook`, `Widget` or `Route`).

## Execution rules

- If there is **more than one** `Controller`, `Widget` or domain object (`Entity`/`Structure`) in the input, trigger `subagents` (one per item) to work in parallel.
- Each `subagent` must return:
  - test files created/changed
  - necessary `mocks`
  - list of scenarios covered

> 💡 At the end, consolidate the results into a single response.

For each subagent send the following prompt:

<Prompt for subagent>

Create tests for the file <Name>.test.ts

### Adherence to the project's standards

Identify the code type and follow the corresponding rule in `documentation/rules/`:

- **Domain objects:** [domain-objects-testing-rules.md](../rules/domain-objects-testing-rules.md)
- **Use cases:** [use-cases-testing-rules.md](../rules/use-cases-testing-rules.md)
- **Handlers** (`REST`, `RPC`, `AI`, `Queue`): [handlers-testing-rules.md](../rules/handlers-testing-rules.md)
- **HTTP routes of the server app:** [server-routes-testing-rules.md](../rules/server-routes-testing-rules.md)
- **Routes and pages of the web app:** [web-app-routes-testing-rules.md](../rules/web-app-routes-testing-rules.md)
- **Widgets** (UI): [widget-tests-rules.md](../rules/widget-tests-rules.md)

If the file does not belong to one of these allowed categories, stop the
direct test creation and clearly report that the file type cannot
receive dedicated tests according to the project rules.

### Structure and naming

- **Default location:** create **co-located** tests in a `tests/` subfolder in the directory of the original file.
- **Exception for server routes:** create the tests in `apps/server/src/tests/routes/<domain>/...`, mirroring the domain and the tested resource.
- **Exception for web app pages:** create co-located tests in `tests/page.test.tsx` in the page directory; for browser flows, use `apps/web/src/app/tests/<domain>/...`.
- **Extension:**

| Type | Extension |
| --- | --- |
| Logic and `handlers` | `.test.ts` |
| Server HTTP routes | `.test.ts` |
| Web app pages and flows | `.test.tsx` or `.test.ts` |
| Components (`Widget`, `Page`) | `.test.tsx` |

- **Example:**
  - Original: `src/auth/actions/SignInAction.ts`
  - Test: `src/auth/actions/tests/SignInAction.test.ts`
  - Server route: `apps/server/src/app/hono/routers/profile/achievements/CreateAchievementRoute.ts`
  - Test: `apps/server/src/tests/routes/profile/achievements/CreateAchievementRoute.test.ts`

### Testing stack

- **Runner:** `jest`
- **Mocking:** `ts-jest-mocker` (use `mock<Interface>()` and `Mock<Interface>`)
- **Fakers:** `@faker-js/faker` via static classes in `domain/entities/fakers/`
- **React:** `@testing-library/react` and `@testing-library/user-event`
- **Server routes:** `supertest`, `HonoFixture`, `SupabaseFixture`, `AuthFixture` and domain fixtures when necessary

### Data preparation (`fakers`)

- Always use `Faker` classes (e.g. `UsersFaker.fake()`) to instantiate entities, DTOs and structures.
- If the needed `Faker` does not exist, **create it first** following the domain's pattern.

### Strategy by test type

- **Domain objects:** validation of rules in the constructor/factory and behavior methods.
- **Use cases:** 100% of the business logic, covering the `happy path` and all domain exceptions.
- **Handlers:** extraction of data from the context (`Http`, `Call`, `Amqp`, `Mcp`), orchestration of the use case/service and formatting of the response.
- **Server HTTP routes:** exercise the real Hono app, covering authentication, validation, authorization, error mapping, response payload and effects persisted in the database without mocking internal dependencies, except in exceptional cases.
- **Web app pages and flows:** for `page.tsx`, validate the App Router boundary composition with web boundary mocks; for real browser flows, use Playwright with `ServerMock(page)` and test-only bridges of the web app itself. Every browser suite must mandatorily cover navigation observable through an application control; for protected routes, it must cover authenticated navigation from another route and redirect to login without a session.
- **Widgets:**
  - test `hooks` and `views` separately using `Hook()` and `View()`
  - for complex forms, test integration in the `Widget` (Index)

### Quality and `clean code`

- **Arrange-Act-Assert:** structure the tests in the 3 phases (without comments; a line break is enough).
- **Isolation:** use `beforeEach` to reset `mocks` and ensure each `it` is independent.
- **Specific assertions:** prefer `toHaveBeenCalledWith` with exact values or `expect.objectContaining`.

### Suggested workflow

1. Setup: create `tests/` and the file `<Name>.test.ts(x)`.
   For server routes, create the file in `apps/server/src/tests/routes/<domain>/`.
2. Mocking: identify dependency interfaces and instantiate `mocks`.
   For server routes, prepare real fixtures instead of mocking the internal stack.
3. Implementation: start with the success path and then cover error/exception scenarios.
4. For real Web flows, add the mandatory navigation defined in `documentation/rules/web-app-routes-testing-rules.md` before considering the suite complete.
5. Test validation: run in the correct monorepo scope.
6. Quality validation: run `typecheck` and `codecheck` before concluding.

```bash
pnpm run test
pnpm run check:types
pnpm run check:code

pnpm --filter @stardust/web run test:unit
pnpm --filter @stardust/server run test:unit
pnpm --filter @stardust/backoffice run test:unit
pnpm --filter @stardust/core run test:unit

pnpm --filter @stardust/web run test:unit path/to/file
pnpm --filter @stardust/server run test:unit path/to/file
pnpm --filter @stardust/backoffice run test:unit path/to/file
pnpm --filter @stardust/core run test:unit path/to/file

pnpm --filter @stardust/web run check:types
pnpm --filter @stardust/web run check:code
pnpm --filter @stardust/server run check:types
pnpm --filter @stardust/server run check:code
pnpm --filter @stardust/backoffice run check:types
pnpm --filter @stardust/backoffice run check:code
pnpm --filter @stardust/core run check:types
pnpm --filter @stardust/core run check:code
```

<Prompt for subagent>
