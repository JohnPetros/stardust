## Files

- documentation/overview.md
- documentation/architecture.md
- documentation/tooling.md
- documentation/rules/rules.md

## Mandatory reading of the rules before making changes

- Before creating or changing any file (code, tests, configuration or
  documentation), open `documentation/rules/rules.md`, identify the rules file
  whose "When to consult" matches the layer, the app or the task, and read that
  file in full. Do this before the first edit, not after a
  review points out the problem.
- This also applies to fixes for review comments, CI failures and small
  changes. A change that touches more than one layer requires reading the rules
  of each one, including the testing rules (for example, the Provision layer
  does not get dedicated `*.test.*` files).
- If no rule covers the change, record that in the report or in the PR instead
  of assuming a pattern.

## Pull Request language

- Every Pull Request must have its title and description written in PT-BR,
  including those created by agents. Keep in English only technical
  identifiers, file names, commands and code snippets.
- Follow the title and body contract of the `open-pr` skill. Do not use a
  Conventional Commit prefix or an emoji in the title.
- Dependabot PRs have their titles translated automatically by
  `.github/workflows/dependabot-pr-title.yaml`.
- PRDs (`documentation/prds/**`) and GitHub issues, including the drafts in
  `documentation/issues/**`, are also written in PT-BR, using the Portuguese
  section titles defined in `documentation/sdd.md`. All other project
  documentation is written in English.

## Grilling protocol

- When applying the grilling protocol, do not use question tools, such as
  `request_user_input` or `request_user_input_async`. Ask the questions
  directly in the conversation and wait for the answers before moving on with
  decisions that depend on them.

### Local environment and credentials

- For the local Supabase prepared with `db:seed`, use the fixed demo accounts in
  `apps/server/src/database/seeders/seed-accounts.json`. They are public
  fixtures exclusively for local use. Load them in manual Playwright flows with
  the `export-*-app-e2e-env.mjs --seed` scripts; do not copy values into tests.
- The seed Backoffice uses the UUID `00000000-0000-4000-8000-000000000002`;
  include it in `GOD_ACCOUNT_IDS` of the root and of the local Server.
- The rules for private credentials in `.env.local` below still apply to the
  services and to accounts that do not belong to the seed.

- For local development and real browser validations, always use the root
  `.env.local` as the source of environment variables and credentials.
- Load these variables with the corresponding export script before running
  commands or tools; never write credential values in tests, versioned
  documentation, persistent commands or logs.
- `.env.local` is ignored by Git and must stay only on the local machine.

## MCPS

- Context7 to fetch up-to-date information
- CodeGraph to explore symbols, relationships and call paths in the code
- Penpot MCP to inspect and edit the `stardust` design file
- Playwright CLI to inspect and validate real flows in the browser
- Supabase Dev to interact with the development Supabase project
- Supabase Prod to interact with the production Supabase project

### CodeGraph MCP

- Use CodeGraph before reading or editing code when you need to understand a
  symbol, flow, architecture, bug or the impact of a change. Query the relevant
  symbols or files in a single exploration to get the source code, the call
  paths and the blast radius.
- Treat the returned source code as a current read; do not repeat the
  exploration with `grep` or by reading the same files. Use direct reading for
  files the index does not cover or details the exploration did not show.
- If the project is not indexed, use the local navigation and reading tools;
  do not initialize the index without a request.

### Playwright CLI

- Use the Playwright CLI for exploration, visual inspection, diagnosis and
  one-off tasks in a real browser, in addition to formal validations and
  repeatable tests.
- For versioned tests, use `pnpm --filter @stardust/web run test:integration <file>`
  or `pnpm exec playwright test ...` from `apps/web`.
- For an interactive session, use `pnpm exec playwright codegen <url>` from
  `apps/web` when it helps to discover locators or reproduce a flow. Do not use
  alternative browser automation tools in this project.

### Local Supabase as the default

- Use the **local Supabase** for development and to validate the application
  and the Server integrations.
- Before the Server integration tests, prepare the stack with:
  `pnpm --filter @stardust/server run db:test`.
- Use the **Supabase Dev** MCP only when the task requires validating or
  changing the remote project; the remote database does not replace the local
  validation of the application stack.
- For schema changes, keep the migrations versioned and validate the behavior
  on the local Supabase; sync the remote project only when the task workflow
  requires it.

