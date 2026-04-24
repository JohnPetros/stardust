# Changelog

## 1.5.0 (2026-04-24)

* 📚 docs: add new bug report template for unexpected auth error and update existing bug report prompt with PRD and issue links (fcb957d7f)
* 💾 db: deduplicate categories in challenges_view using correlated subquery (e9e9d0795)
* 🤖 ai: add challenge creation rules and register profile toolkit (0e1c6bc0b)
* 📚 docs: update MCP spec with resolved contracts (211b8c41e)
* 🤖 ai: align test-case field names with schema (inputs) (e4b6270c7)
* 🤖 ai: create stateless transport per request in MCP server (c6ecbb934)
* 🤖 ai: return ChallengeDto from tools and use structured schema (2371da1d6)
* 🤖 ai: validate accountId required in MCP context (00f022a01)
* 📶 rest: remove generic try-catch in API key auth (86842cf21)
* 📚 docs: close MCP challenge management spec (3c1462a8a)
* 🤖 ai: add challenge management MCP toolkit and tools (b4fe7fe5c)
* 📶 rest: expose authenticated MCP route in Hono app (af24c42df)
* 💾 db: add api key hash lookup to supabase repository (6d735c128)
* 📮 validation: add MCP listing and profile schemas (c65b08b42)
* ✨ use case: add api key authentication flow (449811b79)
* 📑 interface: add hashed api key and MCP account contracts (446bfa5be)
* 📦 deps: upgrade mastra packages for MCP runtime (a69f05696)
* 📚 docs: refine planning and issue authoring guides (1e341afce)
* ⚙️ config: ignore documentation issue draft (0808e7b02)
* ⚙️ config: update .gitignore to rename opencode.jsonc to opencode.json for consistency (40f743850)
* ⚙️ config: update .gitignore to include prompt.md and documentation/plan.md (bd1c0fee5)
* 🐛 fix: address review comments on api key PR (967d820e3)
* 🎴 assets: refresh profile design workspace assets (dede0d2b8)
* ♻️ refactor: inline reporting router base path (231c93c55)
* 🖥️ ui: extract toast presentation component (53a4849ae)
* 📟 rpc: inline profile access action (a3cd82de4)
* 🧪 test: add api key coverage across layers (b19b78160)
* 🖥️ ui: add profile api key manager page (fc2312052)
* 📶 rest: add api key management routes and adapters (c1f1c9ad4)
* 🧰 prov: add api key secret provider (5e2aee784)
* 💾 db: add api key persistence mapping (7ff107fd3)
* 📮 validation: extend name schema length (21753678f)
* ✨ use case: add api key management flow (ac50533f9)
* 📑 interface: add api key contracts (b01ed79fe)
* 🌐 domain: add api key entity and auth errors (b1c322288)
* 📤 response: add list response helper (a4e847d94)
* 📚 docs: add api key completion and planning guidance (b4a8ffe50)
* ⚙️ config: update local agent and skill setup (ada76bbc7)
* docs: point implement-plan-prompt to documentation/plan.md as default entry point (1703daf56)
* docs: add global plan.md as active implementation plan entry point (a3cf390a8)
* docs: improve implement-plan-prompt with state detection, subagent-per-phase, divergências and live plan.md tracking (edb058d4c)
* ⚙️ config: add .claude/commands directory to sync-commands script for improved command organization (d08cd7aa3)
* 🖥️ ui: support attributes in assistant code blocks (be3e35dee)
* 🤖 ai: align code-block instruction and remove search logs (bb7c768b6)
* 🐛 fix: avoid redundant delete during guides reindex (aad12dd0f)
* 🧪 test: cover embeddings flow without pre-delete (addf86c26)
* ✨ use case: allow skipping delete before storing embeddings (6d53b7c3f)
* 🧪 test: update SearchGuidesTool expectation to topK 10 (4c5f8ca2d)
* ♻️ refactor: align assistant tooling and add manual guides embeddings reindex flow (f8e71b54c)
* ⚙️ config: add .claude/ to .gitignore to exclude Claude-related files from version control (37807707e)
* 📚 docs: update feature specs and close lesson code explanation (779970119)
* 🧪 test: add coverage for lesson code explanation flow (8932df167)
* 🖥️ ui: improve assistant rendering and code explanation retry flow (671c331fa)
* 📶 rest: simplify lesson code explanation route responses (77e39dbbb)
* 📶 rest: adopt AssistUserWorkflow contract in assistant endpoint (b574228b5)
* 🤖 ai: reorganize squads and workflows for manual and lesson agents (75b501ae4)
* 📚 docs: update examples in AI layer rules documentation for consistency (4d129a8d3)
* 📚 docs: document lesson code explanation architecture and spec (8ff867e45)
* 🖥️ ui: add code explanation dialogs to lesson snippets (7a8562f2b)
* 📶 rest: add lesson service methods for code explanation (2bc0f6d68)
* 📶 rest: add lesson code explanation endpoints (fec170562)
* 🤖 ai: add lesson code explanation agent workflow (817897986)
* 📮 validation: add lesson code explanation schemas (5f6d69b9d)
* ✨ use case: add daily code explanation quota use cases (0646591d1)
* 🐛 fix: correct spelling in challenge completion status and improve pagination response handling (9947ed4d7)
* 🐛 fix: enhance authentication middleware to correctly identify sign-in route and clear session tokens on failure (b0a95386f)
* 📚 docs: update bug report and plan prompt guidelines (d705ac57a)
* 📚 docs: consolidate sign-in reports and close studio redirection issue (795c2aa44)
* 🧪 test: add sign-in and sign-out token flow tests (832c7cd3d)
* 🐛 fix: improve studio sign-in session recovery flow (60c90ce0d)
* 📚 docs: update PR prompt formatting and clarify issue linking guidelines (8bf5d75b9)
* 🗃️ ftree: replace legacy web design export files (142377b84)
* 💾 db: refresh generated supabase database typings (6d0484994)
* 📚 docs: tighten testing scope and conclude-spec workflow (dec5ece15)
* 🧪 test: add ai tools coverage for web and server (8597d6faa)
* ⚙️ config: remove web sentry setup and adjust telemetry flow (aeac49e10)
* 🖥️ ui: render mdx paragraphs with valid structure (ffa425e84)
* ♻️ refactor: standardize pagination and listing order contracts (4c95b830e)
* 🖥️ ui: implement challenge navigation sidebar progress flow (d99795bd2)
* ✨ use case: support additional instructions in challenge sources (1da81b28c)
* 📚 docs: normalize spec statuses and add sidebar specification (d6c941543)
* 📦 deps: add vaul drawer dependency for web (7fda79d63)
* 🖥️ ui: add challenge navigation sidebar drawer and filters (78a0c0909)
* 📶 rest: update challenging clients for sidebar filters and progress (2c93310db)
* 📶 rest: expose challenges sidebar progress endpoint (412487663)
* 💾 db: count public non-star challenges for sidebar (88077f54c)
* 🧪 test: update completion status default to all (501ce9f29)
* 📮 validation: add sidebar query schemas (2a9b7dae4)
* ✨ use case: add sidebar progress computation (d22de1603)
* 📑 interface: extend challenging contracts for sidebar progress (005e99716)
* 🏷️ type: align challenge completion status with all (e9db63ea6)

## 1.4.3 (2026-04-02)

* 🖥️ ui(web): add loading fallback for MonacoEditor in TextEditorView (7a43b6764)
* 🖥️ ui(web): add mdx paragraph widget to prevent invalid nesting (02f5d4329)
* ♻️ refactor: lazy load inngest broker client (38463caa9)
* 🖥️ ui: lazy load editor and fallback telemetry errors (1dbfb8501)
* ⚙️ config: remove sentry integration from web app (d5d988087)
* 🧪 test: update challenge ID handling in GetChallengeDescriptionTool tests (f9203a24e)
* 🧪 test: add web ai tool coverage for guide and challenge helpers (7466a0506)
* 📚 docs: restrict test scope and add queue handler guidance (186fcbc5e)
* 📚 docs: close challenge source additional instructions spec and update prd (62bad825a)
* 🧪 test: add server handler coverage for challenging tools and controllers (c3aa8e920)
* 🧪 test: verify studio challenge source additional instructions behavior (bed83a9f0)
* 🧪 test: cover additional instructions in challenge source use cases (f90b251fe)
* 🤖 ai: align mastra challenge source schema and prompt context (33ba8ecf4)
* 🖥️ ui: add additional instructions field to challenge source flows (b2146faa2)
* 📶 rest: propagate additional instructions through source handlers and clients (151f9af2e)
* 💾 db: map and persist additional instructions for challenge sources (d201107ec)
* 📮 validation: accept optional additional instructions in source schema (e0f1c1301)
* ✨ use case: handle additional instructions in source create and update (e913c001e)
* 📑 interface: extend challenge source service signatures (34935bf34)
* 🏷️ type: add additional instructions to challenge source dto (b6a55cc84)
* 🌐 domain: persist additional instructions in challenge source entity (18bbf1a45)
* 🧪 test(studio): update regex in ChallengeSourceForm test for valid URL message (11afa3882)
* 🖥️ ui(studio): implement useFeedbackReportsPage hook for managing feedback reports with pagination and filtering (f7bed0cb5)
* 📟 rpc(web): add actionClient and authActionClient for handling server actions and authentication (c9f5e64c2)
* 🐛 fix: remove actionClient and authActionClient implementations and tests (00dcad0f5)
* 🖥️ ui(studio): enhance styling and structure in ContentView, HeaderView, and SidebarView components (02cf93083)
* 🏎️ ci: remove push trigger from Heroku CD workflow (f755481db)
* 🐛 fix(studio): handle optional chaining for selectedQuestion in quiz editors (4f301f9b7)
* 🐛 fix(web): return error message instead of generic response on action failure (a0a2d2db2)
* ♻️ refactor(server): remove unnecessary blank line in SignInWithGoogleAccountController (03b3e7be4)
* 🐛 fix(server): enhance logging for returnUrl in SupabaseAuthService and SignInWithGoogleAccountController (72675f1dc)
* 🐛 fix(server): add logging for returnUrl in SignInWithGoogleAccountController (1b2f558f6)
* 🐛 fix(lsp): refine DeleguaErro type by adding ErroInterpretadorInterface and improving import structure (4b40ea212)
* 📦 deps(lsp): update @designliquido/delegua to version 1.15.3 in package.json (4335bee13)
* 📚 docs: clarify the objective of the anti-pattern registration prompt for better understanding (54bd3bffc)
* 📦 deps: update @designliquido/delegua to version 1.15.2 in package-lock.json and package.json (da6be871d)
* 🏎️ ci: enable release types in Heroku CD workflow (f1946d8be)
* 📚 docs: update spec prompt to include GitHub milestone and issue links (8bc83f27b)
* 📚 docs: add issue link to challenges navigator widget specification (a1de0f583)
* 📚 docs: refine specification workflow prompts (c12ae4bb0)
* 📚 docs: document challenge navigation delivery (b37b2cd75)
* 🐛 fix: remove retry user creation debug logging (e9b42e70d)
* ♻️ refactor: extract challenging widget views and hooks (dbdf83749)
* 🖥️ ui: add challenge navigation controls and guard (3ee2a3a9c)
* 📟 rpc: hydrate challenge navigation on page access (6c0fd94f3)
* 📶 rest: add challenge navigation service calls (a4473684d)
* 📶 rest: expose challenge navigation endpoint (d004566fd)
* 💾 db: resolve adjacent challenge slugs by creation order (2e4d40b90)
* ✨ use case: add challenge navigation lookup (6346a037d)
* 🌐 domain: add challenge navigation structure (b5a89f7d6)
* 📑 interface: add challenge navigation contracts (30dc18769)
* 📚 docs: add story text blocks editor spec updates (347fc7a07)
* ⚙️ config: ignore lockfile warning in web jest setup (b54e89fca)
* 🧪 test: stabilize lesson story and auth ui tests (38e9da6e3)
* 🖥️ ui: replace lesson story editor with text blocks workflow (74b02b85c)
* 📶 rest: add lesson text blocks update client method (af2332a74)
* 📶 rest: expose endpoint to update lesson text blocks (3f8542403)
* 💾 db: persist full text blocks collection updates (d7bcfb52e)
* 📮 validation: add lesson text block update schema (3cb47b6d2)
* ✨ use case: add update text blocks flow and coverage (3822c6b55)
* 🏷️ type: extend lesson text block contracts for update flow (6a19b0be6)
* 🐛 fix: comment out Speaker component in ContentView to prevent rendering issues (a70012923)
* 🐛 fix: remove error handling and logging from InngestBroker publish method (26377e7d1)
* 🐛 fix: add logging for clientInput in signUpWithSocialAccount and await action handling in accessChallengeEditorPage (093ea817e)
* 🐛 fix: add error state logging in useSignUpWithSocialAccountAction (62340d3d2)
* 🐛 fix: add console.log for accessToken and refreshToken in useSocialAccountConfirmationPage (02c3ffab6)
* 🐛 fix: refactor signUpWithSocialAccount to accept tokens as parameters (9c7a244dd)
* 🐛 fix: add console.log for isNewAccount in useSocialAccountConfirmationPage and clean up dependencies in useEffect (ca428c916)
* 🐛 fix: restore error handling for signUpResponse and update AccountSignedInEvent publishing logic (d527fbf30)
* 🐛 fix: enhance error handling and logging in InngestBroker publish method (349443ef0)
* 🐛 fix: add error handling and logging to InngestBroker publish method (1d2a3adc1)
* 🏎️ ci: update GitHub Actions workflow to trigger on push to main branch (ad0aa435e)
* 📟 rpc(web): add console.log for signUpResponse and comment out production broker.publish (403d1d9fe)
* 📚 docs: standardize section headings and improve clarity in PR conversation resolution prompt (c690af555)
* 📮 validation: update urlSchema (7d71cb8cb)
* 📚 docs: update feedback reports spec and prompts documentation (a8e84e6b1)
* 🖥️ ui: update Code component and FeedbackReportsPage hook (9ad6404ba)
* 🧪 test: update ChallengeSourcesPageView test file (b2cf95021)
* 📚 docs: remove obsolete bug report for shadcn theme modals (ef75959d7)
* 📚 docs: add studio-theme global features documentation (cfe5b992b)
* 📮 validation: add urlSchema and update challengeSourceSchema (7b92a8151)
* 🖥️ ui: update root app and calendar component (6e45d979f)
* 🖥️ ui: update reporting and space page hooks (d53a25619)
* 🖥️ ui: update lesson quiz page components (0c2123e82)
* 🖥️ ui: update global widgets hooks and components (84e7c2a8e)
* 🖥️ ui: update ChallengeSources form, page and hooks (0f5c3c9f5)

## 1.4.2 (2026-03-15)

* 🐛 fix: remove console.log with sensitive data and fix duplicated spec entry (071a30e8a)
* 📚 docs: add realtime rules documentation for event handling and integration (f8bb7a4e4)
* 📚 docs: mark retry user creation specification as closed (b1e511d66)
* 📚 docs: update retry user creation specification (dfdbb1cf0)
* 📶 rest: add retry user creation action and update queue job configs (bab3fe8df)
* 🖥️ ui: remove UserCreationPendingLayout and update auth confirmation pages (e7f487bdf)
* 🌐 domain: remove console.log statements from use cases (e0082850a)
* 📚 docs: add product requirements document and user creation retry specifications (1e3a7505f)
* 📚 docs: update CHANGELOG with recent changes (7d093217f)
* 📚 docs: remove resolved bug report and update job spec (0e7a384db)
* 📶 rest: improve Discord notification messages in Portuguese (9787c1dc9)
* 🌐 domain: update event payloads to use firstReachedTierId (4c8d3ac75)
* 🖥️ ui: refactor realtime layer to use ProfileChannel interface (2de5d4117)
* ⚙️ config: simplify middleware by extracting public routes to constants (fdd788c49)
* 🧪 test: update auth controller tests to use AccountSigned*Event (cdb40037a)
* 📶 rest: update auth controllers to use AccountSigned*Event (544b81998)
* 📟 rpc: update queue jobs to use AccountSigned*Event and firstReachedTierId (41bfcf653)
* 🌐 domain: rename firstTierId to firstReachedTierId in use cases (d4fe42866)
* 🌐 domain: rename auth events from UserSigned*Event to AccountSigned*Event (87abb9d4d)
* 📚 docs(studio): add product requirements document link for milestone 19 (fa70d8994)
* 🖥️ ui(studio): update branding text to 'Studio' (6299e5c17)
* 🖥️ ui(studio): update branding text to 'Studio Deployado' (089a1deed)
* 🏎️ ci(studio): remove build job from CI workflow to streamline process (357a618c6)
* 🏎️ ci(studio): change dependency installation from npm ci to npm install in CI workflow (684aeeb45)
* ⚙️ config(studio): add custom Rollup warning handler to Vite configuration (b4865702f)
* 📦 deps(studio): remove vite-plugin-environment from package.json and package-lock.json (a057c5c3d)
* 📦 deps(studio): update vite version to 6.4.1 in package.json and package-lock.json (8fd94e34b)
* 📦 deps(studio): downgrade @react-router/dev to version 7.5.3 in package.json and package-lock.json (636f71615)
* ⚙️ config(studio): refactor Vite configuration to use a plugins array for better readability (118e9979d)
* 📦 deps(studio): remove unnecessary resolved and integrity fields from package-lock.json and add vite override in package.json (9bfe0d8e5)
* 📦 deps(studio): update vite version in package-lock.json to 6.3.5 (88740c62f)
* 📦 deps(studio): update vite version to 6.3.5 in package.json (a4739997f)
* 🐛 fix(studio): update react-router and related packages to version 7.13.1 in package.json and package-lock.json (0f3aab3e4)
* 🐛 fix: update import path for AppError in ValidationError.ts (deb16c422)
* 🖥️ ui: update UI components and hooks across studio (f99877638)
* 📚 docs: update AGENTS.md (7fb7d9359)
* ⚙️ config: update .gitignore (f49b0847d)
* 🐛 fix(studio): adjust CI workflow triggers and job dependencies (958bbf53c)
* 🏎️ ci: enhance GitHub Actions workflows for core, server, and web apps with codecheck, typecheck, tests, and build steps (630057803)
* 🏎️ ci: add GitHub Actions workflow for Studio app CI with codecheck, typecheck, tests, and build steps (e85059b1e)
* ♻️ refactor(studio): update route definitions by removing duplicate achievement route (072e1cc1c)

## 1.4.1 (2026-03-12)

* ♻️ refactor: streamline query parameter handling in HandleRedirectController (4b79b75eb)
* 📚 docs: correct cookie hardening terms in security report (d0393820b)
* ♻️ refactor: remove debug log from user unlock check (6b510215e)
* ♻️ refactor: simplify challenge reward completion branch (f478ba2ff)
* 🐛 fix: enforce safe redirect query param handling (fc15b1332)
* 🐛 fix: update mock implementations in Challenge tests to include result fields (2e4488223)
* 📚 docs: consolidate report prompts and archive wiki content (0d2ad4535)
* 🌐 domain: update recently unlocked star state transitions (11f849c81)
* 🐛 fix: remove debug logging from lottie loader fallback (aa04f5fc1)
* 💾 db: enforce inner join when loading planet stars (bc1093f5e)
* 🧪 test: stabilize async queries in sign up form tests (d077bc5c6)
* 🐛 fix: preserve reward flow for completed star challenges (9f41118d4)
* 🐛 fix: harden web auth boundary and mask internal errors (a656acebf)

## 1.4.0 (2026-03-10)

* 🐛 fix(web): align user created payload consumers (1cfb7b197)
* ✨ use case: orchestrate user creation workflows and progression events (1e3388ece)
* 🐛 fix(web): correct error message in useChallengeCodeEditorSlot test for consistency (2115d4924)
* 📚 docs: add PRD for user creation feature detailing requirements and user flow (af7a95980)
* 🏎️ ci: update GitHub Actions workflow to trigger on release events instead of push to main (81fb36826)
* 🐛 fix: enhance UpdateChallengeSourceController to include ChallengesRepository and update parameter handling (8c138ed04)
* ♻️ refactor: simplify UpdateChallengeSourceController instantiation and remove unused property mapping in SupabaseChallengeSourceMapper (74add88a9)
* 🐛 fix: improve error messages in ChallengeCodeEditor slot for clarity (e3b761f66)
* 📚 docs: update commit-code-prompt documentation for clarity and structure (733fa5fd9)
* 🌐 domain: update PlanetsFaker and StarsFaker (cd1814912)
* 📚 docs: add auto-scroll not working bug report (09bd65039)
* 🖥️ ui: update SpaceContext provider and tests (2ceebac80)
* 🖥️ ui: refactor SpaceContext hooks and update Space page components (9506f8484)
* 🧪 test: add SpaceContext tests and fakers (83cd1644c)
* 📚 docs: add auto-scroll not working bug report (74eeca996)
* 🐛 fix(server): add 'shouldIncludeStarChallenges' field to FetchChallengesListController schema for enhanced challenge filtering (e1f774284)
* ⚙️ config: disable sourcemap generation in tsup.config.ts for optimized build output (a8d44c63d)
* 🚚 cd: change deployment trigger from release to push on main branch for Heroku CD (339aeb4b6)
* 🐳 docker: refactor Dockerfile.web to use a multi-stage build with a base stage for improved organization (a87117836)
* 📚 docs: update console spec documentation (e992fe11b)
* 🧪 test: update CodeEditorToolbar and ChallengeCodeEditor tests (eb25d9445)
* 🖥️ ui: update CodeEditorToolbar and ChallengeCodeEditor components (f08769a83)
* ♻️ refactor: format UpdateChallengeSourceUseCase (684edf45f)
* 🧪 test: add onUpdateChallengeSource handler to ChallengeSourcesPageView tests (3e2416710)
* 📶 rest: implement UpdateChallengeSourceController and fix mapper (71209b5bd)
* 🌐 domain: add replace method to ChallengeSourcesRepository interface (858609608)
* 📚 docs: clarify optional environment section in bug issue template (51da78db9)
* 🐛 fix: update bug issue template (e53c1e6c7)
* 📚 docs: update challenge editor documentation (853d8e7c0)
* 📟 rpc: update DeleguaLsp (6907e5570)
* 🌐 domain: update Challenge entity (a67f570ce)
* 🖥️ ui: update ChallengeResult slot (4117b46a5)
* 🖥️ ui: add CodeEditorToolbar and Console components (b8c9b3618)
* 🖥️ ui: add ChallengeCodeEditor slot component (e773c59c0)
* ✨ use case: update PostChallengeUseCase with test (2d0fb18a3)
* 📚 docs: update resolve PR conversations prompt (57043280a)
* 🤖 ai: update challenging toolset and workflow (97a3ae95f)
* ⚙️ config: update copilot instructions (12246a5a7)
* 📤 response: update ChallengingService in studio app (188cc4b94)
* ⚙️ config: add copilot-instructions for GitHub Copilot (080ed80eb)
* 📚 docs: add specs for GetNextChallengeSourceTool and UpdateChallengeSource (3f91ef1dc)
* 📤 response: update ChallengingService in web app (7c81038cd)
* 🖥️ ui: update ChallengeSourceForm and ChallengeSourcesPageView (cf4c21859)
* 📮 validation: update challengeSourceSchema for source management (81525c0f9)
* 🤖 ai: add GetNextChallengeSourceTool to challenging toolset (ba55679de)
* 📶 rest: add UpdateChallengeSourceController endpoint (912d2ef7f)
* ✨ use case: add GetNextChallengeSource and UpdateChallengeSource use cases (abdcfc953)
* 💾 db: add SupabaseChallengeSourceMapper and repository (4a3b6595c)
* 🌐 domain: add ChallengeSource entity with DTO and faker (94ae2fc1d)
* 📚 docs: add PRD for Space Page with milestone link (855866cbd)
* ▶️ cr: resolve review comments on isNew flag implementation (2c2bcff45)
* ⚙️ config: update StorageMiddleware to use Supabase instance from HonoHttp (2f1dd4f31)
* 💾 db: refine intent parameter type in SupabaseFeedbackReportsRepository (6a6023fd2)
* 📚 docs: add new-challenge-flag spec and update PRD and prompt docs (31502310e)
* 🖥️ ui: add is-new filter to Challenges page and update ChallengeCard display (9f7b89724)
* 📶 rest: update ChallengingService to pass is-new filter param (29d29f9b1)
* 🎞️ queue: add ExpireNewChallengesJob and update challenging queue functions (80947928d)
* 🤖 ai: update GetChallengeProblemTool (87e7a3929)
* 📶 rest: update challenge controllers and router to support is-new filter (c4bc24900)
* 🧰 prov: update UpstashCacheProvider implementation (05310cf0e)
* 💾 db: update SupabaseChallengesRepository and mapper to support is-new flag (676695907)
* ✨ use case: add ExpireNewChallenges and update List/Post challenge use cases (a54886d8d)
* 📑 interface: update ChallengesRepository and CacheProvider contracts (cbd442f76)
* 🌐 domain: add is-new status to Challenge entity and related types (e940ac725)

## 1.3.1 (2026-03-07)

* 🐳 docker: update base image in Dockerfile.web from node:20.15.1-alpine to node:22-alpine for improved performance and compatibility (db5cee4b1)
* ⚙️ config: remove unused "noUnknownAtRules" rule from biome.json to streamline configuration (2adff93cc)

## 1.3.0 (2026-03-06)

* 📚 docs: remove detailed sections from Product Requirements Document for Challenge Creator Agent to enhance focus and include link to milestone (3ba737372)
* 📚 docs: remove extensive content from Product Requirements Document for Challenge Listing feature to improve clarity and focus (90dbf39f9)
* 📚 docs: remove outdated sections from Product Requirements Document for Challenge Layout feature to streamline content (ff3c990ed)
* 📚 docs: update Product Requirements Document for Challenge Code Editor feature to include link to milestone (a05b66ad6)
* 📚 docs: add Product Requirements Document for Challenges Navigation feature (59a21810c)
* 📚 docs: update PRD prompt to include mode detection and enhance clarity for prospective and retrospective features (919781a4b)
* 📚 docs: add comprehensive Product Requirements Document for Challenge Listing feature (af63889fa)
* 📚 docs: add comprehensive Product Requirements Document for Challenge Result Tab feature (63c2c0776)
* 📚 docs: add detailed Product Requirements Document for Challenge Layout feature (12164a343)
* 📚 docs: add comprehensive Product Requirements Document for Challenge Description feature (516960b4c)
* 📚 docs: add Product Requirements Document for Challenge Code Editor feature (a5d6f58b0)
* 🖥️ ui: enhance button formatting in ChallengeSourcesPageView for improved readability (71ddee2ca)
* 📚 docs: remove outdated documentation files for application, database, provision, queue, rest, and realtime layers (8459bb891)
* ♻️ refactor: address PR 353 review comments (1eafad86f)
* 📚 docs: refine conclude spec prompt workflow (9a07d8a10)
* 💾 db: align Supabase payload typings and feedback intent filter (d3e268617)
* 📚 docs: update changelog and prompts documentation (c25a33c45)
* 🧪 test: update auth router test (c8dd5437a)
* 🖥️ ui: update users table sidebar and star item components (06adf8654)
* ⚙️ config: update studio constants with cache and routes (3c28e9942)
* ✨ use case: add challenge sources management feature with CRUD operations (652a4ff2e)
* ♻️ refactor(web): update ChallengeSource to enforce non-null challenge property, enhance ChallengeSourcesFaker for better challenge handling (e5731f50b)
* 📶 rest(web): add fetchChallengeSourcesList, createChallengeSource, deleteChallengeSource, and reorderChallengeSources methods to ChallengingService (ce2e07129)
* 🐛 fix: update StorageMiddleware to use Supabase instance from HonoHttp for file verification (f0d8868cf)
* ⚙️ config: update .gitignore to include prompt.md and add a new folder for Terminal Paste Images (ed1e8e2e9)
* ✨ use case: export new challenge source use cases including List, Create, Delete, and Reorder functionalities (52c87dd00)
* 🧪 test: add unit tests for ListChallengeSourcesUseCase to validate pagination and response structure (8126573b6)
* 🧪 test: add unit tests for ReorderChallengeSourcesUseCase to validate error handling and source reordering logic (1950662ab)
* 🧪 test: add unit tests for DeleteChallengeSourceUseCase to verify error handling and successful deletion of challenge sources (8603983bd)
* 🧪 test: add unit tests for CreateChallengeSourceUseCase to validate error handling and source creation logic (1ed999381)
* ✨ use case: implement DeleteChallengeSourceUseCase for removing challenge sources with validation and error handling (09bf94c5c)
* ✨ use case: implement ReorderChallengeSourcesUseCase for reordering challenge sources with validation and error handling (6cd39a652)
* ✨ use case: add ListChallengeSourcesUseCase for paginated retrieval of challenge sources (1bd4f2841)
* ✨ use case: implement CreateChallengeSourceUseCase for creating challenge sources with validation and error handling (c65543684)
* 🌐 domain: add ChallengeSourceAlreadyExistsError and ChallengeSourceNotFoundError for error handling (ffe66f2ae)
* 🌐 domain: add ChallengeSourcesFaker for generating fake ChallengeSource data (0a998c522)
* 📑 interface: add ChallengeSourcesRepository for managing ChallengeSource entities (5807d89bc)
* 📑 interface: extend ChallengingService with ChallengeSource operations and update index exports (6a2a4aea2)
* 📑 interface: implement fetch, create, delete, and reorder operations for ChallengeSource in ChallengingService (f0e58b751)
* 🌐 domain: introduce ChallengeSource entity and ChallengeSourceDto for challenge management (636577c7f)
* 🌐 domain(core): add Url structure with validation and export it (2dd300217)
* 📚 docs: rename webAppUrl to stardustWebAppUrl (d2594c71d)
* 🐛 fix(core): format isPurchasable property initialization for better readability in Avatar entity (39b2b1207)
* 🐛 fix(core): streamline isPurchasable property initialization in Avatar entity (60fe4fc65)
* 🧪 test: remove Insignia entity tests as part of code cleanup (30bc07893)
* 🧪 test: enhance ListFeedbackReportsUseCase tests to validate request structure with object containment (760185908)
* 🐛 fix(core): update default purchasable status in Insignia entity to false (1fbe70d3c)
* 🐛 fix(server): improve insignia filtering logic in SupabaseInsigniasRepository to handle purchasable status (35b714e94)
* 📚 docs: update bug report for "God" insignia in shop page with improved filtering logic and documentation structure (9de9ee4b1)
* 📚 docs: add clarification on seeking user input for implementation doubts in PR conversation resolution prompt (90dbb8d89)
* ♻️ refactor(core): change intent type in FeedbackReportsListingParams to FeedbackIntent (19796bc60)
* 🧪 test: add shop controllers and domain entity tests (5edd5d67c)
* 📚 docs: update prompts for bug report and implementation (baf7cb0b6)
* 📶 rest: update storage middleware and insignias controller (886eb79de)
* 💾 db: add shop domain entities and repository updates (bc4e7532d)
* 🖥️ ui(web): refactor useAuthContextProvider to utilize useCallback and useMemo for improved performance and readability (a1e2e47e5)
* 🖥️ ui(web): refactor useToast to utilize useRef for scroll position and throttle scroll event handling (f527f7501)
* 🖥️ ui(web): optimize AuthContext provider with useMemo for improved performance (310c76849)
* 🖥️ ui(web): refactor CommentsListView to streamline loading state rendering (feaf89b88)
* 🖥️ ui: enable short-lived auth cache in root server providers (c31517e01)
* 📟 rpc: parallelize lesson loading and enable cached safe-action clients (d210c7889)
* 📶 rest: optimize auth route checks and default REST cache policy (e52d47dda)
* 🖥️ ui: optimize client-only loading for animations and visual widgets (e08ebdf5c)
* ⚙️ config: adjust web middleware and Next.js runtime settings (e8ec104e4)

