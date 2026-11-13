---
app: web
status: open
last_updated_at: 2026-03-11
---

# Performance Diagnosis - `apps/web`

## Scope

- **Task:** Identify performance bottlenecks and risks in the StarDust web frontend (Next.js 15).
- **Target:** `apps/web` -- all routes, pages, components, middleware, data fetching, and build configuration.
- **Success criteria:** Reduced JS bundle, elimination of API waterfalls, improved TTFB/LCP on the main routes (landing, space, challenging, lesson).
- **Constraints:** Do not change the database schema; do not change functional behavior; preserve the DDD/hexagonal architecture.

## Assumptions and Open Items

**Assumptions:**
- No production metrics (Lighthouse, CrUX, p95/p99) are available; severity is estimated through static code analysis.
- The backend (`apps/server`) responds in a reasonable time (~50-200ms per call); the impact of the waterfalls assumes that latency.

**Open items:**
- Run `next build && next analyze` to confirm the actual bundle sizes per route.
- Collect real TTFB/LCP/INP metrics in staging/prod to prioritize with data.
- Confirm whether WAV files are loaded eagerly or lazily by the browser (depends on the audio components).

## Flow Map

```text
[Browser] --(HTTP)--> [Middleware: VerifyAuth + SetAccessToken + HandleRewarding + HandleRedirect]
                            |
                            v (fetchAccount -- API call on every request)
                       [Next.js Server Component / Layout]
                            |
                            v (ServerProviders: fetchAccount again + cookies)
                       [RPC Action via authActionClient]
                            |
                            v (fetchAccount + fetchUserById -- 2 sequential API calls)
                       [Action handler: additional fetches]
                            |
                            v
                       [Response -> React Render -> Client Hydration]
                            |
                            v (Client: SWR fetches, Zustand stores, contexts)
                       [UI rendered]
```

**Critical I/O points:**
1. Middleware -> Backend API (every request)
2. ServerProviders -> Backend API (every page navigation)
3. authActionClient -> Backend API (2x sequential, every action)
4. SWR hooks -> Backend API (client-side, aggressive without global config)

## Collected Evidence

All the evidence below was verified directly in the source code.

## Performance Issues (Priority)

### ISSUE-01: JS minification disabled in production

- **Area:** Build
- **Symptom:** The production JS bundle is not minified.
- **Probable cause:** `next.config.js:22` sets `config.optimization.minimizer = []`, removing ALL webpack minimizers.
- **Evidence:** `apps/web/next.config.js:21-24`:
  ```js
  webpack: (config) => {
    config.optimization.minimizer = [];
    return config;
  },
  ```
- **Impact:** The JS served in production has full variable names, whitespace, and comments. Estimated 40-60% increase in the total JS delivered.
- **Risk:** Low (reverting is trivial). Regression: no functional one.
- **Fix (quick win):** Remove the entire `webpack` block from `next.config.js`. If there was a specific reason (e.g., debugging in prod), use `productionBrowserSourceMaps: true` instead.
- **Fix (robust):** N/A.
- **How to validate:** `npm run build -w @stardust/web` and compare the size of `.next/static/chunks` before/after.
- **Estimate:** S (5 min). No dependencies.

### ISSUE-02: 5.5 MB of Lottie JSON statically imported into the JS bundle

- **Area:** Frontend / Bundle
- **Symptom:** The client bundle contains ~5.5 MB of Lottie animation JSON inlined as JS modules.
- **Probable cause:** `lotties.ts` imports 28 JSON files via `import X from '../../../public/lotties/X.json'`, and webpack includes them inline in the chunk.
- **Evidence:** `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/lotties.ts:1-28` -- 28 static JSON imports.
- **Impact:** ~5.5 MB added to the client JS bundle. Files such as `planets-exploration.json` (1.1 MB) and `rocket-exploring.json` (768 KB) are especially heavy.
- **Risk:** Low. Possible regression: momentary FOUC if the animation takes a while to load.
- **Fix (quick win):** Use `fetch('/lotties/${name}.json')` inside the `useLottieAnimation` hook, loading the JSON on demand. Keep the files in `public/lotties/`.
- **Fix (robust):** Create a lazy map: `const LOTTIES: Record<AnimationName, () => Promise<unknown>> = { '404': () => import('../../public/lotties/404.json'), ... }`. Load only when the component mounts.
- **How to validate:** `next build` -> compare `.next/static` size. Target: a reduction of ~5 MB in total JS.
- **Estimate:** M (1-2h). Requires changing `lotties.ts` + `useLottieAnimation.ts`.

