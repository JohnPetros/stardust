---
app: web
status: closed
last_updated_at: 2026-03-11
---

## Executive Summary

- Total findings: 6 (Critical: 0 | High: 2 | Medium: 3 | Low: 1 | Info: 0)
- Highest-risk area: authentication/redirection boundary in the REST/RPC layer of `apps/web`
- Recommended immediate action: fix the middleware's `fail-open` and block external redirects via `redirect_to`

---

## Findings

### [ISSUE-01] Authentication middleware fails open

- **Severity:** High
- **Layer:** rest
- **File:** `apps/web/src/middleware.ts` (line 35)
- **Description:** the middleware's controller chain is protected by a `try/catch` that lets the request through with `NextResponse.next()` on any exception. This turns auth, parsing, or integration failures into a bypass of the protection edge.
- **Evidence:**
  ```ts
  try {
    for (const controller of controllers) {
      const response = await controller.handle(http)
      if (response.isRedirecting) return response.body
    }
  } catch {
    return NextResponse.next()
  }
  ```
- **Impact:** a temporary failure in `VerifyAuthRoutesController`, `SetAccessTokenController`, or any middleware dependency may allow non-redirected access to routes that depend on this barrier to require a session.
- **Recommendation:** apply fail-closed for protected routes. In the `catch`, log the error and return a controlled redirect to login/error, letting `NextResponse.next()` through only for explicitly public routes.
- **Reference:** `documentation/rules/rest-layer-rules.md`
- **Status:** resolved

---

### [ISSUE-02] The `redirect_to` parameter allows open redirect

- **Severity:** Medium
- **Layer:** rest
- **File:** `apps/web/src/rest/controllers/global/HandleRedirectController.ts` (line 12)
- **Description:** the middleware accepts `redirect_to` as an arbitrary `string` and passes it directly to `http.redirect()`, without origin validation, allowlist, or restriction to relative paths.
- **Evidence:**
  ```ts
  const queryParams = http.getQueryParams()
  if (queryParams?.redirect_to) return http.redirect(queryParams?.redirect_to)
  ```
- **Impact:** an attacker can build URLs on the legitimate StarDust domain that redirect the user to external domains, facilitating phishing, chaining with social login, and abuse of trust.
- **Recommendation:** accept only relative internal routes or validate the destination against an allowlist of StarDust origins/paths before calling `http.redirect()`.
- **Reference:** `documentation/rules/rest-layer-rules.md`
- **Status:** resolved

---

### [ISSUE-03] Session cookie is derived from an untrusted incoming header

- **Severity:** Medium
- **Layer:** rest
- **File:** `apps/web/src/rest/controllers/auth/SetAccessTokenController.ts` (line 8)
- **Description:** any request that reaches `apps/web` with an `Authorization` header makes the middleware write the received token into an HTTP-only cookie, without validating the issuer, the format, or whether the token came from a trusted authentication flow.
- **Evidence:**
  ```ts
  const header = http.getHeader('Authorization')
  if (!header) return http.pass()

  const token = header.split(' ')[1]
  if (!token) return http.pass()

  http.setCookie(
    COOKIES.accessToken.key,
    token,
    COOKIES.accessToken.durationInSeconds,
  )
  ```
- **Impact:** the browser may persist an arbitrary token as the app's session, opening room for session fixation/confusion and inconsistent states between web and backend.
- **Recommendation:** remove this automatic promotion from header to cookie and remove `SetAccessTokenController` from the middleware. For handlers in `apps/web/src/app/api`, introduce a `NextApiRestClient` that receives the current request, looks for the token first in the `Authorization` header and then in the cookies, forwarding it only as a transient credential to the backend. Authentication cookies must continue to be issued only in trusted `sign-in`, `confirm-email`, or `refresh-session` flows.
- **Reference:** `documentation/rules/rest-layer-rules.md`
- **Status:** resolved

---

### [ISSUE-05] Internal errors are returned to the client with raw messages

- **Severity:** High
- **Layer:** rpc
- **File:** `apps/web/src/rpc/next-safe-action/clients/actionClient.ts` (line 7)
- **Description:** the global server actions client returns `AppError.message` directly to the frontend and, for unknown errors, builds a response with `error.message`. This exposes internal execution details instead of masking the failure. (The string `Erro interno do servidor: ...` in the snippet below is the user-facing PT-BR message, kept as in the code: "Internal server error: ...".)
- **Evidence:**
  ```ts
  handleServerError(error) {
    if (error instanceof AppError) {
      console.error('Action error message:', error.message)
      return error.message
    }
    console.error('Action error:', error)
    return `Erro interno do servidor: ${error.message}`
  }
  ```
- **Impact:** backend exception messages may reach toasts, screens, and client responses, revealing infrastructure details, internal rules, or unexpected states.
- **Recommendation:** standardize masking with user-safe messages and structured logging only on the server. For `AppError`, return reviewed business messages; for unknown errors, respond with generic text.
- **Reference:** `documentation/rules/rpc-layer-rules.md`
- **Status:** resolved

---

### [ISSUE-06] Authentication cookies do not explicitly define `secure` and `sameSite` hardening

- **Severity:** Medium
- **Layer:** rpc
- **File:** `apps/web/src/rpc/next/NextCall.ts` (line 32)
- **Description:** the central cookie setters define only `httpOnly`, `path`, and `maxAge`. The same pattern appears in `apps/web/src/rest/next/NextHttp.ts` in the `redirect()` and `send()` paths.
- **Evidence:**
  ```ts
  cookieStore.set({
    name: key,
    value,
    httpOnly: true,
    path: '/',
    maxAge: durationInSeconds,
  })
  ```