## 1.2.0 (2026-03-04)

* 📚 docs: update star challenge selector specification (77ce1432e)
* 🖥️ ui: refine planet and challenge interface behavior (bd5b81969)
* 📟 rpc: adjust access challenge page action flow (9dd55bd2d)
* 📶 rest: update challenge routes and controller tests (64b247030)
* ✨ use case: refine challenge star selection flows (6cf88dbbb)
* 🌐 domain: rename challenge star error contract (9db5d7f70)
* 📚 docs: update prompts and add space management feature documentation (4cef273da)
* 🖥️ ui: add StarChallengeSelector component and update StarItem and Planets views (69d468e61)
* 🖥️ ui: update ChallengesList page on web app (9dcd9b1ac)
* 📶 rest: add star management methods to ChallengingService clients (9d8eb4d34)
* 📟 rpc: update AccessChallengePage action (8f28470d8)
* 📶 rest: add EditChallengeStar and RemoveChallengeStar controllers and routes (ecc059237)
* 💾 db: update Supabase repositories to support challenge star assignment (a171d436c)
* 📮 validation: add challenge star assignment schema (2d2a5d74a)
* 📑 interface: update ChallengingService with star management methods (41c50987c)
* 🧪 test: add tests for EditChallengeStar and RemoveChallengeStar use cases (957762554)
* ✨ use case: add EditChallengeStar and RemoveChallengeStar use cases (72f153dd2)
* 🌐 domain: add star assignment errors and update Challenge and User entities (032695758)

## 1.1.1 (2026-02-27)

* 🐛 fix(server): enhance error handling in SupabaseStorageProvider with detailed messages for upload, list, find, and remove operations (8a66c0ab8)
* ♻️ refactor(server): update SupabaseStorageProvider initialization to accept SupabaseClient instance (e2a82e094)
* 🧰 prov(server): add logging for folder and file during upload in SupabaseStorageProvider (e4317caf2)
* ⚙️ config: update pre-commit hook to run codecheck instead of lint (62faa7af7)
* 🖥️ ui(web): improve logging in useFeedbackDialog and update insigniaRoleSchema to include 'god' role (3611bf315)
* 📦 deps: update package.json files to refine linting and formatting commands (fb872458d)
* 📚 docs: add PRD for Lesson Page detailing functional requirements and user experience guidelines (a93ff2a80)
* 🖥️ ui(web): enhance logging in useFeedbackDialog to improve debugging of screenshot URL (ddca50b2f)
* 🖥️ ui(web): add default trigger class name and enhance logging in FeedbackDialog for improved debugging (22bbb7031)
* ♻️ refactor(server): remove console log for godAccountIds in environment configuration to streamline code (aa7b9f62e)
* 🐛 fix: resolve PR review feedback for env and testing docs (d64a1250c)
* ♻️ refactor(server): update godAccountIds processing in environment configuration to filter out falsy values (e6d20da5d)
* 🐛 fix(server): enhance console log for godAccountIds in environment configuration for better clarity (0a54e39fa)
* ♻️ refactor(server): update godAccountIds processing in environment configuration to ensure boolean values (28b15554b)
* ⚙️ config(server): add console log for godAccountIds in environment configuration for troubleshooting (ae07a4cd6)
* 📚 docs: add testing agent documentation (d7150a9bd)
* 🧪 test: add challenge controllers tests (01a95d70d)
* 🌐 domain: add challenge categories faker (bb7fbceb7)
* ⚙️ config: update server environment constants (f900d90e3)
* ♻️ refactor(server): remove unnecessary blank line in DiscordNotificationService for cleaner code (021ec85ea)
* 📚 docs: update create-prompt-prompt.md and add web-app-performance-report.md for improved prompt guidelines and performance diagnostics (e6a6c17bb)
* ♻️ refactor(server): update environment configuration to support multiple God account IDs (abbdecf4a)
* ⚙️ config: add install-skills.sh to automate skill installations for web quality and performance (f9d2b44f0)
* 📦 deps: add skills-lock.json to define web quality skills configuration (7bf283e45)
* ♻️ refactor(web): remove unused notification service and error notification logic (7f9986111)

## 1.1.0 (2026-02-24)

* ♻️ refactor(server): enhance error handling in Inngest functions by including job names in failure notifications (caa0cb75e)
* 🖥️ ui(web): add edit link for God users in ChallengeCardView (12bad618d)
* 🌐 domain: add isGod property to User entity for role verification (d766f4edb)
* 🖥️ ui: apply PR review fixes for challenge permission flow (2191c80c6)
* ♻️ refactor: remove console log from User entity's hasInsignia method (339875647)
* 📚 docs: update challenge editor specs and implementation prompt (5dbceb7ed)
* 🖥️ ui: refine challenge editor and description interactions (2cb7b43c9)
* 📟 rpc: adjust challenge access action flows (daa1bf3dc)
* 🌐 domain: update insignia role and user entity rules (9dd0a0866)
* 🧪 test: add challenge management permission controller tests (45ce34e80)
* 📶 rest: update challenge permission and profile middlewares (349a2047f)
* 📚 docs: add product requirement documents for avatars, insignias, rockets, and shop page management features (e536ddb79)
* 📮 validation: update challengeDraftSchema to use ordinalNumberSchema for position validation (0789449e8)
* 🤖 ai(server): update MastraCreateChallengeWorkflow to use challengeDraftSchema and improve error handling during workflow execution (31c4d320a)
* 🤖 ai(server): replace challengeSchema with challengeDraftSchema and enhance input processing for test cases in ChallengingToolset (8c610162d)
* 🪨 constants: add JSON validation note for challenge inputs and expected outputs in agents-instructions (ace66d3fc)
* 📮 validation: add challengeDraftSchema for validating challenge draft submissions (bc60d51f8)
* 🐛 fix(lsp): change result type in LspResponse to any for improved flexibility (9cd6a1aef)
* 🪨 constants: update Supabase key to use ANON key in client environment constants (e6f23b5b1)
* 🐛 fix(lsp): improve result extraction logic in DeleguaLsp to handle nested values and ensure correct response formatting (87b248c50)
* 📚 docs: remove outdated workflow documentation files for bug reports, specs, PRs, and code reviews (688aed268)
* ⚙️ config: update Supabase key and add Discord channel URL to client environment constants (5ea884d05)
* ⚙️ config: update .env.example to reflect new Supabase key and add Discord channel URL (057b0af30)
* 🐛 fix(studio): uncomment button for downloading users XLSX file in UsersPageView (b50c8ca76)
* ♻️ refactor(web): replace hardcoded Discord link with CLIENT_ENV variable in ErrorPageView and FeedbackDialogView (f269700a0)
* 🐛 fix: change response type from 'blob' to 'arraybuffer' in getFile (499e7cf50)
* ♻️ refactor(studio): optimize rest client initialization and authorization header management in useRestContextProvider (976092a54)
* 📚 docs: correct typos in suggest issues prompt documentation (e9b8d6d85)
* ♻️ refactor: normalize JSX quote style in error page link (af42a2777)
* 📦 deps: add exceljs dependency for server xlsx export (28775ef23)
* 📶 rest: add users xlsx export endpoint and file download support (15e568b59)
* 🧰 prov: add exceljs provider for xlsx file generation (4514d57e4)
* 📑 interface: add xlsx provider and users file download contracts (4de651d17)
* 🖥️ ui: move users page widget to profile module and update studio wiring (7688ce0e2)
* 🐳 docker: remove studio container build configuration files (09da46b07)
* 📚 docs: update prompt templates and add profile feature documentation (dffbf2ba9)
* 🐛 fix: update failure handling in InngestFunctions to only log errors in production mode (acaec2815)
* 🐛 fix: update failure handling in InngestFunctions to only log errors in development mode (2757d08a3)
* ▶️ cr(server): address PR review comments on InngestFunctions (dd375bd35)
* 📶 rest: update telemetry integration in HonoApp (db8a89afd)
* 🚚 cd: update staging deployment notification description to specify Heroku (4759389d4)
* ♻️ refactor: add 'as const' assertion to CHALLENGING_PROMPTS for improved type safety (85b459e20)
* 🚚 cd: enhance Discord notification formatting in Heroku deployment workflow (c6a9a03d4)
* ♻️ refactor: reorder import statements in LessonService interface for clarity (54cc80bc5)
* 🚚 cd: correct name formatting in Vercel deployment workflow (0e5685fda)
* 🚚 cd: update Vercel deployment workflow to trigger on release events and re-enable Discord notifications with structured message (423ec1388)
* 📚 docs: expand layer rules and add prompt/tooling documentation (3a40f88e2)
* 🚚 cd: refine staging deploy webhook commit field formatting (29250994e)
* 🐛 fix: add event exports to main.ts for improved event handling (9eb53ac30)
* ⚙️ config: change file name from abacaxi.jpg to banana.jpg in files.rest configuration (ef1658fd5)
* 🚚 cd: comment out Discord notification step in Vercel deployment workflow for future reference (63ab6314c)
* 🚚 cd: add new GitHub Actions workflow for production deployment to Vercel with Discord notifications (2ce2fa77f)
* 🚚 cd: enhance Discord notification in Vercel deployment workflow with structured message and additional details (0653f793e)
* 🚚 cd: refactor Vercel deployment workflow to remove prebuilt steps and streamline deployment process (1cfe737fa)
* 🚚 cd: update Vercel deployment workflow to specify working directory for environment pulls and builds (a5130d268)
* 🚚 cd: update Vercel deployment workflow to use Node.js 22, and streamline environment variable handling (fc83464e9)
* 🚚 cd: update Vercel deployment configuration to use Node.js 20 and improve environment variable handling for preview deployments (8f529b355)
* ⚙️ config: remove outputFileTracingRoot from Next.js configuration (a90576fcf)
* 🚚 cd: remove symlink for root node_modules in GitHub Actions workflow for staging deployment to Vercel (6c85d0c56)
* ⚙️ config: add outputFileTracingRoot to Next.js configuration for improved file tracing (5c6fdba54)
* 📚 docs: add descriptions to various prompt markdown files to clarify their objectives and usage (e273d53a1)
* 📦 deps(web): remove dom-to-image-more dependency from package.json and package-lock.json (307f4fb0a)
* ⚙️ config: add sync-commands.sh to automate prompt linking and copying for documentation (09baffbd3)
* 📚 docs: update feedback documentation to reflect changes in screenshot capture library and latest update date (ddfaf24fe)
* 🖥️ ui(web): refactor feedback dialog to remove idle wait function and improve error handling; enhance screen cropper with consistent styling (37f45ce93)
* 📦 deps: add dom-to-image-more and html-to-image dependencies, and update global styles for advanced cropper functionality (9a06b500e)
* 🖥️ ui(web): enhance feedback dialog with capture warmup and ignore capture attributes for improved screenshot functionality (4100f924d)
* 📚 docs: overhaul README.md to enhance project description, structure, and installation instructions (aafc4904d)
* 📚 docs: rename files for rules (8e7e93f61)
* 📚 docs: remove outdated documentation files for code conventions, core package guidelines, database guidelines, domain objects testing, and more (85b8b87e5)
* 🚚 cd: enhance Discord notifications for Heroku deployments with detailed embed messages for production and staging (b129fbb63)
* 🚚 cd: add symlink for root node_modules in GitHub Actions workflow for staging deployment to Vercel (c63a4daa3)
* 🚚 cd: update build and deploy steps in GitHub Actions workflow for staging deployment to Vercel (aae456d04)
* 🚚 cd: replace Vercel build step with TurboRepo in GitHub Actions workflow for staging deployment (53337838c)
* 🚚 cd: update build step in GitHub Actions workflow for staging deployment to Vercel (fb6d83196)
* 🚚 cd: correct path for copying Vercel environment variables in GitHub Actions workflow for staging deployment (8082a749b)
* 🚚 cd: update environment variable copy in GitHub Actions workflow for staging deployment to Vercel (c4bf5ff82)
* 🚚 cd: fix environment variable copy in GitHub Actions workflow for staging deployment to Vercel (fa42460e1)
* 🚚 cd: remove NODE_ENV setting from GitHub Actions workflow for staging deployment to Vercel (195327d8c)
* 🚚 cd: update GitHub Actions workflow to copy Vercel environment variables for staging deployment (4343b3b34)
* 🚚 cd: remove Infisical secrets action and permissions from GitHub Actions workflow for staging deployment to Vercel (ceaeef78d)
* 🚚 cd: comment out paths in GitHub Actions workflow for staging deployment to Vercel (1f7f643c8)
* 🚚 cd: change GitHub Actions workflow trigger from push to pull_request for staging deployment to Vercel (1cc335bc9)
* 🚚 cd: update GitHub Actions workflow for staging deployment to Vercel, changing trigger to push and refining paths, build, and deployment steps (d95decf42)
* 🚚 cd: comment out paths in GitHub Actions workflow for staging deployment to Vercel (ae9841e7d)
* 🏎️ ci: add GitHub Actions workflow for staging deployment to Vercel (2289b0e60)

## 1.0.3 (2026-02-11)

* 🚚 cd: add Discord notification for successful Heroku deployment with release details (c233e9896)
* 🐛 fix: improve challenge test case handling with enhanced data type detection and synchronization (d9efb769e)
* 📚 docs: update PR conversation resolution prompt to include GitHub GraphQL API mutation for resolving threads (d0573563d)
* ⚙️ config: update Sentry initialization to enable only in production environment (79b9a564d)
* 🐛 fix: enhance challenge test case handling with improved data type management and input synchronization (f1cb2990b)
* ⚙️ config: add .excalidraw to .gitignore to exclude Excalidraw files from version control (614a94e14)
* 📚 docs: add challenge editor product requirements document (07d2e6a59)
* ⚙️ config: add .claude/ to .gitignore to exclude Claude-related files from version control (02a196c43)
* 📚 docs: remove outdated tooling documentation and update guidelines to reflect current practices (36bc86782)
* 📚 docs: add comprehensive tooling documentation for StarDust monorepo scripts and workflows (99a60395d)
* 🐛 fix: update challenge data type definition in challengeSchema for improved validation (3b8a542d2)
* 🐛 fix: update challenge posting flow payload and notification routing (38b58b0e0)
* 🐛 fix: align cache provider value typing with conversation usage (67c4adff2)
* 🤖 ai: polish challenge creator agent prompt instructions (97652174e)
* 📚 docs: refine challenge creator requirements and job spec (f81e7568d)
* 📚 docs: update linting command in fix-side-effect-prompt documentation (d2fe2bf6c)
* ♻️ refactor: remove console log from Planet creation method (4d1d10372)
* 🧪 test: enhance PostChallengeUseCase to publish ChallengePostedEvent after challenge creation (404998a8e)
* 🐛 fix: resolve server and web typecheck regressions (f75413a36)
* ⚙️ config: update .gitignore to streamline ignored files and add new documentation files (2a01a5d52)
* ⚙️ config: update .gitignore to clean up entries and add new files for agents and prompts (84a80355a)
* 🖥️ ui: improve feedback dialog capture process with button visibility restoration and animation frame handling (2f6db3a19)
* 🖥️ ui: add console logging for feedback screenshot file name in useFeedbackDialog (2b4da7740)
* 🖥️ ui: update ErrorPageView component to change link color for Discord help (0b6d32f98)
* 🖥️ ui: enhance feedback dialog with screenshot preview logging and optional chaining (0709521e6)
* 🖥️ ui: update ErrorPageView component to change button text and add Discord help link (1657fe500)
* 🐛 fix: add logging for Planet creation DTO (424a9a059)
* 🐛 fix: resolve code review comments from PR #326 (2c88b9e2b)
* 📚 docs: add challenge creator PRD and update prompt docs (05e13d158)
* 📦 deps: update package dependencies (37a304949)
* ⚙️ config: add cache constants and update app configuration (51f781b02)
* 📶 rest: update Discord notification service (c84f79774)
* 📮 validation: update challenge validation schema (352bbe2a3)
* ✨ use case: update PostChallenge use case (256d159f0)
* 📑 interface: add challenge workflow and service interfaces (74b03aedd)
* 🌐 domain: add challenge errors, events and text selection structure (99ee6afc1)
* 📟 rpc: add challenging and notification job handlers (1b32ed7e8)
* 🤖 ai: add AI layer implementation (64e7ba1d9)
* 💾 db: add Supabase database configuration and repositories (7fcd90a08)
* 📚 docs: add MCP guidelines for Context7 and Serena usage (e7cc351ab)
* 🖥️ ui: remove unused direction prop from PanelHandle in ChallengeLayoutView (7c0429760)
* 🧪 test: remove unused auth mocks (45ad6314e)
* 🖥️ ui: enhance challenge assistant chatbot and slider components (f84f68b35)

## 1.0.2 (2026-02-06)

* 📚 docs: add detailed bug report for after sign-in error in social login flow (f2ae11373)
* 🖥️ ui: update padding in ContentView component for improved layout (71c0a2264)

## 1.0.1 (2026-02-06)

* 📚 docs: enhance bug report prompt with detailed guidelines and structured output format (55e28453a)

## 1.0.0 (2026-02-06)