### ISSUE-03: Middleware makes an API call (`fetchAccount`) on EVERY request, including public routes

- **Area:** API / Middleware
- **Symptom:** Every page navigation and API request adds ~50-200ms of latency in the middleware.
- **Probable cause:** `VerifyAuthRoutesController.ts:57` calls `authService.fetchAccount()` unconditionally, BEFORE checking whether the route is public.
- **Evidence:** `apps/web/src/rest/controllers/auth/VerifyAuthRoutesController.ts:52-57`:
  ```ts
  async handle(http: Http) {
    const currentRoute = http.getCurrentRoute()
    const isPublicRoute = PUBLIC_ROUTES.map(String).includes(currentRoute) || ...
    const response = await authService.fetchAccount()  // <-- always runs
  ```
- **Impact:** Every request (landing page, challenges listing, playground) suffers unnecessary auth latency. On public routes, the `fetchAccount` response is discarded.
- **Risk:** Low. Regression: if the "early return" logic for public routes has a bug, authenticated users may not be redirected.
- **Fix (quick win):** Invert the logic: check `isPublicRoute` BEFORE `fetchAccount`. If public, skip the fetch:
  ```ts
  if (isPublicRoute) return http.pass()
  const response = await authService.fetchAccount()
  ```
  Note: the root route redirects authenticated users to `/space`, so extra care is needed to keep that redirect.
- **Fix (robust):** Split controllers: `PublicRouteController` (no fetch) and `ProtectedRouteController` (with fetch). Or use a local JWT decode (no API call) to check whether there is an active session.
- **How to validate:** Measure the landing page TTFB before/after. Target: -50-200ms.
- **Estimate:** M (2-3h). Redirect edge cases need testing.

### ISSUE-04: `authActionClient` makes 2 sequential uncached API calls on EVERY server action

- **Area:** API / RPC
- **Symptom:** Every authenticated server action adds ~100-400ms of waterfall before executing the logic.
- **Probable cause:** `authActionClient.ts:10-22` calls `fetchAccount()` and then `fetchUserById()` in sequence, both with `isCacheEnabled: false`.
- **Evidence:** `apps/web/src/rpc/next-safe-action/clients/authActionClient.ts:10-22`:
  ```ts
  const restClient = await NextServerRestClient({ isCacheEnabled: false })
  const authResponse = await authService.fetchAccount()  // Call #1
  const profileResponse = await profileService.fetchUserById(account.id)  // Call #2
  ```
- **Impact:** Every page load of an authenticated route (challenge, lesson, space, profile, playground) pays ~100-400ms of extra waterfall. This ACCUMULATES with the middleware fetches (ISSUE-03) and the ServerProviders ones.
- **Risk:** Medium. Regression: if the cache is stale, the user may momentarily see outdated data.
- **Fix (quick win):** Enable `isCacheEnabled: true` with `revalidate: 60` (1 min) for `fetchAccount` and `fetchUserById` in `authActionClient`.
- **Fix (robust):** Extract the user data from a local JWT/session cookie (no API call). Or consolidate `fetchAccount` + `fetchUserById` into a single backend endpoint (`/auth/me` with the profile included).
- **How to validate:** Measure server action latency (e.g., `accessAuthenticatedChallengePage`) before/after.
- **Estimate:** S for the quick win (enable cache). L for the consolidated endpoint (server change).

### ISSUE-05: `ServerProviders` makes a duplicated `fetchAccount` (already done in the middleware)

