# Web App Route Testing Rules

This documentation defines the standards for testing entry points of the `apps/web` application
based on `Next.js App Router`, focusing on pages, edge composition and
real browser flows.

## 1. Overview

The web app route tests validate the `Next.js` edge at two complementary
levels:

1. **Page/composition test** with `Jest`, to ensure that the page in
   `apps/web/src/app/**/page.tsx` resolves dependencies correctly, reacts to
   `params`/`searchParams` and delegates to the expected widget.
2. **Real browser flow test** with `Playwright`, to validate the route
   published to the end user, including rendering, HTTP requests, client-side
   events and observable UI states.

Unlike `widget` tests, the focus here is not the isolated View. Unlike the
`apps/server` routes, the focus is not the Hono app or direct persistence
in the database. The goal is to validate the web edge of the monorepo: App Router pages,
the web app's own test-only routes and real browser journeys.

## 2. Scope Covered

This rule applies to:

- pages in `apps/web/src/app/**/page.tsx`
- App Router slots/defaults when they have their own behavior
- browser flows organized in `apps/web/src/app/tests/**`
- test-only routes or local HTTP handlers of the web app when they support a
  flow of the web app itself

It does not replace:

- `widget-tests-rules.md` for `View`, `Hook` and `index.tsx`
- `handlers-testing-rules.md` for the web's REST controllers
- `server-routes-testing-rules.md` for the HTTP edge of `apps/server`

## 3. Location and Naming

### 3.1 Pages and App Router entries

- **Location:** co-located in `tests/` in the page's directory.
- **Example:**
  - page: `apps/web/src/app/(home)/profile/[userSlug]/api-keys/page.tsx`
  - test: `apps/web/src/app/(home)/profile/[userSlug]/api-keys/tests/page.test.tsx`
- **Extension:** `.test.tsx`

### 3.2 Real browser flows

- **Location:** `apps/web/src/app/tests/<domain>/...`
- **Example:** `apps/web/src/app/tests/auth/sign-up.test.ts`
- **Extension:** `.test.ts`
- **Runner:** `@playwright/test`

## 4. Tools and Stack

### 4.1 Page/composition tests

- Runner: `jest`
- Mocking: `jest.mock(...)`
- DTOs and payloads: core `Fakers` when it makes sense
- HTTP responses: `RestResponse`

### 4.2 Real flow tests

- Runner: `@playwright/test`
- Initial browser: `chromium`
- Test-only infra:
  - `apps/web/playwright.config.ts`
  - `apps/web/src/app/api/tests/server/**`
  - `ServerMock(page)`
  - `window.__STARDUST_PROFILE_CHANNEL_MOCK__`

## 5. Pattern for Page Tests

The tests co-located in `page.test.tsx` must treat the page as an async
composition function of the App Router.

### 5.1 What to validate

1. Resolution of edge dependencies, such as `NextServerRestClient`.
2. Instantiation of the correct `services` with the resolved `restClient`.
3. Reaction to `params: Promise<...>` and `searchParams` when they exist.
4. Success paths, `notFound()` and observable redirects.
5. Delegation to the final widget/page, without testing the widget's internal
   implementation.

### 5.2 Observed pattern

```tsx
import Page from '../page'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('Not found')
  }),
}))

jest.mock('@/rest/next/NextServerRestClient', () => ({
  NextServerRestClient: jest.fn(),
}))

describe('API Keys Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the page for the authenticated engineer owner', async () => {
    const result = await Page({ params: Promise.resolve({ userSlug: 'john-doe' }) })

    expect(typeof result.type).toBe('function')
  })
})
```

### 5.3 Specific rules

- Keep `params` in the same shape used by the current App Router: `Promise.resolve(...)`.
- Mock only the immediate web edge of the page: `next/navigation`,
  `NextServerRestClient` and the `services` factories consumed by the page.
- Do not rewrite the widget's logic in page assertions; just confirm that
  the page reached the correct composition point.
- For `notFound()`, use the existing pattern of mocking `next/navigation` and making
  the test fail through a controlled exception.

## 6. Pattern for Real Flow Tests with Playwright

Use Playwright when coverage depends on the published route, the real browser
and the interaction between SSR, hydration, client-side requests and asynchronous events.

### 6.1 What to validate

1. Initial rendering of the real route.
2. HTTP requests triggered by the page.
3. Progressive UI states and visible messages.
4. Client-side effects based on events or test-only bridges.
5. Observable public contracts, such as links, loading and success messages.

### 6.1.1 Mandatory navigation

Every real browser flow suite must contain at least one observable
navigation test. The test cannot validate the screen only through a direct
`page.goto()` to the route under test.

For protected routes, the mandatory minimum coverage is:

1. prepare an authenticated session with `ServerMock(page)`;
2. open a protected source route, such as `/space`;
3. trigger a visible link or control of the application to reach the route under
   test;