* 📚 docs: remove code and tests conventions documentation (1edcf8cd0)
* 🖥️ ui: refactor useTextSelection to use function declaration (deec5fd94)
* 🖥️ ui: implement selection features in challenging module (d3cbff43d)
* 🖥️ ui: enhance global components and code editor (2c0a4a783)
* 🏷️ type: update code editor ref type (9951111d2)
* 🌐 domain: update text selection structure (2f0da6cee)
* 📶 rest: update assistant controller with selection support (3c8116a5f)
* 📚 docs: add and update assistant agent specifications (818c544c5)
* 🖥️ ui: update chat history widgets (a22f01311)
* 🖥️ ui: add code and text selection widgets (c656af1f2)
* 🌐 domain: add code and text selection structures (50df94179)
* 🖥️ ui(web): add callback for editing chat name in AssistantChatsHistory (db03095e2)
* 🐛 fix: correct prompt property name in SnippetCardView (5142571cd)
* ♻️ refactor: update delegua lsp behavior (ba8488f17)
* ♻️ refactor: adjust core entry exports (9ac680f70)
* 🌐 domain: update core domain structures (d12910f35)
* 🧪 test: adjust core tests and fakers (e02c370a8)
* 🏷️ type: update lesson and validation types (60d41a4b7)
* ✨ use case: refine guide creation flow (fc466cb10)
* 📑 interface: extend service provider contracts (652096082)
* ⚙️ config: update turborepo settings (a14f006f9)
* 📦 deps: update package dependencies (faf0888b1)
* 📚 docs: update guidelines and assistant PRD (8ae67e599)
* 🐛 fix: limit sign-in event publishing to production (68281fcc0)
* 📶 rest: add chat name update endpoint (f772087b1)
* 🖥️ ui: add chat name editing controls (c398a9c28)
* 📚 docs: add initial draft of assistant-agent PRD documentation (81f42b2d7)
* 📦 deps: update @mastra/rag to version 2.1.0 and add new dependencies in package-lock.json (e1388fc91)
* 📦 deps(lsp): update package dependencies to include monaco-editor and related packages (36081e59c)
* chore: atualiza .gitignore e prompt de criação de PR (362ec353c)
* 📚 docs: remove redundant input section from create-pr-prompt documentation to streamline guidelines (10d626d6d)
* 📚 docs: create AGENTS.md to reference key documentation files for project overview, architecture, and guidelines (1ab4aa2d6)
* 📶 rest: integrate ReportingService into RestContextProvider and update useStorageImage import path (68c86e826)
* 🖥️ ui(studio): update dialog component styles to enhance accessibility and visual consistency (103c9136c)
* 🖥️ ui(studio): add Feedback Reports route and sidebar link for reporting (330e2406e)
* 🖥️ ui(studio): add MessageSquare icon and update IconName type for feedback integration (c3ce48998)
* 📚 docs: add specification for Feedback Reports management page including REST services and UI components (669dfc10a)
* 🪨 constants: add new cache and route constants for feedback reports management (0079ba39d)
* 🐛 fix: update SupabaseFeedbackReportMapper to log incoming rows and adjust query to use inner join for user data retrieval (256cdca14)
* 📶 rest: integrate ReportingService into RestMiddleware and update RestContext with new service (77e4e0c4f)
* 📶 rest: add ReportingService to manage feedback reports and update RestContext accordingly (5f1ad281a)
* 🧪 test: add mock environment constants and index exports for testing (e4ab0aa44)
* 🧪 test: add comprehensive tests for Feedback Reports components including dialogs, tables, and hooks (be53a5f4f)
* ⚙️ config: update .gitignore to include Codex directory and adjust formatting for clarity (322767667)
* ⚙️ config: update package.json and add tsconfig for testing with Jest and Babel support (c4ac9bccf)
* ⚙️ config: add Babel and Jest configuration files for TypeScript and React support (3db757331)
* 🖥️ ui: implement Feedback Reports management page with filtering, pagination, and dialogs for viewing and deleting reports (f15a80225)
* 🐛 fix: enable client-side rendering in RestContext by adding 'use client' directive (1c19843ed)
* ♻️ refactor: rename useRestProvider to useRestContextProvider and update RestContext imports for consistency (dad69a765)
* ♻️ refactor: update RestContext imports and enhance ReportingService with new feedback report methods (4300c9537)
* ⚙️ config: add linting and formatting scripts to package.json for improved code quality (939c58177)
* ♻️ refactor: introduce RestContext for improved REST service management and replace useRest hook with useRestContext across the application (5abe9211a)
* 📚 docs: update documentation guidelines for clarity and best practices (c5d0ad3ce)
* 📚 docs: add specification for feedback reports management page in StarDust Studio (bd5bf3bd3)
* 📚 docs: remove outdated documentation files for app, rest, and UI layers (beebcab71)
* ⚙️ config: update infrastructure providers and planets repository (460c5a9fa)
* 📚 docs: add delete feedback report spec and update documentation (fd9ec1122)
* 🧪 test: add tests for delete feedback report functionality (7190cd2a7)
* 📶 rest: add delete feedback report endpoint (0287cc0ca)
* 💾 db: implement repository methods for deleting feedback reports (3a9fe4325)
* ✨ use case: implement delete feedback report logic (3de2d4282)
* 🧪 test: add unit tests for ListFeedbackReportsUseCase and controller (24c532f32)
* ⚙️ config: migrate feedback notification jobs to notification module (b057e6ca9)
* 📶 rest: add ListFeedbackReportsController and register router (44ddaf02f)
* 💾 db: implement SupabaseFeedbackReportsRepository and types (b700dca81)
* ✨ use case: implement ListFeedbackReportsUseCase (01ac83c56)
* 🏷️ type: define feedback report listing params and validation schemas (fd4a25de2)
* 📚 docs: add feedback reports management specs and update guidelines (3c667fe5d)
* 📚 docs: add PRD for Feedback Reports Management detailing functional and non-functional requirements (eabbc206f)
* ✨ use case: add FeedbackReportsListingParams type and ListFeedbackReportsUseCase implementation (13b039e9f)
* 📚 docs: consolidate fragmented documentation references from agent rules into a new comprehensive guidelines index (3c9148d8f)
* 📚 docs: update feedback dialog specification (ddac770b2)
* ♻️ refactor(web): remove debug logs from rest client and services (b1912f268)
* ♻️ refactor(server): remove debug logs from storage router (02107659f)
* ♻️ refactor(web): improve feedback dialog implementation (19553a58d)
* 🐛 fix: add feedback-reports path to Google Drive storage (51e00698d)
* 🖥️ ui: integrate FeedbackLayout and enhance FeedbackDialog (ce04955b9)
* 🐛 fix: implement postFormData in NextRestClient (a07efcd11)
* 📶 rest: update storage router and validation middleware (960acbd33)
* 🏷️ type: update feedback and storage schemas (7faef24f0)
* 🌐 domain: update storage domain and feedback use case (c3b497d94)
* ⚙️ config: update dependencies and gitignore (5c7a15ce5)
* 📚 docs: update feedback specs and guidelines (3c051bc30)
* 🚧 wip: feedback dialog (ef28168b9)
* ⚙️ config: remove tsbuildinfo from version control (d2c1e9dba)
* ⚙️ config: ignore typescript build info files (25494ca13)
* 📚 docs: refine create-spec, implement-spec and commit-code prompts (ed65a043e)
* ⚙️ config: rename check-types script to typecheck across workspace (297de1958)
* 📚 docs: add feedback widget spec and update UI guidelines (fac57d0b6)
* 🖥️ ui: implement multi-step Feedback Dialog widget (9fe1c09b5)
* 📶 rest: implement ReportingService in web app (ec11e6cdc)
* 📑 interface: add ReportingService core interface (98b98e4f8)
* 🖥️ ui: enhance Dialog component with controlled state and better composition (dd07fd46a)
* ⚙️ config: standardize script names in package.json files across apps and packages (114905aa8)
* ♻️ refactor: format web app code (520a06682)
* ♻️ refactor: apply composition pattern to Dialog widget (7f89a31c8)
* 📶 rest(web): add sendFeedbackReportNotification method stub (a381dba25)
* ⚙️ config: add tsconfig.tsbuildinfo to gitignore (e3ecca436)
* 📚 docs: add commit code prompt (e00a739f7)
* ♻️ refactor: format web app code (5f91da13a)
* 📶 rest(server): enhance feedback reporting by adding screenshot support and refactoring notification service for improved clarity (e7785904c)
* ⚙️ config: update .gitignore to include .context and .opencode, and comment out .agent for better file management (4c740bd5e)
* 📚 docs: update prompt title from 'Criar PRD' to 'Criar Pull Request' for clarity in PR creation guidelines (044dc7b8a)
* 📶 rest(server): add feedback report API endpoint for creating feedback reports (51277de86)
* ⚙️ config: fix package.json formatting by ensuring proper newline at end of file (73c81d142)
* 🎞️ queue(server): integrate ReportingFunctions and ReportingRouter into HonoApp for enhanced reporting capabilities (5f3e51cc6)
* 📶 rest(server): add userAvatar to the body in AppendUserInfoToBodyController for enhanced user information (d6468fa41)
* 🎞️ queue(server): introduce NotifyFeedbackJob for handling feedback report notifications in the reporting module (d69a38c97)
* 📮 validation: add reporting module exports to package.json and main.ts for improved schema integration (404f3f57e)
* 📶 rest(server): enhance DiscordNotificationService to use embeds for notifications and add sendFeedbackReportNotification method (b94d6b1e0)
* ⚙️ config(server): introduce FeedbackRouter and ReportingRouter for handling feedback report routes in the reporting module (ee8a424ff)
* 💾 db(server): create SupabaseFeedbackReportsRepository for managing feedback report persistence in Supabase (2cab751cd)
* 📶 rest: add SendFeedbackReportController to handle feedback report submissions and export it in the reporting module (d36d7dda6)
* 🧪 test: refactor SendFeedbackReportUseCase tests to use beforeAll and improve mock implementations (89debae91)
* 📦 deps: add reporting module exports and structure to enhance reporting functionality (8cbba6591)
* 🧪 test: add unit tests for SendFeedbackReportUseCase to validate feedback report processing and error handling (bb92f5efe)
* ✨ use case: implement SendFeedbackReportUseCase for processing and publishing feedback reports (1112d6219)
* 📑 interface: add FeedbackReportsRepository interface for managing feedback report persistence (69d4fba89)
* 🌐 domain: add FeedbackReportsFaker class for generating fake feedback reports and DTOs in the reporting module (674596709)
* 🌐 domain: implement FeedbackReportSentEvent class for handling feedback report sent events in the reporting module (d5159fdad)
* 🌐 domain: add FeedbackReport entity and DTO for structured feedback reporting in the reporting module (3b827f8f7)
* 🌐 domain: introduce FeedbackIntent class for structured feedback handling and validation in reporting module (348c056fd)
* 📮 validation: add reporting module with feedback report schema and index exports for improved validation structure (c66a4f522)
* 📚 docs: add foundational documentation for project architecture, guidelines, and workflows to enhance clarity and standardization (454b4c755)
* 📚 docs: introduce comprehensive architecture documentation for StarDust project, (1492745a3)
* 📚 docs: add project overview and detailed module descriptions for StarDust platform to enhance documentation clarity and user understanding (4432d282c)
* 📚 docs: add comprehensive guidelines for code conventions, core package structure, database interactions (c7b6dedf3)
* 📚 docs: add new prompts for bug report, spec creation, and PRD documentation to enhance development workflow and standardization (4ef891f2a)
* 📚 docs: remove outdated challenge descriptions to streamline documentation and improve clarity (14ec685ce)
* 📚 docs: update pull request template to clarify mandatory and optional sections for improved submission guidelines (8fa88c158)
* 🌐 domain: add optional lastUnlockedStarId to UsersListingParams for enhanced user data tracking (8c0a0de52)
* ⚙️ config: update .gitignore to include .context directory for better file management (23ee43d9d)
* ♻️ refactor(server): remove redundant file deletion in DropboxStorageProvider to streamline file handling (42f4fbc2e)
* 🐛 fix(server): update SupabaseDatabaseProvider to handle backup file creation and cleanup, improving error handling and file management (0cbcb09e0)
* 🖥️ ui(studio): add UsersTable component to export UsersTableView for improved modularity (2da67edd6)
* ♻️ refactor(server): remove unnecessary blank line in FetchChallengesListController for improved code readability (5031015e6)
* 🐳 docker(server): add PostgreSQL client to Dockerfile for database interactions (ca4e00710)
* 📚 docs(server): update challenges.rest and users.rest to replace completionsCount with completionCount for consistency (9b116e63b)
* 🖥️ ui(studio): update PlanetCollapsibleView to reflect userCount and completionCount with new titles and icons for improved clarity (beb5f7275)
* 💾 db(server): correct property name from completionsCount to completionCount in SupabaseChallengeMapper for consistency (0bac45d70)
* 💾 db(server): enhance SupabaseStarMapper and SupabaseStarsRepository to include userCount and unlockCount properties for improved star data handling (1d65a55a1)
* 💾 db(server): update SupabasePlanetMapper and SupabasePlanetsRepository to replace completionsCount with completionCount (0c7363cb7)
* 🖥️ ui(studio): update ChallengesTableView to use completionCount for consistency with recent refactor (86328de69)
* 🖥️ ui(studio): add userCount and unlockCount tooltips to StarItemView for enhanced user information display (953060ff1)
* 🖥️ ui(studio): add UsersTable component to export UsersTableView for improved modularity (6d33eb9a7)
* 🖥️ ui(studio): refactor codebase to replace all instances of completionsCount with completionCount for consistency and improved clarity (e031d896a)
* 🖥️ ui: add StarUnlockIcon and StarUserIcon components with SVG representations for enhanced user interface (4aacbc184)
* 🌐 domain: add new icons 'planet-user' and 'planet-completion' to IconName and ICONS for enhanced user representation (adfd5cf08)
* 🖥️ ui(studio): update button text color in SortableColumnView for improved visibility (3bb9f71e1)
* 🧪 test: add unlockCount and userCount assertions to Star entity tests for enhanced validation (627a9aaef)
* 🌐 domain: enhance StarsFaker by adding unlockCount and userCount properties for improved star data generation (221c0231c)
* 🧪 test: remove Month.test.ts as part of codebase cleanup (cae565e3f)
* 🌐 domain: update CreatePlanetUseCase to replace completionsCount with completionCount and add userCount for improved tracking (69fbc4129)
* 🌐 domain: update PlanetsFaker to replace completionsCount with completionCount for consistency (af7b5e0b1)
* 🌐 domain: refactor Challenge entity and DTO to replace completionsCount with completionCount for consistency across the codebase (483f9fb4f)
* 🌐 domain: refactor Planet entity and DTO to replace completionsCount with completionCount and add userCount for improved user tracking (83ce91392)
* 🌐 domain: add userCount and unlockCount properties to Star entity and DTOs for enhanced star tracking (517914d1f)
* 🖥️ ui(studio): update text color from muted-foreground to zinc-500 for improved readability (37ef470fe)
* ♻️ refactor(server): remove console log from FetchRocketsListController to clean up code (0b5a0fb69)
* 📚 docs: add specification for query string state management in shop pages, detailing implementation and behavior for filters and pagination (10f74b5e1)
* 📚 docs: implement skeleton loading for RocketsTable and AvatarsTable, enhancing user experience during data loading (ea209336f)
* 📚 docs(studio): implement sortable price column in RocketsTable, enhancing user experience for item sorting (94fdabacb)
* 🖥️ ui(studio): refactor AvatarsTable and RocketsTable to use 'priceOrder' for sorting, enhancing consistency across components (5bda0d789)
* 🖥️ ui(studio): add AvatarsTableSkeleton component for loading state and update RocketsTable to use priceOrder for sorting (5de55242b)
* 🧪 test: update ListAvatarsUseCase and ListRocketsUseCase tests to use 'priceOrder' instead of 'order' for consistency (547ccd18b)
* 📶 rest(server): replace 'order' with 'priceOrder' in AvatarsRouter and RocketsRouter for consistency in query parameters (21df80bd7)
* 🌐 domain: update ShopItemsListingParams to include priceOrder for enhanced sorting capabilities (e55297e54)
* 📶 rest: update ShopService to replace 'order' with 'priceOrder' for consistency in query parameters (fe545b8df)
* ✨ use case: rename 'order' to 'priceOrder' in ListAvatarsUseCase and ListRocketsUseCase for consistency (26802750e)
* 💾 db(server): update ShopItemsListingParams to use priceOrder in SupabaseAvatarsRepository and SupabaseRocketsRepository (010e296c2)
* 📮 validation: update listingOrderSchema to include 'any' option and set default value (bbd8f8305)
* 🐛 fix(web): enhance challenges list filtering by adding support for private challenges and sorting by completion and downvote counts (226511510)
* ✨ use case: add support for including private challenges in ListChallengesUseCase to enhance filtering options (c174352fa)
* ♻️ refactor(server): remove debug log from SupabaseChallengesRepository to enhance code clarity (1247312d9)
* ♻️ refactor(server): remove debug log from FetchChallengesListController to improve code clarity (1e9e4afdc)
* ♻️ refactor(studio): remove unused onOrderChange prop to streamline component interface (f57f2ee40)
* 📚 docs(server): update challenges and users API specifications to enhance sorting and filtering options (1d0ecf38c)
* 📚 docs(studio): add specification for ChallengesTableSkeleton to improve loading state representation in ChallengesTable (8eabe4642)
* 📚 docs(studio): add specification for query string state management in challenges page to enhance URL sharing and state persistence (45b079d2d)
* 📚 docs(studio): add specification for challenge list sorting by downvotes and completion counts (c42835b8e)
* 📚 docs(studio): implement sorting and filtering features in ChallengesTableView for enhanced challenge management (4b0b6cdb3)
* 📚 docs: update users list and filtering specifications to replace 'Sorter' terminology with 'Order' for consistency (d2a3478d5)
* 💾 db(server): enhance SupabaseChallengesRepository to support sorting by downvotes and completions (46a2da266)
* 🖥️ ui(studio): enhance ChallengesTableView with sortable columns and loading skeleton for improved user experience (2312d6546)
* 💾 db(server): refactor SupabaseUsersRepository to replace 'Sorter' terminology with 'Order' for sorting parameters (dbacd1c8e)
* 🖥️ ui(studio): refactor ChallengesPageView and useChallengesPage for improved prop handling and filtering options (059423660)
* 🖥️ ui(studio): reorder props in PaginationView component for improved clarity (28624ce71)
* 🖥️ ui(studio): add ChallengesTableSkeleton component for loading state representation (b566086f6)
* 🌐 domain: add isNone getter to Sorter class for additional sorting state (017c047b4)
* 🖥️ ui(studio): refactor SortableColumn components to replace 'Sorter' terminology with 'ListingOrder' for sorting parameters (10ac1ca91)
* 🖥️ ui(studio): update UsersTable and RecentUsersTable components to replace 'Sorter' terminology with 'Order' for sorting parameters (f90fb2e3d)
* 🖥️ ui(web): update UsersPageView to replace 'Sorter' terminology with 'Order' for sorting parameters (de4666b1e)
* 📶 rest(studio): update ProfileService to replace 'Sorter' terminology with 'Order' for sorting parameters (8ee67f98c)
* 📶 rest(server): update ChallengesRouter and controllers to incorporate downvoteCountOrder and completionCountOrder for enhanced challenge filtering (a80884292)
* ✨ use case: add downvoteCountOrder and completionCountOrder to ListChallengesUseCase for enhanced filtering options (8ef86f07e)
* ♻️ refactor: update ChallengingService and ChallengesListParams to include additional filtering options for challenges (d50820864)
* ♻️ refactor(server): update UsersRouter and FetchUsersListController to replace 'Sorter' terminology with 'Order' for sorting parameters (ad6152e0f)
* ♻️ refactor(core): update UsersListingParams and ProfileService to use 'Order' terminology for sorting parameters (bb1841438)
* ♻️ refactor(core): rename sorting parameters in ListUsersUseCase to use 'Order' terminology for consistency (7c490704f)
* 🐛 fix: update listingOrderSchema to include 'any' option and set default value (8a3771bcb)
* 🐛 fix(core): throw AppError if timezone offset is not found in dateWithoutTimeZone method (e28c7c893)
* 🐛 fix(core): throw AppError if timezone offset is not found in dateWithoutTimeZone method (0de76ce26)
* 📚 docs: add specification for deleting embeddings of deleted guides (6af984867)
* 🧪 test: enhance DeleteGuideUseCase tests to verify GuideDeletedEvent publishing (e264933e3)
* 🎞️ queue(server): add DeleteGuideEmbeddingsJob to handle deletion of guide embeddings (603ab6d73)
* ♻️ refactor: update DeleteGuideController to include broker for event publishing (d4642472b)
* 🌐 domain: introduce GuideDeletedEvent class to handle guide deletion events (5b76e94cd)
* ✨ use case: implement DeleteGuideUseCase to publish GuideDeletedEvent after guide removal (fc98d2c68)
* 🖥️ ui(studio): update DateRangePicker to use dateWithoutTimeZone for accurate date handling (5b43c912a)
* 🌐 domain: add dateWithoutTimeZone method to handle timezone adjustments and update Datetime interface (a430584cb)
* ♻️ refactor(server): remove unused queryParams variable in UsersRouter to streamline code (814294bb6)
* ♻️ refactor(web): enhance fetchUsersList to support advanced filtering and sorting parameters (71b732f3f)
* 📚 docs(studio): add technical specification for user table filtering and sorting features (78efbc6da)
* 📚 docs(studio): add specification for query string filtering and pagination in UsersPage (e8300a5d6)
* 📚 docs(studio): add specification for query string filtering and pagination in ChallengesPage (f83b6f99e)
* ⚙️ config(server): add date filtering parameters for user queries in UsersRouter and update validation schema (567082ea9)
* ♻️ refactor(server): remove console log for insigniaRoles in SupabaseUsersRepository to clean up code (fae2752bc)
* 🖥️ ui(studio): turn Pagination into a pure widget (5b67885bf)
* 🖥️ ui(studio): enhance UsersPageView with sorting, filtering, and pagination controls (c9e089b20)
* 🖥️ ui(studio): integrate sorting functionality into UsersTableView with SortableColumn components and update loading state representation (3ba118f6c)
* 🖥️ ui(studio): update ChallengesPageView to use 'Categorias' and add pagination controls with handlers for page and items per page changes (413665e59)
* 🖥️ ui(studio): add UsersTableSkeleton component for loading state representation in user tables (dd61aea04)
* 🖥️ ui(studio): enhance RecentUsersTable with sorting functionality and state management for improved user experience (f02f893d2)
* 🖥️ ui(studio): add InsigniaRolesSelect component with dropdown for role selection and toggle functionality (66111b615)
* 📑 interface: update ProfileService interface to include new KPI and user report fetching methods for enhanced user analytics (b6437a5f1)
* 🖥️ ui(studio): implement SortableColumn component with sorting functionality and dropdown menu for sort options (d3ad9010f)
* 🖥️ ui(studio): introduce PeriodPicker component with dropdown for date range selection and clear option (ad4801a50)
* 🖥️ ui(studio): add pagination controls to RocketsTable component with handlers for page and items per page changes (24c0326c9)
* 🖥️ ui(studio): enhance AvatarsTable component with pagination and items per page change handlers for improved user experience (13f479bc5)
* 📶 rest(studio): refactor fetchUsersList to utilize UsersListingParams and enhance query parameter handling for improved user listing functionality (8e1acf46e)
* 🖥️ ui(studio): integrate NuqsAdapter for enhanced routing support in the App component (afd0990da)
* 🌐 domain: enhance Datetime interface and DayJsDatetime class with new date format and addHours method for improved date manipulation (f850b89ac)
* 📦 deps(studio): update package-lock and package.json to include date-fns, react-day-picker, and nuqs for improved date handling and UI components (7449b042f)
* 🌐 domain: introduce ZodDateValidation for robust date validation and add DateValidation interface (f3ec276a0)
* 🌐 domain: enhance Period class to validate date ranges and ensure start date is before end date (3eccc785a)
* 🖥️ ui(studio): add Calendar and DateRangePicker components for enhanced date selection functionality (e18aba497)
* 📮 validation: add dateSchema for validating date strings in YYYY-MM-DD format (c9c9cbdd9)
* 📶 rest(studio): fix buildUrl function to correctly handle array query parameters (ae773e347)
* 🖥️ ui(studio): add custom hooks for managing query parameters as numbers and strings (84ad658d2)
* 🖥️ ui(studio): add ArrowUp and ArrowDown icons to the LucideIcon set and update IconName type (ee7c333e3)
* 🌐 domain: update UsersListingParams to include spaceCompletionStatus, insigniaRoles, and optional creationPeriod (ab3df29b9)
* 📚 docs: add specifications for user list filtering by creation period and space completion status with insignia roles (932ec9292)
* ✨ use case: enhance ListUsersUseCase to support space completion status, insignia roles, and date range filtering (f26f98cb3)
* ⚙️ config(server): update UsersRouter to include spaceCompletionStatus and date range fields in user query schema (294321789)
* 💾 db(server): enhance SupabaseUsersRepository with insignia role filtering and date range support for user queries (3be212896)
* 📶 rest(server): extend FetchUsersListController schema with new fields for space completion status and date range filtering (faee782c1)
* 🌐 domain: add Period class for managing date ranges and update exports in index.ts (754074bd8)
* 🌐 domain: add SpaceCompletionStatus class for managing space completion states and validation (55f8564bc)
* 📮 validation: add spaceCompletionStatusSchema for profile validation and export dateRangeSchema (795a582f5)
* 📮 validation: add dateRangeSchema for optional date range validation (44c0134e9)
* 📶 rest: update FetchUsersList API to include additional sorting parameters for improved user list retrieval (ee385eb97)
* 📚 docs: update README links for application sections to reflect new naming conventions (f03d76a7c)
* 📚 docs: add technical specification for user list sorting parameters (6a5f4fee7)
* 📚 docs: add user management page requirements and functionalities to the documentation (c89b9c2fe)
* ♻️ refactor: add additional sorting parameters to UsersRouter for enhanced user listing functionality (1dcf0a62e)
* 💾 db(server): update findMany method in SupabaseUsersRepository to use UsersListingParams (76611add8)
* 📶 rest(server): add additional sorting options to FetchUsersListController for enhanced user listing capabilities (cf4be622b)
* ✨ use case: extend ListUsersUseCase to include sorting options for user listings (77f3ab912)
* 📑 interface: introduce UsersListingParams type and update UsersRepository to utilize it (9ce66bd65)
* 🌐 domain: add Sorter class for sorting options and export in index (30e0981aa)
* 📮 validation: add sorterSchema for sorting options and export in index (ad2c1b367)
* 📚 docs(studio): correct typo in challenges page plan regarding tag filter display (678c58a0a)
* 🐛 fix(studio): remove duplicate search parameter appending in buildUrl function (ce2159662)
* 🖥️ ui(studio): enhance ChallengesPageView with pagination functionality and update useChallengesPage for improved state management (4ffc69fe6)
* 📶 rest(studio): add fetchAllChallenges method and log itemsPerPage in ChallengingService (dec4faa8c)
* 🐛 fix(studio): update AxiosRestClient to return headers correctly and enhance buildUrl function (f1487c2cf)
* 🖥️ ui(studio): restructure challenges page components and implement pagination with filtering options (85d1ede61)
* 📚 docs(studio): add challenges page plan with implementation details and user flow (e3fad3a17)
* 🖥️ ui(studio): implement ChallengesTableView and ChallengesPageView components with filtering and loading states (f0f24d253)
* 🚚 cd: delete GitHub Actions workflow for continuous deployment of Studio app to Vercel (e8b835fc0)
* 🚚 cd: add GitHub Actions workflow for continuous deployment of Studio app to Vercel (d604d69ba)
* ⚙️ config: update commit-msg hook to use commitlint for message validation (1bc1f3da1)
* chore: update Dockerfile to change exposed port (212788ff6)
* ♻️ refactor(lsp): enhance DeleguaLsp to safely access nested properties for improved error handling (ac45db8fe)
* ♻️ refactor(core): update Code test cases to support asynchronous operations for improved reliability (09253c672)
* ♻️ refactor(web): integrate useLsp hook in TestCase component for enhanced asynchronous handling of LSP provider (94d96d1c8)
* ♻️ refactor(web): update handleChange function in useCodeEditor to support asynchronous syntax analysis (3d41ae6b0)
* ♻️ refactor(ui): update runCodeWithInput function to handle asynchronous input processing in PlaygroundCodeEditor (c51e219b9)
* ♻️ refactor(ui): update useTestCase hook to utilize asynchronous translations for inputs and  outputs (4b2841ecf)
* ♻️ refactor(core): enhance Challenge class methods to support asynchronous operations for improved performance and reliability (cf17c4da5)
* ♻️ refactor(core): update Code class methods to support asynchronous operations for improved performance (00c2c7004)
* ♻️ refactor(lsp): update DeleguaLsp methods to support asynchronous operations and improve error handling (31e902472)
* ♻️ refactor(core): update LspProvider interface methods to return Promises for improved asynchronous handling (38e077442)
* 🖥️ ui(web): increase minimum size of assistant panel in ChallengeLayoutView for better usability (9410d8daf)
* 🖥️ (ui): remove console log statements from various hooks and components for cleaner code (a018d696c)
* 🐛 fix(core): export use cases from conversation module for improved structure and accessibility (59ca8beb5)
* ♻️ refactor(server): remove unnecessary blank line in FetchChatsController for cleaner code (3cee78e52)
* 🖥️ ui(studio): remove unused global CSS import in Root component for cleaner code (f82ee4686)
* 📟 rpc(web): remove NotificationService from AccessChallengePageAction and related functions for cleaner dependency management (3816a2496)
* 🖥️ ui(studio): refactor Root component to Layout and update global styles import for improved structure (89fb7eb6c)
* ⚙️ config(studio): update start script in package.json to use 'serve' for serving the client index.html (bd64adb8c)
* ⚙️ config: add Vercel configuration for URL rewrites to serve index.html (f9024d479)
* ⚙️ config: update .gitignore to exclude .vercel directory (6b6820956)
* ⚙️ config: add build:studio script to package.json (64953b376)
* 🐛 fix(web): refactor cookie actions in handleRestError to use getCookie and setCookie for improved clarity and maintainability (f39a580f0)
* 🖥️ ui(web): enhance error notification handling in ChallengePage and AccessChallengePageAction with improved logging (caa28b209)
* 🖥️ ui(web): initialize NotificationService in ChallengePage for error notification handling (8ec3398d5)
* 🖥️ ui(web): integrate NotificationService into AccessChallengePageAction for enhanced error handling (8be547f91)
* 🖥️ ui(web): fix console log syntax in ChallengePage for improved debugging clarity (4092c51b6)
* 🖥️ ui(web): add console logs in ChallengePage and useChallengeLayout for improved debugging (9ba883f10)
* 🖥️ ui(web): add console log for challengeDto in ChallengePage for debugging purposes (c328c6b46)
* 📶 rest(server): replace AuthError with NotGodAccountError in VerifyGodAccountController for improved error handling (bb6124910)
* 🖥️ ui(web): implement CodeEditorToolbarView component for improved code editor functionality and refactor CodeEditorToolbar to utilize the new view (3c594e2ac)
* 🖥️ ui(web): add console logs for debugging challenge fetching in AccessChallengePageAction and useChallengePage (5bd380b10)
* 🌐 domain: add event exports from manual domain for enhanced functionality (982cfd4fb)
* 🖥️ ui(web): import actionClient in challengingActions.ts for improved functionality (745fc72fb)
* 🖥️ ui(web): fix rendering issue by removing trailing backslash in RocketAnimation component on SignInPageView (55031c335)
* 🧪 tests: remove test for insignia already exists error in UpdateInsigniaUseCase due to role refactor (ddc2c268d)
* 🖥️ ui(studio): remove 'god' option from insignia role selection in InsigniaFormView (133d16242)
* 📮 validation: remove 'god' role from insigniaRoleSchema to align with recent refactor (3888d8b36)
* 🖥️ ui(studio): update sign-in form to use signInGodAccount and redirect to dashboard (95f081200)
* 🖥️ ui(studio): improve trend display text for clarity and consistency (0da620ed7)
* 📶 rest(server): add signInGodAccount route and enhance various routers with verifyGodAccount middleware (d675b689b)
* 📶 rest(server): add verifyGodAccount method to AuthMiddleware for god account validation (6517a410c)
* ♻️ refactor(domain): remove 'god' role from InsigniaRole and related methods (3a9367406)
* 🪨 constants(server): add godAccountId to environment variables and update schema validation (87652ee82)
* 📶 rest(server): implement signInGodAccount method as a placeholder in SupabaseAuthService (d973c8101)
* 📶 rest(server): add SignInGodAccountController for god account authentication (04e80654e)
* 📶 rest(server): add VerifyGodAccountController to validate god account access (b9b9500f0)
* 📶 rest: enhance AuthService with social account functionalities and additional sign-in methods (08e6de5d9)
* 🌐 domain: add NotGodAccountError class for authentication handling (e37df364e)
* 🖥️ ui(web): remove duplicate Mdx component in ChallengeDescriptionSlotView for cleaner rendering (b857ab086)
* 🖥️ ui(web): remove console log for message limit check in useAssistantChatError for cleaner error handling (d70e47972)
* 📚 docs(web): update infinite list plan status to completed and correct typo in prop name (06961a490)
* 🤖 ai(web): correct typos in manual prompts for clarity and consistency in guidelines (c6f694c95)
* 🖥️ ui(web): fix typo in AssistantChat component props for consistent naming of isAssistantAnswering (e03f9e8bb)
* 🖥️ ui(web): remove unnecessary ref from assistant panel in ChallengeLayoutView for cleaner code (19eb7ac7d)
* 🖥️ ui(web): introduce AssistantChatbot component with view and hooks for managing chat interactions and state in AssistantChatbot (c7c607cda)
* 🖥️ ui(web): add AssistantChatView and AssistantResponse components for enhanced chat message rendering and response handling in AssistantChatbot (1d65ec88d)
* 🖥️ ui(web): add AssistantMessageView component for rendering chat messages with parsing logic in AssistantChatbot (4ee2b0934)
* 🖥️ ui(web): implement AssistantChat component with chat message handling and error management in AssistantChatbot (89c7aa5ce)
* 🖥️ ui(web): implement ChatInput component for user message input in AssistantChatbot with dynamic resizing and send functionality (fb09f46bc)
* 🖥️ ui(web): add AssistantChatError component to handle and display error messages in the AssistantChatbot (fd8bebc1f)
* 🖥️ ui(web): implement AssistantChatsHistory component for displaying and managing chat history with loading and delete functionalities (97606cd37)
* 🖥️ ui(web): add AssistantGreeting component to display personalized greeting and assistance options for users (222f781a7)
* 🖥️ ui(web): remove layout selection popover from ChallengePageView and add assistant toggle button to CodeEditorToolbar (c8c248519)
* ♻️ refactor(core): change MAX_MESSAGE_COUNT to static for IncrementAssistantChatMessageCountUseCase (7a8c79087)
* 🖥️ ui(web): integrate AssistantChatbot into ChallengeLayoutView and update props for assistant feature (6aa10b4a5)
* 🖥️ ui(web): remove title prop from UserView component and adjust avatar size to 64 (330a74ce5)
* 🖥️ ui(web): add ConversationService to useRest hook for enhanced chat functionality (2a565b050)
* 🖥️ ui(web): add 'robot' and 'hourglass' animation names to AnimationName type (beefae881)
* 🖥️ ui(web): refactor StarBorder component styles and improve inner content padding (5dd179f60)
* 🤖 ai(web): enhance VercelAssistUserWorkflow to include smooth streaming for assistant responses (4c16a4345)
* ♻️ refactor(web): remove unused assistant chat message count increment logic from AskAssistantController (30bc7e1be)
* 🖥️ ui(web): implement assistant feature in ChallengeStore with state management and actions (2d7df46bc)
* 🖥️ ui(web): add new icons for AI features including Robot, Sparkle, and ClockCounterClockwise (364ff6816)
* 🪨 constants(web): add conversation assistant endpoint for chat interactions (4d0672420)
* 🪨 constants(web): add assistantChats endpoint to cache configuration (7ccd4eac1)
* 🤖 ai(web): update manual prompts to clarify restrictions on code blocks and user interaction guidelines (a1c2dc423)
* 🖥️ ui(web): update useAuthContextProvider to disable refetching on focus (7584f76f2)
* 🖥️ ui(web): add new Lottie animations for hourglass and robot, and update LOTTIES export (e86f8b4f2)
* 📚 docs(web): add initial plan for InfiniteList widget development (8128d60e1)
* 📦 deps(web): add throttleit package for improved request handling (6f9e2469e)
* ♻️ refactor(web): correct typos in assistant agent prompt (77f9f8043)
* 📶 ui(web): introduce InfiniteList component with view and hook for infinite scrolling functionality (51f9b5040)
* 🧪 test: update IncrementAssistantChatMessageCountUseCase tests to reflect new message count logic and limit conditions (15ad2dabf)
* ✨ use case: increase maximum message count limit in IncrementAssistantChatMessageCountUseCase and adjust condition for exceeding limit (cfa93bc24)
* ♻️ refactor(core): remove test for max messages limit in SendChatMessageUseCase (1b15cb001)
* 🐛 fix(server): correct typo in UpstashCacheProvider for setting expiration time in cache options (9927a1eea)
* 🤖 ai(web): correct typo in manual prompts to enhance clarity for user instructions (0300947ff)
* 🤖 ai(web): update assistant agent to use Google model and adjust stop condition (d3059c847)
* 🤖 ai(web): refine manual prompts with clearer formatting and response guidelines for user interactions (01e1fb54d)
* 📶 rest(web): enhance ConversationService with incrementAssistantChatMessageCount method (bac1c6d33)
* ♻️ refactor(web): update AskAssistantController to accept dependencies as an object and improve message handling logic (614ac5fd1)
* ⚙️ config(server): add NotAllowedError handling in HonoApp for improved error response management (ce1e4ecd4)
* ⚙️ config(server): add route for incrementing assistant chat message count (3ee55cd87)
* 📶 rest(server): implement IncrementAssistantChatMessageCountController to handle message count increments (e29e1e606)
* 📦 deps(server): add @upstash/redis and throttleit packages for enhanced caching and throttling capabilities (c6cb52edc)
* 📚 docs(server): add documentation for IncrementAssistantChatMessageCount endpoint and its implementation details (55cf2de4b)
* 🧰 prov(server): implement UpstashCacheProvider for caching functionality with Redis integration (8f1ac0e09)
* 📦 deps(server): add error exports to conversation module for improved error handling (330206497)
* 🪨 constants(server): add HTTP status code for 'Method Not Allowed' (405) to enhance API response handling (52410548a)
* 🧪 test: add unit tests for IncrementAssistantChatMessageCountUseCase to validate message count logic and error handling (75549333e)
* 📑 interface: add CacheProvider interface and CacheOptions type for caching functionality (75c44f63f)
* ✨ use case: increment assistant chat message count (7c83f4243)
* 🌐 domain: add formatTimeAgo and getEndOfDay methods to Datetime interface and DayJsDatetime implementation (e8e562b17)
* 🧪 test: enhance ListChatMessagesUseCase tests to validate chat not found error handling and message retrieval (28e84377c)
* ♻️ refactor(core): simplify ListChatMessagesUseCase by removing userId dependency and handling chat not found error (825fd9608)
* ♻️ refactor(server): remove accountId dependency from FetchChatMessagesController to simplify message fetching (899e32049)
* 🧪 test: add unit tests for CreateChatUseCase to validate chat creation logic (990a03bc6)
* 🧪 test: add unit tests for ListChatsUseCase to verify chat listing with pagination (76fcdb637)
* 🔀 rest(server): implement FetchChatsController and update API routes for chat management (1cb35d109)
* ✨ use case: list chats (b582892df)
* 📦 deps(core): add types export for conversation domain to enhance type management (690965d3c)
* 🌐 domain: remove ChatMessagesListingParams and introduce ChatsListingParams for improved chat filtering (c2d4d9f27)
* 💾 db(server): update ChatsRepository to use findManyByUser method with pagination and search support (f31f6b97d)
* 📶 rest(server): add CreateChat and FetchChats routes to ChatsRouter with corresponding controllers (67e205647)
* ✨ use case: create chat (fb89d1861)
* ♻️ refactor(web): remove unused import of ChatMessageDto in AskAssistantController to streamline code (be96d2b02)
* 🐛 fix(web): improve error handling in AskAssistantController by adding checks for user and assistant message responses (8156ce9d6)
* 🐛 fix(web): add check for missing token in SetAccessTokenController to prevent cookie setting errors (2796d8ff5)
* 📚 docs(server): update status of Search Embeddings endpoint plan to reflect completion (6340cfa1e)
* ⚙️ config(web): update query parameter in Search guides to improve clarity of user intent (028e76ef4)
* ♻️ refactor(web): correct typo in manual prompts to enhance clarity in user instructions (cf7458871)
* 📚 docs(server): update Search Embeddings endpoint plan to reflect changes in query parameters and endpoint path (908891356)
* 📶 rest(web): refactor AskAssistantController to enhance code readability by restructuring assistUser callback and improving formatting (534bacfba)
* 🧪 test: remove redundant documentId from SearchEmbeddingsUseCase tests for clarity (05bdb1081)
* 🧪 test: simplify GenerateEmbeddingsUseCase tests by removing redundant documentId and updating expectations (2039bb71e)
* 🧪 test: fix previousMonth test to correctly account for month indexing (13e97f120)
* ⚙️ config(server): add new endpoints for managing files and searching embeddings in the storage service (f9bc5a7a6)
* 📚 docs(server): add initial plan for Search Embeddings endpoint implementation (acd45e501)
* 🧰 prov(server): refactor MastraMarkdownEmbeddingsGeneratorProvider for improved code clarity and formatting (2ed3494bc)
* 📶 rest: update StorageService endpoints to include 'files' in URL paths and add searchEmbeddings method for querying embeddings (3100e01e9)
* 📶 rest(web): refactor AskAssistantController to improve chat message handling and streamline user message processing (154e5871c)
* ⚙️ config(web): add SetAccessTokenController to middleware for enhanced authentication handling (067e43049)
* 🤖 ai(web): rename assistantUser to assistUser for improved clarity in VercelAssistUserWorkflow (85504a4ec)
* 🤖 ai(web): update assistantAgent to increase step count and enhance manualToolset with searchGuidesTool for improved guide searching (ffeb0aad6)
* 🤖 ai(web): enhance MANUAL_INSTRUCTIONS and implement searchGuidesTool for improved user assistance (d12585cbd)
* 🤖 ai(web): add SearchGuidesTool for querying guides based on user input (db09fc53f)
* 🧪 test: add unit tests for SearchEmbeddingsUseCase to validate embedding search functionality and error handling (db8f07537)
* ✨ use case: implement SearchEmbeddingsUseCase for querying embeddings based on user input (07a560456)
* 📶 rest(server): add getHeader method to HonoHttp for improved header retrieval (f1b0a9894)
* 📶 rest(server): introduce EmbeddingsStorageRouter and FilesStorageRouter for managing embeddings and file operations (50a32b6fc)
* 📶 rest(web): implement StorageService for file management and embedding search functionality (690402b86)
* 📶 rest(web): update ConversationService to fetch and send chat messages with correct API endpoints (8ce7161a9)
* ♻️ refactor(core): remove documentId parameter from generate method in MastraMarkdownEmbeddingsGeneratorProvider (de10e34a7)
* 📶 rest(server): add SearchEmbeddingsController for querying embeddings with specified parameters (0bab4cbe0)
* 🧰 prov(server): add VercelEmbeddingsGeneratorProvider for generating embeddings using Google Gemini model (38e4716a9)
* 🧰 prov(server): update store method in UpstashEmbeddingsStorageProvider to accept documentId as a parameter (6883d7c66)
* 📑 interface: add getHeader method to Http interface for enhanced header retrieval (56843da38)
* 📶 rest(web): add getHeader method and enhance cookie handling in NextHttp for improved request management (5431266e0)
* 📶 rest(web): add SetAccessTokenController to handle access token management via cookies (3514fd7cc)
* 📶 rest(web): enhance query parameter handling in addQueryParams function for improved URL encoding (7206fa1a7)
* ♻️ refactor(core): remove documentId from Embedding and EmbeddingDto, update related interfaces for consistency (bd7406d71)
* ♻️ refactor(core): update validation error message in EmbeddingNamespace to use correct terminology for workspace (a99cbffdc)
* ♻️ refactor(core): change imports in EmbeddingStorageProvider to use type imports for better clarity (dd9502ebc)
* ♻️ refactor(core): update validation error message in EmbeddingNamespace to reflect correct terminology (165a6b768)
* ♻️ refactor(core): improve delete method formatting in UpstashEmbeddingsStorageProvider for better readability (ec7886ec5)
* 🐛 fix(core): update storage structures path in package.json to reflect new directory structure (ed4398d3e)
* 🧪 test(core): add unit tests for GenerateEmbeddingsUseCase to validate embedding generation and storage (f408274b5)
* 🧰 prov(server): implement UpstashEmbeddingsStorageProvider for managing embeddings storage and retrieval (9f011f9db)
* 📦 deps(core): add manual events entry to package.json for event handling (78ce97805)
* 🎞️ queue(server): integrate GuideContentEditedEvent and create GenerateGuideEmbeddingsJob for processing guide content edits (3ca717777)
* 🎞️ queue(server): add GenerateGuideEmbeddingsJob for processing guide content edits (677ef41a2)
* ✨ use case: generate embeddings (8fe6774a1)
* ♻️ refactor(core): update EditGuideContentUseCase to use Broker for event publishing instead of embedding generation (9104db034)
* ♻️ refactor(server): replace MastraMarkdownEmbeddingProvider with InngestBroker in EditGuideContentController (0e929b76a)
* ♻️ refactor(server): remove addManyEmbeddings and related methods from SupabaseGuidesRepository and GuidesRepository interface (ad0a51f26)
* ♻️ refactor(server): replace MastraMarkdownEmbeddingProvider with MastraMarkdownEmbeddingsGeneratorProvider (309126bf3)
* 🌐 domain: add GuideContentEditedEvent for handling guide content edits (765e7e586)
* 📑 interface: introduce EmbeddingsGeneratorProvider and EmbeddingsStorageProvider interfaces (57b54ec27)
* 🌐 domain: add workspace property to Embedding class and create EmbeddingDto for data transfer (140244db9)
* 📦 deps(server): downgrade @ai-sdk/google to 2.0.51 and add @upstash/vector and ai packages (14004438d)
* ⚙️ config(server): integrate ConversationRouter into HonoApp (2e679311d)
* ♻️ refactor(server): enhance FetchChatMessagesController and SendChatMessageController to include ChatMessagesRepository for improved message handling (657ecd6ea)
* ♻️ refactor(core): update ListChatMessagesUseCase and SendChatMessageUseCase to utilize ChatMessagesRepository for message handling (a454f3f89)
* 💾 db(server): implement SupabaseChatMessagesRepository for managing chat messages with findAllByChat and add methods (5b80b3c8e)
* ♻️ refactor(core): update createChat method in ListChatMessagesUseCase to replace existing chat instead of adding a new one when renaming (1713ec288)
* 📚 docs(server): correct spelling in chat endpoints plan and improve formatting for better readability (4b01a01bd)
* ♻️ refactor(server): remove console log from add method in SupabaseChatsRepository for cleaner code (0d119395c)
* 🐛 fix: add early return in ListChatMessagesUseCase to prevent unnecessary repository calls (639ad27d9)
* 🐛 fix: update message limit check in SendChatMessageUseCase to use 'greater than or equal' condition and adjust test case accordingly (20b92bc51)
* 🧪 test: enhance ListChatMessagesUseCase tests by including userId in repository calls for improved validation (75ffcb396)
* 📚 docs(server): add chat endpoints plan outlining controllers and use cases for chat functionalities (3280ec924)
* ⚙️ config(server): introduce ConversationRouter and ChatsRouter for managing chat functionalities (c01346adb)
* 📮 validation: add optional sentAt field to chatMessageSchema for message timestamp (bb0c7f8f0)
* 📶 rest(server): add DeleteChatController to handle chat deletion requests (e80237185)
* 📶 rest(server): add FetchChatMessagesController to retrieve chat messages for a specific chat (c3dc6b00e)
* 📶 rest(server): add EditChatNameController to manage chat name updates (bc0735050)
* 📶 rest(server): add SendChatMessageController to handle sending chat messages (907602eaa)
* 🧪 test: add unit tests for ListChatMessagesUseCase to verify chat message retrieval and creation logic (080a79f1e)
* 🧪 test: add unit tests for EditChatNameUseCase to verify chat existence and name updating (8d5f40906)
* 🧪 test: add unit tests for DeleteChatUseCase to verify chat removal and error handling (c195a8963)
* 🧪 test: add unit tests for SendChatMessageUseCase to validate chat existence and message limit enforcement (7679d637e)
* ✨ use case: implement SendChatMessageUseCase for sending messages with chat message limit enforcement (80dd6550b)
* ✨ use case: implement EditChatNameUseCase for updating chat names with error handling (37e1df4c8)
* ✨ use case: implement DeleteChatUseCase for removing chats with error handling (71822b1e2)
* ✨ use case: add ListChatMessagesUseCase to handle fetching and creating chat messages (059a092b5)
* 🌐 domain: refactor Chat entity and DTO to use 'name' instead of 'title' and 'userId' (c301cb4a5)
* 💾 db(server): add chat and chat message types to Supabase schema (db19227fd)
* 💾 db(server): implement Supabase mappers and repository for chat and chat messages handling (bbed559a0)
* ♻️ refactor(core): remove ChatMessagesRepository interface and update ChatsRepository with new methods for message handling (8a11491d9)
* 🌐 domain: introduce ChatNotFoundError for handling missing chat scenarios (81d865a80)
* 🌐 domain: add ChatMessagesExceededError for chat message limit enforcement (4411fecda)
* ♻️ refactor(web): enhance type inference for route parameters in conversation and profile API routes (7d2af0064)
* ♻️ refactor(web): rename solutionSlug to solutionSug in route schema and enhance NextHttpParams type for better type inference (e098ca0d5)
* ♻️ refactor(web): update NextHttpParams type to support generic parameters for improved type safety (e97c56e30)
* ♻️ refactor(lsp): comment out unused code in DeleguaLsp class to improve readability and maintainability (86ce96b70)
* 📦 deps(lsp): update @designliquido/delegua to version 1.0.0 (30bf8f09b)
* 🐛 fix(web): update TypeScript definitions and improve onMount handling in CodeEditor and TextEditor components (2a1cdae61)
* 📦 deps(web): update react and react-dom to version 19.2.3 in package.json (0b91b88ef)
* ♻️ refactor(web): modify fetchChatMessages to return a mock response instead of making an API call (66fdd77b7)
* ♻️ refactor(web): simplify LottieAnimation component by removing unnecessary imports and props forwarding (05b0ae0cf)
* 📦 deps(web): update @testing-library/jest-dom to version 6.9.1 and @testing-library/react to version 16.3.1 in package.json (7f2175f0e)
* 📶 rest(web): update request schemas in AskAssistantController and route for enhanced chat message handling (68ed7e1ce)
* 🤖 ai(web): enhance manual prompts and integrate challenging toolset for improved user assistance (9c4d9b868)
* 🤖 ai(web): add GetChallengeDescriptionTool for fetching challenge descriptions (a2406579e)
* 🪨 constants(web): add CHALLENGING_PROMPTS constant for challenge descriptions (dd7a764a3)
* 🐛 fix(server): add TypeScript ignore comment for embedding model in MastraMarkdownEmbeddingProvider (0b0b3b032)
* 🐛 fix(server): rename 'size' to 'maxSize' in MastraMarkdownEmbeddingProvider for clarity (edb4aaab9)
* 📦 deps(server): update @mastra/rag to version 2.0.0-beta.4 in package.json and remove unused dependencies from package-lock.json (b4d67dce6)
* 🤖 ai(web): fix typos in manual prompts and remove unused tool choice in manualAgents (cc2e46353)
* ♻️ refactor(web): update import statements in AskAssistantController for consistency (9c472f78d)
* ♻️ refactor: update imports in Tool interface and remove unused ChatMessage import in NextHttp (d664acc3f)
* ⚙️ config: add '🤖 ai' category to commitlint configuration for improved categorization of AI-related commits (6c08a074c)
* 📶 rest(web): add '/api/conversation' to public route groups for authentication (5c6742636)
* 📶 rest(web): add REST endpoint for assistant interactions in conversation chats (7012483ec)
* 🤖 ai(web): add AskAssistantController for handling user messages and assistant interactions in conversations (19aa9ac33)
* 🤖 ai(web): implement VercelAssistUserWorkflow for managing assistant user interactions with chat messages (3923ad0aa)
* 🤖 ai(web): add convertToUiMessages utility for transforming chat messages into UIMessage format (503bb7af9)
* 🤖 ai(web): create manualAgents module to define assistant agent with MDX guide tool integration (035f0780c)
* 🤖 ai(web): add manualToolset for managing MDX guide tool functionality (0fb6025ba)
* 🤖 ai(web): introduce GetMdxGuideTool for fetching MDX guides by category (98aafe676)
* 🤖 ai(web): add VercelMcp utility for handling input in a structured manner (2298cbd61)
* 📶 rest(web): implement ConversationService and export related modules (8d3774ba4)
* 📦 deps(core): add conversation module exports and paths for entities, structures, and use cases (42c0babed)
* 📶 rest: add stream method to HonoHttp and NextHttp for enhanced response handling (6ef1acedc)
* 📑 interface: add ManualWorkflow interface for managing assistant user interactions (167386001)
* ♻️ refactor(core): change Embedding import to type import in EmbeddingProvider interface (4e29d3644)
* 📑 interface: add AI-related interfaces for Tool and Mcp to support new functionality (88994b07f)
* ♻️ refactor(core): enhance ChatMessage and ChatMessageSender classes for improved structure and functionality (b7df9fcc5)
* 📑 interface: add ConversationService interface for fetching chat messages (807a6c21e)
* 🪨 constants(web): add MANUAL_INSTRUCTIONS for assistant responses and tools in Delégua language (c428ace94)
* 📮 validation: add conversation schemas and chatMessageSchema for message validation (c22228997)
* 📦 deps(web): add AI SDK dependencies for Google, OpenAI, React, and ai (0d8048cf5)
* 📦 deps(server): add @mastra/hono v0.1.0-beta.13 and @mastra/rag v2.0.0-beta.4 (7aefcdc55)
* 🐛 fix(server): add replaceMany method to GuidesRepository interface (28083f79c)
* 🧪 test: enhance EditGuideContentUseCase tests to include embedding generation and validation (ba64ac050)
* 📶 rest(server): integrate MastraMarkdownEmbeddingProvider into EditGuideContentController for enhanced guide content processing (e33048aea)
* 📦 deps(server): install ai sdk and mastra (c0af258d7)
* ✨ use case: enhance EditGuideContentUseCase to generate and store guide embeddings (4febe5990)
* 🧰 prov(server): implement MastraMarkdownEmbeddingProvider for generating embeddings from Markdown content (6eae96730)
* 📑 interface: add EmbeddingProvider interface for generating embeddings from text (633c91299)
* 🌐 domain: implement Embedding class for managing text and vector data (053c951b2)
* 💾 db(server): add addManyEmbeddings method to GuidesRepository and implement in SupabaseGuidesRepository (8d83566e1)
* 💾 db(server): add guide_embeddings type for managing guide-related data (291332e44)
* 🌐 domain: export ChatAction, ChatActionIntent, and ChatActionStatus from structures (4d1f499e2)
* 🌐 domain: remove CursorResponse class as it is no longer needed (c66372236)
* 🌐 domain: fix Chat creation by correctly passing dto.id and ensure ChatDto includes optional id field (db4829a2e)
* 📑 interface: add ChatMessagesListingParams type and ChatMessagesRepository interface for message retrieval (f58d5aea0)
* 📤 response: add CursorResponse class for paginated response handling (bb8fb37ff)
* 📑 interface: create ChatsRepository interface for chat management operations (d55f3e3fc)
* 🌐 domain: implement ChatMessage and ChatMessageSender structures with DTO support (c4d1c0ef3)
* 🌐 domain: implement ChatAction structure with DTO, intent, and status validation (e293db016)
* 🌐 domain: add ChatDto type definition and export in entities index (8713225da)
* 🌐 domain: implement Chat entity with creation method (353cff952)
* 🐛 fix(studio): update storage folder reference from Rockets to Avatars in removeImageFile function (da4bc53e1)
* 🐛 fix(studio): implement Rockets management features including form, table, and delete dialog (3e89e74fa)
* 🐛 fix(studio): reorganize avatars page components and remove deprecated shop page (a2d86ac8d)
* 🖥️ ui(studio): correct Portuguese spelling in code block insertion prompts (84d14c097)
* 🖥️ ui(studio): fix FetchGuideController to use consistent routeParams naming and update response handling (3ef50fc84)
* 📚 docs(studio): add content editor plan detailing the `ContentEditor` and its toolbar functionality (5419b134d)
* ⚙️ config(server): update GUIDE_ID for fetching guide by ID in guides.rest (d4ed6f006)
* 🖥️ ui(studio): implement GuidePage with content editor and action button functionality (7225507a3)
* 📚 docs(studio): add guide content editing page plan (8d9a546e8)
* 🖥️ ui(studio): implement TextEditor context and toolbar for content editing (345570493)
* ⚙️ config(studio): add GuidePageRoute for displaying individual guides (ae937726a)
* 📶 rest(studio): add ManualService to RestMiddleware and implement fetchGuide method (8caa42c60)
* ✨ use case: update GetGuideUseCase to return guide DTO and add type annotation for execute method (070f54aaf)
* 📦 deps(studio): add @radix-ui/react-toolbar to dependencies (fc01f737a)
* 📶 rest(server): add FetchGuideController and route to retrieve a guide by ID (be94daa78)
* ✨ use case: add GetGuideUseCase to retrieve a guide by ID (66ab30467)
* 🖥️ ui(studio): add success toast message for guide renaming in useGuidesPage (50348bca7)
* ⚙️ config(server): add guideTitle field to the Create guide request in guides.rest (af910ae7a)
* 🖥️ ui(studio): reorder import statements for ManualService and ToastProvider in useGuidesPage (23c41b8c5)
* 📚 docs(studio): correct spelling of "agnóstico" in guides page plan (e8ab0aed2)
* 🐛 fix(web): refactor fetchGuides function to use fetchGuidesByCategory for improved guide retrieval (3944094f0)
* 🖥️ ui(studio): implement GuidesPage with Create, Rename, and Delete functionalities for guides (80e23960a)
* 🖥️ ui(studio): add Skeleton component for loading placeholders (5a84e1f96)
* 🖥️ ui(studio): add type annotation for useToastProvider function (592cc6f2c)
* 🖥️ ui(studio): add manualService to useRest for improved service integration (df6c7c064)
* 🪨 constants(studio): add guidesGrid cache key for improved caching structure (cf5a36465)
* 🖥️ ui(studio): add navigation links for LSP and MDX guides (2a8a995dd)
* 📶 rest: implement ManualService with CRUD operations for guides (5a6ccb038)
* 🪨 constants(studio): update manual guide route to use Guide type for better structure (8367b1af1)
* ⚙️ config(studio): add GuidesRoute and update routes for manual guides (4df944309)
* 📶 rest(studio): add ManualService to RestContext type definition (b733b128e)
* 📚 docs(studio): add guide management page plan to support multiple guide categories (ef8d1b73c)
* 📚 docs(studio): add LSP guide creation button plan with UI components and workflow (2b81d9140)
* 📚 docs(studio): add creation plan for LSP guide with UI components and workflow (43f0f758e)
* ♻️ refactor(server): update CreateGuideController to use guideTitle and guideCategory directly instead of GuideDto (eb92846cb)
* 📚 docs(studio): create initial plan for LSP guides management page with grid layout (5336ccc5f)
* ♻️ refactor(core): update CreateGuideUseCase to use guideTitle and guideCategory instead of guideDto (fbf8bff5a)
* 🖥️ ui(studio): add ExpandableInput and ExpandableInputView components with custom hook (156641f5f)
* ♻️ refactor(core): reorder import statements in EditGuideTitleUseCase for clarity (57ac583ae)
* ♻️ refactor(core): improve type definitions and import structure in EditGuideTitleUseCase (fa86cb75e)
* 📦 deps(core): add manual use-cases export to package.json and main.ts (9a7d9908f)
* 📦 deps(core): add manual structures export to package.json (186166e0c)
* ♻️ refactor(server): update category assignment logic in SupabaseGuideMapper (a2f366c24)
* 🐛 fix(web): correct casing of manualService in returned services (6c42d0c3e)
* 🗃️ ftree(studio): delete all files related to shop page (feb34b8b8)
* 📚 docs(web): update guide controllers and use cases for editing guides (d0a5ad6bd)
* 🐛 fix: update ManualService references to use camelCase and correct endpoint for fetching guides (14618f0eb)
* 🐛 fix: correct import path for Name in EditGuideTitleUseCase (3318f3a2f)
* 📶 rest(server): implement endpoints for editing guide title and content (2a85dc72d)
* 📶 rest(server): add EditGuideTitleController for editing guide titles (edecfd009)
* 📶 rest(server): add EditGuideContentController for editing guide content (f9a7b9abf)
* ♻️ refactor: remove UpdateGuideController and UpdateGuideUseCase implementations (7b8bc8a09)
* 🧪 test: add unit tests for EditGuideTitleUseCase (78fcdc7c9)
* 🧪 test: add unit tests for EditGuideContentUseCase (517b128cb)
* ✨ use case: implement EditGuideTitleUseCase for editing guide titles (37363b0e4)
* ✨ use case: implement EditGuideContentUseCase for updating guide content (a87e62a44)
* 🌐 domain: add setters for title and content properties (d4c8d7386)
* 📚 docs(studio): add initial implementation plan for LSP guides management page (1d4321e4a)
* ♻️ refactor: update SortableGridContainer export and enhance PlanetCollapsible to include storageService (8397de87f)
* 📑 interface: update ManualService interface to include detailed guide operations (f2c284542)
* 📚 docs: add initial documentation for CRUD endpoints of guides (0505f0dcb)
* 📮 validation: add manual module with guide schemas and update exports (dd70f49a9)
* ⚙️ config(server): implement CRUD operations for guides with appropriate middleware and validation (c4df686ce)
* 📶 rest(server): enhance FetchAllGuidesController to support fetching guides by category (2e380e15c)
* 📶 rest(server): add DeleteGuideController for handling guide deletion requests (7e375e29d)
* 📶 rest(server): add UpdateGuideController for handling guide update requests (e489c74cd)
* 📶 rest(server): add ReorderGuidesController for handling guide reordering requests (0260d6d53)
* 📶 rest(server): add CreateGuideController for handling guide creation requests (42ca5fcf4)
* 💾 db(server): implement CRUD operations for guides in SupabaseGuidesRepository (45a9559ba)
* 📦 deps: add manual entities, structures, and use-cases to package exports (f05885155)
* 🌐 domain: add GuidesFaker for generating fake guide data and update Guide entity with position management (a8d651524)
* ♻️ refactor: update CreatePlanetUseCase to manage planet positions using OrdinalNumber (9cebf35d2)
* 🧪 test: update UpdateAchievementUseCase tests to ensure position is preserved during updates (f2689d3a0)
* ♻️ refactor: update CreateAchievementUseCase to use OrdinalNumber for position management (d26d00d1d)
* 🧪 test: add unit tests for guide deletion functionality (7762196f3)
* 🧪 test: add unit tests for ReorderGuidesUseCase functionality (9f8732c8d)
* 🧪 test: add unit tests for UpdateGuideUseCase functionality (733fc7b80)
* 🧪 test: add unit tests for CreateGuideUseCase functionality (09c1b297b)
* 📑 interface: define GuidesRepository interface methods for guide management (c7cd205fc)
* ✨ use case: add GuideNotFoundError for handling guide not found errors (d6d29aa63)
* ✨ use case: implement ReorderGuidesUseCase for reordering guides (b16b97223)
* ✨ use case: implement DeleteGuideUseCase for guide deletion (1699098dc)
* ✨ use case: add UpdateGuideUseCase for updating guides (019a46a17)
* ✨ use case: implement CreateGuideUseCase for guide creation (f42a5cf98)
* 🗃️ ftree(web): rename all files related to manual module (bcd258541)
* 🗃️ ftree(server): rename all files related to manual module (5cbf4b6da)
* 🌐 domain: rename from Doc to Guide (2fe0d1e2f)
* 🌐 domain: add GuideCategory structure (73c51ed6c)
* 📚 docs(studio): fix typos in users page plan documentation (58d61b12e)
* 🖥️ ui(studio): update openExternal function to enhance security with 'noopener' attribute (daef81c21)
* 🖥️ ui(studio): enhance useNavigationProvider to include current route and improve external link handling (0c1aced20)
* ♻️ refactor(web): code structure for improved readability and maintainability (93159c4f6)
* 🖥️ ui(studio): add openExternal function to useNavigationProvider for external link handling (914f83908)
* 📚 docs(studio): update users page plan with formatting improvements and checklist completion (329d2e0a9)
* 📚 docs(studio): add user management page plan with routing and UI components (71e253967)
* 🖥️ ui(studio): implement UsersPage widget and integrate it into UsersPageView (529ce6a22)
* 🪨 constants(studio): add stardustWebAppUrl to environment configuration and schema validation (e9baab48a)
* 🖥️ ui(studio): add useDebounce custom hook for debouncing values (c7ba3f5db)
* 🖥️ ui(studio): add openExternal method to NavigationProvider interface and implementation (4d2e554c6)
* 🖥️ ui(studio): enhance openExternal method with security features and update navigationProvider type (d111a7e7d)
* ♻️ refactor: code structure for improved readability and maintainability (a6f1d7be2)
* 🪨 constants(studio): add stardustWebAppUrl to environment configuration and schema validation (4db20cee8)
* 🖥️ ui(studio): implement challenge click handler in StarItem component (1cfb74a38)
* 🖥️ ui: add openExternal method to NavigationProvider (c0218ae74)
* 📚 docs(studio): add star challenge link plan documentation (df25f0329)
* 📚 docs(studio): update file paths in delete insignia plan documentation (90fc136d6)
* 🖥️ ui(studio): update SidebarView to include separate links for Insígnias, Foguetes, and Avatares in the shop section (ae04e8375)
* 🖥️ ui(studio): add Avatars and Rockets pages with tables, and update ShopPageView to include Insignias tab (a12ccc4a0)
* 📮 validation: add 'insignias' to storageFolderSchema enum (0406d0b05)
* 🖥️ ui(studio): change React import to type-only import for better performance (7ff7247c4)
* ⚙️ config(studio): restructure shop routes to include insignias, rockets, and avatars (310c1b8c3)
* 🌐 domain: export InsigniaRoleValue type for external usage (ca4913c67)
* 🧰 prov(server): add insignias folder ID to GoogleDriveStorageProvider (3dfc14a44)
* 🖥️ ui(web): add CRUD operations for Insignias in ShopService (7572bebc4)
* 📚 docs(studio): update terminology from 'Rocket' to 'Insignia' in creation plan (36f7e44fe)
* 🖥️ ui(studio): reset form state after successful submission in useAvatarForm and useRocketForm (4cba385aa)
* 📚 docs(studio): correct spelling of "Prencher" to "Preencher" in create insignia plan (8e8b20163)
* 📚 docs(studio): correct spelling of "sucesso" in create insignia plan (398904a58)
* 🌐 domain: add insignias folder creation and update folder name validation (818e00508)
* 🗃️ ftree: move InsigniasTable files into InsigniasPage (421cd16a3)
* 🖥️ ui(studio): add InsigniasTable and InsigniasTableView components for insignias management (b65bd5f01)
* 📶 rest(studio): add CRUD operations for insignias in ShopService (c71c2eb1a)
* 🖥️ ui(studio): implement insignias management components and hooks (5b3b7d990)
* 🌐 domain: add SupabaseInsigniaRole type definition (a2798c113)
* 📚 docs(studio): add plans for insignias management (4b388964a)
* 📚 docs: correct plans numeration (8a25dbb15)
* 📚 docs: correct typo in return statement comment for useCheckbox hook (8a66204ae)
* ♻️ refactor(studio): streamline avatar form handling and update image submission logic (4e4922d74)
* 📶 rest(studio): normalize pagination header keys to lowercase and rename clearQueryParams method (b5580c8e2)
* 🖥️ ui(studio): log total items count in usePaginatedCache fetcher response (2e5953345)
* 🧪 test: update CreateAvatarUseCase and CreateRocketUseCase tests to reflect default acquisition and selection states (cdff8d260)
* 📶 rest(web): enhance ShopService with insignias fetching and avatar management methods (39ad800df)
* ♻️ refactor: streamline avatar and rocket creation logic with Logical handling (bfb107994)
* 📑 interface: update Rocket and Avatar handling in ShopService (a6ce14f9f)
* 🌐 domain: add text representation to Image class (1c584cc5a)
* 🖥️ ui(studio): enhance avatar management and streamline shop page components (0fe316b0a)
* ♻️ refactor(studio): update rocket and planet management logic in shop page (e28d23d1b)
* 📮 validation: remove shop schemas export from package.json (34ab6d1ea)
* 📚 docs(studio): add plans for shop page (dd8701ac2)
* 🖥️ ui(studio): add dialog for rocket deletion (52fd28ff3)
* 🖥️ ui(studio): add dialog for avatar deletion (47501c204)
* 📶 rest(studio): implement crud methods in ShopService (188a7f515)
* ⚙️ config(studio): ignore rule files for antigravity IDE (0c729238e)
* 🖥️ ui(studio): implement update and delete operations for shop avatars (7debd4d14)
* 📚 docs: add doc for each application layer (cb91c0dea)
* 📶 rest(studio): add createAvatar method to ShopService for creating new avatars (7c3b04a26)
* 🖥️ ui(studio): refine checkbox checked state text color (25aac5db9)
* 🖥️ ui(studio): implement avatar creation form with corresponding API endpoint and minor checkbox styling adjustment (6b34037dd)
* 🖥️ ui(studio): add avatar creation form and service integration, and update checkbox styling (079e422ae)
* 📚 docs(studio): implement RocketsTable and AvatarsTable components with search, sorting, and pagination features for shop management (6260eff5f)
* 🖥️ ui(studio): create ShopPageView component to manage shop items with tabs for Rockets and Avatars (6656ace25)
* 🖥️ ui(studio): create AvatarsTableView component for displaying avatars with search, sorting, and pagination features (8f5199181)
* 🖥️ ui(studio): add Loja section to Sidebar and create ShopPage component for shop functionality (99b14dc2e)
* 🖥️ ui(studio): add RocketForm and RocketFormView components for rocket creation with validation and image upload (2eba62bd2)
* 🐛 fix: correct default selection logic for Avatar and Rocket entities (820552ebe)
* 🖥️ ui(studio): add RocketsTable component with search, pagination, and create functionality (352a69d0a)
* 🖥️ ui(studio): implement AvatarsTable component with pagination and search functionality (a9c2d22cd)
* 🖥️ ui(studio): add Pagination component and PaginationView for item navigation (e7c190ec8)
* ⚙️ config(studio): add ShopService to RestContext (ba23e307d)
* 📶 rest(studio): extend ShopService interface with rocket and avatar management methods (96b178b24)
* 📮 validation: add shop module with rocketSchema and update exports (c02c297de)
* ⚙️ config(studio): add ShopRoute component and update routes constant to include shop path (35cc72264)
* 🖥️ ui(web): add ShoppingCart icon to LucideIcon component and update IconName type (3f5a7947a)
* 💾 db(server): add oauth_client_states type definitions and update user_id constraints for improved data integrity (01bba9a63)
* 📚 docs(server): correct typo in CRUD endpoints plan for Insignias to improve clarity (4c8923299)
* ♻️ refactor: remove unnecessary type assertion for HonoHttp instantiation in InsigniasRouter for cleaner code (16eafd393)
* 🧪 test: add validation for existing insignia role in UpdateInsigniaUseCase to prevent duplicates (ec73f9d82)
* ♻️ refactor: remove debug log from add method in SupabaseInsigniasRepository for cleaner code (ff36ce2e9)
* 📮 validation: update insigniaRoleSchema to include 'god' role for enhanced role validation (08397330c)
* 🌐 domain: extend InsigniaRole to include 'god' role with corresponding methods and validation (3307dd52f)
* 🐛 fix: correct typo in InsigniaAlreadyExistsError message for consistency (07bcd6ae5)
* 📚 docs(server): add CRUD endpoints plan for Insignias, detailing core, REST, database, and validation layers (be96027d2)
* 🌐 domain: make 'id' property optional in InsigniaDto for improved flexibility (f39b0b8a5)
* ⚙️ config(server): add routes for creating, updating, and deleting insignias in InsigniasRouter (1dff5c4b7)
* 💾 db(server): enhance SupabaseInsigniasRepository with methods for finding, adding, replacing, and removing insignias (79a4272d6)
* 📶 rest(server): add DeleteInsigniaController for handling insignia deletion requests (704e1f7e6)
* 📶 rest(server): implement UpdateInsigniaController for handling insignia update requests (578c5dd7a)
* 📮 validation: add shop module with insignia schema for validation (ddec79fdb)
* 📑 interface: extend InsigniasRepository with new methods for finding, adding, replacing, and removing insignias (3c0fe5311)
* 🧪 test: add unit tests for UpdateInsigniaUseCase to verify functionality and error handling (5c78aa2c5)
* 🧪 test: add unit tests for DeleteInsigniaUseCase to verify error handling and insignia removal (6e06faaaf)
* 🧪 test: add unit tests for CreateInsigniaUseCase to validate role conflict handling and insignia creation (33d34826a)
* ✨ use case: implement CreateInsigniaUseCase for creating insignias and handling role conflicts (69cdbdf3a)
* ✨ use case: implement DeleteInsigniaUseCase for removing insignias and handling not found errors (f945720db)
* ✨ use case: implement UpdateInsigniaUseCase for updating insignia details and handling conflicts (38f04ffe7)
* ✨ use case: implement CreateInsigniaController for handling insignia creation requests (b77ad6459)
* 🌐 domain: add InsigniasFaker for generating mock insignia data (c70397f02)
* 🌐 domain: add InsigniaNotFoundError to handle missing insignia cases (8da235c91)
* 🌐 domain: add InsigniaAlreadyExistsError for handling conflicts with existing insignias (a0186e7f3)
* 💾 db(server): remove findBySlug method from SupabaseAvatarsRepository and update type imports (3b0a9ced7)
* ♻️ refactor: rename methods for clarity in UpdateAvatarUseCase and UpdateRocketUseCase (d47fb98e0)
* 💾 db(server): extend Database type with oauth_client_states and update user_id constraints across multiple tables (6a5b855f8)
* ⚙️ config(server): implement CRUD operations for rockets in RocketsRouter with authentication and validation (1447a0087)
* ⚙️ config(server): implement CRUD operations for avatars in AvatarsRouter with authentication and validation (924f1cc35)
* 🌐 domain: add setter for isSelectedByDefault in ShopItem class to allow dynamic selection state updates (53258e3c3)
* 🐛 fix: update AuthorAggregatesFaker to use fakeAuthor instead of fakeAvatar for generating author DTOs (77297042a)
* 📦 deps: add shop schema import to package.json for module integration (8dbb58b3a)
* 💾 db(server): enhance SupabaseRocketsRepository with methods for default selection, addition, replacement, and removal of rockets (15f2836ac)
* 💾 db(server): enhance SupabaseAvatarsRepository with new methods for avatar management (449f034d5)
* 📶 rest(server): implement UpdateRocketController for handling rocket update requests (e55be69c0)
* 📶 rest(server): implement DeleteRocketController for handling rocket deletion requests (f3f027b0a)
* 📶 rest(server): implement DeleteAvatarController for handling avatar deletion requests (6c7c621c7)
* 📶 rest(server): implement UpdateAvatarController for handling avatar update requests (187e3f893)
* 📶 rest(server): implement CreateRocketController for handling rocket creation requests (43c1b2076)
* 📶 rest(server): implement CreateAvatarController for handling avatar creation requests (ebf96e351)
* 🧪 test: add unit tests for UpdateRocketUseCase to validate rocket update logic (d98209c20)
* 🧪 test: add unit tests for DeleteRocketUseCase to validate rocket deletion logic (f701a558f)
* 🧪 test: add unit tests for DeleteAvatarUseCase to validate avatar deletion logic (754b39112)
* 🧪 test: add unit tests for CreateRocketUseCase to validate rocket creation logic (a790cb9c9)
* 🧪 test: add unit tests for CreateAvatarUseCase to validate avatar creation logic (2fc2dfb73)
* 📮 validation: add shop module with avatar and rocket schemas for validation (3e83cb39c)
* 🧪 test: add unit tests for UpdateAvatarUseCase to validate avatar update logic (7e9f11f6c)
* ✨ use case: add UpdateRocketUseCase for updating rocket logic and export new use cases (732d1fdd9)
* 🐛 fix: update default selection logic for Avatar and Rocket entities (2d136737f)
* ✨ use case: implement DeleteAvatarUseCase for avatar deletion logic (355951edf)
* ✨ use case: implement DeleteRocketUseCase for rocket deletion logic (486fdc843)
* ✨ use case: implement UpdateAvatarUseCase for avatar update logic (32b33657f)
* ✨ use case: implement CreateRocketUseCase for rocket creation logic (7a4f1b8e1)
* ✨ use case: add CreateAvatarUseCase to handle avatar creation logic (d0deb8413)
* 📚 docs(server): implement CRUD endpoints for rockets including use cases, controllers, validation schema, and database methods (6be266a14)
* 📚 docs(server): implement CRUD endpoints for avatars including controllers, validation schema, and database methods (75de26f86)