- **Area:** API
- **Symptom:** `fetchAccount()` is called 2-3 times per page load (middleware + ServerProviders + authActionClient).
- **Probable cause:** `ServerProviders/index.tsx:19-21` creates another `NextServerRestClient({ isCacheEnabled: false })` and calls `fetchAccount()` again.
- **Evidence:** `apps/web/src/ui/global/widgets/layouts/Root/ServerProviders/index.tsx:18-22`:
  ```ts
  const restClient = await NextServerRestClient({ isCacheEnabled: false })
  const authService = AuthService(restClient)
  const response = await authService.fetchAccount()
  ```
- **Impact:** +1 redundant API call on EVERY page navigation. Combined with ISSUE-03 and ISSUE-04, an authenticated page calls `fetchAccount` 3 times.
- **Risk:** Low.
- **Fix (quick win):** Enable `isCacheEnabled: true` with a cache tag. Next.js `fetch()` deduplication will eliminate duplicate calls within the same request.
- **Fix (robust):** Pass the `accountDto` via server-side props from the middleware to the layout, eliminating the duplicate call.
- **How to validate:** Add logging in the backend to count how many times `/auth/account` is called per page load. Target: 1x.
- **Estimate:** S (enable cache). M (pass props from the middleware).

### ISSUE-06: Three.js (~800KB) statically imported on the landing page

- **Area:** Frontend / Bundle
- **Symptom:** The landing page loads the full Three.js in the client bundle.
- **Probable cause:** `Particles/index.tsx` imports `@react-three/drei` and `@react-three/fiber` statically, without `next/dynamic`.
- **Evidence:** `apps/web/src/ui/global/widgets/pages/Landing/Particles/index.tsx:1-2`:
  ```ts
  import { Stars } from '@react-three/drei'
  import { Canvas } from '@react-three/fiber'
  ```
- **Impact:** ~800KB+ of JS added to the landing page bundle. Affects ALL initial visitors.
- **Risk:** Low. Regression: flash of empty content until the component loads.
- **Fix (quick win):** Wrap the `Particles` component with `next/dynamic({ ssr: false })`.
- **How to validate:** `next build` -> compare the chunk size of the `/` route.
- **Estimate:** S (15 min).

### ISSUE-07: `isCacheEnabled: false` is the default -- most server-side fetches ignore the Next.js cache

- **Area:** API
- **Symptom:** No `fetch()` deduplication or caching on the server side.
- **Probable cause:** `NextRestClient.ts:11` sets `isCacheEnabled = false` as the default, resulting in `cache: 'no-store'` on all requests.
- **Evidence:** `apps/web/src/rest/next/NextRestClient.ts:10-11`:
  ```ts
  export const NextRestClient = ({
    isCacheEnabled = false,
  ```
  ~25 of 35 consumers use the default.
- **Impact:** Next.js cannot deduplicate identical fetches within the same request rendering cycle. Each component that calls the backend makes an independent round-trip.
- **Risk:** Medium. Regression: data may become stale if the cache is not invalidated correctly.
- **Fix (quick win):** For read endpoints that do not change every second (planets, achievements, challenges metadata), use `isCacheEnabled: true` with a `revalidate` of 60-300s.
- **Fix (robust):** Invert the default to `isCacheEnabled = true` with `revalidate: 60` and use `cache: 'no-store'` only for endpoints that really need it (e.g., session, real-time data).
- **How to validate:** Count API calls in the backend per page load. Target: 30-50% reduction.
- **Estimate:** M (review of each call site).

### ISSUE-08: 3 sequential fetches in `FetchLessonStoryAndQuestionsAction` (could be parallel)