## Playwright in the Backoffice

Use Playwright to validate the Backoffice in a real browser, including login
and at least one protected route. Do not consider the login screen enough to
declare the application functional.

### Prerequisites

- Start the local server and the Backoffice in separate terminals:

  ```bash
  pnpm --filter @stardust/server run dev
  ```

  ```bash
  pnpm --filter @stardust/backoffice run dev
  ```

- The project's development server uses `http://localhost:3334`.
  Confirm that `apps/backoffice/.env.local` contains:

  ```dotenv
  VITE_SERVER_APP_URL=http://localhost:3334
  VITE_CDN_URL=<url-do-cdn>
  VITE_WEB_APP_URL=http://localhost:3000
  ```

- If port `8000` is busy, start the Backoffice on another port and use that
  same port in the test's `baseURL`. Do not change the server URL to resolve a
  Backoffice port conflict.

- For your own accounts outside the seed, configure the credentials in the root
  `.env.local` and run the exporter without `--seed`:

  ```dotenv
  BACKOFFICE_APP_E2E_EMAIL=<email-da-conta-de-teste>
  BACKOFFICE_APP_E2E_PASSWORD=<senha-da-conta-de-teste>
  ```

  Load them in the terminal before starting Playwright. The command must be
  `source`d so that the `export`s remain in the current shell:

  ```bash
  eval "$(node ./scripts/export-backoffice-app-e2e-env.mjs --seed)"
  ```

  The `.env.local` file is ignored by Git; never put these credentials in
  tests, versioned documentation or logs.

### Mandatory flow

1. Open `http://localhost:8000/` (or the alternative port chosen).
2. Fill in the email and password fields using environment variables, never
   credentials written in the test or in the repository.
3. Click the `Login` button and wait for the navigation to `/dashboard` with
   `page.waitForURL`, instead of using only `waitForTimeout`.
4. Go to `/profile/users` in the same browser context to confirm that the
   session was persisted across protected routes.
5. Verify the presence of the `Usuários` heading ("Users", a UI string kept in
   PT-BR) and wait for the listing response.

Minimal example:

```ts
const backofficeUrl = "http://localhost:8000";
const page = await browser.newPage();

await page.goto(`${backofficeUrl}/`);
await page.getByLabel(/email/i).fill(process.env.BACKOFFICE_APP_E2E_EMAIL!);
await page
  .getByLabel(/senha|password/i)
  .fill(process.env.BACKOFFICE_APP_E2E_PASSWORD!);
await page.getByRole("button", { name: "Login" }).click();
await page.waitForURL("**/dashboard");

await page.goto(`${backofficeUrl}/profile/users`);
await page.getByRole("heading", { name: "Usuários" }).waitFor();
```

### Failure diagnosis

- On the happy path, confirm only the statuses of the essential endpoints:
  login `2xx`/`201`, `/auth/account` `200` and the protected route listing
  `2xx`.
- If this flow fails, record `console`, `pageerror`, `requestfailed` and the
  relevant responses to diagnose the cause.
- A `module is not defined` error in `stream-browserify` indicates an SSR/Vite
  bundle compatibility failure; investigate the server error before debugging
  authentication.
- An environment variable error must prevent the Backoffice from starting.
  Check `VITE_SERVER_APP_URL`, `VITE_CDN_URL` and `VITE_WEB_APP_URL` before
  opening the browser; do not proceed with the test if the initial validation
  fails.
- CORS errors usually indicate a mix of a local origin with the production API
  or an incorrect port. Confirm the browser origin and the API URL in the
  captured requests.
- After a fix, run the detectors defined in this file and repeat the affected
  happy path.

## Playwright in the Web App

The Web App has an integration flow separate from the Backoffice. These tests
use the `testing` environment, the application's own test server and backend
mocks; they do not use the real Backoffice account and must not point to
production.

### Execution

- Install the browser, if needed:

  ```bash
  pnpm --filter @stardust/web run test:integration:install
  ```

- Run all integration tests only when the user asks for the full suite:

  ```bash
  pnpm --filter @stardust/web run test:integration
  ```

- To investigate a failure, use `test:integration:debug` or
  `test:integration:ui`.

The `apps/web/playwright.config.ts` file automatically starts the Web App at
`http://127.0.0.1:3100`, waits for `http://127.0.0.1:3100/api/tests/server` and
loads `apps/web/.env.testing`. Do not manually start `next dev` or the API
server for this flow, since this can cause a port conflict and mix
environments.