## 0.10.2 (2025-12-17)

* ⚙️ config(web): add Layout component for challenge pages with custom metadata configuration (21e9308f)
* 🖥️ ui(web): disable prefetching for challenge links in ChallengeCardView to improve performance (54b4a7b8)

## 0.10.1 (2025-12-13)

* ♻️ refactor: remove challengeId parameter from solutionsRepository.add and update related tests for consistency (5b002c31)
* ♻️ refactor(server): update SolutionsRepository to remove challengeId parameter and enhance SupabaseSolutionMapper with additional fields (4b5154da)
* 🌐 domain: add challengeId field to SolutionsFaker for enhanced solution generation (24af7ac7)
* 📶 rest(server): refactor FetchChallengesListController and FetchAllChallengesController to streamline accountId handling (e95dcaf0)
* ✨ use case: update ListChallengesUseCase to make accountId optional and improve challenge filtering logic (7b482cb5)
* 🖥️ ui(web): enable refetching on focus in useChallengesList for improved data freshness (ddddb104)
* 🧪 test: update AccessSolutionPageController tests to use fetchChallengeById for improved clarity and accuracy (fc439624)
* 📮 validation: replace booleanSchema with queryParamBooleanSchema in ChallengesRouter and update validation logic (74cd112e)
* 🖥️ ui(web): enhance ChallengesList and ChallengeEditor to support user-specific challenges and public visibility options (53f84864)
* ⚙️ config(server): implement routes for fetching challenges by ID and slug, and add support for fetching all challenges with pagination and filtering (1976ec7c)
* 📶 rest(server): update FetchChallengeController to include challengeId in request parameters for enhanced challenge retrieval (1f127127)
* 📶 rest(server): enhance FetchChallengesListController to include author-specific challenges (2983f2ac)
* 📶 rest(web): update AccessSolutionPageController to fetch challenge by challengeId for improved data retrieval (c8740b11)
* 📶 rest(server): add FetchAllChallengesController for improved challenge retrieval with pagination and filtering options (dc052c21)
* 💾 db(server): enhance SupabaseChallengesRepository with additional filtering options for challenges based on star status and author (9ae5cfd3)
* ✨ use case: enhance ListChallengesUseCase with additional request parameters for improved challenge filtering (b2524f04)
* ✨ use case: add optional challengeId to GetChallengeUseCase for enhanced challenge retrieval (f6923069)
* 📶 rest(web): enhance ChallengingService with new fetchChallengesList method and update ChallengesListParams for improved challenge filtering (ed9e5778)
* 📮 validation: update booleanSchema to use z.coerce.boolean() for improved type coercion (e3570175)
* 💾 db(server): include challengeId in SupabaseSolution type and mapper for improved data handling (8f48f5bd)
* 🌐 domain: add challengeId to Solution entity and DTO for enhanced solution tracking (319bf813)