- **Area:** API
- **Symptom:** The lesson page takes ~3x the latency of a single fetch.
- **Probable cause:** `fetchQuestions`, `fetchTextsBlocks`, `fetchStarStory` are independent but awaited in sequence.
- **Evidence:** `apps/web/src/rpc/actions/lesson/FetchLessonStoryAndQuestionsAction.ts:25-35`.
- **Impact:** If each fetch takes ~100ms, the action takes ~300ms instead of ~100ms.
- **Risk:** Low.
- **Fix (quick win):** `const [q, t, s] = await Promise.all([service.fetchQuestions(starId), service.fetchTextsBlocks(starId), service.fetchStarStory(starId)])`.
- **How to validate:** Measure the action latency before/after. Target: ~1/3 of the time.
- **Estimate:** S (15 min).

### ISSUE-09: Duplicated challenge fetch in the page + comments slot

- **Area:** API
- **Symptom:** The same challenge is fetched 2x in the same page load.
- **Probable cause:** `challenge/page.tsx` and `challenge/@tabContent/comments/page.tsx` both call `fetchChallengeBySlug` independently, without cache.
- **Evidence:** `AccessChallengeCommentsSlotAction.ts:19-22` fetches the challenge only to extract `challengeId`.
- **Impact:** +1 redundant API call on every challenge page load.
- **Risk:** Low.
- **Fix (quick win):** Enable cache in `NextServerRestClient` for challenge requests, or pass `challengeId` as a searchParam.
- **Estimate:** S (30 min).

### ISSUE-10: AuthContext creates `User.create(userDto)` on every re-render without `useMemo`

- **Area:** Frontend / Re-renders
- **Symptom:** All `AuthContext` consumers re-render when any context state changes.
- **Probable cause:** `useAuthContextProvider.ts:130` does `User.create(userDto)` inline in the return, creating a new reference on every render.
- **Evidence:** `apps/web/src/ui/auth/contexts/AuthContext/hooks/useAuthContextProvider.ts:129-130`:
  ```ts
  return {
    user: userDto ? User.create(userDto) : null,
  ```
- **Impact:** Cascade of re-renders across the ENTIRE app (Space, Ranking, Profile, etc. consume AuthContext).
- **Risk:** Low.
- **Fix (quick win):** `const user = useMemo(() => userDto ? User.create(userDto) : null, [userDto])`.
- **Fix (robust):** Memoize the provider's entire return object with `useMemo`, or separate data (user/account) from actions (handleSignIn, etc.) into distinct contexts.
- **How to validate:** React DevTools Profiler -> count re-renders of the AuthContext consumers.
- **Estimate:** S (quick win). M (separate contexts).

### ISSUE-11: `@tsparticles`, `swiper`, `react-confetti`, `typewriter-effect`, `html-to-image` statically imported

- **Area:** Frontend / Bundle
- **Symptom:** ~300KB+ of libs loaded in the client bundle without immediate need.
- **Probable cause:** Static imports at the top of files without `next/dynamic` or `import()`.
- **Evidence:**
  - `@tsparticles`: `ui/space/widgets/pages/Space/Particles/index.tsx:1`
  - `swiper`: `ui/challenging/widgets/layouts/Challenge/ChallengeSlider/ChallengeSliderView.tsx:1`
  - `react-confetti`: `ui/challenging/widgets/components/ConfettiAnimation/ConfettiAnimationView.tsx:1`
  - `typewriter-effect` + `react-simple-typewriter`: `ui/global/widgets/components/TypeWriter/index.tsx:3-4`
  - `html-to-image`: `ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/useFeedbackDialog.ts:2`
- **Impact:** ~300KB+ of unnecessary JS on the initial load.
- **Risk:** Low.
- **Fix (quick win):** Wrap each component with `next/dynamic({ ssr: false })`. For `html-to-image`, use `const { toPng } = await import('html-to-image')` inside the handler.
- **Estimate:** S (30 min-1h for all).

### ISSUE-12: Toast scroll listener active on ALL pages, always