### Authentication and mocks

- The authentication tests use `ServerMock` and deterministic data. The
  credentials present in `apps/web/src/app/tests/auth/sign-in.test.ts` are
  only test fixtures; they are not valid credentials for the real application.
- Use the `data-testid`s already defined in the components, such as
  `email-input`, `password-input` and `submit-button`, and wait on
  `page.waitForRequest`, `page.waitForResponse` or
  `expect(page).toHaveURL(...)`.
- To validate an authenticated flow, first register the responses of
  `/auth/account`, `/auth/sign-in`, `/auth/refresh-session` and of the screen's
  routes in `ServerMock`. Then confirm the navigation to `/space` or to the
  expected protected route.
- Do not use `BACKOFFICE_APP_E2E_*` in the Web App tests. These variables
  belong exclusively to the real Backoffice flow.

### Access to authenticated routes

It is possible to access authenticated routes in the Web App. In the
integration environment, do this by simulating the session, without depending
on a real account:

1. Clear the context and add the `@stardust:access-token` cookie for the
   `127.0.0.1` domain.
2. Register in `ServerMock` a `GET /auth/account` with
   `isAuthenticated: true`.
3. Also register all the responses that the protected route consumes, such as
   `/space/planets` or the challenge endpoints.
4. Navigate to the route and validate the URL and the visible content.

Example of an authenticated route:

```ts
await context.clearCookies();
await context.addCookies([
  {
    name: "@stardust:access-token",
    value: "web-e2e-test-token",
    domain: "127.0.0.1",
    path: "/",
  },
]);

await ServerMock(page).register([
  {
    method: "GET",
    path: "/auth/account",
    status: 200,
    body: { isAuthenticated: true },
  },
  {
    method: "GET",
    path: "/space/planets",
    status: 200,
    body: [],
  },
]);

await page.goto("/space");
await expect(page).toHaveURL(/\/space$/);
```

The test `apps/web/src/app/tests/challenging/assistant-history.test.ts`
contains a complete example of this pattern. To test the login itself, use the
flow of `apps/web/src/app/tests/auth/sign-in.test.ts`, which registers
`/auth/sign-in`, `/auth/account` and `/auth/refresh-session` in `ServerMock`
before navigating to `/space`.

### Authenticated visual inspection outside the suite

To visually verify a real page with Playwright, outside
`test:integration`, use the local Web App and API in separate terminals:

```bash
# terminal 1
pnpm --filter @stardust/server run dev
```

```bash
# terminal 2
pnpm --filter @stardust/web run dev
```

Then, in the Playwright browser:

1. Go to `http://localhost:3000/auth/sign-in`.
2. Fill in `email-input` and `password-input` with a real test account,
   provided through local variables; do not use the `ServerMock` fixtures.
3. Click `submit-button` and wait for the navigation to `/space` with
   `waitForURL`.
4. Go to `/space` or another protected route in the same browser context.
5. Visually confirm the page and verify that `GET /auth/account` and the
   screen's endpoints, such as `GET /space/planets`, return `2xx`.

In this flow, the Web App uses `http://localhost:3000` and the API uses
`http://localhost:3334`, according to `apps/web/.env.local`. Do not use
`apps/web/playwright.config.ts`, `/api/tests/server` or `ServerMock`, since
they belong exclusively to the integration tests.

For your own accounts outside the seed, configure the credentials in the root
`.env.local` and run the exporter without `--seed`:

```dotenv
WEB_APP_E2E_EMAIL=<email-da-conta-da-web-app>
WEB_APP_E2E_PASSWORD=<senha-da-conta-da-web-app>
```

Load them in the same terminal that starts the Playwright browser:

```bash
eval "$(node ./scripts/export-web-app-e2e-env.mjs --seed)"
```

In the default mode, the script fails if any variable is missing.
In `--seed` mode, it loads the fixed local fixtures. Do not reuse
`BACKOFFICE_APP_E2E_*`: the Backoffice and Web App accounts are independent.

## Mandatory manual verification rule for the Frontend

Every implementation that involves frontend, UI, client-side routes or
interaction with the browser must go through a manual happy-path smoke test in
a real browser, in addition to the automated tests.

