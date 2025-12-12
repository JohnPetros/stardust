# Changelog

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
* 🎞️ queue(server): enhance inngest to support UserSignedInEvent and register user visit functionality (ff67a594)
* 🎞️ queue(server): implement RegisterUserVisitJob for processing user visit events (1e63d004)
* 🧪 test: add unit tests for RegisterUserVisitUseCase to validate user visit registration logic (53087eae)
* ✨ use case: add RegisterUserVisitUseCase for tracking user visits (2e99127b)
* 🐛 fix(server): modify error handling in SupabaseUsersRepository to return Logical.createAsFalse() instead of throwing an error (9f7cf216)
* 💾 db(server): add users_visits table type definition and update message versioning (2fee19b9)
* 🌐 domain: add UserSignedInEvent class and export from events index (43321fd0)
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
- ♻️ refactor(web): rename webAppUrl and serverAppUrl to stardustWebUrl and
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
- ♻️ refactor(server): rename webAppUrl to stardustWebUrl and update references
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
- ♻️ refactor(web): update all instances of webAppUrl and serverAppUrl to
  stardustWebUrl and stardustServerUrl for consistency across the application
  (62ae7a6a)
- 📶 rest(web): add NotificationService for handling notifications and integrate
  it into the service index (e76a1ef3)
- ♻️ refactor(web): update environment variable names from webAppUrl and
  serverAppUrl to stardustWebUrl and stardustServerUrl for improved clarity
  (585d7502)
- ⚙️ config(web): add Sentry client initialization and request error handling
  for enhanced error tracking (946bfab3)
- 🖥️ ui(web): introduce DecryptedText component for animated text reveal effects
  (2aa42dcf)
- 🎴 assets(web): add new Apollo Mendigo image to the public assets (8660678d)
- 🖥️ ui: add internal error animation to Lottie animations and update type
  definitions (ab0a55e8)
- ♻️ refactor: rename webAppUrl to stardustWebUrl in environment configuration
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
- 🌐 domain: add accountProvider field to UserSignedUpEvent,
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
- 🌐 domain: add completionsCount prop to Planet (b0dbf6ed)
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