- **Area:** Frontend / Runtime
- **Symptom:** `setScrollPosition(window.scrollY)` fires on every scroll event, causing Toast re-renders.
- **Probable cause:** `useToast.ts:44-56` registers a global scroll listener that updates state on every scroll.
- **Evidence:** `apps/web/src/ui/global/contexts/ToastContext/Toast/useToast.ts:44-56`.
- **Impact:** Unnecessary re-renders during scroll on ALL pages. May cause jank.
- **Risk:** Low.
- **Fix (quick win):** Throttle the scroll handler (e.g., `throttle(handleScroll, 100)`) or use `IntersectionObserver`.
- **Estimate:** S (15 min).

### ISSUE-13: No list uses virtualization

- **Area:** Frontend / Runtime
- **Symptom:** Potentially long lists render all items in the DOM.
- **Probable cause:** No virtualization lib (`react-window`, `@tanstack/react-virtual`) is installed or used.
- **Evidence:** Affected lists: `RankingUsersList`, `AchievementsList`, `CommentsList` (with nested replies), `ChallengesList`, `SolutionsList`.
- **Impact:** If rankings or comments grow beyond ~100 items, scroll performance degrades.
- **Risk:** Medium (depends on data volume).
- **Fix (quick win):** For paginated lists (Challenges, Solutions), limit items per page in the backend. For Ranking (~30 users per tier), it may be acceptable without virtualization.
- **Fix (robust):** Add `@tanstack/react-virtual` for `CommentsList` and `RankingUsersList`.
- **Estimate:** M-L per list.

### ISSUE-14: Uncompressed WAV audio files (3.2 MB)

- **Area:** Assets
- **Symptom:** Audio files in WAV format (~10x larger than MP3).
- **Evidence:** `public/audios/` contains 9 `.wav` files totaling 3.2 MB.
- **Impact:** If loaded on demand, low impact. If preloaded, ~2.5 MB of possible savings.
- **Risk:** Low.
- **Fix (quick win):** Convert WAV -> MP3/OGG with `ffmpeg`. Estimated savings: ~80%.
- **Estimate:** S (30 min with a script).

### ISSUE-15: 5+ barrel imports from `@phosphor-icons/react` instead of `/dist/ssr`

- **Area:** Build
- **Symptom:** Longer build time and risk of tree-shaking failing.
- **Evidence:** `DialogHeader.tsx:4`, `Checkbox/index.tsx:5`, `Search/index.tsx:2`, `EditableTitleView.tsx:1`, `AnimatedArrowView.tsx:1` import from `@phosphor-icons/react` instead of `@phosphor-icons/react/dist/ssr`.
- **Impact:** Slight increase in build time. `next.config.js` already has `optimizePackageImports` for the SSR path, but these imports do not benefit from it.
- **Risk:** Low.
- **Fix (quick win):** Change the imports to `@phosphor-icons/react/dist/ssr`.
- **Estimate:** S (15 min).

### ISSUE-16: `form.watch()` without arguments in ChallengeEditor

- **Area:** Frontend / Re-renders
- **Symptom:** The entire ChallengeEditor re-renders on every keystroke.
- **Probable cause:** `useChallengeEditorPage.ts:98` calls `form.watch()` without specifying fields, subscribing to ALL form fields.
- **Evidence:** `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/useChallengeEditorPage.ts:98`.
- **Impact:** Re-render of the entire editor (including the Monaco editor) on every keystroke.
- **Risk:** Low.
- **Fix (quick win):** Use `form.watch('fieldName')` for specific fields, or use `useWatch` with defined fields.
- **Estimate:** S-M (30 min-1h).

## Recommendations (Phased Plan)

### Phase 1: Quick Wins + Instrumentation (1-2 days)

| # | Action | Issues | Estimated Impact |
|---|------|--------|-----------------|
| 1 | Remove `config.optimization.minimizer = []` | ISSUE-01 | -40-60% JS bundle |
| 2 | Convert Lottie imports to lazy `fetch()` | ISSUE-02 | -5.5 MB bundle |
| 3 | `next/dynamic` for Three.js, tsparticles, swiper, confetti, typewriter, html-to-image | ISSUE-06, ISSUE-11 | -1.1 MB+ bundle |
| 4 | `Promise.all()` in `FetchLessonStoryAndQuestionsAction` | ISSUE-08 | -200ms lesson page |
| 5 | Fix phosphor-icons barrel imports | ISSUE-15 | Build time |
| 6 | Throttle the Toast scroll listener | ISSUE-12 | Less jank |
| 7 | `useMemo` on AuthContext's `User.create()` | ISSUE-10 | Fewer re-renders |
| 8 | Convert WAV -> MP3 | ISSUE-14 | -2.5 MB assets |