- Start the frontend and the local services the screen depends on in separate
  terminals. For the Web App, use `apps/server` at `http://localhost:3334` and
  `apps/web` at `http://localhost:3000`; for the Backoffice, use the local
  server and the Backoffice as described in the specific section above.
- Authenticate when necessary, exercise the happy path of the changed
  functionality and confirm its main visible result and the essential
  endpoints `2xx`.
- Do not manually explore error, loading or recovery states. Do not consider
  the login screen alone enough when the functionality requires a protected
  route.
- In an approved run, record only the app/route, the result and the status of
  the essential endpoints. Capture console, `pageerror`, `requestfailed` and
  detailed responses only to diagnose an unexpected failure.
- Screenshots are only needed when the change affects the UI or when they help
  record a visual divergence.
- Use credentials only through environment variables and never write them in
  tests, versioned documentation or logs.
- After a fix, repeat the affected happy path, not the entire manual matrix.

If the login redirects back to `/auth/sign-in`, record `console`,
`pageerror`, `requestfailed` and `response` before trying another route. This
separates a visual failure of the page from an authentication, CORS or API
failure.

### Authentication diagnosis in Playwright

- A `2xx`/`201` on the login endpoint does not prove that the session was
  propagated to the application. After login, confirm `/auth/account` with
  `200`, the protected route and the endpoints it consumes with `2xx`.
- If the login API returns success but a later call shows
  `Conta não autorizada` ("Unauthorized account", a PT-BR error message)/`401`,
  do not automatically classify this as an invalid credential. Separate login,
  cookies, `Authorization` header, refresh, middleware and the later endpoint;
  record the method, path and status of each step without recording token or
  cookie values.
- In flows that use Server Actions, the `POST` observed by the browser may use
  the page URL and the `next-action`/RSC headers. Verify that the action
  completed without a premature `3xx` and that the page was not unmounted
  before the authenticated state or the visual transition was observed.
- For asynchronous visual states, validate the observable property — for
  example, computed style, attribute or text — with `waitForFunction` or an
  equivalent assertion; `locator.toBeVisible()` alone can pass while the
  element still has `opacity: 0`.
- If you need to confirm the API contract directly, use the local variables and
  keep tokens only in process memory. Do not print the token, the password, the
  contents of `.env.local` or sensitive response bodies.

### Diagnosis

- Validate that the requests are going to `/api/tests/server`, not to a local
  or production API.
- Preserve `127.0.0.1` in the `baseURL`; some tests validate return URLs with
  that exact origin.
- On intermittent failures, capture `console`, `pageerror`, `requestfailed` and
  `response`, keeping `trace: 'on-first-retry'` to obtain the trace without
  generating unnecessary artifacts on every run.
- After changing the Web App or its tests, run the detectors of this file and
  the affected Playwright scenarios with
  `pnpm --filter @stardust/web run test:integration <files>`. Run only the
  tests of the changed code and of the directly affected consumers; the full
  suite only runs when the user requests it, and the CI runs it independently.

## Error detectors

Run the detectors within the scope of the change; the CI runs the full suites.
Define the scope by the diff and by the real dependencies (changed workspaces
and direct consumers), not by similarly named files or by the touched app. A
presentation change in the Web does not require Server tests, and a change in
the Server with no observable effect in the browser does not require browser
tests.

- `pnpm run check:code -w <workspace>` and `pnpm run check:types -w <workspace>`
  for each changed workspace and for the affected consumers. The typecheck uses
  the workspace's entire project; do not pass files to `tsc`.
- `pnpm run test:unit -w <workspace> -- <test-files>`, with paths verified in
  the code. In the Web, additionally run
  `pnpm --filter @stardust/web run test:integration <files>` only for the
  affected journeys.
- Run only the tests of the code that changed and of the directly affected
  consumers. A full suite (`pnpm run test:unit`, `test:integration`,
  `test:coverage` and `check:coverage`) only runs when the user asks; the CI
  runs them. Do not widen the selection by impact inference (for example,
  because a route, session or root layout was touched): if widening seems
  necessary, record the dependency and the reason and ask first.
- An empty or skipped selection is not approval: confirm the count and the
  result.

In SDD workflows, also run the applicable sensors defined in
`documentation/sdd.md` and record in `evaluation.md` the commands run, the
files and scenarios, the counts and the results. The selection details are in
`documentation/tooling.md`, section "Scoped local execution".