## 0.10.0 (2025-12-12)

* 📦 deps(lsp): upgrade @designliquido/delegua to version 0.65.0 (38191594)
* ♻️ refactor(web): reorder imports and update server error message for clarity (232c8baa)
* 🖥️ ui(web): update BackPageLink to conditionally render based on account authentication status (c3d66704)
* 🐛 fix(server): update userCompletedChallengesIds to use DTO format for consistency in response (1da2527c)
* ✨ use case: add ConflictError handling for duplicate IDs in ReorderAchievements, ReorderPlanetStars, and ReorderPlanets use cases (c9836882)
* 🖥️ ui(studio): handle optional chaining for selectedQuestion data in DragAndDropListQuestionEditor (7e326912)
* 📶 rest(studio): update reorderPlanets and reorderPlanetStars methods to use PATCH instead of PUT for improved API consistency (2436a0b6)
* 🖥️ ui(studio): rename from Sortaable to SortableList to distingush from SortableGrid widget (3cac20f7)
* 🖥️ ui(studio): integrate drag-and-drop functionality in AchievementsPage using SortableGrid for improved achievement management (8f237443)
* 🖥️ ui(studio): introduce SortableGrid component with sortable items and drag-and-drop functionality (8cd3bc74)
* 📚 docs(studio): add documentation for achievement grid reordering plan (4f624e1e)
* 📶 rest(studio): add reorderAchievements method to ProfileService for updating achievement order (d02c7cb5)
* 🖥️ ui(web): enhance ProfileService with achievement management methods including fetch, create, update, and delete functionalities (54525763)
* ⚙️ config(server): implement PATCH endpoint for reordering achievements with validation and controller integration (553a3f1e)
* 📶 rest(server): add ReorderAchievementsController to handle reordering of achievements (8d4a5a44)
* 🌐 domain: add setter for position in Achievement class to enable position updates (f3ee8938)
* 💾 db(server): add replaceMany method to AchievementsRepository for bulk achievement updates (f04bcd7b)
* 📚 docs(server): add plan for implementation of ReorderAchievements endpoint with controller, repository method, and associated tests (06aca468)
* 🧪 test: add unit tests for ReorderAchievementsUseCase to validate reordering logic and error handling (4e37b4eb)
* ✨ use case: add ReorderAchievementsUseCase for reordering achievements based on provided IDs (c2af0c9c)
* 🖥️ ui(studio): implement AchievementsPage component with view and logic for managing achievements (343657a4)
* 🖥️ ui(studio): create custom hook useAchievementForm for managing achievement form state and submission logic (02a8d073)
* 🖥️ ui(studio): add AchievementsCard component for displaying and managing achievements with edit and delete functionality (124fd9e5)
* 📮 validation: add 'achievements' and 'rankings' to storageFolderSchema for enhanced validation options (073dfb36)
* 🖥️ ui(studio): refactor Select component for improved styling and add new Textarea component (3186d20c)
* ♻️ refactor(studio): update AchievementsRoute to use new AchievementsPage component and implement clientLoader for fetching achievements (5916ea7f)
* 🖥️ ui(studio): implement AchievementForm components for creating and editing achievements with form validation and UI integration (9a665a28)
* 📚 docs(studio): add achievement deletion plan documentation detailing the implementation of deletion functionality for existing achievements (551183f0)
* 📚 docs(studio): add AchievementForm for editing existing achievements with UI updates and validation (51fe32f5)
* 📚 docs(studio): add AchievementForm for creating new achievements with validation and UI integration (024fe62c)
* 📚 docs: add AchievementsGrid plan documentation outlining the implementation of achievements listing in grid format (0d24d91c)
* ✨ use case: enhance CreateAchievementUseCase to increment position and handle missing achievements (3e648255)
* 📶 rest(studio): extend ProfileService to manage achievements with CRUD operations (a26f9d6b)
* 💾 db(server): add findLastByPosition method to AchievementsRepository (7e6b331b)

## 0.9.0 (2025-12-10)

* 📶 rest(server): update CreateAchievementController to return 201 status on successful achievement creation (7cf6b389)
* ⚙️ config(server): add routes and controllers for creating, updating, and deleting achievements in AchievementsRouter (897f599e)
* 💾 db(server): implement methods for adding, replacing, and removing achievements in SupabaseAchievementsRepository (18d2c50d)
* 📶 rest(server): implement DeleteAchievementController for handling achievement deletion requests (471cc808)
* 📶 rest(server): implement UpdateAchievementController for handling achievement update requests (2c21bbfb)
* 📶 rest(server): implement CreateAchievementController for handling achievement creation requests (69404717)
* 🧪 test: add unit tests for UpdateAchievementUseCase to validate achievement updates (435194be)
* 🧪 test: add unit tests for DeleteAchievementUseCase to validate achievement deletion (715c048c)
* 🧪 test: add unit tests for CreateAchievementUseCase to validate achievement creation (0cde4a48)
* 📑 interface: add methods for managing achievements in AchievementsRepository (ecb0a77b)
* ✨ use case: implement CreateAchievementUseCase for creating achievements in the profile (264508cc)
* ✨ use case: implement UpdateAchievementUseCase for updating achievements in the profile (26ab216d)
* ✨ use case: implement DeleteAchievementUseCase for removing achievements from the profile (ef8ec8c2)
* 📮 validation: add achievementSchema for profile achievements validation (14f28db5)
* 📚 docs(server): add implementation plan for CRUD operations on achievements in the profile module (5f901df1)
* 🖥️ ui(studio): update Recent Activity tabs and fix layout issues in Recent Users table (71fedef8)
* 📶 rest(web): implement fetchUsersList method in ProfileService with unimplemented error (4369fa2b)
* 📶 rest(web): enhance ChallengingService with pagination support (20131ddb)
* 🖥️ ui(studio): add Recent Activity section with Recent Users and Challenges tables (e9062e76)
* ♻️ refactor(server): replace GetUserUseCase with direct repository call in AppendUserCompletedChallengesIdsToBodyController (010aadac)
* 📶 rest(studio): enhance ChallengingService and ProfileService with new methods and logging (2769d051)
* 🌐 domain: add new date formats DateFormat type (fa24debc)
* 📦 deps(studio): add Tabs component and related subcomponents; update package dependencies (6592d4e4)
* ♻️ refactor(server): update FetchImagesListController to align with new listFiles return structure for pagination (ee889b6c)
* ♻️ refactor(server): update listFiles method signatures in storage providers to return ManyItems type for consistency (d65d9194)
* ♻️ refactor(server): standardize repository methods to return ManyItems type for consistency in pagination across various repositories (22edd06d)
* ♻️ refactor: update repository methods to return ManyItems type for improved pagination handling (dff49c0f)
* 🧪 test: add unit tests for ListUsersUseCase to validate user retrieval and pagination response (b360e224)
* 📶 rest(server): add FetchUsersListController and route for paginated user retrieval (17a071f6)
* ✨ use case: add ListUsersUseCase for paginated user retrieval (6053c43e)
* 💾 db(server): implement findMany method in SupabaseUsersRepository (888c6524)
* 🌐 domain: add ManyItems type for handling collections with count (aa39de3f)
* 🖥️ ui(studio): refactor useDailyActiveUsersChart to use constant for default days and improve days selection handling (379c42f7)
* 🖥️ ui(studio): refactor DailyActiveUsersChartView for improved readability and consistency in styling (07f03a2d)
* 📶 rest(web): implement fetchDailyActiveUsersReport method in ProfileService for retrieving daily active users data (dc296c16)
* 🧪 test: update GetDailyActiveUsersReportUseCase tests for response structure and date comparison logic (0e1fcf15)
* 🖥️ ui(studio): enhance dashboard with Daily Active Users chart and refactor KPI display (b86205cf)
* ⚙️ config(server): rename fetchDailyActiveUsersReport route to fetchDailyActiveUsers and improve query validation structure (6c375b4a)
* 🖥️ ui(studio): add ProfileService to useRest hook for enhanced user profile management (41ed4b51)
* ♻️ refactor: update DailyActiveUsersDto structure and simplify GetDailyActiveUsersReportUseCase return value (981ae395)
* 📶 rest(studio): add fetchDailyActiveUsersReport method to ProfileService interface and implementation (d8d6d3d1)
* 🖥️ ui(studio): add Kpis component and KpisView for displaying key performance indicators on the dashboard (a26e2fa1)
* 📦 deps(studio): add chart and toggle components using Recharts and Radix UI (f1304ed7)
* 🧪 test: update GetDailyActiveUsersReportUseCase test to use English labels for date values (1341d12b)
* ✨ use case: reset hours to midnight in GetDailyActiveUsersReportUseCase date generation for accurate daily reports (9f746448)
* ⚙️ config(server): add endpoint for daily active users report with query parameter support (2f72881c)
* 📶 rest(server): add FetchDailyActiveUsersReportController to handle daily active users report requests (f6694241)
* 📮 validation: update integerSchema to use z.coerce.number() for improved type coercion (1ae14bb7)
* 💾 db(server): add countVisitsByDateAndPlatform method to SupabaseUsersRepository for visit counting by date and platform (a4e13f93)
* 🧪 test: add unit tests for GetDailyActiveUsersReportUseCase to validate daily active users report generation (42ed8a7a)
* ✨ use case: implement GetDailyActiveUsersReportUseCase to retrieve daily active users for web and mobile platforms (383830f8)
* 🌐 domain: introduce DailyActiveUsersDto for tracking daily active users across web and mobile platforms (c58269bb)
* 🌐 domain: add static methods to create Platform instances for web and mobile (41734426)
* 🧪 test: enhance ConfirmEmailController tests to include event publishing for user sign-in (a4b18539)
* ♻️ refactor(server): rename EventBroker to just Broker (6481b194)
* 📟 rpc(web): integrate Inngest broker for user sign-in and sign-up events (010360b1)
* 🎞️ queue(web): add Inngest integration with event schemas for user and ranking events (a3c29534)
* 🪨 constants: add Inngest keys and Google Analytics ID to environment configuration (48182c90)
* 🐛 fix: update validation error message for Platform name to specify valid options (b60b3b56)
* 🧪 test: add unit test for user visit registration in User entity (0574d648)
* 🐛 fix(server): update hasVisit method to check user visits within the same day and improve error handling (e22a892c)
* 🎞️ queue(server): update Inngest ID from 'StarDust ServerQueue' to 'StarDust Queue' (f1a7e44c)
* 🎞️ queue(server): enhance inngest to support AccountSignedInEvent and register user visit functionality (ff67a594)
* 🎞️ queue(server): implement RegisterUserVisitJob for processing user visit events (1e63d004)
* 🧪 test: add unit tests for RegisterUserVisitUseCase to validate user visit registration logic (53087eae)
* ✨ use case: add RegisterUserVisitUseCase for tracking user visits (2e99127b)
* 🐛 fix(server): modify error handling in SupabaseUsersRepository to return Logical.createAsFalse() instead of throwing an error (9f7cf216)
* 💾 db(server): add users_visits table type definition and update message versioning (2fee19b9)
* 🌐 domain: add AccountSignedInEvent class and export from events index (43321fd0)
* 🌐 domain: add registerVisit method to User class for tracking user visits (117921ef)
* 🌐 domain: add VisitDto and Visit structure for user visit management (68ca38b1)
* 🌐 domain: introduce Platform class for platform type validation and creation (d045e180)
* 💾 db(server): add methods to handle user visits in SupabaseUsersRepository (efb66578)
* 📮 validation: add platformSchema for platform type validation (6156fcdf)

## 0.8.0 (2025-12-06)