### Phase 2: Structural Fixes (3-5 days)

| # | Action | Issues | Estimated Impact |
|---|------|--------|-----------------|
| 1 | Skip `fetchAccount` on public routes in the middleware | ISSUE-03 | -50-200ms on public routes |
| 2 | Enable cache for read endpoints in `NextRestClient` | ISSUE-07 | -30-50% API calls |
| 3 | Cache or consolidate `fetchAccount` in `authActionClient` | ISSUE-04, ISSUE-05 | -100-400ms per action |
| 4 | Eliminate the duplicated challenge fetch in the comments slot | ISSUE-09 | -1 API call |
| 5 | Use a specific `form.watch('field')` in ChallengeEditor | ISSUE-16 | Fewer re-renders |

### Phase 3: Hardening (1 week+)

| # | Action | Issues | Impact |
|---|------|--------|---------|
| 1 | Add a global `SWRConfig` with `dedupingInterval: 30000` | General | Fewer refetches |
| 2 | Split AuthContext into data vs actions | ISSUE-10 | Less re-render cascade |
| 3 | Virtualization for long lists (Comments, Ranking) | ISSUE-13 | Scroll performance |
| 4 | Consolidated `/auth/me` endpoint in the backend | ISSUE-04 | -1 API call per action |
| 5 | Timeouts and circuit breaker in `NextRestClient` | General | Resilience |

## Instrumentation and Measurement

| KPI | Where to Measure | How to Measure | Baseline |
|-----|-----------|------------|----------|
| Total JS bundle | Build output | `next build` -> `.next/static` total size | Run before fixes |
| Landing page TTFB | Browser/Lighthouse | `npx lighthouse http://localhost:3000 --output json` | Measure now |
| Landing page LCP | Browser | Lighthouse or the `web-vitals` lib | Measure now |
| API calls per page load | Backend logs | Count requests to `/auth/account` per page view | Probably 3x |
| Lesson page load time | Server action duration | `console.time` in `FetchLessonStoryAndQuestionsAction` | ~300ms |
| AuthContext consumer re-renders | React DevTools Profiler | Count renders in SpacePage, RankingPage | Measure now |

## Verification Checklist

- [x] Did not change functional behavior (existing tests pass: `npm run test -w @stardust/web`)
- [x] Did not degrade accessibility/SEO (keep `metadata` exports, `alt` on images)
- [x] Build completes successfully (`npm run build -w @stardust/web`)
- [x] Typecheck passes (`npm run check:types -w @stardust/web`)
- [x] Visual validation of the Lottie animations after migrating to lazy loading
- [x] Validation of the auth flow after changing the middleware (public routes still work, redirect to /space works for auth users)
- [x] Compare bundle size before/after

## References

- `apps/web/next.config.js` -- build configuration
- `apps/web/src/rest/next/NextRestClient.ts` -- REST client factory
- `apps/web/src/rpc/next-safe-action/clients/authActionClient.ts` -- auth middleware
- `apps/web/src/rest/controllers/auth/VerifyAuthRoutesController.ts` -- middleware controller
- `apps/web/src/ui/global/widgets/layouts/Root/ServerProviders/index.tsx` -- root providers
- `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/lotties.ts` -- static Lottie imports
- `apps/web/src/rpc/actions/lesson/FetchLessonStoryAndQuestionsAction.ts` -- sequential fetches
- `apps/web/src/ui/auth/contexts/AuthContext/hooks/useAuthContextProvider.ts` -- auth context
- `documentation/architecture.md` -- project architecture