4. confirm the final URL with `expect(page).toHaveURL(...)` and validate the
   route's main content;
5. open the route under test without a session and confirm the redirect to login,
   including the return route when that contract exists.

When the route is public, the test must cover the most relevant entry or exit
navigation of the flow, such as a link to the route, a return after a completed
action or an error redirect.

Use `page.waitForURL(...)` or `expect(page).toHaveURL(...)` to synchronize
navigation. Do not consider the static existence of a link sufficient: the test
must click the control and observe the route change. Requests triggered
during the transition must be awaited with `page.waitForRequest(...)` or
`page.waitForResponse(...)` when they are part of the validated contract.

Co-located `page.tsx` composition tests with Jest do not need to open
a browser nor duplicate this flow; the requirement applies to the suites in
`apps/web/src/app/tests/**`.

### 6.2 Standard infra

- The suite must start the local web app via Playwright's `webServer`.
- Page requests must point to `/api/tests/server` during the suite.
- Each test must configure its own scenario via `ServerMock(page)`.
- `ServerMock(page)` must be treated as the canonical factory function for the mock server of the web integration tests.
- Do not duplicate local helpers such as `createServerMock(...)` in the suites; extract or reuse the shared implementation in `apps/web/src/app/tests/shared/mocks/ServerMock.ts`.
- Fake realtime events must be triggered through
  `window.__STARDUST_PROFILE_CHANNEL_MOCK__`.

### 6.3 Writing rules

- Group the suite by route with `test.describe('/route', ...)`.
- Prefer the suite's own local helpers to keep the scenario readable, such as:
  - `goto<Route>Page(...)`
  - `fillValid<Form>(...)`
  - `emit<Event>(...)`
- Use `page.waitForRequest(...)` and `page.waitForResponse(...)` when the test
  explicitly depends on the request cycle.
- Use `getByTestId`, `getByRole` and `expect(locator)` with auto-waiting.
- Avoid `waitForTimeout` as the main synchronization mechanism.

### 6.4 Observed example

```ts
test.describe('/auth/sign-up', () => {
  test('waits for realtime user creation before showing success', async ({ page }) => {
    await gotoSignUpPage(page)

    const signUpResponsePromise = page.waitForResponse((response) => {
      return (
        response.request().method() === 'POST' &&
        response.url().endsWith('/api/tests/server/auth/sign-up')
      )
    })

    await page.getByTestId('submit-button').click()
    await signUpResponsePromise

    await emitUserCreated(page, payload)

    await expect(page.getByTestId('sign-up-success-message')).toBeVisible()
  })
})
```

## 7. Rules for the Web Test-Only Infra

- Shared stateful mocks must live in `apps/web/src/app/tests/shared/mocks/`.
- Support factories shared across Playwright suites must live in `apps/web/src/app/tests/shared/mocks/` when they control test-only state or HTTP contracts.
- Browser-safe utils and global bridges must live in
  `apps/web/src/app/tests/shared/utils/`.
- Global types and shared support types must live in
  `apps/web/src/app/tests/shared/types/`.
- Web test-only routes must be protected by `MODE=testing`.
- When the app has a global middleware, the test-only infrastructure must explicitly
  escape from the authentication flows that would cause recursion.

## 8. What to Avoid

- Do not test an App Router page by internally rendering the whole widget with
  `render(...)` if the goal is to validate edge composition.
- Do not use Playwright to replace widget tests already covered in Jest.
- Do not depend on a real websocket, real Supabase realtime or a real backend when
  the suite has a defined test-only boundary.
- Do not couple the test to cosmetic layout details with structural CSS
  selectors.
- Do not share fake route state between scenarios.
- Do not create parallel versions of `ServerMock(page)` inside test files; evolve the shared factory to keep compatibility with all the integration suites.

## 9. Checklist

1. The test covers a real entry of the web app, and not just an isolated widget.
2. The file location follows `tests/page.test.tsx` or `src/app/tests/**`.
3. If it is an App Router page, `params`/`searchParams` were simulated in the real shape.
4. If it is Playwright, the scenario explicitly configured `ServerMock(page)`.
5. If the test needed a mock server, it reused the shared factory instead of duplicating a local implementation.
6. The test validated observable behavior of the route: rendering,
   redirect, request, message, link or loading.
7. The suite has at least one test that navigates from a source route/state
   to the route under test through a visible control.
8. For protected routes, the suite covers both authenticated navigation and the
   redirect on access without a session.
9. The test did not duplicate responsibility that already belongs to a
   unit-tested `widget` or `controller` in another layer.

## Tooling

- Web workspace: `pnpm --filter @stardust/web run test:unit`
- Web Playwright suite: `pnpm --filter @stardust/web run test:integration`
- Local quality: `pnpm --filter @stardust/web run check:types` and
  `pnpm --filter @stardust/web run check:code`
- General reference: `documentation/tooling.md`