- UI de KPIs na página de dashboard (#230) (e3cca71e)
- 🐛 fix(web): correct import path for TextEditorWidget in
  useTextEditorContextProvider (512be5da)
- 📶 rest(server): update GetPostedChallengesKpiController to use
  GetPostedChallengesKpiUseCase for KPI retrieval (9636836d)
- 💾 db(server): add countAll method to retrieve total challenges and update
  interface to include new counting methods (38af7b23)
- 💾 db(server): add methods to count all users, completed challenges, and
  unlocked stars; update interface accordingly (fec04fec)
- ✨ use case: enhance GetUnlockedStarsKpiUseCase to include total unlocked
  stars count and adjust KPI structure; add corresponding tests (492c266a)
- ✨ use case: update GetCreatedUsersKpiUseCase to include total user count and
  adjust KPI structure; enhance related tests (29abda7d)
- ✨ use case: enhance GetCompletedChallengesKpiUseCase to include total
  completed challenges and adjust tests accordingly (a38810a9)
- 🌐 domain: update Kpi structure to include current and previous month values,
  and adjust related tests (0575ec17)
- ♻️ refactor: introduce GetPostedChallengesKpiUseCase to calculate KPIs for
  posted challenges (9c23bbda)
- 📶 rest(server): register routes for KPI retrieval of created users, completed
  challenges, and unlocked stars (5a2981c2)
- ⚙️ config(server): register route for GetPostedChallengesKpiController to
  handle KPI retrieval for posted challenges (3d3f222c)
- 📶 rest(server): add GetCompletedChallengesKpiController to handle KPI
  retrieval for completed challenges (9996c23a)
- 📶 rest(server): add GetCreatedUsersKpiController to handle KPI retrieval for
  created users (425badd2)
- 📶 rest(server): add GetUnlockedStarsKpiController to handle KPI retrieval for
  unlocked stars (6638ab0d)
- 📶 rest(server): add GetPostedChallengesKpiController to handle KPI retrieval
  for posted challenges (b6e892c0)
- 🧪 test: add unit tests for GetCompletedChallengesKpiUseCase to validate KPI
  calculation for completed challenges (8edd780e)
- 🧪 test: add unit tests for GetCreatedUsersKpiUseCase to validate KPI
  calculation for created users (fd7fd1c4)
- 🧪 test: add unit tests for GetPostedChallengesUseCase to validate KPI
  calculation for posted challenges (f4017b7e)
- 💾 db(server): implement countChallengesByMonth method in
  SupabaseChallengesRepository to count challenges created within a specified
  month (bde768be)
- 💾 db(server): add methods to count users, completed challenges, and unlocked
  stars by month in SupabaseUsersRepository (b8b772be)
- 💾 db(server): add nonce and scopes fields to various database types
  (377c6fd6)
- ✨ use case: add GetUnlockedStarsKpiUseCase to calculate KPIs for unlocked
  stars in the current and previous months (f245e673)
- ✨ use case: add GetCreatedUsersKpiUseCase to calculate KPIs for created users
  in the current and previous months (60c90fab)
- ✨ use case: add GetCompletedChallengesKpiUseCase to calculate KPIs for
  completed challenges (0084e2a9)
- ✨ use case: add GetPostedChallengesUseCase to retrieve and calculate KPIs for
  current and previous month challenges (fe9e7094)
- 🧪 test: add unit tests for Month structure to validate date creation,
  first/last days, and previous month retrieval (814eaf83)
- 🧪 test: add unit tests for Kpi class to validate value creation, trend
  calculation, and trending status (3c8e23d4)
- 🌐 domain: introduce Kpi class and KpiDto for KPI management, and export Month
  structure (f1077959)
- 🌐 domain: implement Month class with methods to retrieve first/last days and
  previous month (db94ca96)
- 🌐 domain: add minusMonths method and first/last day of month functions to
  DayJsDatetime class (70bd35ab)
- 🖥️ ui(web): improve TextEditor value handling and refactor LinkView variable
  for clarity (650f67ba)
- 🖥️ ui(web): update ContentEditorView layout for better responsiveness and
  adjust TextEditor height for improved usability (0ea49124)
- 🖥️ ui(web): fix typo in insertTitleElement function and refactor content
  replacement logic for improved readability (4cab81d4)
- 🖥️ ui: enhance URL validation approach in Link mdx widget (a9e1583f)
- 🖥️ ui(web): update SolutionPageView to import old_ContentEditor for
  compatibility (3911d4c0)
- 🖥️ ui(web): implement getLineLength method in useTextEditor and update
  TextEditor components for enhanced line length functionality (81d4aa25)
- 🖥️ ui(web): update ContentEditorView to replace 'strong' button with
  'quoteTextBlock' for enhanced text formatting options (b72c184d)
- 🖥️ ui(web): add getLineLength method to TextEditorRef for enhanced line length
  retrieval (e318c31d)
- 🖥️ ui(web): enhance LinkView component to sanitize and format URLs for
  improved link handling (04cb8e6c)
- 🖥️ ui(web): standardize naming by correcting 'isRecheadedEnd' to
  'isReachedEnd' in SnippetsList for consistency and clarity (c727ceea)
- 🖥️ ui(web): refine child content rendering logic in ContentView to ensure
  proper handling of string and non-string children (beb9534f)
- 🖥️ ui(web): standardize naming by correcting 'isRecheadedEnd' to
  'isReachedEnd' in ChallengeSolutions components for consistency and clarity
  (1ebe23fd)
- 🖥️ ui(web): remove unnecessary z-index from AnimatedBorderView for cleaner
  layout (8f9055b3)
- 🖥️ ui(web): standardize naming by correcting 'isRecheadedEnd' to
  'isReachedEnd' in usePaginatedCache for consistency and clarity (3ccf0b28)
- 🖥️ ui(web): correct spelling of 'insertTitlelement' to 'insertTitleElement' in
  TextEditorContext for improved clarity and consistency (7f43ad56)
- 🖥️ ui(web): correct spelling of 'Lista numérica' in ContentEditorView for
  improved clarity (d12a489a)
- 🖥️ ui(web): standardize naming by updating 'isRecheadedEnd' to 'isReachedEnd'
  across ChallengesListTab components for consistency and clarity (89917f32)
- 🖥️ ui(web): standardize naming by updating 'isRecheadedEnd' to 'isReachedEnd'
  across SolutionsListTab components for consistency and clarity (e224b497)
- 🖥️ ui(web): standardize naming by updating 'isRecheadedEnd' to 'isReachedEnd'
  across ChallengesList components for consistency and clarity (d35321f1)
- 🖥️ ui(web): fix naming inconsistency by correcting 'isRecheadedEnd' to
  'isReachedEnd' in CommentsList components for improved clarity (a27203fb)
- 🖥️ ui(web): correct import paths for TextEditorWidget and fix naming
  inconsistencies in TextEditorContext for improved clarity (29ef6473)
- 🖥️ ui(web): add ElectricBorderView component for animated border effects and
  update index export for consistency (d114d7c2)

## 0.7.0 (2025-12-04)

- 🖥️ ui(web): remove unused user context in ChallengesList component for cleaner
  code (b735d30d)
- 🖥️ ui(web): fix formatting in TextEditorContextProvider and update placeholder
  text for code blocks (f044cd3d)
- 📦 deps(lsp): upgrade @designliquido/delegua to version 0.61.2 (dd3af24c)
- 🐛 fix(web): adjust logic for acquired rocket count in useRocketItem to ensure
  accurate comparison (a2e6dea4)
- 🖥️ ui(web): adjust brightness levels in AvatarItemView based on acquisition
  status for improved visual feedback (7f45439a)
- 🖥️ ui(web): refactor ContentEditor to separate view logic into
  ContentEditorView for improved maintainability and structure (07a6e453)
- 🖥️ ui(web): update User entity imports to use type for InsigniaRole for
  consistency (176a8f67)
- 🖥️ ui(web): update imports to use old_TextEditor for compatibility in
  CommentInput components (d6a772b9)
- 🖥️ ui(web): add EletricBorder component with view for improved structure
  (f7755a6b)
- 🖥️ ui(web): refactor AnimatedBorder component to utilize AnimatedBorderView
  for improved structure (75c49a3a)
- 🖥️ ui(web): fix import path for TextEditor component to ensure correct
  referencing (7817ad87)
- 🖥️ ui(web): add ConfettiAnimation component with separate view for improved
  structure and maintainability (e2a0f685)
- 📶 rest(server): refactor VerifyUserInsigniaController to utilize User entity
  for insignia validation (addfb533)
- 🖥️ ui(web): enhance ChallengeEditor and Challenges components with improved
  layout and context integration (df729377)
- 🖥️ ui(web): add TextEditor component with hooks and view for enhanced text
  editing experience (7cf58d65)
- 🖥️ ui(web): add StarBorder component with customizable styles and animations
  (d6c63331)
- 🖥️ ui(web): implement TextEditorContext and related hooks for improved text
  editor functionality (a70460a9)
- 🖥️ ui(web): refactor TextEditor component and introduce new TextEditor hooks
  for enhanced functionality (6e5162a1)
- 🖥️ ui(web): introduce TextEditorView component with Monaco Editor integration
  (5da06f0b)
- 🖥️ ui(web): add ElectricBorder component with customizable styles and
  animations (bf23d1aa)
- 📶 rest(web): remove console log from handleRestError for cleaner error
  handling (357974b3)
- 📶 rest(web): remove console logs in NextHttp and NextRestClient for cleaner
  output (0c194f79)
- 📶 rest(server): remove console log for error in SupabaseAuthService to clean
  up debugging output (4714e9ee)
- 📶 rest(web): fix refreshAuthSession logic in handleRestError to correctly
  handle unauthorized responses (6631a262)
- 🖥️ ui(web): refactor to use NextRestClient and set base URL from CLIENT_ENV
  for improved configuration (7b0c3ec1)
- 🐛 fix(web): update import path for authActionClient and remove unused
  accessAuthenticatedPage action (34d7966b)
- 📶 rest(web): log error in SupabaseAuthService for improved debugging of
  authentication issues (de3bac61)
- 📶 rest(web): implement session refresh logic in handleRestError for improved
  authentication handling (7cd4186c)
- 🖥️ ui(web): update import statements for SpaceService and remove redundant
  import (c975a04c)
- 🖥️ ui(web): add 'use client' directive to useRest hook for client-side
  rendering (e11471de)
- 🖥️ ui(web): rename variable for clarity in handleFormSubmit function
  (eb5ce182)
- 📶 rest(web): enhance error handling in NextRestClient and remove
  isAuthenticated from config (60e0060a)
- 📶 rest(web): update NextHttp to await params and modify cookie deletion logic
  (eaa14f60)
- 📟 rpc(web): update import for authActionClient in lessonActions (623493ad)
- 📟 rpc(web): remove unused action client exports from next-safe-action
  (54c1f375)
- 📟 rpc(web): refactor cookieActions to await getCookie call (367a5d86)
- 🖥️ ui(web): update import path for BlurText component in
  UserCreationPendingMessageView (d5516829)
- 🖥️ ui(web): add BlurText component with animation capabilities for text
  blurring effects (58383391)
- 🖥️ ui(web): update tooltip logic in ChallengeInfoView (89c64b94)
- 🖥️ ui(web): update tooltip text in ChallengeInfoView for clarity on acceptance
  rate description (a528756b)
- ⚙️ config(lsp): upgrade @designliquido/delegua dependency to version 0.61.0
  (b18836f9)
- 🖥️ ui(web): refactor Page component to include isAuthenticated parameter in
  NextServerRestClient initialization (92531117)
- 🖥️ ui(web): refactor ChallengesPageView to remove isChallengePostingEnabled
  prop (0eeb50e3)
- 🖥️ ui(web): enhance ChallengeCard component to include user authentication
  handling and completion status (aae20db4)
- 🖥️ ui(web): update useRest hook to conditionally set Authorization header
  based on isAuthenticated parameter (5d323920)
- 🖥️ ui(web): add BackPageLink and BackPageLinkView components to provide
  navigation back to the space page for authenticated users (0b6099dd)
- 🖥️ ui(web): update ChallengesListView to handle completedChallengesIds as an
  array and improve user authentication handling (71d2b932)
- 🖥️ ui(web): add isAccountAuthenticated prop to ChallengesFiltersView and
  conditionally render completion status filter based on authentication status
  (16aeb810)
- 🖥️ ui(web): add PostChallengeLink and PostChallengeLinkView components to
  enable users with engineer role to create challenges (7ebd84c9)
- 🖥️ ui(web): introduce ChallengeInfoView component to enhance challenge
  information display and refactor ChallengeInfo for improved structure
  (aed8732e)
- ♻️ refactor(web): remove duplicate imports of ChallengingService and
  SpaceService in challengingActions.ts (4db8b787)
- 📶 rest(web): add isAuthenticated flag to NextRestClientConfig and
  conditionally set Authorization header (c4fc0619)
- ⚙️ config(server): modify challenges API to change items per page from 20 to
  10 and remove redundant Authorization headers (5dfa6d0e)
- 📶 rest(server): add null check for account in
  AppendUserCompletedChallengesIdsToBodyController to prevent processing without
  a valid account (a49f8036)
- 🧪 test: add unit tests for ListChallengesUseCase to validate challenge
  listing and filtering logic (05c4a511)
- ✨ use case: add null check for userId in ListChallengesUseCase to return
  challenges without filtering (48ef6830)
- ⚙️ config: modify challenges REST API to change itemsPerPage from 20 to 10 and
  remove redundant Authorization headers (a2dcce7e)
- ⚙️ config(web): refactor Page component to include isAuthenticated parameter
  in NextServerRestClient and update export syntax (2b6417ff)
- 🧪 test: add unit tests for ListChallengesUseCase to validate challenge
  listing and filtering logic (0c91de80)
- ✨ use case: handle null userId in ListChallengesUseCase to return challenges
  without filtering (5a72ba7c)
- 🖥️ ui(web): enhance ChallengeCard component to include user authentication
  context and manage challenge completion status (a121dbd3)
- 🖥️ ui(web): refactor ChallengesPageView to remove isChallengePostingEnabled
  prop and integrate BackPageLink and PostChallengeLink components (51a1fe8b)
- 🖥️ ui(web): implement ChallengeInfoView component for improved challenge
  information display and refactor ChallengeInfo to utilize it (a11d9422)
- 🖥️ ui(web): update ChallengesListView to handle completedChallengesIds as an
  array and improve user challenge completion status handling (5c53bb0f)
- 🖥️ ui(web): add isAccountAuthenticated prop to ChallengesFiltersView for
  conditional rendering of completion status filter (74010a91)
- 🖥️ ui(web): clean up imports in challengingActions.ts by removing duplicates
  and organizing service imports (a4a4b570)
- 🖥️ ui(web): update useRest hook to include isAuthenticated parameter for
  conditional authorization header (8800ec12)
- 🖥️ ui(web): add PostChallengeLink and PostChallengeLinkView components for
  user challenge creation (801d2a2c)
- 🖥️ ui(web): add BackPageLink component with navigation to the space route
  (e5e9d4fb)
- ⚙️ config(web): add isAuthenticated flag to NextRestClientConfig and update
  authorization header logic (2f4bf14f)
- ♻️ refactor(server): remove authentication middleware from fetch all challenge
  categories route (e8e039c2)
- 🖥️ ui(web): correct typo in ShopButtonView from 'Aquirido' to 'Adquirido' and
  remove unused fetchInsigniasList method from ShopService interface (07e61530)
- 🖥️ ui(web): refactor InsigniasList components and introduce InsigniasListView
  for improved structure and naming consistency (67ea659e)
- 🧪 test: update test case to reflect error thrown when user is not found in
  VerifyUserInsigniaUseCase (c76a7093)
- ♻️ refactor: replace `VerifyUserInsigniaUseCase` with `GetUserUseCase` and
  throw `InsigniaNotIncludedError` if the user has the specified insignia
  (72bfadfb)
- 🖥️ ui(web): refactor ShopPage component into ShopPageView for improved
  structure and readability (47d64d15)
- 🖥️ ui(web): refactor InsigniasList and InsigniaItem components to simplify
  props and enhance functionality (40a9432a)
- 🖥️ ui(web): update ShopButton and ShopButtonView to allow isSelected prop to
  be nullable (cb686892)
- 🖥️ ui(web): add 'insignias' storage folder type to useImage hook (71766531)
- 🖥️ ui(web): add challenge posting capability to ChallengesPageView based on
  user role (e63a8b56)
- 📶 rest(web): implement VerifyUserInsigniaController and add insignia
  acquisition method to ProfileService (427a418c)
- 🧪 test: add unit test for verifying user insignia presence in User entity
  (cb4e8ce8)
- 🌐 domain: enhance User entity with insignia role management methods
  (5d0f6325)
- 🌐 domain: add InsigniaNotIncludedError for better error handling in insignia
  operations (c18af869)
- 📑 interface: add AudioProvider interface for audio playback functionality
  (b805aaf1)
- 🪨 constants: add AUDIO_FILES constant for audio assets (e8ea0530)
- 🧪 test: add unit tests for VerifyUserInsigniaUseCase to validate user
  insignia roles (ec83987f)
- ✨ use case: add VerifyUserInsigniaUseCase to validate user insignia roles
  (988ada95)
- 🖥️ ui(web): add shop insignias route to cache and update ShopPage to use
  ShopPageView (e1c874a5)
- 🖥️ ui(web): introduce paginated insignias list to shop UI with search and
  price ordering (3c867355)
- 🌐 domain: make AppError properties public again (c1e3f6b7)
- ♻️ refactor(server): remove useless schemas from InsigniasRouter (9bf10848)
- 🌐 domain: throw NotEnoughCoinsError if the user do not have enough coins for
  insignia acquisition (838e7b34)
- 🌐 domain: add NotEnoughCoinsError (73e8c5c0)
- 💾 db(server): standardize string quotes in Database.ts to single quotes for
  consistency (0d9a06fd)
- ⚙️ config(server): add route for acquiring insignias in UsersRouter,
  integrating validation and controller handling (07151ea7)
- 💾 db(server): update SupabaseUserMapper and SupabaseUsersRepository to
  include insignia roles (9ffd1733)
- 💾 db(server): implement addAcquiredInsignia method in SupabaseUsersRepository
  to handle insignia acquisition for users (2dd63599)
- 🌐 domain: add static method createAsEngineer to InsigniaRole for easier role
  instantiation (28df1a47)
- ⚙️ config(server): add InsigniasRouter to handle insignia-related requests,
  including fetching insignia lists (3a0bd756)
- 🧪 test: add unit tests for AcquireInsigniaUseCase, covering user not found
  error, insignia acquisition, and repository updates (9fc5ad73)
- 🧪 test: add unit tests for insignia acquisition logic in User entity,
  including error handling for already acquired insignias (cd7f7e2c)
- 🌐 domain: add insigniaRoles getter to User entity for improved insignia role
  access (812e7a35)
- ✨ use case: refactor AcquireAvatarUseCase and AcquireRocketUseCase to
  introduce AvatarAggregateEntity types (178547f8)
- 📶 rest(server): add AcquireInsigniaController to handle insignia acquisition
  requests and integrate with the AcquireInsigniaUseCase (3dfcf127)
- ✨ use case: implement AcquireInsigniaUseCase for managing insignia
  acquisition, including user validation and repository interaction (cf42fbbe)
- 🌐 domain: introduce InsigniaRole class and integrate into User entity,
  updating related DTO and factory for insignia management (a4e099e5)
- 🌐 domain: add InsigniaAlreadyAcquiredError class and update exports in index
  file (40ce660c)
- 💾 db(server): implement Insignia mapping and repository, update database
  types and exports (65bb78cc)
- 📮 validation: add insigniaRoleSchema for role validation and update exports
  in index file (b0e2e6a2)
- 🌐 domain: add Insignia class and DTO, update exports in index files
  (0b4dd604)
- 📶 rest(server): add FetchInsigniasListController to retrieve insignias and
  update index export (8408615a)
- ⚙️ config(server): remove Authorization header from comments REST API for
  improved security and compliance (d8cfb3ef)
- 🖥️ ui(web): integrate user authentication state into ChallengePage and
  useChallengePage for enhanced user experience (bf9684e4)
- 🖥️ ui(web): remove console log from useAuthContextProvider for cleaner code
  (8c120adf)
- 🖥️ ui(web): enhance CommentsList components with account authentication
  handling and UI updates (f7d23bdd)
- 🖥️ ui(web): integrate useAuthContext in CommentRepliesButton to manage
  authenticated user state (84d72d13)
- 🖥️ ui(web): integrate isAccountAuthenticated state into UpvoteCommentButton
  for enhanced user interaction (70b88644)
- 🖥️ ui(web): add isAccountAuthenticated prop to CommentRepliesButtonView for
  handling authenticated user state (fa6dfa40)
- 🖥️ ui(web): clean up console logs and fix minor typos in Challenge components
  for improved readability (cb3bfae6)
- 🖥️ ui(web): refactor Challenge components to improve structure and add account
  requirement handling in voting and result slots (dda8f658)
- 🖥️ ui(web): rename AuthProvider to AuthContextProvider and update related hook
  usage for improved clarity (c9bccf3e)
- 🖥️ ui(web): remove unused useNavigationProvider import and reorganize ROUTES
  import in Snippet components (3a573cad)
- 🖥️ ui(web): add AccountRequirementAlertDialog component for handling account
  requirement alerts with navigation support (4c437c0d)
- 🖥️ ui(web): add useAuthContextProvider hook for managing authentication state
  and user interactions (c8902e57)
- 📶 rest(web): update public route handling in VerifyAuthRoutesController to
  include new playground snippets and route groups (8ea7aa45)
- 📟 rpc(web): enhance user authentication handling in AccessChallenge actions
  and improve challenge vote fetching logic (0405d118)
- ♻️ refactor(server): replace zValidator with ValidationMiddleware in
  CommentsRouter and update context parameter in ValidationMiddleware (c05f21d5)
- 🗃️ ftree(web): move challenging filtes in the app folder out of the (home)
  folder (8ad13e4a)
- 🐛 fix(web): correct typo in delete confirmation messages and remove console
  log in useChallengeEditorPage (5acf709a)
- 📦 deps(lsp): upgrade @designliquido/delegua dependency from 0.57.1 to 0.59.0
  in package.json and package-lock.json (d9ac6df9)
- 🐛 fix(web): update ChallengeTitleField to use challengingService directly and
  improve deleteChallenge logic in useChallengeControl (30d54b0a)
- 🐛 fix(web): update Checkbox onChange handler and remove unused position
  variable in ChallengeTestCasesField (19e879d2)
- 🐛 fix(web): correct state variable naming and enhance error message handling
  in ChallengeEditorPage (451ac950)
- ♻️ refactor(web): rename Checkbox component import and update onChange handler
  for improved readability (ec92d347)
- 🐛 fix(web): improve challenge title validation logic and error handling in
  useChallengeTitleField hook (c2ea1c3e)
- 🐛 fix: enhance fetchChallenge function to handle errors and improve request
  handling in AccessChallengeEditorPage (1d2f04ff)
- 🐛 fix: update accessChallengeEditorPage action to include user context for
  improved request handling (99f8300a)
- 🖥️ ui(web): integrate toast notifications and enhance delete confirmation
  dialog in ChallengeEditorPageView (967a173c)
- 🖥️ ui(web): enhance ChallengeEditorPage with error handling, delete
  confirmation dialog, and toast notifications (14b493c9)
- 🖥️ ui(web): implement ChallengeEditorPage and ChallengeEditorPageView
  components for challenge creation and editing (b9c81197)
- ⚙️ config: update tsconfig.tsbuildinfo to reflect changes in TypeScript
  library references (a8de0875)
- ♻️ refactor: remove EditChallengeAction and PostChallengeAction along with
  related hooks and imports (95d1fd15)
- 📶 rest(server): implement postChallenge method in ChallengingService for
  challenge creation (e6cdf593)
- 📮 validation: create challengeFormSchema to define structure for challenge
  form submissions (424840e6)
- 📮 validation: add challengeCategoriesSchema to define structure for challenge
  categories (9332c514)
- ♻️ refactor: remove unnecessary console logs and fix challenge category
  deletion query in SupabaseChallengesRepository (65d5462f)
- 🌐 domain: add 'all' difficulty level to ChallengeDifficulty and update type
  definition (6b1e7330)
- 📮 validation: update challengeSchema to include author, position, and new
  categories/difficulty level schemas (12dc9c4e)
- ⚙️ config(server): enhance ChallengesRouter with new routes for challenge
  creation, update, and deletion (1cdb0771)
- 📶 rest(server): add PostChallengeController to handle challenge creation
  requests (239d839c)
- 📶 rest(server): add UpdateChallengeController to handle challenge update
  requests (c4771755)
- 📶 rest(server): add DeleteChallengeController to handle challenge deletion
  requests (33e8e51a)
- 🧪 test: add unit tests for PostChallengeUseCase to validate challenge
  creation and error handling (368a4faf)
- 🧪 test: add unit tests for UpdateChallengeUseCase to validate error handling
  and challenge replacement (95243704)
- 🧪 test: add unit tests for DeleteChallengeUseCase to verify error handling
  and challenge removal (3b735762)
- ✨ use case: implement DeleteChallengeUseCase for removing challenges with
  error handling for non-existent challenges (52b67cd4)
- ✨ use case: implement UpdateChallengeUseCase for updating challenges with
  validation for existing titles and slugs (a01882f4)
- ♻️ refactor: replace ChallengingService with ChallengesRepository in
  PostChallengeUseCase for improved challenge management (e5002e6e)
- 💾 db(server): implement add, replace, and remove methods for Challenge
  management in SupabaseChallengesRepository (54c07866)
- 🌐 domain: add hasSameTitle method to Challenge entity and log categories in
  ChallengeFactory (9af75471)
- 🌐 domain: add ChallengeAlreadyExistsError for conflict handling (365c59de)

## 0.6.0 (2025-11-10)

- ⚙️ config(web): update layout components to utilize Stardust metadata
  (e8809a0b)
- ⚙️ config(web): create llms.txt route to define AI crawler access policies
  (b1f6e7c0)
- ⚙️ config(web): update URLs to use stardustWebUrl for improved routing
  consistency (da781d1d)
- 📶 rest(web): include SEO routes in VerifyAuthRoutesController for enhanced
  public access (8da141b3)
- 🪨 constants(web): add SEO-related routes for llms.txt, robots.txt, and
  sitemap.xml (7f59f649)
- ⚙️ config(web): add sitemap generation for main routes with metadata for SEO
  optimization (b2536b3c)
- ⚙️ config(web): create robots.ts file to define metadata route for web
  crawlers (627016c8)
- 🪨 constants(web): add Stardust metadata (2ffb52a9)
- 🖥️ ui(web): update key assignment in DragAndDropQuestion component (4df38897)
- 🧪 test: enhance UpdateSpaceForAllUsersUseCase tests to validate behavior with
  recently unlocked stars (c3b8544e)
- 🌐 domain: add recentlyUnlockedStarsIds to UsersFaker for enhanced user
  profile data (bf57f2df)
- 🖥️ ui(web): fix key assignment in DragAndDropQuestion component for proper
  rendering of text elements (5f123f25)
- 📶 rest(server): add starId to user challenge schema and implement logic to
  remove recently unlocked stars in reward controllers (03c6cfa0)
- ⚙️ config(server): log error details in HonoApp for improved debugging
  (5b1f60b8)
- ✨ use case: enhance UpdateSpaceForAllUsersUseCase to include recently
  unlocked stars in update logic and improve star reordering validation
  (8be8fab2)
- 💾 db(server): implement findAllOrdered method in SupabaseStarsRepository to
  retrieve stars in ascending order (57d05878)
- 💾 db(server): add findRecentlyUnlockedStars method to SupabaseUsersRepository
  for retrieving recently unlocked stars (51837a2f)
- 🌐 domain: update IdsList creation to ensure unique IDs by using Set for
  improved integrity (07d39e26)
- 🌐 domain: add unlockedStarsIds getter to User class for improved access to
  unlocked star IDs (cd80fe78)
- 💾 db(server): standardize string quotes in Database.ts to single quotes for
  consistency (b951f6f9)
- 🖥️ ui(web): add ShinyText component to StarView for indicating recently
  unlocked content (6fe266fe)
- ✨ use case: enhance CalculateRewardForStarCompletionUseCase to include starId
  and improve next star unlock logic (cb3003c6)
- ✨ use case: refactor UpdateSpaceForAllUsersUseCase to retrieve all users and
  streamline star updates (d982dc18)
- 🧪 test: add unit tests for RemoveRecentlyUnlockedStarUseCase to validate user
  star removal logic (6bffc98d)
- ✨ use case: add RemoveRecentlyUnlockedStarUseCase to manage recently unlocked
  stars in user profiles (35ba90f4)
- 📶 rest(server): add starId to RewardUserForStarCompletionController for
  reward calculation (8ea03bee)
- 🌐 domain: add recentlyUnlockedStarsIds to UserFactory for enhanced user
  profile management (74cac3ba)
- ⚙️ config(server): add recentlyUnlockedStarsIds to SupabaseUserMapper and
  update SupabaseUser type to include recently unlocked stars (c56e0fe2)
- ✨ use case: modify UpdateSpaceForAllUsersUseCase to update recently unlocked
  stars and add unit tests for functionality (b4fd8679)
- 🌐 domain: add recentlyUnlockedStarsIds property and related methods to User
  entity (0ac3e9f8)
- 📑 interface: add methods for managing recently unlocked stars in
  SupabaseUsersRepository (b4785648)
- 🖥️ ui(web): introduce ShinyText component with customizable animation and
  styling (853603eb)
- 🖥️ ui: add shiny text effect with animation to global CSS (b00441a5)
- ♻️ refactor(server): integrate InngestEventBroker into
  ReorderPlanetsController and ReorderPlanetStarsController (a3602bea)
- ✨ use case: update ReorderPlanetStarsUseCase to publish
  StarsOrderChangedEvent and enhance tests for event verification (77daee7e)
- ⚙️ config(server): refactor Inngest integration and add event schemas for user
  and space events (d70c2967)
- 🎞️ queue(server): implement ProfileFunctions to include
  UpdateSpaceForAllUsersJob (bc4bae6b)
- 🎞️ queue(server): add UpdateSpaceForAllUsersJob to handle space updates for
  all users (11d3cb29)
- 🎞️ queue(server): add HandleStarsNewOrderJob to process new star orders and
  integrate with the event broker (0880bd42)
- 🧪 test: add unit test to verify StarsOrderChangedEvent publishing in
  UpdatePlanetUseCase (9f92061c)
- ✨ use case: add UpdateSpaceForAllUsersUseCase and HandleStarsNewOrderUseCase
  (23e0b974)
- ✨ use case: enhance ReorderPlanetStarsUseCase to publish
  PlanetsOrderChangedEvent and update tests for event verification (666a9505)
- 🧪 test: add unit tests for HandleStarsNewOrderUseCase to verify event
  publishing with star IDs (837bdea3)
- 🧪 test: add unit tests for UpdateSpaceForAllUsersUseCase to verify star
  unlocking logic (0aafa2a1)
- ✨ use case: add HandleStarsNewOrderUseCase to manage star reordering and
  publish events (cb04ce67)
- ✨ use case: implement UpdateSpaceForAllUsersUseCase to reorder unlocked stars
  for all users (12e0c891)
- 🌐 domain: implement findUnlockedStars method in SupabaseUsersRepository and
  update UsersRepository interface (8a07d3fc)
- 🌐 domain: add new event classes for space and planets order changes
  (4e56f995)
- 🌐 domain: add addAt method to IdsList for inserting IDs at specific indices
  (59e51742)

## 0.5.2 (2025-10-31)

- 🧪 test: add comprehensive tests for Quiz structure (b4045daf)
- 🖥️ ui(web): remove unused 'use client' directive from useOpenQuestion hook
  (8af60d51)
- 🌐 domain: add code property to OpenQuestion entity for enhanced data
  representation (c893d34c)
- 🌐 domain: add classes for generating fake data for various question types
  (43ea9ef3)
- 🪨 constants(web): remove unused environment variables from serverEnv and
  schema (cda532e7)
- 🖥️ ui(web): conditionally render Google Analytics in RootLayoutView based on
  server environment (22f5562e)
- 📮 validation: update appModeSchema to use more descriptive environment names
  (13a13f24)
- 🪨 constants(web): replace StringValidation with zod for environment variable
  validation (5054f88f)
- 📮 validation: add appModeSchema for application mode validation (0ce7248d)
- 📦 deps(lsp): update @designliquido/delegua to version 0.57.1 (403a4858)
- 🖥️ ui(web): integrate Google Analytics into RootLayoutView for enhanced
  tracking (7c24cb66)
- 📦 deps(web): add @next/third-parties and third-party-capital packages
  (14552d4c)
- 🐛 fix(studio): refactor LessonStoryPageView and useLessonStoryPage to handle
  story updates and toast notifications correctly (b4469ae7)
- 🐛 fix(studio): handle potential null values in QuizContext and improve
  DragAndDropQuestionEditor logic (ce41f3d0)
- 🐛 fix(server): handle potential null questions and add debug logs (85fe0b7c)
- 🐛 fix(studio): optimize DragAndDropQuestion and OpenQuestion logic for
  handling code lines and text inputs (9e6d9649)
- 🐛 fix(web): replace useRouter with useNavigationProvider across various
  components for improved navigation handling (a0fd2981)
- 🐛 fix(web): update navigationProvider to use type assertion for compatibility
  (9efbc1a8)
- 📑 interface: rename 'path' to 'route' and add methods for navigation control
  (fba4ff97)
- ♻️ refactor(web): refactor Ending page components and implement EndingPageView
  for better structure (04dc6e3d)
- 🐛 fix(web): type erros in SpaceService (f07206e5)
- ♻️ refactor(studio): remove logs (ba44bd4b)
- ♻️ refactor(studio): add the new Sortable widget to open question editor and
  quiz arrenger (7140bd71)
- 🖥️ ui(studio): add stortable feature to planets list (2efd8e4c)
- 📶 rest: implement reorderPlanets method in SpaceService (2756e193)
- ⚙️ config(server): correct route path for ReorderPlanetsController (a24556fe)
- 🖥️ ui(studio): add widgets for planets crud (893c1f48)
- 📑 interface: add UiProvider (b5513748)
- 📮 validation: add fileSchema (6913f82f)
- 📦 deps(studio): update radix-ui to version 1.4.3 (eaaaeb8b)
- ♻️ refactor(studio): push star returned by service after executing the
  createPlanetStar method (68a404e9)
- 📶 rest(web): implement all methods of SpaceService (9abe4f07)
- 🖥️ ui(studio): integrate the PlanetCollapsible widget with SpaceService to
  manipulate stars (d490642d)
- 🌐 domain: sort starts before planet creation in Planet entity (e13cd319)
- 📶 rest(studio): add methods to manipulate planet stars (ca05cdaf)
- 🧰 provision(server): implement findFile method in DropboxStorageProvider and
  GoogleDriveStorageProvider (9a8fa5b1)
- ⚙️ config(server): add CreatePlanet, UpdatePlanet, and DeletePlanet
  controllers; update routes and documentation (b3c6afd0)
- 📶 rest(server): add StorageMiddleware for file existence verification
  (36ddf264)
- 📶 rest(server): add VerifyFileExistsController for verifying file existence
  (72f3eec5)
- 📶 rest(server): add DeletePlanetController for handling planet deletion
  (61d80f55)
- 📶 rest(server): add ReorderPlanetsController for handling planet reordering
  (600e781c)
- 📶 rest(server): add CreatePlanetController for handling planet creation
  (1bba5b2a)
- 📶 rest(server): add UpdatePlanetController for handling planet updates
  (ad882504)
- 💾 db(server): add findById and findLastPlanet methods to
  SupabasePlanetsRepository; update PlanetsRepository interface (66a0a031)
- 🌐 domain: update Planet and PlanetDto to use optional id and add setters for
  properties (e399daf7)
- ✨ use case: implement VerifyFileExistsUseCase for checking file existence
  (0c2d109e)
- 🧪 test: add unit tests for UpdatePlanetUseCase (f881a780)
- 🧪 test: add unit tests for ReorderPlanetsUseCase (735ee4be)
- 🧪 test: add unit tests for DeletePlanetUseCase (f56edf6c)
- 🧪 test: add unit tests for CreatePlanetUseCase (52341c85)
- ✨ use case: implement CreatePlanetUseCase for creating new planets (c77e1cfe)
- ✨ use case: implement UpdatePlanetUseCase for updating planet details
  (ac6a0f10)
- ✨ use case: implement DeletePlanetUseCase for deleting planets (0d00435a)
- ✨ use case: implement ReorderPlanetsUseCase for reordering planets (90db14a5)
- 🌐 domain: add FileNotFoundError class for handling file not found errors
  (086645ec)
- 🧰 provision(server): add findFile method to StorageProvider interface and
  implement in SupabaseStorageProvider (4de56d7b)
- ⚙️ config: ignore AGENTS.md (f14d8f7b)
- ♻️ refactor: remove findById method from PlanetsRepository interface
  (355fbd0e)
- 💾 db(server): implement add, replace, and remove methods in
  SupabasePlanetsRepository (6fed8e2a)
- ♻️ refactor: format useSignInForm parameters for improved readability
  (264f9e33)
- 🧪 test: remove duplicate faker import in CreatePlanetStar and
  ReorderPlanetStars use case tests (9f250f36)
- 🧪 test: update test descriptions for clarity and improve formatting in space
  use cases (64196ded)
- 🖥️ ui(web): improve confirmation dialog text and format Toggle component for
  better readability (ecbd8088)
- 📶 rest(server): add routes for editing star name, availability, and type in
  StarsRouter (7f03c26f)
- 📶 rest(server): implement routes for managing planet stars including
  creation, reordering, and deletion (ee2733d4)
- 💾 db(server): update SupabaseStar type to include is_available and
  is_challenge properties for enhanced star management (67ac3161)
- 📶 rest(server): add EditStarTypeController and update use case exports for
  star management (4aa2212b)
- 📶 rest(server): add CreatePlanetStarController to handle star creation for
  planets (95ccaa9f)
- 📶 rest(server): add EditStarNameController to handle star name updates
  (b402becf)
- 📶 rest(server): add EditStarAvailabilityController to manage star
  availability updates (5cb7c163)
- 📶 rest(server): add DeletePlanetStarController to handle star deletion from
  planets (af7dad49)
- 📶 rest(server): implement ReorderPlanetStarsController to handle star
  reordering for planets (8622b06b)
- 💾 db(server): add isAvailable and isChallenge properties to Star and Planet
  entities; add findById method for planets (c563c6fc)
- 🧪 test: add unit tests for Star entity to validate creation, property
  updates, and DTO conversion (a4c43bba)
- 🧪 test: add unit tests for Planet entity star management methods including
  addition, removal, reordering, and error handling (fd91baab)
- 🌐 domain: add isChallenge property to Star entity and update StarDto to
  include challenge status (c9432369)
- 🌐 domain: enhance Planet entity with star management methods and isAvailable
  property (774c2488)
- 🧪 test: add unit tests for ReorderPlanetStarsUseCase to validate star
  reordering and error handling (b863d053)
- 🧪 test: add unit tests for EditStarTypeUseCase to validate star type editing
  and error handling (550f946f)
- 🧪 test: add unit tests for EditStarAvailabilityUseCase to validate star
  availability editing and error handling (c62157d8)
- 🧪 test: add unit tests for DeletePlanetStarUseCase to validate star deletion
  and error handling (572d929d)
- 🧪 test: add unit tests for CreatePlanetStarUseCase to validate star creation
  and error handling (358f39b4)
- 📮 validation: add ordinalNumberSchema for positive integer validation
  (f770b431)
- ✨ use case: implement EditStarTypeUseCase to modify star challenge status
  (b27a05d1)
- ✨ use case: implement EditStarAvailabilityUseCase to manage star availability
  status (5f268724)
- ✨ use case: implement CreatePlanetStarUseCase to facilitate star creation for
  planets (1f6d40c0)
- ✨ use case: implement DeletePlanetStarUseCase to handle star removal from
  planets (2affafaf)
- ✨ use case: implement ReorderPlanetStarsUseCase to manage star ordering for
  planets (5fae2e6b)
- 📚 docs: translate and update documentation for app and UI layers (71b1c56a)
- 🌐 domain: enhance Star entity and DTO with isAvailable property, (c7d0ae52)
- 🖥️ ui(studio): update styling for PlanetsPageView and PlanetCollapsibleView
  components (b1c0e122)
- 🖥️ ui(studio): update AppLayoutView background color from bg-zinc-900 to
  bg-zinc-950 (e26ba141)
- 🖥️ ui(studio): add Switch component for enhanced toggle functionality
  (3a87d982)
- 🖥️ ui(studio): enhance StarItemView with ExpandableInput, Toggle, and
  ConfirmDialog components (e958c803)
- 🖥️ ui(studio): add Toggle and ToggleView components for enhanced toggle
  functionality (2c3735cb)
- 📦 deps(studio): add @radix-ui/react-switch version 1.2.6 to package.json and
  package-lock.json (64029c59)
- ✨ use case: add EditStarNameUseCase for updating star names in the repository
  (aa0490e8)
- 📚 docs: update documentation for app, database, provision, queue, REST, and
  UI layers (eb16eba9)
- 📚 docs: update documentation across multiple layers, enhancing clarity and
  consistency in app, database, provision, queue, and LSP layers (f42149ed)
- Editor de Questão de Arrastar e Soltar (#180) (e0b7f817)
- 📚 docs: add documentation for LSP layer, detailing structure, core
  components, and integration with Monaco Editor for the Delegua language
  (5a5f0e05)
- 📚 docs: add documentation for validation layer, detailing schema structure,
  error handling, and usage of Zod for data validation (27f1bb3a)
- 📚 docs: add comprehensive documentation for core package, detailing domain
  concepts, implementation patterns, and development guidelines (f6609006)
- 📚 docs: add testing conventions documentation, outlining file organization,
  test structure, coverage principles (0048cf9d)
- 📚 docs: add code conventions documentation, outlining variable naming,
  function structure, and best practices for consistent coding in the project
  (3f9c7391)
- 📚 docs: add comprehensive documentation for UI layer, detailing module
  structure, widget design, and best practices for React components (c79f852a)
- 📚 docs: add documentation for RPC layer, outlining structure, core concepts,
  and best practices for action implementation in the web application (7f30262e)
- 📚 docs: add documentation for REST layer, detailing API communication
  structure, service implementations, and RestClient usage in the web
  application (c1f03934)
- 📚 docs: add documentation for realtime layer, detailing structure, Supabase
  client usage, and example implementation for realtime communication (854e2ad3)
- 📚 docs: add comprehensive documentation for UI layer, covering module
  structure, widget design, and best practices for React components (1d12cb0e)
- 📚 docs: add detailed documentation for REST layer, including service
  structure, RestClient implementation, and communication flow in the Studio app
  (827c4f53)
- 📚 docs: add documentation for app layer, detailing structure, routing,
  layouts, and root component in React application (7c5de591)
- 📚 docs: add documentation for REST layer, detailing server-side and
  client-side structure, controllers, services, and communication flow
  (f984b77c)
- 📚 docs: add documentation for queue layer, detailing structure, Inngest
  integration, and event-driven architecture (af3b055f)
- 📚 docs: add documentation for provision layer, outlining structure,
  providers, and extensibility (a0bf0585)
- 📚 docs: add documentation for database layer, detailing structure,
  repositories, mappers, and migrations (b22bc09a)
- 📚 docs: add app layer documentation for Hono web framework, detailing
  structure, routers, and middlewares (6b129133)
- ♻️ refactor(studio): rename useToast to useToastProvider (17db1940)
- ♻️ refactor: use lsp package in studio app (ba9a3c7e)
- 📦 deps(studio): install shadcn select (084e267d)
- ⚙️ config: update tsconfig.tsbuildinfo with comprehensive type definitions for
  improved TypeScript support (8d42215f)
- ♻️ refactor(studio): refactor SignInForm to use AuthService and ToastProvider
  for improved login handling (a7fcad8e)
- ⚙️ config(studio): implement client middleware and loader for user account
  fetching (0cc31bd4)
- 🖥️ ui(studio): enhance Header component with user account dropdown and
  sign-out functionality (b5541e2b)
- ♻️ refactor(studio): replace unstable_createContext with createContext
  (8ad40589)
- 📦 deps(studio): update @hookform/resolvers, react-hook-form, react-router,
  and @react-router/dev to latest versions (88d9efa6)
- 🧰 provision(studio): add NavigationProvider interface and update exports in
  index.ts (78989aac)
- 🖥️ ui(studio): add ToastProvider interface and useToastProvider hook for
  success and error notifications (bbe7f39e)
- ♻️ refactor(studio): remove AuthContext and related files for simplification
  (1015e24b)

## 0.5.1 (2025-10-14)

- 📦 deps(lsp): update @designliquido/delegua to version 0.54.7 (fef07fa1)
- 🏎️ ci: add permissions for id-token and contents in Heroku deployment workflow
  (fba7af4d)
- 🏎️ ci: change Heroku deployment environment from "dev" to "prod" in CI
  workflow (0761d0c6)
- ♻️ refactor(web): remove duplicate export of storage structures in main.ts
  (4b543770)
- 🏎️ ci: update Heroku deployment environment from "prod" to "dev" in CI
  workflow (11658fd9)

## 0.5.0 (2025-10-14)

- 📦 deps(studio): remove @designliquido/delegua dependency from package.json
  and package-lock.json (86a44235)
- 🧪 test(server): add unit tests for various authentication controllers to
  enhance test coverage and validate functionality (75f243ef)
- 🧪 test(server): update unit test for ConfirmEmailController to validate token
  usage in authentication (e2690e5e)
- 🧪 test(server): update unit tests for VerifyAuthenticationController to
  validate authentication verification functionality (15985cec)
- 🧪 test(server): add unit tests for RefreshSessionController to validate
  session refresh functionality (5585628d)
- 🧪 test(server): add unit tests for RequestPasswordResetController to validate
  password reset request functionality (4b2b769d)
- 🧪 test(server): add unit tests for SignInWithGithubAccountController to
  validate GitHub account sign-in functionality (b58b63cf)
- 🧪 test(server): add unit tests for SignInController to validate user sign-in
  functionality (bd6c8b4c)
- 🧪 test(server): add unit tests for SignInWithGoogleAccountController to
  validate Google account sign-in functionality (aecd5c3c)
- 🧪 test(server): add unit tests for ResendSignUpEmailController to validate
  email resending functionality (0f33fd7e)
- 🧪 test(server): add unit tests for ResetPasswordController to validate
  password reset functionality (63cadf04)
- 🧪 test(server): add unit tests for SignOutController to validate user
  sign-out functionality (93cf5d2e)
- 🧪 test(server): add unit tests for SignUpController to validate user sign-up
  and event publishing functionality (c843e2df)
- 🧪 test(server): add unit tests for SignUpWithSocialAccountController to
  validate user sign-up event publishing (b800aeeb)
- 🧪 test(server): add unit tests for FetchSessionController to validate session
  fetching functionality (08b1660b)
- 🧪 test(server): add unit tests for FetchGoogleAccountConnectionController to
  validate Google account connection retrieval functionality (21da3ce7)
- 🧪 test(server): add unit tests for VerifyAuthenticationController to validate
  authentication handling and error scenarios (a6f8634d)
- 🧪 test(server): add unit tests for FetchGithubAccountConnectionController to
  validate GitHub account connection retrieval functionality (666eec7b)
- 🧪 test(server): add unit tests for DisconnectGoogleAccountController to
  validate Google account disconnection functionality (4100c14d)
- 🧪 test(server): add unit tests for DisconnectGithubAccountController to
  validate GitHub account disconnection functionality (f4c8e63c)
- 🧪 test(server): add unit tests for ConnectGoogleAccountController to validate
  Google account connection functionality (28b82ae5)
- 🧪 test(server): add unit tests for ConnectGithubAccountController to validate
  GitHub account connection functionality (d4c92097)
- 🧪 test(server): add unit tests for ConfirmPasswordResetController to validate
  password reset functionality (af3bbb93)
- 🧪 test(server): add unit tests for ConfirmEmailController to validate email
  confirmation logic (04185a5f)
- ♻️ refactor(server): rename authService to service in SignInController for
  consistency (d228964a)
- 🧰 provision(server): refactor DropboxStorageProvider to use a static internal
  folder name based on environment mode (7d072357)
- ⚙️ config(server): conditionally track errors and send notifications based on
  environment mode (9f94a5ff)
- 🧰 provision(server): update DropboxStorageProvider to include environment in
  file path and clean up imports (c7469d30)
- 🖥️ ui(web): add TypeScript ignore comment for completion item provider in
  CodeEditor (4c3f8b50)
- 🏎️ ci: change environment slug from "staging" to "dev" in Heroku CI workflow
  (b325cc95)
- 🖥️ ui(web): update CodeEditor snippet mapping to correct keyword reference and
  improve documentation examples in Delegua constants (0e6cf282)
- ⚙️ config(lsp): update Delegua language configuration to support additional
  bracket types and refine indentation rules (affbd387)
- 🖥️ ui(web): change CodeEditor auto-indent setting from 'advanced' to
  'brackets' (3bad2f08)
- 📦 deps(lsp): update @designliquido/delegua dependency to version 0.54.6
  (3a6a3c74)
- 🖥️ ui(web): enhance CodeEditor with advanced auto-indent, formatting options,
  and snippet support (d6fadbc9)
- 🖥️ ui(web): refactor ChallengeResultSlotView to improve key assignment in test
  case mapping (4944ad64)
- ⚙️ config(lsp): enhance Delegua language configuration for Monaco editor with
  bracket pairs and indentation rules (08e3b3df)
- 🖥️ ui(web): update useLsp hook to include DELEGUA_SNIPPETS for enhanced
  functionality (32b2ef0f)
- 🖥️ ui(web): enhance ChallengeCodeEditor with code checker toggle and refactor
  originalCode handling (9ea22a89)
- 🖥️ ui(web): prevent error notification in development mode (5fd1a695)
- 🪨 constants(lsp): add delegua snippets (61b76f22)
- 🌐 domain: add LspSnippet type definition for code snippets (f31569f3)
- 🏎️ ci: update GitHub Actions workflow to include permissions for id-token and
  contents (e6ed6878)
- 🏎️ ci: integrate Infisical secrets management into CI workflows for server and
  web applications (e5624dac)
- ⚙️ config(server): rename test environment file from .env.test to .env.testing
  for clarity (ac818faa)
- 🏎️ ci: integrate Supabase CLI setup and migration steps into CI workflow for
  server application (51098c9e)
- 🏎️ ci: add test execution step to CI workflow for server application
  (1c6395ed)
- 🧪 test(server): refactor AuthRouter to use centralized route definitions and
  add initial tests for AuthRouter functionality (c64265d7)
- ⚙️ config(server): introduce HonoServer class for enhanced request handling
  and integrate it into HonoApp (52d83255)
- 💾 db(server): create initial database schema and migration scripts for user
  challenges, achievements, and related entities (e59a7aa5)
- ⚙️ config(server): add Jest configuration and setup for testing environment
  (55c7ab6d)
- 📦 deps(server): update dependencies and add database scripts in package.json
  (edeb30e4)
- 🧪 test(web): add unit tests for HandleRewardingPayloadController to validate
  cookie handling and redirection logic (0e4ef26a)
- 🧪 test(web): add unit tests for HandleRedirectController to validate
  redirection logic based on query parameters (8a35db59)
- 🧪 test(web): refactor AccessProfilePageController tests to improve user ID
  handling and response validation (01ca8194)
- 🧪 test(web): remove unused import from AccessSolutionPageController test file
  (53e9a0ca)
- ⚙️ config(web): enable security headers in Next.js configuration (8dc81171)
- ♻️ refactor(web): remove unused ranking API calls and delete
  FetchAchievementsController (194d0ebf)
- 🌐 domain(core): add fakers export for auth entities and update challenging
  fakers (070f33cb)
- 🧪 test(web): add unit tests for AccessProfilePageController to validate user
  fetching and redirection logic (f76bf8c4)
- 🧪 test(web): refactor AccessSolutionPageController to use a service parameter
  and add comprehensive tests for its functionality (def875a3)
- 🧪 test(web): implement VerifyAuthRoutesController with tests for public and
  private route access (4f86c139)
- ♻️ refactor(web): remove console log from ConfirmEmailController and add
  ConfirmPasswordResetController tests (ae5811cb)
- 📦 deps(lsp): update @designliquido/delegua dependency version to 0.54.5 in
  package.json (a72078bd)
- 🚚 cd: change trigger from pull_request to push in server and web app Heroku
  CD workflows for streamlined deployment (233d4f38)
- 🚚 cd: update Infisical secrets-action configuration in web app CI and CD
  workflows for improved environment variable management (58ad682c)
- ♻️ refactor(web): add console log for CLIENT_ENV to aid in environment
  configuration troubleshooting (7e773310)
- 🚚 cd: update domain configuration to use secrets in Heroku workflows for
  server and web apps (d3d9b54d)
- 🏎️ ci: add permissions for id-token and contents in web app CI workflow
  (352fb646)
- 🚚 cd: replace hardcoded identity-id with secrets in Infisical secrets-action
  for server and web app workflows (7cc1536b)
- 🚚 cd: integrate Infisical secrets-action for .env file generation in web app
  CI and staging workflows (981a016e)
- ♻️ refactor(web): replace many env variables across various components for
  consistent environment configuration (4d810baf)
- ♻️ refactor: rename WEB_APP_URL to STARDUST_WEB_URL and add SENTRY_DSN in
  server and web environment configurations (dc65b809)
- 🚚 cd: change trigger from pull_request to push in server app Heroku CD
  workflow and add permissions in web app staging CD workflow (ef8df72e)
- ♻️ refactor(web): rename stardustWebAppUrl and serverAppUrl to stardustWebUrl and
  stardustServerUrl in CLIENT_ENV configuration (d9e14652)
- 🚚 cd: change trigger from push to pull_request in Heroku CD workflow
  (a9224db0)
- 🚚 cd: replace .env file creation with Infisical secrets-action for improved
  environment variable management (225950a0)
- 🐛 fix(server): correct SENTRY_DNS to SENTRY_DSN in environment configuration
  (819a103f)
- 🚚 cd: restore Infisical secrets-action in Heroku CD workflow for environment
  variable management (6818082b)
- 🚚 cd: comment out Infisical secrets-action in Heroku CD workflow for
  environment variable management (45241ebb)
- 🚚 cd: update Heroku CD workflow permissions to enable id-token writing and
  content reading (b99e4d68)
- 🚚 cd: update Heroku CD workflow to use Infisical for environment variable
  management and change trigger to pull_request (d3eab1d4)
- ♻️ refactor(server): rename stardustWebAppUrl to stardustWebUrl and update references
  in SupabaseAuthService and RestMiddleware (8cf0594d)
- 📦 deps(lsp): update @designliquido/delegua to version 0.54.4 in package.json
  and package-lock.json (26f4e007)
- 🖥️ ui(web): fix typo in ErrorPageView props from 'onReaload' to 'onReload'
  (a2159a69)
- ⚙️ config(web): update Sentry DSN to use environment variable for improved
  security and flexibility (47f34c89)
- ⚙️ config(server): add REST client configuration for sending error
  notifications (7b8bd3ba)
- 🖥️ ui(web): add GlobalError component and ErrorPage for improved error
  handling and user experience (b3af23f4)
- 🖥️ ui(web): implement useTelemetryProvider hook for error tracking with Sentry
  (feb5ac46)
- ♻️ refactor(web): update landing route and adjust authentication URLs to use
  stardustServerUrl for consistency (6b517c34)
- ⚙️ config(web): include app directory in Tailwind CSS content paths for
  improved styling coverage (03275a8f)
- ♻️ refactor(web): update all instances of stardustWebAppUrl and serverAppUrl to
  stardustWebUrl and stardustServerUrl for consistency across the application
  (62ae7a6a)
- 📶 rest(web): add NotificationService for handling notifications and integrate
  it into the service index (e76a1ef3)
- ♻️ refactor(web): update environment variable names from stardustWebAppUrl and
  serverAppUrl to stardustWebUrl and stardustServerUrl for improved clarity
  (585d7502)
- ⚙️ config(web): add Sentry client initialization and request error handling
  for enhanced error tracking (946bfab3)
- 🖥️ ui(web): introduce DecryptedText component for animated text reveal effects
  (2aa42dcf)
- 🎴 assets(web): add new Apollo Mendigo image to the public assets (8660678d)
- 🖥️ ui: add internal error animation to Lottie animations and update type
  definitions (ab0a55e8)
- ♻️ refactor: rename stardustWebAppUrl to stardustWebUrl in environment configuration
  for consistency across services (d5546950)
- 📶 rest(server): add NotificationRouter for handling error notifications and
  integrate it into HonoApp (a6957af5)
- 📶 rest(server): introduce SendErrorNotificationController for handling error
  notifications (1f2737f7)
- 📶 rest(server): enhance error notification handling by adding app context and
  implementing NotificationService for web (e2be85b8)
- ⚙️ config(web): integrate Sentry for error tracking and monitoring in Next.js
  application (35b0d10c)
- 🪨 constants(server): correct SENTRY_DNS variable name to SENTRY_DSN in
  environment configuration (867ce9f4)
- ⚙️ config(server): integrate DiscordNotificationService for error
  notifications in HonoApp (b951af40)
- 📶 rest(server): add sendErrorNotification method to
  DiscordNotificationService for error reporting (d7cdb495)
- ⚙️ config(server): integrate Sentry telemetry provider for error tracking in
  HonoApp (e67c61a1)
- 🧰 provision(server): add Sentry telemetry provider and integrate Sentry DSN
  in environment configuration (b546413f)
- 📑 interface: add TelemetryProvider interface and export it in provision index
  (c31d31f0)
- 📦 deps(server): add @sentry/node version 10.17.0 to package.json (36b32295)

## 0.4.1 (2025-09-29)

- ⚙️ config(server): change challengeId in user profile request to new value
  (ddf37ec2)
- 🧪 test(core): add unit tests for CompleteChallengeUseCase to validate
  challenge completion logic (1c16c968)
- 🐛 fix(core): ensure challenge completion is recorded only if not already
  completed (1e888107)
- ♻️ refactor(server): simplify RewardUserForStarCompletionController by
  removing EventBroker dependency (d20bb48c)
- ⚙️ config(server): update user challenge data and implement completeSpace
  middleware for handling space completion requests (988b8252)
- 🧪 test(core): add unit tests for CompleteSpaceUseCase to validate user space
  completion logic (221e815a)
- 📶 rest(server): add CompleteSpaceController to handle space completion
  requests (2c9ad8ec)
- ♻️ refactor(core): remove EventBroker and SpaceCompletedEvent from
  CalculateRewardForStarCompletionUseCase (fa5c48a9)
- ✨ use case: complete use case (1d3712b8)
- 🐛 fix(server): handle PostgreSQL query errors in SupabasePlanetsRepository
  (61b33e12)
- 🏎️ ci: add turbo installation step in Heroku CI workflow (ebc9f47b)
- 📦 deps(server): upgrade axios to version 1.12.2 (2576a5aa)
- 🏎️ ci: update GitHub Actions workflows to include path filters for core and
  validation packages (85118fba)
- 🏎️ ci: add GitHub Actions workflow for server app CI (76668a0f)
- 🐛 fix(core): update CreateUserUseCase tests to use findByName and findByEmail
  methods (0de3e80e)
- 🐛 fix(core): refine user existence checks in VerifyUserEmailInUseUseCase and
  VerifyUserNameInUseUseCase (df60c2dd)
- ⚙️ config(server): change user email in authentication response (efd09d66)
- 🐛 fix(core): update user existence checks to use findByName and findByEmail
  methods (677bdd65)
- 📮 validation: add accountSchema for user authentication validation (04fa71b3)
- 🐛 fix(web): add security headers to Next.js configuration for enhanced
  protection (b24d6df7)

## 0.4.0 (2025-09-25)

- 🐛 fix(core): correct input index initialization and update question line
  creation messages for clarity (1807f54f)
- 🐛 fix(web): update input index calculation to correctly parse numeric suffix
  from text (00a7a0cb)
- 🐛 fix(lsp): ensure error messages are converted to strings in DeleguaLsp for
  consistent error handling (ebcda302)
- ♻️ refactor(lsp): add initial implementation of Delegua language support with
  configuration, documentation, and regex definitions (8a378b34)
- 📦 deps: update package references from @stardust/code-runner to @stardust/lsp
  and add package.json for LSP module (c08a1831)
- ♻️ refactor(lsp): replace useCodeRunner with useLsp across components for
  improved code execution and error handling (57c446ba)
- ♻️ refactor(lsp): remove useCodeRunner hook and introduce useLsp for LSP-based
  code execution (bb55412d)
- ♻️ refactor(lsp): remove deprecated code-runner package and migrate to
  LSP-based implementation (a4422da1)
- 🖥️ ui(web): update CodeEditor to utilize new hooks for context and breakpoint
  management, enhancing mobile responsiveness and editor configuration
  (19c15702)
- 🖥️ ui(web): enhance CodeEditorSettingsDialog with error detector toggle and
  improve accessibility with labels (3913dff6)
- ♻️ refactor(web): streamline code execution by replacing codeRunner with
  codeRunnerProvider across components (09e05c0e)
- 🖥️ ui(web): implement useEditorContextProvider for state management and
  enhance editor context with new features (f922859d)
- ♻️ refactor(web): separate RangeInput into RangeInputView for improved
  modularity and readability (c2f6b7dc)
- 🐛 fix(lsp): ensure CodeRunnerResponse returns an empty response when no
  errors are present (49541f92)
- 🐛 fix(core): update isFailure logic and add errors getter for improved error
  handling (a5679780)
- ⚙️ config: replace 'code-runner' with 'lsp' in the allowed scopes for commit
  messages (ccb9241e)
- 🪨 constants(lsp): modularize DELEGUA_DOCUMENTACOES into method-specific
  constants for better organization (902868dc)
- 🌐 domain: add LspDocumentation type for enhanced documentation structure
  (e9aed386)
- 🧰 provision(code-runner): implement syntax and semantic analysis methods in
  ExecutorDeCodigoDelegua (82c74d37)
- 🧰 provision(code-runner): add DELEGUA_DOCUMENTACOES constant with function
  descriptions and examples (da8d5f7f)
- ♻️ refactor(server): remove console.log from environment constants (a8b258ad)
- ⚙️ config(server): add new environment variables for Dropbox and Discord
  integration (7381da18)
- ⚙️ config(server): integrate AxiosRestClient into DropboxStorageProvider
  (41c1558d)
- 🧰 provision(server): implement access token fetching and update constructor
  to accept RestClient (b3998292)
- 🪨 constants(server): update Dropbox environment variables (5991e34f)
- 🐛 fix(code-runner): improve null safety and type handling (36069842)
- 📦 deps: upgrade @designliquido/delegua to version 0.54.1 (e6e0d84f)
- 🐛 fix(code-runner): enhance result processing in ExecutorDeCodigoDelegua to
  ensure proper handling of returned values and add debugging logs (4b1fd35a)
- 📦 deps: upgrade @designliquido/delegua to version 0.54.0 (c8ca4c92)
- Update ExecutorDeCodigoDelegua.ts (0fc2d44c)
- 🐛 fix(code-runner): update result handling in ExecutorDeCodigoDelegua to
  correctly process returned values (84c2190c)
- 🐛 fix(web): update userOutput check to handle undefined values in useTestCase
  hook (a66f9c64)
- 🐛 fix(web): update userOutput assignment to handle null values in
  ChallengeResultSlotView (0ed521ed)
- 🐛 fix(core): update result assignment in CodeRunnerResponse constructor to
  check for undefined (5042f569)
- ♻️ refactor(web): remove console.log statements (3c62d72b)
- 📦 deps: upgrade @designliquido/delegua to version 0.53.2 (635da7e9)
- ♻️ refactor(server): streamline user parameter handling in notification and
  use case classes for improved readability (074ff120)
- 📶 rest(server): update user ID in users.rest and add secondsCount field to
  user challenge responses (f768782c)
- 📶 rest(server): add appendUserInfoToBody method to ProfileMiddleware and
  integrate it into UsersRouter for enhanced user data handling (b7432f33)
- ⚙️ config(server): add NotificationFunctions to handle completion
  notifications and integrate with HonoApp (046d199b)
- 🎞️ queue: add SendPlanetCompletedNotificationJob and
  SendSpaceCompletedNotificationJob for handling completion notifications
  (9f543342)
- 📶 rest(server): introduce AxiosRestClient for streamlined REST API
  interactions with error handling and pagination support (4240210a)
- 📶 rest(server): add AppendUserInfoToBodyController and enhance existing
  controllers to integrate EventBroker for user-related operations (bd51d6fe)
- 🪨 constants: add discordWebhookUrl to environment constants and schema
  (d6035d79)
- ✨ use case: integrate EventBroker to publish SpaceCompletedEvent upon space
  completion (1e4ea9b5)
- ✨ use case: enhance GetNextStarUseCase to include user information and
  publish PlanetCompletedEvent (f53b0deb)
- 🌐 domain: add PlanetCompletedEvent and SpaceCompletedEvent classes to handle
  space completion events (8d86a511)
- 📶 rest(server): implement DiscordNotificationService for sending user
  notifications (d7d18c66)
- 📑 interface: add NotificationService interface and export it (dce13e73)
- 🏎️ ci: update Discord notification message in Heroku workflow to use
  'implantada' instead of 'deployada' (eaa16116)
- 🐛 fix(web): remove CLIENT_ENV console log to clean up output (d7bee5c3)
- 🏎️ ci: update Discord notification message in Heroku workflow for staging
  deployment (2d81f701)
- 🏎️ ci: update Heroku workflow to use the latest Ubuntu runner (f7af7ed4)
- 🐛 fix: correct typo in Heroku workflow runner specification (7fe7cf6d)
- 🏎️ ci: streamline .env file creation by removing redundant step in Heroku
  workflow (01f2b4df)
- 🏎️ ci: improve .env file creation and enhance CLIENT_ENV logging for better
  debugging (a36f73af)
- 🏎️ ci: update .env file creation step to include test environment variables
  (22c78c45)
- 🐛 fix(web): add console log for CLIENT_ENV to aid in debugging (e14d0693)
- 🚚 cd: add Discord notification step to Heroku deployment workflow (01a5e44f)
- 🏎️ ci: add step to create .env file for staging environment in Heroku workflow
  (ffec5521)
- ⚙️ config: change module export to default export in jest.config.ts and remove
  uuid mapping (828a4bad)
- 🧪 test: remove exclusive focus from email confirmation test to ensure all
  tests run (aa557a2c)
- ⚙️ config: simplify import of TextEncoder and TextDecoder in jest.config.ts
  (de4c1106)
- 🔀 merge: social-account-settings branch into feat/web-app-and-core-package-ci
  branch (ec95ce65)
- 🐛 fix(web): update cache key for GitHub account connection and reintroduce
  CLIENT_ENV import in ConnectSocialAccountAction (a9f9fa83)
- 🖥️ ui: refactor global CSS to use Tailwind imports and define custom color
  variables for light and dark themes (9ab08730)
- 📦 deps: remove husky prepare script from package.json (eb08f44c)
- Apply suggestion from @Copilot (64ab4ffa)
- Apply suggestion from @Copilot (5a95e7d9)
- 🏎️ ci: add GitHub Actions workflow for core package CI on pull requests
  (fe1e59a2)
- 🏎️ ci: add GitHub Actions workflow for web app CI on pull requests (c12ec846)
- 🐛 fix: correct unlockedStarsCount logic in User entity and update
  BackupDatabaseUseCase tests to use StorageFolder for uploads (70f4d4ac)
- ♻️ refactor: remove console log from VerifyUserSocialAccountUseCase and update
  tests to reflect changes in user retrieval logic (66c877d0)
- ⚙️ config(web): remove empty line from .env.example file for cleaner
  configuration (18606413)
- ⚙️ config: update TypeScript configuration to exclude additional directories
  and add skipLibCheck option (8cce27df)
- ♻️ refactor: remove unused import of AccountProvider in User tests (a2ff465e)
- ♻️ refactor: simplify ProfileService imports by removing unused
  AccountProvider type (239b7348)
- 📮 validation: update build scripts and add type checking (432c30ad)
- 🌐 domain: add SessionFaker for generating fake session data and update main
  export to include fakers (f4e02eff)
- 📶 rest: enhance ConfirmEmailController to log response and update tests for
  token handling and session management (ac30d1ca)
- 🖥️ ui(web): remove AvatarSelect component and related files; update
  SettingsPageView to reflect changes (03dab30d)
- 📶 rest(server): streamline handle method in ConnectGithubAccountController
  and ConnectGoogleAccountController by removing unnecessary response (26f9afc8)
- 🖥️ ui(web): implement useSocialAccountActions hook for managing social account
  connections and disconnections (90559a53)
- 📶 rest: implement social account sign-up and update routes for connecting
  Google and GitHub accounts (303c24e6)
- ♻️ refactor: move AccountProvider export to core structure and remove obsolete
  global structure (71365ca2)
- ♻️ refactor: remove console log from User entity creation and improve test
  readability by using block syntax for expect statements (649a0b80)
- 📟 rpc: implement Connect and Disconnect actions for social accounts (Google
  and GitHub) with cache management (af798636)
- 📟 rpc: add resetCache method to Call interface and implement in NextCall for
  cache management (c924355a)
- ⚙️ config: update biome.json to add new linting rules for unique element IDs
  and iterable callback returns (2b81fb34)
- 📮 validation: introduce accountProviderSchema for account validation and
  remove deprecated accountSchema (81cb9dff)
- ⚙️ config: update release-it configuration to skip checks and include build
  assets (2f246393)
- 🖥️ ui(web): update GitHub logo SVG and adjust button styles in SocialLinksView
  for improved aesthetics (e8faab2b)
- 🖥️ ui(web): add Social Accounts section to Settings page with Google and
  GitHub integration (27c0838b)
- 📶 rest(web): add methods to disconnect and fetch connections for GitHub and
  Google accounts in AuthService (504e3bbf)
- ⚙️ config(server): update auth REST client and router to support disconnecting
  and fetching connections for Google and GitHub accounts (f211f64d)
- 📶 rest(server): enhance SupabaseAuthService with methods for disconnecting
  accounts and fetching connection status for Google and GitHub (e6bd008f)
- 📶 rest(server): add FetchGithubAccountConnectionController to handle fetching
  GitHub account connections (e425bcd9)
- 📶 rest(server): add FetchGoogleAccountConnectionController to handle fetching
  Google account connections (977a82ba)
- 📶 rest(server): add DisconnectGoogleAccountController to manage Google
  account disconnections (d53a810a)
- 📶 rest(server): add DisconnectGithubAccountController to manage GitHub
  account disconnections (2cc3f158)
- 📶 rest(server): implement ConnectGithubAccountController to handle GitHub
  account connections (38fcc454)

## 0.3.0 (2025-09-05)

- 🖥️ ui(web): fix input index calculation in OpenQuestion component to prevent
  negative values (ae6ac601)
- 🖥️ ui(web): streamline useSpeakerContextProvider by initializing state from
  local storage and removing redundant useEffect (0fec65e8)
- 🖥️ ui(web): update TextView component layout with improved gap properties for
  better responsiveness (5a5d7be9)
- 🖥️ ui(web): adjust PictureView component dimensions for improved layout
  consistency (66ecdbd6)
- 🖥️ ui(web): improve AlertView layout by restructuring flex properties and
  enhancing child component alignment (5cbca42e)
- ♻️ refactor(core): remove console log from User entity creation for cleaner
  code (d89adb51)
- 🚚 cd: update CI/CD paths to include core, validation, and code-runner
  packages for better deployment coverage (5a870bd4)
- ♻️ refactor(web): enhance UserCreationPendingLayout to immediately render
  children if user is present (7b8d5209)
- ♻️ refactor(web): update useUserCreationPendingLayout to accept user object
  and enhance state management with useEffect (4d1ad4ba)
- ♻️ refactor(web): update user creation pending layout to accept boolean for
  user status and simplify state management (023d74c9)
- ♻️ refactor(server): remove unnecessary blank line in HonoHttp class for
  cleaner code (c617684d)
- 🌐 domain: add isZero method to Integer class and update User entity to
  utilize it for count checks (9be57560)
- ⚙️ config(server): change USER_ID in users.rest to reflect new user identifier
  (ef2c0340)
- ♻️ refactor(core): add console log for UserDto in User entity creation to
  assist debugging (436a1f80)
- ⚙️ config(server): modify sample sign-up response with new user details for
  consistency (3fb68858)
- ♻️ refactor(web): add console log in handleRestError for improved error
  tracking (df1e4bda)
- ♻️ refactor(web): remove unused sign-up response from
  SignUpWithSocialAccountAction to streamline code (5ce26e45)
- ♻️ refactor(web): include sign-up response in SignUpWithSocialAccountAction
  for better state management (2fdadd2b)
- ♻️ refactor(web): add console log for response in
  SignUpWithSocialAccountAction to aid debugging (c008c52d)
- ♻️ refactor(web): add console log for new account status in
  useSocialAccountConfirmationPage (80791a57)
- ♻️ refactor(web): add console logs for account creation and sign-up response
  in SignUpWithSocialAccountAction (8ee38211)
- 🐛 fix(web): add User type import to useUserCreationPendingLayout for improved
  type safety (8b805148)
- ♻️ refactor(code-runner): add console logs for result and error handling in
  ExecutorDeCodigoDelegua (6a01cc64)
- ♻️ refactor(core): update Account entity to conditionally set name value based
  on input (807238fc)
- ♻️ refactor(core): simplify VerifyUserSocialAccountUseCase by removing unused
  imports and redundant user lookup logic (370e3b58)
- ♻️ refactor(web): enhance useUserCreationPendingLayout to manage user state
  with useEffect for improved responsiveness (79f735d2)
- 🐛 fix(web): update dependencies in useAuthProvider to include account ID for
  improved user data fetching (0455b984)
- 📮 validation: remove provider field from accountSchema to simplify user
  authentication structure (243992c6)
- ♻️ refactor(server): replace hardcoded JWT in auth.rest with placeholder and
  clean up console logs in useAuthProvider (46b2e99a)
- 🐛 fix(core): set default name value in Account entity to 'não definido'
  (8fb555fe)
- ♻️ refactor(core): update Account entity to set default name value when not
  provided (09ce2305)
- ♻️ refactor(server): replace hardcoded JWT in auth.rest with placeholder
  (ac462560)
- 🖥️ ui(web): modify authentication and user profile configurations for improved
  clarity and security (d5484017)
- ♻️ refactor(web): update returnUrl handling in authentication endpoints and
  SocialLinksView for consistency (43383a86)
- ♻️ refactor(web): update tsconfig.tsbuildinfo to reflect changes in TypeScript
  library references (cbfd7b73)
- ♻️ refactor(core): remove accountProvider field from various entities and use
  cases to streamline user data management (fb8a8d36)
- ♻️ refactor(core): remove GitHub and Google account fields from User entity
  and DTOs to streamline user data management (d860eba2)
- 📶 rest(server): add endpoints to connect Google and GitHub accounts for user
  authentication (9fd05a23)
- ♻️ refactor(web): remove unused useSleep hook and simplify fetchUserById call
  in useAuthProvider (133da202)
- ♻️ refactor(core): eliminate userAccountProvider from UnlockFirstStarUseCase
  to streamline user data handling (befd3e28)
- ♻️ refactor(web): simplify fetchUserById method by removing accountProvider
  parameter to streamline user data retrieval (b19e6494)
- 📶 rest(server): add methods to connect GitHub and Google accounts, and
  implement account deletion functionality (2126cf04)
- ♻️ refactor(core): further remove account provider and email references from
  user-related controllers and use cases to enhance user management (0b95e72a)
- ♻️ refactor(core): remove account provider references from user-related
  entities and use cases to simplify user management (1df081bb)
- ♻️ refactor(core): remove social account ID handling from User entity and
  tests to streamline user management (8893cf19)
- ♻️ refactor(server): remove GitHub and Google account fields from user mappers
  and repository; add OAuth client types to database schema (7e55ee02)
- 📶 rest(server): add ConnectGoogleAccountController and route for Google
  account connection (ed8aff05)
- 🐛 fix(web): remove typing errors across the entire app (4293900d)
- 📦 deps(code-runner): update @designliquido/delegua to version 0.50.2 for
  improved functionality (08618634)
- 🖥️ ui(web): wrap layout in UserCreationPendingLayout to enhance user
  experience during profile creation (65b11e22)
- 🖥️ ui(web): update SocialAccountConfirmation to handle user creation state and
  improve loading experience (333df18c)
- 🖥️ ui(web): implement UserCreationPendingLayout and related components for
  improved user experience during profile creation (5c1ee386)
- ♻️ refactor(web): enhance useAuthProvider to include account state and
  integrate useSleep for improved user experience (aed483e2)
- ♻️ refactor: integrate userAccountProvider into CreateUserUseCase and
  UnlockFirstStarUseCase for comprehensive user data management (b53e22c6)
- 📮 validation: add provider field to accountSchema for enhanced account type
  support (6f90101d)
- 🖥️ ui(web): introduce BlurText component with animation capabilities for
  enhanced text effects (21a25ca6)
- 📶 rest(server): include userAccountProvider in CreateUserJob and
  UnlockFirstStarJob for improved user data handling (c4d02e1c)
- 📶 rest(server): add userAccountProvider field to SignUpController and
  SignUpWithSocialAccountController for enhanced user data tracking (792ab220)
- 🧪 test: add AccountsFaker for generating fake account data and enhance user
  tests for social account verification (7a4aa716)
- 💾 db(server): add GitHub and Google account IDs to user profile retrieval
  (286b6250)
- 📶 rest(server): implement GitHub sign-in route and update AuthRouter
  (519e4b02)
- 📶 rest(server): add SignInWithGithubAccountController for GitHub
  authentication (9af83924)
- 📶 rest(server): add signInWithGithubAccount method to SupabaseAuthService and
  update AuthService interface (7edf5144)
- 🌐 domain: add accountProvider field to AccountSignedUpEvent,
  FirstTierReachedEvent, and FirstStarUnlockedEvent payloads (31ac9282)
- 🐛 fix(server): ensure event publishing in SignUpWithSocialAccountController
  is correctly awaited (92efbcab)
- ♻️ refactor(web): simplify error handling in middleware and remove unnecessary
  console logs (15bbb48b)
- 📶 rest(server): enhance FetchUserController to include accountProvider in
  user retrieval (44539c8b)
- ⚙️ config: increase header max length in commitlint configuration from 120 to
  150 (35330185)
- ♻️ refactor(server): update AppendUserCompletedChallengesIdsToBodyController
  to use account details (e484ee6a)
- 📶 rest(web): add setBody method to NextHttp for extended body management
  (20e01d3e)
- 🐛 fix(server): update account DTO to include user name and provider
  information (0480f6de)
- 📟 rpc(web): enhance SignUpWithSocialAccountAction to return account details
  and new account status (21d7c332)
- 📑 interface: add setBody method to Http interface and implement in HonoHttp
  class (613ea5fc)
- ⚙️ config(server): modify user retrieval endpoints to include accountProvider
  query parameter (667b3f65)
- ⚙️ config(server): implement Google sign-in and social account sign-up
  endpoints (45d37c43)
- 📶 rest(server): add VerifyUserSocialAccountController for social account
  verification (8b2ad7b5)
- 📑 interface: implement VerifyUserSocialAccount use case and middleware for
  social account verification (7ee7c482)
- 📑 interface: update fetchUserById method to include accountProvider parameter
  (4ec795a7)
- ♻️ refactor(web): implement social account sign-up functionality and enhance
  context management (8420db46)
- 💾 db(server): enhance SupabaseUsersRepository to support retrieval by GitHub
  and Google account IDs (e049331f)
- 📑 interface: add setAuthorization method to NextRestClient (a67aaf22)
- 📑 interface: extend UsersRepository and GetUserUseCase to support user
  retrieval by name and email (82b20981)
- 🌐 domain: enhance Name class with deduplication logic and duplication check
  (25ab6bbd)
- 🌐 domain: introduce AccountProvider class for managing authentication
  providers (09bc31a0)
- 📮 validation: add authentication schemas for account validation and global
  account provider schema (7fe7ff97)
- 🌐 domain: add UserSocialAccountAlreadyInUseError for handling conflicts with
  social account registration (5855e0a9)
- 📶 rest(server): add SignUpWithSocialAccountController for social account
  registration (9b27bbdb)
- 📶 rest(server): add FetchSocialAccountController to retrieve social account
  information (22ec6b03)
- 📶 rest(server): add SignInWithGoogleAccountController to handle Google
  account sign-in (24e4d2b4)
- 📶 rest: enhance SupabaseAuthService and AuthService with social account
  methods and account details (6a76b6b1)
- 🪨 constants(web): add durationInSeconds for accessToken in cookies
  configuration (3a2885d2)
- 🖥️ ui(web): implement SocialAccountConfirmation components and hooks for
  social account sign-up flow (d46c2d1e)
- 📟 rpc(web): add SignUpWithSocialAccountAction and integrate into authActions
  (3ad0d3a7)
- ⚙️ config: update commit types table to reflect 'rpc' as the new prefix for
  API RPC layer (339e7d47)
- 🪨 constants(web): update ROUTES to include social account confirmation and
  server authentication endpoints (6ae67aa5)
- 🖥️ ui(web): implement useHashParam hook for retrieving hash parameters from
  URL (0fd4a0e0)
- 🖥️ ui(web): enhance SignInPageView with social login options (a8a440cb)
- 📑 interface: enhance AuthService interface with social account methods for
  improved authentication options (6796d32e)
- 🖥️ ui(web): add useHashParams hook (fe38d1a3)
- 🎴 assets: add logo files for github and google (8d962280)
- ⚙️ config: add 'code-runner' to the list of valid scopes for commit messages
  (35df3752)
- ♻️ refactor(core): improve result verification by translating outputs for
  accurate comparison (73e0b984)
- ♻️ refactor(code-runner): streamline error handling and simplify result
  extraction in ExecutorDeCodigoDelegua (bd8a247c)
- 🖥️ ui(web): validate speakerContext before rendering SpeakerView to ensure
  proper context handling (3b5f29aa)
- 🖥️ ui(web): add translatedUserOutput to TestCase component for improved output
  handling (59061ea6)
- 🖥️ ui(web): fix expectedOutput format in o-castelo challenge mock data
  (9aefefc8)
- 🖥️ ui(web): update Speaker component to format content by removing strong tags
  (3f1e38a0)
- 🗃️ ftree(web): delete all templates within Mdx component (c37c19bf)
- ⚙️ config(web): enable minimizer for build optimization (7c1f87c2)
- 🌐 domain: remove unnecessary console logs from OpenQuestion class (aa0f95ec)
- ⚙️ config: increase header max length in commitlint configuration from 100 to
  120 (ba2f7c63)
- ♻️ refactor(studio): refactor QuestionCodeLine methods to return new instances
  instead of modifying in place (0a1d97c8)
- 🖥️ ui(studio): enhance OpenQuestionEditor with new input handling and add
  ExpandableInput component (ec1d6a90)
- 🖥️ ui(studio): remove LineConfigurationDropdown and TextInput components
  (66c48131)
- 🖥️ ui(studio): refactor CodeLineEditor to use new
  CodeLineConfigurationDropdownMenu (1b11d8c1)
- 🌐 domain: enhance List and OpenQuestion with new methods for item
  manipulation (00f19b8b)
- 🖥️ ui(studio): add ExpandableInput (7a0a5b23)
- 🖥️ ui(studio): add OpenQuestionEditor widget (ed84854d)
- 🌐 domain: add methods to handle crud of code lines (193451f4)
- 📦 deps(studio): install @radix-ui/react-dropdown-menu (f5f889ec)
- 🖥️ ui(web): add Speaker component to Lesson page (10e6d5b5)
- 🖥️ ui(web): add Speaker component (e08c7a3b)
- 🖥️ ui(web): add Speaker Context (1b52a88b)
- ⚙️ config(web): disable React strict mode in Next.js configuration (97ac4bee)
- ♻️ refactor(web): apply mvvm to each mdx widget (cdf9b6fd)
- 📦 deps(web): install react-text-to-speech (1b0b9861)
- Seção de patrocinadores (#129) (b1779870)
- ♻️ refactor(web): allow referrer for Design Liquido external link (416a7282)
- 🖥️ ui(web): add SponsorsSection widget to LandingPage (81a5d332)
- 🎴 assets: add design loiquido logo (25b22ec0)
- ♻️ refactor(web): remove console logs and update options prop in
  SelectionQuestion component (ba27dc06)
- 🖥️ ui(web): add GoToProfilePageLink widget to Settings page (07e77230)
- 🌐 domain: update slug when set User entity name (0d608085)
- 🐛 fix: cast suffledlist always to its generic type (7aded606)
- 🖥️ ui(web): add Preferences widget to SettingsPage (49427077)
- ♻️ refactor(web): add isDefaultAudioDisabled prop and toggleAudioDisability
  method to AudioContext (3fe5c164)
- 🪨 constants(web): add isAudioDisabled cookie key for audio settings
  (222ec355)
- 📶 rest(web): add updateQuestions method to LessonService for managing lesson
  questions (c659e51c)
- 🪨 constants(web): add back supabaseUrl and supabaseKey to CLIENT_ENV
  (a4edb782)
- 🌐 domain: add setter for User entity name (d24d6671)
- ♻️ refactor(web): remove logs and trash code from SettingsPageView (f1b5eaf1)
- 🖥️ ui(web): temporarily disable challenge posting button (db80d2a5)
- 🖥️ ui(web): add Settings page (b3842a6d)
- 🖥️ ui(web): add Badge component (0e997d9d)
- 🖥️ ui(web): add NameInput (4478a9a1)
- 📦 deps(core): export dtos of aggregates from profile module (1e7a3aa0)
- ♻️ refactor: update changeItemLabel method to create a new array instead of
  mutating (d414656a)
- 📦 deps: update @designliquido/delegua to version 0.49.2 (a9e00261)
- 🖥️ ui(studio): add DragAndDropListQuestionEditor widget (90ac510e)
- 🖥️ ui(studio): add CheckboxQuestionEditor (64eb3d43)
- 🖥️ ui(studio): refactor LessonStory components to simplify state management
  (3610ce2d)
- 🌐 domain: add methods to CheckboxQuestion (e9514b52)
- 🖥️ ui(studio): add AddItemButton (c736f2a2)
- 🖥️ ui(studio): add CodeInput (76acbb2f)
- 🖥️ ui(studio): add UndoQuestionChangeButton (27395d0b)
- 📦 deps(studio): install @radix-ui/react-checkbox (447a90b3)
- 🗃️ ftree(studio): remove OptionInput (89d22edb)
- ♻️ refactor(studio): remove logs from SelectionQuestionEditorView (ff78535e)
- 🖥️ ui(studio): add SelectionQuestionEditor (2225bee7)
- ♻️ refactor(studio): update QuizContext to use selectedQuestion instead of
  selectedQuestionIndex (6d36d235)
- 🌐 domain: add setters to Question and SelectionQuestion (f06042c7)
- 📦 deps(studio): install react-radio-group (43271676)
- 🗃️ ftree(studio): move PictureInput to global components folder (04662b56)
- ♻️ refactor(web): remove logs from auth ui module (45fc456a)
- 🧪 test(web): signUpPageView (6c7c49c3)
- 🧪 test(web): useSignUpPage (6e833fa5)
- 🧪 test(web): signUpForm (258b82cd)
- 🧪 test(web): animatedHeroView (e42a9a6c)
- 🧪 test(web): signInPageView (aa8fa9b3)
- 🧪 test(web): rocketAnimationView (462354ec)
- 🧪 test(web): useSignInPage (7d915aa1)
- 🧪 test: signInForm (3cf4ff6f)
- 📦 deps(web): add scripts to run tests (c54b500c)
- ⚙️ config(web): load env variables for testing (845d9eba)
- 📦 deps(web): install ts-jest-mocker (8f1c4f4f)
- 🗃️ ftree(web): remove all texts and questions mocks from **tests** folder
  (c5916a7b)
- ♻️ refactor(studio): remove logs from useActionButton (59b23910)
- ♻️ refactor(studio): remove logs from useActionButton (26429746)
- ♻️ refactor(studio): replace LessonQuestionsPage with LessonQuizPage and
  enhance sortable feature (ffe63a70)
- 📶 rest(studio): implement LessonService's updateQuestions (9eaf97f3)
- 🖥️ ui(studio): add action button store (813cf7f5)
- ⚙️ config(server): register update questions route (b7693255)
- 💾 db: implement QuestionsRepository's updateMany method using Supabase
  (e41e43fe)
- 📶 rest: add UpdateQuestionsController (8bbbf2b0)
- ✨ use case: update questions (db423f56)
- 🌐 domain: add QuestionFactory (17e2265f)
- 🌐 domain: add InvalidQuestionTypeError (72165063)
- 📦 deps: install zustand (7d3ac745)

## 0.2.1 (2025-08-11)

- ⚙️ config: set GITHUB_TOKEN before run release-it script (ad97b12d)
- ♻️ refactor(web): remove all comments from next.config (9aaa4e76)
- 🔀 merge: branch 'sing-up-form-bug' into main (7e296300)
- 🗃️ ftree(web): delete code runner folder (634b6ba9)
- 🔀 merge: pull request #122 (c573aa68)
- ♻️ refactor(web): update useSnippetPage to use new type definitions for form
  input and output (d2143db5)
- ♻️ refactor(server): integrate ValidationMiddleware for request validation in
  AuthRouter (2c51087b)
- 🐛 fix(web): update SignUpForm button type and improve error handling in
  useSignUpForm (480edcb7)
- 📦 deps(web): update @hookform/resolvers to version 5.2.1 (e846a1ba)
- 🔀 merge: pull request #120 (d0d1f46a)
- ♻️ refactor(studio): update LessonQuestions components and translations
  (04944d4b)
- 🚧 wip(studio): add QuizArranger widget for lesson questions page (219e4c39)
- 🖥️ ui(studio): add QuizArranger widget for lesson questions page (b7c53a07)
- 🖥️ ui(studio): add QuizBank widget for lesson questions page (dc14e959)
- 🖥️ ui(studio): add PageHeader component for lesson module (38279987)
- 🖥️ ui(studio): add QuizContext (66881542)
- 🖥️ ui(studio): add Sortable component (8c5d9eae)
- 🖥️ ui(studio): add ConfirmDialog component (946c2d4f)
- ⚙️ config(studio): register LessonQuestionsRoute (7b326097)
- 📦 deps(studio): install tailwind-scrollbar (1a4c3ad9)
- 🔀 merge: quiz-builder branch into main (175f718b)
- 📦 deps(studio): install @dnd-kit/core (8804a04a)
- 🔀 merge: pull request #117 (55a2bd15)
- 📚 docs: add cr prefix to coomit table (5ac2b06a)
- 🖥️ ui(studio): remove simple-arrow-down as icon name value (ad648aa9)
- 🖥️ ui(studio): make it possible to insert a tag right after the tag whenre the
  cursor is on (73e0c8cd)
- 🖥️ ui(studio): enhace colors of CodeSnippetView (5b988f87)
- ⚙️ config: polyfill node process in vite config (bee24405)
- 📦 deps(studio): install vite-plugin-node-polyfills (53655749)
- 🔀 merge pull request #115 (4260b8f1)
- 🚧 wip: import code runner package in web and studio applications (c7bc5b7d)
- 📦 deps: update @designliquido/delegua to version 0.48.2 (00d98420)
- ⚙️ config: add package for code runner (20109566)
- ▶️ cr: add ExecutorDeCodigoDelegua (5b9cdd69)
- ▶️ cr: add ConfiguracaoDeleguaParaEditorMonaco (b17c5858)
- ▶️ cr: add InterpretadorDelegua (856905da)
- ⚙️ config: allow code-runner as commit scope (0f4c083d)
- 🔀 merge pull request #114 (c2413c83)
- Merge branch 'text-editor-context' of https://github.com/JohnPetros/stardust
  into text-editor-context (b20e7af2)
- ♻️ refactor(studio): move text editor context to global module (fe192f23)
- 🪨 constants: add DEFAULT_PICTURE_NAME in useTextBlockButton (3683c449)
- 🖥️ ui(studio): wrap lesson story page with text editor context (466339f8)
- 📶 rest(studio): implement LessonService (946a04ee)
- 🖥️ ui(studio): add widget and context for TextEditor (d07d1a44)
- 🎴 assets(studio): add alert image (d08f91ff)
- 📦 deps(studio): install markdown-to-jsx and tailwind-variants (a2e65123)
- 🐛 fix(web): maintain the consistency of the ContentEditor component with the
  rest of the app (2a5e46c9)
- ♻️ refactor: include mdx and action button components from web app yo studio
  app (9d154d4c)
- 🐛 fix: resolve bad typing (215327b3)
- 🔀 merge pull request #112 (028bcf44)
- ♻️ refactor(web): deactivate postFormData in NextRestClient (2aafb764)
- ♻️ refactor: remove logs (20b1c738)
- ♻️ refactor(studio): replace StorageFolder as a type with StorageFolder as a
  structure (d732d633)
- 🌐 domain: add StorageFolder (9393173b)
- 🖥️ ui(web): add useImage hook (9760e9e3)
- 🐛 fix(server): remove description field from rocket and avatar schemas
  (51e26eb6)
- 📦 deps(web): update @designliquido/delegua to 0.47.0 version (5dfdac41)
- 🖥️ ui(studio): enhance UX for story image input component (69172dd9)
- 🖥️ ui(studio): add LoadMoreButton component (8c593e6d)
- 🖥️ ui(studio): add Loading component (3feb05d7)
- 🖥️ ui(studio): make usePaginatedCache to return isFetching and
  isFetchingNextPage (97dd0bfa)
- 🖥️ ui(studio): add ClipboardButton (a3b4f54d)
- Merge branch 'main' of https://github.com/JohnPetros/stardust (3c6571b8)
- 🖥️ ui(studio): translate StoryImageInputView to portuguese (96be4ee1)
- 🔀 merge: pull request #111 (e5c24172)
- 🖥️ ui(studio): add ImageInput global component (b5111059)
- 📶 rest(studio): implement StorageService's uploadFile and removeFile
  (232d34a5)
- 📶 rest(studio): implement RestClient's postFormData using Axios (7c798503)
- 📦 deps(studio): install dialogs, input with error, and file upload from
  shadcn (65e839c8)
- 🔀 merge: pull request #109 (8608af78)
- ♻️ refactor(studio): remove useless tailwind css class in ImageCardView
  (02c87fc5)
- 🚧 wip(studio): add lesson story page (d14c8051)
- 🚧 wip(studio): add story image input (cf20ed93)
- 🖥️ ui(studio): add Tooltip component (c615736c)
- 🖥️ ui(studio): add usePaginatedCache hook (cc4084d9)
- 🖥️ ui(studio): add useClipboard hook (5de80d71)
- 🖥️ ui(studio): add useImage hook (0ebb3117)
- ⚙️ config(studio): add route for LessonStory page (1a9caa8d)
- ♻️ refactor: raname StorageProvider's listImages to listFiles (c3a8304c)
- 📦 deps(studio): install shadcn/tooltip (4a68814a)
- 📦 deps(studio): install shadcn/dialog (75893300)
- 🔀 merge: pull request #108 (3e4ffabf)
- ♻️ refactor(server): enhance error handling in DropboxStorageProvider
  (af5e5c3d)
- 🐛 fix(web): remove bad typing (d8f0745e)
- 🧪 test: backup database use case (c2e708c6)
- ♻️ refactor: replace Google Drive with Dropbox within BackupDatabaseJob
  (db6826e0)
- 🧰 provision(server): implement StorageProvider using Dropbox (ac01d729)
- 🪨 constants(server): add dropboxAccessToken to ENV (3c039387)
- 📦 deps(server): install dropbox (9e5341f6)
- 📚 docs: remove trash from blacklog item issue (6f69fed0)
- 🐛 fix(server): restore all files realted to storage module (9e7d461f)
- 🐛 fix(server): resolve conflicts (daeefc9a)
- 🔀 merge: storage-router branch into itself (603df7b5)
- 🔀merge: pull request #106 (9bcba859)
- 🔀 merge: storage-router branch into itself (d4ffdfad)
- 🐛 fix(server): validate storage folder as a route param instead of query
  param (34df1aa0)
- 🐛 fix: imports of storage controllers (d84d9a57)
- 📶 rest(server): add RemoveFileController (a0ff2eb9)
- 📶 rest(server): add UploadFileController (89b9bf0e)
- 🧰 provision(server): implement upload and removeFile methods in
  SupabaseStorageProvider (6beb6c49)
- ⚙️ config(server): make hono http implementation return file (aa60064d)
- ⚙️ config(server): register router for storage module (f99e9e16)
- 📶 rest(server): add FetchImagesListController (58259a3a)
- 🧰 provision(server): implement listFiles method in SupabaseStorageProvider
  (fbbf99e2)
- 📑 interface: add listFiles method to StorageProvider (d40d619c)
- 📮 validation: add storageFolderSchema (36ae5c4b)
- 📮 validation: add searchSchema (c954085d)
- ⚙️ config: add commit type for validation (fd2fa2e3)
- ⚙️ config: ignore issue.md file (1d9a52e6)
- 🔀 merge: pull request #104 (4933a234)
- 🔀 merge pull request #102 (bf615685)
- ⚙️ config(server): register update story route (3d046c57)
- 📶 rest(server): add UpdateStoryController (72b049b2)
- ⚙️ config: ignore issue.md file for testing (0f0d1eee)
- 📶 rest(server): add VerifyStarExistsController (7a7ce244)
- 💾 db(server): implement update StoriesRepository's method using Supabase
  (97228be7)
- 🧪 test: update Story Use Case (97f1f461)
- ✨ use case: add Update Story Use Case (cec22ab6)
- 🖥️ ui(studio): add planets list to planets page (3964e7f1)
- 🪨 constants: add supabaseCdnUrl to ENV (8dc27878)
- 📶 rest(studio): add StorageService (36b39504)
- 🖥️ ui(studio): add Animation component (55ac1ef5)
- 📦 deps(studio): install lottie-react (99b97944)
- 🔀 merge: pull request #101 (0b39c7ae)
- ♻️ refactor(studio): localize password field to Portuguese (565452c6)
- ⚙️ config(studio): wrap all application with context providers (f390f91f)
- ⚙️ config(studio): apply middlewares to sign in and planets routes (fde665b6)
- ⚙️ config(studio): add RestMiddleware for react router (837f4c1b)
- ⚙️ config(studio): add AuthMiddleware (73928c36)
- 🖥️ ui(studio): add useRest hook (e0feb231)
- 🖥️ ui(studio): add SignInPage widget (12a01954)
- 🖥️ ui(studio): add AuthContext (2a0b4315)
- ⚙️ config(studio): enable unstable_middleware (847ff2ce)
- 📶 rest(studio): add AuthService (d5e99a78)
- 🪨 constants(studio): add constants for useRouter, useToast, and
  useSessionStorage (34f1325d)
- 🖥️ ui(studio): add useRouter hook (920b23a4)
- 🖥️ ui(studio): add useCache hook (03e61b95)
- 🖥️ ui(studio): add useToast (8391c7c1)
- 📦 deps(studio): install react query, react hook form, and usehooks-ts
  (7ac292bf)
- 📦 deps(studio): install sonner (edc13a4a)
- 🔀 merge: pull request #99 (f756ce7c)
- Apply suggestion from @Copilot (968f9fcd)
- 🚧 wip(studio): page of planets (33e2da22)
- 📶 rest(studio): add SpaceService (f48011ac)
- 🪨 constants(studio): add env (070bd3b7)
- 📶 rest(studio): implement rest client using Axios (f09f1989)
- 💾 db(server): use planets_view to create SupabasePlanet (2bd14fcb)
- 🌐 domain: add completionCount prop to Planet (b0dbf6ed)
- 📦 deps(studio): install core and validation packages (db8b8d8f)
- 🔀 merge: pull request #97 (aaf97402)
- ♻️ refactor(studio): prefix all imports with '@/' (a7b21f31)
- ♻️ refactor: use cn util in HeaderView (17bc8398)
- ⚙️ config: allow commit emoji for constants (5e6ca27a)
- ⚙️ config(studio): add routes for Achivements, Planets, Users, and Challenges
  pages (e0f4285a)
- 🖥️ ui(studio): add App layout (77014fe1)
- 🖥️ ui(studio): add base for Achivements, Users, and Challenges pages
  (334b528a)
- 🖥️ ui(studio): add Icon component (af03f6d7)
- 🪨 constants(studio): add routes constant (5c014f6b)
- 🎴 assets(studio): add logo and rocket images (76a215ac)
- 🔀 merge: pull request #95 (c7c56891)
- 🐛 fix(server): ensure pass inngest context to all functions (3590b2b7)
- 💾 db(server): implement UsersRepository's findAll method using Supabase
  (8cec8dfe)
- 📦 deps: add script to check and update dependencies (663914f2)
- 🗃️ ftree(server): delete all duplicated files (254a4b70)
- 📚 docs: add project rules for cursor (c83cf257)
- ⚙️ config: ignore vscode and cursor folders (e197a823)
- 📦 deps(web): update @designliquido/delegua to version 0.45.5 (1142e5cd)
- Merge branch 'main' of https://github.com/JohnPetros/stardust (30d88781)
- 🔀 merge: pull request #92 (884d9908)
- 🔀 merge: pull request #90 (85ec87e5)
- ⚙️ config: ignore .react-router folder (9d1f0906)
- ♻️ refactor(web): create TextBlock structure from a dto in useLessonPage hook
  (bb08ad97)
- ♻️ refactor(server): create TextBlock structure from a dto in
  SupabaseTextBlockMapper (c2ea2f4b)
- ♻️ refactor(core): create TextBlock structure from a dto (08f6136e)
- ♻️ refactor: create TextBlock structure from a dto (e0aac1e5)
- 📚 docs(studio): correct typos (e4a98c33)
- ⚙️ config: restrict commit scope (acc2f687)
- ⚙️ config(studio): setup app and install initial dependnecies (cf3147c2)
- 📚 docs: add wiki page for studio application (faf7fbef)

## 0.2.0 (2025-07-16)

- 📚 docs: add changelog for version 0.2.6 (41b21789)
- 🔀 merge: pull request #87 (4fb4849d)
- 🐛 fix(web): set initial stage to story for lesson state (10f15c66)
- 🐛 fix: set initial stage to story for lesson state (10e51b9c)
- 🐛 fix(server): make FetchChallengesListController get the user completed
  challenges ids (92efd822)
- 🔀 merge: pull request #85 (c7d35f18)
- 📚 docs: add backlog item issue template (526c90af)
- 📚 docs: add backlog item issue template (37b411df)
- ♻️ refactor(web): add useProfileSocket (f34b45a5)
- 🐛 fix(web): resolve all dependency incompatibilities (ba563178)
- 📦 deps(web): upgrade react types (ead8eee0)
- 📦 deps(web): upgrade react to version 19 (9520411d)
- 🔀 merge: pull request #82 (5d8bf525)
- 🚧 wip(web): replace framer motion with motion/react dependency (b48eb526)
- 🌐 domain: add dto getter to Question abstract (4cb7d9dd)
- ♻️ refactor(web): remove all Supabase implementation (07ca56e3)
- ⚙️ config(server): add routers for lesson module (8651a172)
- 📶 rest: add lesson module controlers (a2b4a001)
- 💾 db: implement lesson module repositories using Supabase (fcdd0aca)
- 📦 deps(web): upgrade Next.js to version 15 (487c55bc)
- 📦 deps(web): update minor change for all packages (1026e7fc)
- 🐛 fix: disabling minification until Terser Plugin can be appropriately
  configured for Webpack. (#81) (9f7bdc82)
- 📦 deps: upgrade delegua version to 0.45.2 (b5391cd3)
- 📚 docs: update issue templates (ac330ec9)
- 📚 docs: update issue templates (7943b856)
- 📚 docs: add issue template (f52aa8cb)
- ⚙️ config: set node version to 22.17.0 (8e66ac61)
- ♻️ refactor(web): apply mvvm pattern to some small components (ec0796e9)
- 📚 docs: update code conventions wiki page (ccad2b33)
- 📚 docs: add wiki page for code conventions (f1df81da)
- 🔀 merge: pull request #79 (48219a7c)
- 🔀 merge: pull main branch changes (afe346b7)
- 📚 docs(web): update .env.example (a89c25d8)
- 🐛 fix(core): ensure users can only unlock stars that are not already unlocked
  (f6a4c618)
- 🔀 merge: pull request #77 (f34f6e72)
- 🐛 fix: improved minification config (d2153e77)
- 📚 docs(web): update .env.example file (498d4254)
- 📚 docs(server): update .env.example (c8ef5c8d)
- ♻️ refactor(web): declare types for delegua umd module (23ad3a70)
- 📚 docs: add all pages from wiki (d0b71168)
- 🔀 merge: main branch into itself (f659286c)
- ⚙️ config(web): update .env.example (fb9770b0)
- 🔀 merge: pull request #74 (e7a4a24b)
- ⚙️ config(web):suppresing message about Zod. (7e34225c)
- ⚙️ config(web): configuring Terser plugin to not modify Delégua class names.
  (8026fe6c)
- ⚙️ config(web): disable swcMinify from nextjs.config (ca11086e)
- ⚙️ config(web): set config.optimization.minimize to false (0bd115fe)
- ⚙️ config: add release sh script (628fbd62)
- 📚 docs: generate changelog for 0.1.6 version (8a0ee42c)

## 0.1.6 (2025-07-10)

- 📚 docs: add section about issues to CONTRIBUTING.md (b256b1b8)
- ♻️ refactor: remove duplicated code from User entity (5a4be8b8)
- 🔀 merge: branch space-completion-status-refactor into itself (fa196b3b)
- ✨ use case: make user to complete space if they completes the last available
  star for the first time (d09e3562)
- 🧪 test: user entity (03f5625d)

## 0.1.5 (2025-07-09)

- 📦 deps: uninstall all relase-it plugins (1a49abf4)
- ⚙️ config: add update-changelog shell script (00b88873)
- ⚙️ config: remove plugin for changelog from release-it (f5c90949)