- **Impact:** the application does not make explicit the guarantees recommended for session cookies in an authenticated environment, reducing the defense against insecure transport and cross-site request scenarios.
- **Recommendation:** set `secure: true` in HTTPS environments and `sameSite: 'lax'` (or stricter when possible) in the central cookie emitters, keeping the configuration standardized at the edge.
- **Reference:** `documentation/rules/rpc-layer-rules.md`
- **Status:** resolved

---

### [ISSUE-07] Debug logs in production code record feedback payloads and URLs

- **Severity:** Low
- **Layer:** ui
- **File:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/useFeedbackDialog.ts` (line 230)
- **Description:** the feedback submission flow does `console.log` of the `uploadResponse`, the returned `filename`, and the final `screenshotUrl`. This data belongs to a flow that handles images captured from the user's screen.
- **Evidence:**
  ```ts
  console.log('uploadResponse', uploadResponse)

  if (uploadResponse.isSuccessful) {
    console.log('uploadResponse.body.filename', uploadResponse.body.filename)
    screenshotUrl = uploadResponse.body.filename
  }

  console.log('screenshotUrl', screenshotUrl)
  ```
- **Impact:** operational upload data is exposed in the browser console, which increases the leakage surface in shared environments and goes against the hardening expected for production.
- **Recommendation:** remove debug logs and keep only controlled/anonymized telemetry when really necessary.
- **Reference:** `documentation/rules/ui-layer-rules.md`
- **Status:** resolved

---

## Pending Items

- No open pending items for the `apps/web` scope.

## Scope Clarifications

- `redirect_to` is no longer legitimately used in the app; therefore, any remaining support must be treated as unnecessary surface.
- `apps/web` does not contain its own jobs in `apps/web/src/queue/jobs`; the job idempotency review does not apply to this app.

---

## Prioritized Recommendations


| #   | Action                                                                                                                                                                                   | Finding(s)       | Severity     | Effort  |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------ | ------- |
| 1   | Switch the middleware to fail-closed and handle auth exceptions with a safe redirect/control flow                                                                                        | ISSUE-01          | High         | S       |
| 2   | Block external redirects in `redirect_to` and accept only internal paths or a signed allowlist                                                                                           | ISSUE-02          | Medium       | S       |
| 3   | Remove `SetAccessTokenController` from the middleware and create `NextApiRestClient` for `apps/web/src/app/api`, using `Authorization` or cookie only as a transient request credential | ISSUE-03          | Medium       | S       |
| 4   | Standardize error masking in server actions and REST helpers, removing `error.message` from the client response                                                                          | ISSUE-05          | High         | M       |
| 5   | Harden cookie emitters with `secure` and `sameSite`, and remove debug logs from the feedback flow                                                                                        | ISSUE-06, ISSUE-07 | Medium / Low | S       |


---

## Post-Fix Verification Checklist

- [x] `npm run check:code -w @stardust/web` passes
- [x] `npm run check:types -w @stardust/web` passes
- [x] `npm run test -w @stardust/web` passes
- [x] No real environment variable exposed
- [x] No debug `console.log` in production code
- [x] Auth middleware applied on all affected routes

---

## Final Resolution

**Completion date:** 2026-03-11

### Resolved Items

| ID | Title | Approach Taken |
|----|--------|-------------------|
| SEC-01 | Authentication middleware fails open | The middleware's `catch` now logs the error and applies fail-closed for protected routes, with `401` for API routes and a controlled redirect to login for the others. |
| SEC-02 | The `redirect_to` parameter allows open redirect | Alternative approach: support for `redirect_to` was kept, but the redirect now only accepts relative internal paths and ignores absolute or protocol-relative URLs. |
| SEC-03 | Session cookie is derived from an untrusted incoming header | As per the original recommendation: `SetAccessTokenController` was removed from the middleware and the routes in `apps/web/src/app/api` started using `NextApiRestClient` to forward credentials only within the scope of the current request. |
| SEC-05 | Internal errors are returned to the client with raw messages | Alternative approach: the client keeps logging the `AppError` details on the server, but now always responds to the frontend with a safe, generic message. |
| SEC-06 | Authentication cookies do not explicitly define `secure` and `sameSite` hardening | As per the original recommendation: `NextCall` and `NextHttp` now define `sameSite: 'lax'` and `secure` centrally according to the environment. |
| SEC-07 | Debug logs in production code record feedback payloads and URLs | As per the original recommendation: the `console.log` calls in the feedback flow were removed from the affected widget. |

### Notes

All `@stardust/web` validations passed. During the full suite, `src/ui/auth/widgets/pages/SignIn/AnimatedHero/tests/AnimatedHeroView.test.tsx` still emits an `act(...)` warning in the Jest console, but with no test failure nor exposure to the end user.

---

## References

- `documentation/architecture.md`
- `documentation/rules/rules.md`
- `documentation/rules/web-application-rules.md`
- `documentation/rules/ui-layer-rules.md`
- `documentation/rules/rpc-layer-rules.md`
- `documentation/rules/rest-layer-rules.md`
- `documentation/rules/queue-layer-rules.md`
- `apps/web/src/middleware.ts`
- `apps/web/src/rest/controllers/auth/SetAccessTokenController.ts`
- `apps/web/src/app/api`
- `apps/web/src/rest/controllers/global/HandleRedirectController.ts`
- `apps/web/src/rpc/next-safe-action/clients/actionClient.ts`
- `apps/web/src/rpc/next/NextCall.ts`
- `apps/web/src/rest/next/NextHttp.ts`
- `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/useFeedbackDialog.ts`
- `apps/web/src/queue/inngest/inngest.ts`
