---
title: Implementar Analytics de Produto com PostHog
prd: https://github.com/JohnPetros/stardust/milestone/33
issue: https://github.com/JohnPetros/stardust/issues/423
apps: server, studio, web
status: closed
last_updated_at: 2026-06-13
---

# 1. Objetivo (Obrigatório)

Implementar a instrumentação de analytics de produto com PostHog, cobrindo eventos de negócio server-certified via Inngest no `server`, identificação e instrumentação automática no browser da `web`, e migração do relatório de Usuários Ativos Diários consumido pelo `studio` para a PostHog Query API, removendo o tracking legado de visitas em banco sem alterar o contrato visual atual do dashboard administrativo.

---

# 2. Escopo (Obrigatório)

## 2.1 In-scope

* Criar contratos de analytics no `core` para captura server-side, captura client-side e consulta de relatórios.
* Criar eventos de domínio faltantes para desbloqueio de estrela, recompensa, conclusão de desafio, exclusão de desafio e compra de item da loja.
* Passar a publicar eventos de domínio nos use cases existentes após a confirmação da regra de negócio.
* Criar provider PostHog server-side no `server` usando `posthog-node`.
* Criar provider de relatório no `server` usando PostHog Query API com HogQL.
* Criar job e functions Inngest para converter eventos de domínio em eventos PostHog.
* Configurar PostHog client-side no `web` com bootstrap do usuário autenticado, identificação após login/cadastro social e reset no logout.
* Preservar o endpoint `GET /profile/users/daily-active-users-report?days=N` para o `studio`, alterando apenas a fonte do dado no `server`.
* Remover o fluxo legado `AccountSignedInEvent -> RegisterUserVisitJob -> RegisterUserVisitUseCase -> users_visits`.
* Remover a tabela `public.users_visits` por migration canônica em `apps/server/supabase/migrations/**`.

## 2.2 Out-of-scope

* Criar dashboards de analytics dentro da Stardust além do DAU já existente no `studio`.
* Instrumentar pageviews, session recordings ou eventos administrativos no `studio`.
* Implementar consentimento de cookies, LGPD/GDPR ou gestão de opt-in.
* Instrumentar aplicativo mobile.
* Criar testes A/B além de habilitar suporte a feature flags via SDK PostHog.
* Sincronizar ou exportar dados do PostHog para o banco da plataforma.
* Remover Google Analytics existente em `apps/web/src/ui/global/widgets/layouts/Root/RootLayoutView.tsx`; isso não foi solicitado pelo PRD.

---

# 3. Requisitos (Obrigatório)

## 3.1 Funcionais

* Eventos de cadastro, login, criação de perfil, desbloqueio de estrela, conclusão de planeta, conclusão do espaço, recompensa, conclusão de desafio, publicação de desafio, exclusão de desafio, compra de item da loja e envio de feedback devem ser enviados ao PostHog.
* Eventos críticos de negócio devem ser enviados pelo `server` somente após o domínio confirmar o fato.
* Reprocessamentos do mesmo evento Inngest não devem gerar duplicatas no PostHog.
* Falha no envio ao PostHog não deve interromper o fluxo principal do usuário.
* O usuário autenticado da `web` deve ser identificado no PostHog com `id` e `email` desde o primeiro render autenticado.
* Login e cadastro social devem identificar o usuário no PostHog após sucesso.
* Logout deve desvincular a sessão identificada no PostHog.
* Pageviews e gravações de sessão devem ser capturados automaticamente no browser.
* O relatório DAU do `studio` deve consultar dados do PostHog por meio do `server`, mantendo segmentação por `web` e `mobile`.
* O mecanismo legado de registro manual de visitas no banco deve ser removido.

## 3.2 Não funcionais

* **Segurança:** tokens privados do PostHog (`POSTHOG_PERSONAL_API_KEY`) devem existir apenas no `server`; a `web` deve receber somente variáveis `NEXT_PUBLIC_*` do SDK client-side.
* **Privacidade:** eventos enviados ao PostHog não devem incluir conteúdo de feedback, screenshots, código submetido ou outros payloads ricos quando apenas metadados forem suficientes.
* **Resiliência:** o envio de analytics deve rodar dentro de `amqp.run(...)` e tratar falhas como efeito colateral isolado do fluxo principal.
* **Idempotência:** eventos server-side devem enviar `$insert_id` baseado no `context.event.id` do Inngest para deduplicação do mesmo evento durante retries.
* **Compatibilidade retroativa:** o endpoint consumido pelo `studio` para DAU deve manter o shape `DailyActiveUsersDto` atual: `{ date, web, mobile }[]`.
* **Latência:** login/logout na `web` não devem aguardar chamadas client-side ao PostHog para resolver UI; identificação e reset são efeitos de browser.
* **Observabilidade:** falhas de provider PostHog no `server` devem ser propagadas ao handler Inngest para o fluxo de falha existente em `InngestFunctions.handleFailure`, sem quebrar requests HTTP originais.

---

# 4. O que já existe? (Obrigatório)

## Core

* **`Event`** (`packages/core/src/global/domain/abstracts/Event.ts`) - classe base usada por eventos de domínio publicados em filas.
* **`Broker`** (`packages/core/src/global/interfaces/Broker.ts`) - contrato `publish(event: Event): Promise<void>` usado por use cases e actions.
* **`Job`** (`packages/core/src/global/interfaces/queue/Job.ts`) - contrato `handle(amqp?: Amqp<Payload>): Promise<void>` para jobs agnósticos de Inngest.
* **`Amqp`** (`packages/core/src/global/interfaces/queue/Amqp.ts`) - contrato para `run`, `waitFor`, `sleepFor` e `getPayload`.
* **`TelemetryProvider`** (`packages/core/src/global/interfaces/provision/TelemetryProvider.ts`) - referência de contrato de provider desacoplado de SDK externo.
* **`AccountSignedUpEvent`** (`packages/core/src/auth/domain/events/AccountSignedUpEvent.ts`) - evento `auth/account.signed.up` com `accountId`, `accountName` e `accountEmail`.
* **`AccountSignedInEvent`** (`packages/core/src/auth/domain/events/AccountSignedInEvent.ts`) - evento `auth/account.signed.in` com `accountId` e `platform`.
* **`UserCreatedEvent`** (`packages/core/src/profile/domain/events/UserCreatedEvent.ts`) - evento `profile/user.created` já publicado em criação de usuário.
* **`ChallengePostedEvent`** (`packages/core/src/challenging/domain/events/ChallengePostedEvent.ts`) - evento `challenging/challenge.posted` já publicado em publicação de desafio.
* **`FeedbackReportSentEvent`** (`packages/core/src/reporting/domain/events/FeedbackReportSentEvent.ts`) - evento `reporting/feedback-report.sent` já publicado em envio de feedback.
* **`FirstStarUnlockedEvent`** (`packages/core/src/space/domain/events/FirstStarUnlockedEvent.ts`) - evento existente para a primeira estrela desbloqueada.
* **`PlanetCompletedEvent`** (`packages/core/src/space/domain/events/PlanetCompletedEvent.ts`) - evento existente para planeta concluído.
* **`SpaceCompletedEvent`** (`packages/core/src/space/domain/events/SpaceCompletedEvent.ts`) - evento existente para espaço concluído.
* **`UnlockStarUseCase`** (`packages/core/src/profile/use-cases/UnlockStarUseCase.ts`) - desbloqueia estrela no perfil, mas ainda não publica evento.
* **`RewardUserUseCase`** (`packages/core/src/profile/use-cases/RewardUserUseCase.ts`) - recompensa usuário com XP/moedas, mas ainda não publica evento.
* **`CompleteChallengeUseCase`** (`packages/core/src/profile/use-cases/CompleteChallengeUseCase.ts`) - conclui desafio para usuário, mas ainda não publica evento.
* **`DeleteChallengeUseCase`** (`packages/core/src/challenging/use-cases/DeleteChallengeUseCase.ts`) - remove desafio, mas ainda não publica evento.
* **`AcquireRocketUseCase`** (`packages/core/src/profile/use-cases/AcquireRocketUseCase.ts`) - compra foguete, mas ainda não publica evento.
* **`AcquireAvatarUseCase`** (`packages/core/src/profile/use-cases/AcquireAvatarUseCase.ts`) - compra avatar, mas ainda não publica evento.
* **`AcquireInsigniaUseCase`** (`packages/core/src/profile/use-cases/AcquireInsigniaUseCase.ts`) - compra insígnia, mas ainda não publica evento.
* **`GetDailyActiveUsersReportUseCase`** (`packages/core/src/profile/use-cases/GetDailyActiveUsersReportUseCase.ts`) - monta relatório DAU a partir de `UsersRepository.countVisitsByDateAndPlatform(...)`.
* **`RegisterUserVisitUseCase`** (`packages/core/src/profile/use-cases/RegisterUserVisitUseCase.ts`) - registra visita diária legada no banco.
* **`Visit`** (`packages/core/src/profile/domain/structures/Visit.ts`) - estrutura legada para visita de usuário.
* **`DailyActiveUsersDto`** (`packages/core/src/profile/domain/entities/dtos/DailyActiveUsersDto.ts`) - DTO já consumido pelo `studio` com `{ date, mobile, web }[]`.
* **`UsersRepository`** (`packages/core/src/profile/interfaces/UsersRepository.ts`) - inclui métodos legados `countVisitsByDateAndPlatform`, `addVisit` e `hasVisit`.
* **`ProfileService`** (`packages/core/src/profile/interfaces/ProfileService.ts`) - define `fetchDailyActiveUsersReport(days: Integer): Promise<RestResponse<DailyActiveUsersDto>>`.

## Server - Provision

* **`SentryTelemetryProvider`** (`apps/server/src/provision/telemetry/sentry/SentryTelemetryProvider.ts`) - referência de provider que encapsula SDK externo e implementa interface do core.
* **`ENV`** (`apps/server/src/constants/env.ts`) - valida variáveis de ambiente com Zod; ainda não possui variáveis PostHog.
* **`package.json`** (`apps/server/package.json`) - ainda não declara `posthog-node` como dependência direta.

## Server - Queue

* **`InngestBroker`** (`apps/server/src/queue/inngest/InngestBroker.ts`) - publica eventos de domínio em `inngest.send`.
* **`InngestAmqp`** (`apps/server/src/queue/inngest/InngestAmqp.ts`) - adapta `context.step` e `context.event` para o contrato `Amqp`.
* **`ProfileFunctions`** (`apps/server/src/queue/inngest/functions/ProfileFunctions.ts`) - registra `RegisterUserVisitJob` para `AccountSignedInEvent`.
* **`NotificationFunctions`** (`apps/server/src/queue/inngest/functions/NotificationFunctions.ts`) - referência de composition root que mapeia eventos para jobs e services externos.
* **`RegisterUserVisitJob`** (`apps/server/src/queue/jobs/profile/RegisterUserVisitJob.ts`) - job legado que registra visitas no banco.
* **`HonoApp`** (`apps/server/src/app/hono/HonoApp.ts`) - registra todas as functions Inngest em `/inngest`.

## Server - REST

* **`UsersRouter`** (`apps/server/src/app/hono/routers/profile/UsersRouter.ts`) - expõe `GET /profile/users/daily-active-users-report` com validação `days: integerSchema`.
* **`FetchDailyActiveUsersReportController`** (`apps/server/src/rest/controllers/profile/users/FetchDailyActiveUsersReportController.ts`) - instancia `GetDailyActiveUsersReportUseCase` com `UsersRepository`.
* **`ConfirmEmailController`** (`apps/server/src/rest/controllers/auth/ConfirmEmailController.ts`) - publica `AccountSignedInEvent` no fluxo de confirmação de e-mail.

## Server - Database

* **`SupabaseUsersRepository`** (`apps/server/src/database/supabase/repositories/profile/SupabaseUsersRepository.ts`) - implementa `countVisitsByDateAndPlatform`, `addVisit` e `hasVisit` usando `users_visits`.
* **`Database.ts`** (`apps/server/src/database/supabase/types/Database.ts`) - contém tabela `users_visits` e enum `platform` gerados pelo Supabase.
* **`20260511182355_remote_schema.sql`** (`apps/server/supabase/migrations/20260511182355_remote_schema.sql`) - snapshot atual que criou `users_visits`, grants e enum `platform`.

## Web - UI/RPC

* **`RootLayoutView`** (`apps/web/src/ui/global/widgets/layouts/Root/RootLayoutView.tsx`) - composição global da aplicação e Google Analytics em produção.
* **`ServerProviders`** (`apps/web/src/ui/global/widgets/layouts/Root/ServerProviders/index.tsx`) - resolve `accountDto` server-side via `AuthService.fetchAccount()` e cria `AuthContextProvider`.
* **`ClientProviders`** (`apps/web/src/ui/global/widgets/layouts/Root/ClientProviders/index.tsx`) - empilha providers client-side globais.
* **`AuthContextProvider`** (`apps/web/src/ui/auth/contexts/AuthContext/index.tsx`) - monta `useAuthContextProvider` com actions e `ProfileService`.
* **`useAuthContextProvider`** (`apps/web/src/ui/auth/contexts/AuthContext/hooks/useAuthContextProvider.ts`) - centraliza login, cadastro social, logout e cache de usuário.
* **`SignInAction`** (`apps/web/src/rpc/actions/auth/SignInAction.ts`) - autentica e publica `AccountSignedInEvent` em produção.
* **`SignUpWithSocialAccountAction`** (`apps/web/src/rpc/actions/auth/SignUpWithSocialAccountAction.ts`) - autentica/cadastra conta social e publica `AccountSignedInEvent` em produção.
* **`authActions`** (`apps/web/src/rpc/next-safe-action/authActions.ts`) - composition root que instancia `InngestBroker` para actions de autenticação.
* **`CLIENT_ENV`** (`apps/web/src/constants/client-env.ts`) - valida variáveis públicas; ainda não possui PostHog.
* **`SERVER_ENV`** (`apps/web/src/constants/server-env.ts`) - valida variáveis server-side; ainda não possui PostHog.
* **`package.json`** (`apps/web/package.json`) - ainda não declara `posthog-js` nem `@posthog/react`.

## Studio - UI/REST

* **`DailyActiveUsersChart`** (`apps/studio/src/ui/global/widgets/pages/Dashboard/DailyActiveUsersChart/index.tsx`) - widget do gráfico DAU que consome `profileService`.
* **`useDailyActiveUsersChart`** (`apps/studio/src/ui/global/widgets/pages/Dashboard/DailyActiveUsersChart/useDailyActiveUsersChart.ts`) - busca DAU com janela `7`, `30` ou `90` dias via `profileService.fetchDailyActiveUsersReport(days)`.
* **`DailyActiveUsersChartView`** (`apps/studio/src/ui/global/widgets/pages/Dashboard/DailyActiveUsersChart/DailyActiveUsersChartView.tsx`) - renderiza gráfico Recharts usando `date`, `web` e `mobile`.
* **`ProfileService`** (`apps/studio/src/rest/services/ProfileService.ts`) - chama `GET /profile/users/daily-active-users-report?days=${days.value}`.

---

# 5. O que deve ser criado?

## Camada Core (Analytics)

* **Localização:** `packages/core/src/analytics/domain/entities/dtos/AnalyticsEventDto.ts` - **novo arquivo**
* **props:** `name: string`, `distinctId: string`, `insertId: string`, `properties: Record<string, unknown>`.
* **Responsabilidade:** transportar, na borda do job, o evento normalizado montado por `AnalyticsFunctions` antes de criar a structure usada pelo provider.

* **Localização:** `packages/core/src/analytics/domain/structures/AnalyticsEvent.ts` - **novo arquivo**
* **props:** `name: Text`, `distinctId: Id | Text`, `insertId: Text`, `properties: Record<string, unknown>`.
* **Métodos:** `static create(dto: AnalyticsEventDto): AnalyticsEvent` - cria a structure a partir do DTO normalizado pela borda.
* **Métodos:** `get dto(): AnalyticsEventDto` - retorna o shape primitivo para adapters externos quando necessário.
* **Responsabilidade:** representar semanticamente o evento de analytics já validado, garantindo campos obrigatórios antes do provider conversar com o SDK externo.

* **Localização:** `packages/core/src/analytics/interfaces/ServerAnalyticsProvider.ts` - **novo arquivo**
* **Dependências:** nenhuma.
* **Métodos:** `trackEvent(event: AnalyticsEvent): Promise<void>` - envia um evento server-side validado para o provider externo.

* **Localização:** `packages/core/src/analytics/interfaces/ClientAnalyticsProvider.ts` - **novo arquivo**
* **Dependências:** nenhuma.
* **Métodos:** `trackEvent(eventName: string, properties?: Record<string, unknown>): void` - captura evento client-side manual quando necessário.
* **Métodos:** `identifyUser(userId: Id, userEmail: Email): void` - vincula sessão anônima ao usuário autenticado.
* **Métodos:** `reset(): void` - desvincula sessão identificada no logout.

* **Localização:** `packages/core/src/analytics/interfaces/AnalyticsReportingProvider.ts` - **novo arquivo**
* **Dependências:** nenhuma.
* **Métodos:** `getDailyActiveUsers(days: Integer): Promise<DailyActiveUsersDto>` - consulta DAU segmentado por plataforma e retorna o DTO já consumido pelo Studio.

* **Localização:** `packages/core/src/analytics/interfaces/index.ts` - **novo arquivo**
* **Métodos:** Não aplicável.
* **Responsabilidade:** exportar `ServerAnalyticsProvider`, `ClientAnalyticsProvider` e `AnalyticsReportingProvider`.

* **Localização:** `packages/core/src/analytics/domain/entities/dtos/index.ts` - **novo arquivo**
* **Métodos:** Não aplicável.
* **Responsabilidade:** exportar `AnalyticsEventDto`.

* **Localização:** `packages/core/src/analytics/domain/structures/index.ts` - **novo arquivo**
* **Métodos:** Não aplicável.
* **Responsabilidade:** exportar `AnalyticsEvent`.

## Camada Core (Events)

* **Localização:** `packages/core/src/profile/domain/events/StarUnlockedEvent.ts` - **novo arquivo**
* **Métodos:** `constructor(payload: { userId: string; starId: string })` - representa uma estrela desbloqueada por usuário.

* **Localização:** `packages/core/src/profile/domain/events/UserRewardedEvent.ts` - **novo arquivo**
* **Métodos:** `constructor(payload: { userId: string; newXp: number; newCoins: number; newLevel: number | null; newStreak: number | null; newWeekStatus: WeekStatusValue | null })` - representa recompensa aplicada ao usuário.

* **Localização:** `packages/core/src/profile/domain/events/ChallengeCompletedEvent.ts` - **novo arquivo**
* **Métodos:** `constructor(payload: { userId: string; challengeId: string })` - representa conclusão de desafio por usuário.

* **Localização:** `packages/core/src/challenging/domain/events/ChallengeDeletedEvent.ts` - **novo arquivo**
* **Métodos:** `constructor(payload: { challengeId: string; challengeSlug: string; challengeTitle: string; challengeAuthor: AuthorAggregateDto })` - representa exclusão de desafio após remoção confirmada.

* **Localização:** `packages/core/src/profile/domain/events/ShopItemPurchasedEvent.ts` - **novo arquivo**
* **Métodos:** `constructor(payload: { userId: string; itemId: string; itemType: 'rocket' | 'avatar' | 'insignia'; itemName?: string; itemPrice: number })` - representa compra de item da loja pelo usuário sem acoplar `profile` a eventos do módulo `shop`.

## Camada Core (Use Cases)

* **Localização:** `packages/core/src/profile/use-cases/GetDailyActiveUsersReportUseCase.ts`
* **Dependências:** `AnalyticsReportingProvider`.
* **Dados de request:** `days: number`.
* **Dados de response:** `DailyActiveUsersDto`.
* **Métodos:** `execute({ days }: { days: number }): Promise<DailyActiveUsersDto>` - delega a consulta DAU ao provider de analytics mantendo o contrato do Studio.

## Camada Provision (Providers)

* **Localização:** `apps/server/src/provision/analytics/posthog/PostHogAnalyticsProvider.ts` - **novo arquivo**
* **Dependências:** `ENV.posthogProjectToken`, `ENV.posthogHost`.
* **Biblioteca:** `posthog-node`.
* **Métodos:** `trackEvent(event: AnalyticsEvent): Promise<void>` - envia `event.name.value`, `event.distinctId.value`, `event.properties` e `$insert_id: event.insertId.value` ao PostHog.
* **Observação:** deve usar envio imediato ou flush compatível com execução curta de job para não concluir a function antes do envio.

* **Localização:** `apps/server/src/provision/analytics/posthog/PostHogAnalyticsReportingProvider.ts` - **novo arquivo**
* **Dependências:** `RestClient`, `ENV.posthogProjectId`, `ENV.posthogPersonalApiKey`.
* **Biblioteca:** PostHog Query API via `AxiosRestClient` existente.
* **Métodos:** `getDailyActiveUsers(days: Integer): Promise<DailyActiveUsersDto>` - executa HogQL no endpoint `/api/projects/:project_id/query/`, normaliza linhas por data e plataforma, e preenche dias sem dados com `0`.

* **Localização:** `apps/server/src/provision/analytics/index.ts` - **novo arquivo**
* **Dependências:** Não aplicável.
* **Biblioteca:** Não aplicável.
* **Métodos:** Não aplicável - exporta providers de analytics.

## Camada Queue (Jobs)

* **Localização:** `apps/server/src/queue/jobs/analytics/TrackAnalyticsEventJob.ts` - **novo arquivo**
* **Dependências:** `ServerAnalyticsProvider`, `AnalyticsEventDto`.
* **Métodos:** `constructor(analyticsProvider: ServerAnalyticsProvider, analyticsEventDto: AnalyticsEventDto)` - recebe o provider concreto por contrato e o DTO montado pela function Inngest.
* **Métodos:** `handle(amqp: Amqp): Promise<void>` - cria `AnalyticsEvent.create(analyticsEventDto)` e executa `analyticsProvider.trackEvent(analyticsEvent)` dentro de `amqp.run(...)`.
* **Métodos:** `static readonly KEY = 'analytics/track.event.job'` - chave base usada pelas functions de analytics.

* **Localização:** `apps/server/src/queue/jobs/analytics/index.ts` - **novo arquivo**
* **Dependências:** Não aplicável.
* **Métodos:** Não aplicável - exporta `TrackAnalyticsEventJob`.

## Camada Inngest App (Functions)

* **Localização:** `apps/server/src/queue/inngest/functions/AnalyticsFunctions.ts` - **novo arquivo**
* **Métodos:** `getFunctions(): ReturnType<typeof inngest.createFunction>[]` - retorna functions de tracking para todos os eventos do PRD.
* **Métodos:** `private toAnalyticsEventDto(eventName: string, distinctId: string, insertId: string, properties: Record<string, unknown>): AnalyticsEventDto` - cria DTO primitivo e sanitizado para o job.
* **Métodos:** `private createTrackAccountSignedUpFunction()` - rastreia `AccountSignedUpEvent` com `distinctId = accountId`.
* **Métodos:** `private createTrackAccountSignedInFunction()` - rastreia `AccountSignedInEvent` com `distinctId = accountId` e `platform`.
* **Métodos:** `private createTrackUserCreatedFunction()` - rastreia `UserCreatedEvent` com `distinctId = userId`.
* **Métodos:** `private createTrackStarUnlockedFunction()` - rastreia `StarUnlockedEvent` com `distinctId = userId`.
* **Métodos:** `private createTrackFirstStarUnlockedFunction()` - rastreia `FirstStarUnlockedEvent` com `distinctId = user.id`.
* **Métodos:** `private createTrackPlanetCompletedFunction()` - rastreia `PlanetCompletedEvent`; quando não houver `userId`, usar `userSlug` como `distinctId` somente para manter compatibilidade do evento existente.
* **Métodos:** `private createTrackSpaceCompletedFunction()` - rastreia `SpaceCompletedEvent`; quando não houver `userId`, usar `userSlug` como `distinctId` somente para manter compatibilidade do evento existente.
* **Métodos:** `private createTrackUserRewardedFunction()` - rastreia `UserRewardedEvent` com `distinctId = userId`.
* **Métodos:** `private createTrackChallengePostedFunction()` - rastreia `ChallengePostedEvent` com `distinctId = challengeAuthor.id`.
* **Métodos:** `private createTrackChallengeCompletedFunction()` - rastreia `ChallengeCompletedEvent` com `distinctId = userId`.
* **Métodos:** `private createTrackChallengeDeletedFunction()` - rastreia `ChallengeDeletedEvent` com `distinctId = challengeAuthor.id`.
* **Métodos:** `private createTrackShopItemPurchasedFunction()` - rastreia `ShopItemPurchasedEvent` com `distinctId = userId`.
* **Métodos:** `private createTrackFeedbackReportSentFunction()` - rastreia `FeedbackReportSentEvent` com `distinctId = author.id`, sem enviar `feedbackReportContent` nem `screenshot`.

## Camada Banco de Dados (Migrations)

* **Localização:** `apps/server/supabase/migrations/<timestamp>_drop_users_visits.sql` - **novo arquivo**
* **Objetivo:** remover a persistência legada de visitas diárias após DAU migrar para PostHog.
* **Escopo SQL:** `drop table if exists public.users_visits;` e `drop type if exists public.platform;` somente se o enum `platform` não tiver outras dependências no banco no momento da migration.
* **Segurança:** os grants legados da tabela deixam de existir com o `drop table`; não haverá RLS porque não haverá nova tabela.
* **Dependências de código:** atualizar `apps/server/src/database/supabase/types/Database.ts`, remover métodos de visita de `SupabaseUsersRepository`, remover `Visit` do core e remover imports de `Platform` ligados apenas a visitas.

## Camada UI (Providers)

* **Localização:** `apps/web/src/provision/analytics/useAnalyticsProvider.ts` - **novo arquivo**
* **Props:** nenhuma.
* **Estados (Client Component):** não mantém estado próprio; se PostHog não estiver inicializado, métodos devem ser no-op seguro.
* **View:** Não aplicável.
* **Hook (se aplicável):** `useAnalyticsProvider()` no próprio arquivo.
* **Index:** Não aplicável.
* **Widgets internos:** Não aplicável.
* **Estrutura de pastas:** `apps/web/src/provision/analytics/useAnalyticsProvider.ts`.
* **Métodos:** `useAnalyticsProvider(): ClientAnalyticsProvider` - adapta `posthog-js` para o contrato `ClientAnalyticsProvider` usando o client inicializado no provider global.

---

# 6. O que deve ser modificado?

## Core

* **Arquivo:** `packages/core/package.json`
* **Mudança:** adicionar exports `./analytics/interfaces`, `./analytics/entities/dtos` e `./analytics/structures`.
* **Justificativa:** permitir que `server` e `web` consumam os novos contratos sem imports internos.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/domain/events/index.ts`
* **Mudança:** exportar `StarUnlockedEvent`, `UserRewardedEvent`, `ChallengeCompletedEvent` e `ShopItemPurchasedEvent`.
* **Justificativa:** manter padrão de barrel por domínio.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/domain/events/index.ts`
* **Mudança:** exportar `ChallengeDeletedEvent`.
* **Justificativa:** manter padrão de barrel por domínio.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/use-cases/UnlockStarUseCase.ts`
* **Mudança:** injetar `Broker` no construtor e publicar `StarUnlockedEvent` apenas quando uma nova estrela for efetivamente desbloqueada.
* **Justificativa:** cumprir rastreamento server-certified sem duplicar evento quando a estrela já estiver desbloqueada.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/use-cases/RewardUserUseCase.ts`
* **Mudança:** injetar `Broker` no construtor e publicar `UserRewardedEvent` após `repository.replace(user)`.
* **Justificativa:** rastrear recompensa apenas depois da persistência confirmada.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/use-cases/CompleteChallengeUseCase.ts`
* **Mudança:** injetar `Broker` no construtor e publicar `ChallengeCompletedEvent` apenas quando o desafio ainda não estava concluído pelo usuário.
* **Justificativa:** evitar duplicatas de conclusão por reexecução idempotente do use case.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/challenging/use-cases/DeleteChallengeUseCase.ts`
* **Mudança:** injetar `Broker` no construtor e publicar `ChallengeDeletedEvent` após `repository.remove(challenge)` usando dados capturados antes da remoção.
* **Justificativa:** rastrear exclusão confirmada sem consultar item removido depois.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/use-cases/AcquireRocketUseCase.ts`
* **Mudança:** injetar `Broker` no construtor e publicar `ShopItemPurchasedEvent` quando `canAcquireRocket.isTrue`.
* **Justificativa:** rastrear compra real, não tentativa de compra de item já adquirido.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/use-cases/AcquireAvatarUseCase.ts`
* **Mudança:** injetar `Broker` no construtor e publicar `ShopItemPurchasedEvent` quando `canAcquireAvatar.isTrue`.
* **Justificativa:** rastrear compra real, não tentativa de compra de item já adquirido.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/use-cases/AcquireInsigniaUseCase.ts`
* **Mudança:** injetar `Broker` no construtor e publicar `ShopItemPurchasedEvent` após `repository.addAcquiredInsignia(...)`.
* **Justificativa:** rastrear compra confirmada de insígnia.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/use-cases/GetDailyActiveUsersReportUseCase.ts`
* **Mudança:** trocar dependência de `UsersRepository` para `AnalyticsReportingProvider` e delegar a consulta para `getDailyActiveUsers(Integer.create(days))`.
* **Justificativa:** remover dependência do banco legado no relatório DAU preservando o use case consumido pelo controller.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/interfaces/UsersRepository.ts`
* **Mudança:** remover `countVisitsByDateAndPlatform(date: Date, platform: Platform): Promise<Integer>`, `addVisit(visit: Visit): Promise<void>` e `hasVisit(visit: Visit): Promise<Logical>`.
* **Justificativa:** visitas deixam de ser persistidas no banco.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/domain/entities/User.ts`
* **Mudança:** remover método `registerVisit(platform: Platform): Visit` e imports de `Visit` usados apenas por esse método.
* **Justificativa:** entidade `User` não deve mais montar estrutura de visita legada.
* **Camada:** `core`

## Server - Provision

* **Arquivo:** `apps/server/src/constants/env.ts`
* **Mudança:** adicionar `posthogProjectToken`, `posthogHost`, `posthogPersonalApiKey` e `posthogProjectId` ao objeto `env` e ao `envSchema`.
* **Justificativa:** configurar SDK server-side e Query API sem hardcode de segredo.
* **Camada:** `provision`

* **Arquivo:** `apps/server/.env.example`
* **Mudança:** documentar `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_PERSONAL_API_KEY` e `POSTHOG_PROJECT_ID`.
* **Justificativa:** permitir configuração local e deploy consistente.
* **Camada:** `provision`

* **Arquivo:** `apps/server/package.json`
* **Mudança:** adicionar dependência direta `posthog-node`.
* **Justificativa:** não depender da cópia transitiva observada no `package-lock.json`.
* **Camada:** `provision`

## Server - Queue

* **Arquivo:** `apps/server/src/queue/inngest/functions/index.ts`
* **Mudança:** exportar `AnalyticsFunctions`.
* **Justificativa:** manter padrão de exports das composition roots Inngest.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/app/hono/HonoApp.ts`
* **Mudança:** instanciar `AnalyticsFunctions` em `registerInngestRoute()` e adicionar `...analyticsFunctions.getFunctions()` à lista de functions servidas.
* **Justificativa:** registrar consumidores PostHog no endpoint `/inngest`.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/queue/inngest/functions/ProfileFunctions.ts`
* **Mudança:** remover `createRegisterUserVisitFunction(...)` da classe e da lista de `getFunctions(...)`.
* **Justificativa:** `AccountSignedInEvent` passa a ser consumido por `AnalyticsFunctions`, não pelo registro legado de visitas.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/queue/jobs/profile/index.ts`
* **Mudança:** remover export de `RegisterUserVisitJob`.
* **Justificativa:** job legado será removido.
* **Camada:** `queue`

## Server - REST

* **Arquivo:** `apps/server/src/rest/controllers/profile/users/FetchDailyActiveUsersReportController.ts`
* **Mudança:** trocar construtor para receber `AnalyticsReportingProvider` e instanciar `GetDailyActiveUsersReportUseCase` com esse provider.
* **Justificativa:** relatório DAU deixa de consultar `UsersRepository`.
* **Camada:** `rest`

* **Arquivo:** `apps/server/src/app/hono/routers/profile/UsersRouter.ts`
* **Mudança:** em `registerFetchDailyActiveUsersRoute`, substituir `SupabaseUsersRepository` por `PostHogAnalyticsReportingProvider` criado com `AxiosRestClient(ENV.posthogHost)`.
* **Justificativa:** manter a rota e autenticação atuais, alterando apenas a fonte do dado.
* **Camada:** `rest`

* **Arquivo:** `apps/server/src/rest/controllers/auth/ConfirmEmailController.ts`
* **Mudança:** manter publicação de `AccountSignedInEvent`; garantir que event payload continue validável por `AnalyticsFunctions`.
* **Justificativa:** confirmação de e-mail segue sendo um fluxo de sign-in rastreável.
* **Camada:** `rest`

## Server - Database

* **Arquivo:** `apps/server/src/database/supabase/repositories/profile/SupabaseUsersRepository.ts`
* **Mudança:** remover métodos `countVisitsByDateAndPlatform`, `addVisit` e `hasVisit`, além dos imports `Platform` e `Visit` se ficarem sem uso.
* **Justificativa:** a camada database não deve manter adapter para tabela removida.
* **Camada:** `database`

* **Arquivo:** `apps/server/src/database/supabase/types/Database.ts`
* **Mudança:** regenerar tipos para remover `users_visits` e possivelmente enum `platform` caso removido pela migration.
* **Justificativa:** manter tipos gerados alinhados ao schema.
* **Camada:** `database`

## Web - Provision/UI

* **Arquivo:** `apps/web/package.json`
* **Mudança:** adicionar dependências diretas `posthog-js` e `@posthog/react` se os hooks de feature flag do React forem usados.
* **Justificativa:** instalar SDK client-side recomendado pelo PostHog para Next/React.
* **Camada:** `provision`

* **Arquivo:** `apps/web/src/constants/client-env.ts`
* **Mudança:** adicionar `posthogProjectToken: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` e `posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST` ao schema.
* **Justificativa:** inicializar SDK no browser com variáveis públicas.
* **Camada:** `provision`

* **Arquivo:** `apps/web/.env.example`
* **Mudança:** documentar `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` e `NEXT_PUBLIC_POSTHOG_HOST`.
* **Justificativa:** permitir configuração local e deploy consistente.
* **Camada:** `provision`

* **Arquivo:** `apps/web/src/ui/global/widgets/layouts/Root/RootLayoutView.tsx`
* **Mudança:** alterar composição para passar `ClientProviders` como child renderizado dentro de `ServerProviders` com account bootstrap, ou mover `ClientProviders` para dentro de `ServerProviders` para que receba `accountDto`.
* **Justificativa:** o bootstrap do PostHog precisa do `accountDto` resolvido server-side.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/layouts/Root/ServerProviders/index.tsx`
* **Mudança:** repassar `accountDto` para `ClientProviders` sem expor tokens.
* **Justificativa:** habilitar identificação desde o primeiro render autenticado sem depender de fetch client-side posterior.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/layouts/Root/ClientProviders/index.tsx`
* **Mudança:** receber `accountDto?: AccountDto | null`, inicializar `posthog-js` com `CLIENT_ENV.posthogProjectToken`, `api_host`, captura automática, session recording com inputs mascarados e bootstrap quando houver conta autenticada.
* **Justificativa:** configurar instrumentação automática no browser.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/auth/contexts/AuthContext/index.tsx`
* **Mudança:** resolver `analyticsProvider = useAnalyticsProvider()` e passá-lo para `useAuthContextProvider`.
* **Justificativa:** manter integração com analytics na borda UI, não dentro da action RPC.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/auth/contexts/AuthContext/hooks/useAuthContextProvider.ts`
* **Mudança:** adicionar `analyticsProvider: ClientAnalyticsProvider` aos params; chamar `identifyUser(account.id, account.email)` quando `account` autenticada existir; chamar `identifyUser` após `handleSignIn` e `handleSignUpWithSocialAccount`; chamar `reset()` antes ou após `signOut` bem-sucedido.
* **Justificativa:** cumprir identificação e reset sem acoplar RPC ao SDK de browser.
* **Camada:** `ui`

## Web - RPC

* **Arquivo:** `apps/web/src/rpc/actions/auth/SignInAction.ts`
* **Mudança:** remover dependência de `Broker`, import de `AccountSignedInEvent`, checagem de `SERVER_ENV.mode` e `broker.publish(event)`.
* **Justificativa:** login client-side será identificado via PostHog browser; visitas legadas deixam de existir.
* **Camada:** `rpc`

* **Arquivo:** `apps/web/src/rpc/actions/auth/SignUpWithSocialAccountAction.ts`
* **Mudança:** remover dependência de `Broker`, import de `AccountSignedInEvent`, checagem de `SERVER_ENV.mode` e `broker.publish(event)`.
* **Justificativa:** cadastro social será identificado via PostHog browser; visitas legadas deixam de existir.
* **Camada:** `rpc`

* **Arquivo:** `apps/web/src/rpc/next-safe-action/authActions.ts`
* **Mudança:** deixar de instanciar `InngestBroker` para `signIn` e `signUpWithSocialAccount`, ajustando chamadas para `SignInAction(service)` e `SignUpWithSocialAccountAction(service)`.
* **Justificativa:** remover acoplamento da `web` com fila apenas para visitas legadas.
* **Camada:** `rpc`

## Studio - UI

* **Arquivo:** `apps/studio/src/ui/global/widgets/pages/Dashboard/DailyActiveUsersChart/DailyActiveUsersChartView.tsx`
* **Mudança:** alterar copy de `Total de visitas no período selecionado para cada plataforma` para `Usuários únicos ativos no período selecionado para cada plataforma`.
* **Justificativa:** PostHog DAU mede usuários únicos ativos, não visitas gravadas no banco.
* **Camada:** `ui`

---

# 7. O que deve ser removido?

## Core

* **Arquivo:** `packages/core/src/profile/use-cases/RegisterUserVisitUseCase.ts`
* **Motivo da remoção:** o PRD substitui o registro manual de visitas por PostHog.
* **Impacto esperado:** remover exports correspondentes e consumidores no `server`.

* **Arquivo:** `packages/core/src/profile/domain/structures/Visit.ts`
* **Motivo da remoção:** a estrutura existe apenas para persistir `users_visits`.
* **Impacto esperado:** remover export em `packages/core/src/profile/domain/structures/index.ts` e método `User.registerVisit(...)`.

* **Arquivo:** `packages/core/src/profile/domain/entities/dtos/VisitDto.ts`
* **Motivo da remoção:** DTO ligado apenas à estrutura legada `Visit`.
* **Impacto esperado:** remover export em `packages/core/src/profile/domain/entities/dtos/index.ts`.

## Server - Queue

* **Arquivo:** `apps/server/src/queue/jobs/profile/RegisterUserVisitJob.ts`
* **Motivo da remoção:** job legado de persistência de visita deixa de existir.
* **Impacto esperado:** remover função Inngest correspondente em `ProfileFunctions`.

## Web - Queue

* **Arquivo:** `apps/web/src/queue/inngest/InngestBroker.ts`
* **Motivo da remoção:** após retirar publicação de `AccountSignedInEvent` das actions de auth, a `web` não terá consumidor conhecido desse broker.
* **Impacto esperado:** remover apenas se não houver outras referências após a migração.

* **Arquivo:** `apps/web/src/queue/inngest/inngest.ts`
* **Motivo da remoção:** schema Inngest da `web` existe para publicação legada de sign-in.
* **Impacto esperado:** remover apenas se não houver outras referências após a migração.

## Server - Database

* **Arquivo:** `apps/server/supabase/migrations/<timestamp>_drop_users_visits.sql` - **novo arquivo**
* **Motivo da remoção:** remover tabela `public.users_visits` e seus grants por schema migration.
* **Impacto esperado:** dados históricos de visitas deixam de existir no banco; DAU passa a depender do histórico disponível no PostHog.

---

# 8. Decisões Técnicas e Trade-offs (Obrigatório)

* **Decisão:** manter a rota `GET /profile/users/daily-active-users-report?days=N` no `server` e o método `ProfileService.fetchDailyActiveUsersReport(...)` no `studio`.
* **Alternativas consideradas:** criar nova rota `/analytics/daily-active-users-report` e novo service `AnalyticsService` no `studio`.
* **Motivo da escolha:** a migração requerida é da fonte de dados, não do contrato cross-app; preservar rota reduz alterações no Studio e mantém compatibilidade com o widget existente.
* **Impactos / trade-offs:** o nome da rota continua sob `profile`, embora a fonte seja PostHog; uma reorganização semântica pode ser feita depois sem acoplar esta entrega.

* **Decisão:** criar contratos de analytics no `core`, mas manter SDKs e Query API nas bordas (`server` e `web`).
* **Alternativas consideradas:** usar PostHog diretamente em use cases ou actions.
* **Motivo da escolha:** regras do projeto exigem providers para SDKs externos e impedem vazamento de infraestrutura no core.
* **Impactos / trade-offs:** adiciona interfaces novas, mas preserva testabilidade e direção de dependência.

* **Decisão:** usar `$insert_id` com `context.event.id` do Inngest para eventos server-side.
* **Alternativas consideradas:** adicionar id de evento ao `Event` do core ou gerar hash de payload.
* **Motivo da escolha:** `context.event.id` identifica a ocorrência enviada ao Inngest e permanece estável em retries da mesma ocorrência, sem alterar o contrato global `Event`.
* **Impactos / trade-offs:** deduplicação depende do evento ter passado pelo Inngest; eventos client-side automáticos ficam sob a semântica do SDK PostHog.

* **Decisão:** não publicar eventos de analytics diretamente em `SignInAction` e `SignUpWithSocialAccountAction` da `web`.
* **Alternativas consideradas:** trocar `Broker` por `ClientAnalyticsProvider` nas actions.
* **Motivo da escolha:** actions RPC rodam em server-side Next e não devem depender do SDK de browser; identificação do usuário é responsabilidade da UI client-side após sucesso de autenticação.
* **Impactos / trade-offs:** login/cadastro social passam a depender da inicialização client-side para identificação, mitigado pelo bootstrap via `ServerProviders`.

* **Decisão:** criar `ShopItemPurchasedEvent` em `profile/domain/events`, embora o nome do evento represente loja.
* **Alternativas consideradas:** criar o evento em `shop/domain/events` e importar no use case de `profile`.
* **Motivo da escolha:** os use cases de compra (`AcquireRocketUseCase`, `AcquireAvatarUseCase`, `AcquireInsigniaUseCase`) vivem em `profile`; criar o evento no mesmo domínio evita acoplamento cross-domain no core.
* **Impactos / trade-offs:** o nome do evento é orientado ao produto, mas sua localização segue o dono real do fluxo atual.

* **Decisão:** remover `users_visits` por migration após alterar DAU para PostHog.
* **Alternativas consideradas:** manter tabela sem uso por compatibilidade temporária.
* **Motivo da escolha:** o PRD exige remoção do tracking legado; manter tabela e adapters aumentaria ambiguidade operacional.
* **Impactos / trade-offs:** histórico legado de visitas não será consultável pelo app; se for necessário preservar histórico, deve haver exportação fora desta spec antes da migration.

---

# 9. Diagramas e Referências (Obrigatório)

* **Fluxo de Dados:**

```text
[Core Use Case]
  confirma regra de negócio e persistência
        |
        v
[Domain Event]
  Broker.publish(event)
        |
        v
[Inngest]
  AnalyticsFunctions escuta evento
        |
        v
[AnalyticsFunctions]
  payload do domínio + context.event.id
  -> AnalyticsEventDto { name, distinctId, insertId, properties sanitizadas }
        |
        v
[TrackAnalyticsEventJob]
  amqp.run(() => ServerAnalyticsProvider.trackEvent(dto))
        |
        v
[PostHogAnalyticsProvider]
  posthog-node -> PostHog Events API
```

* **Fluxo Cross-app:**

```text
server expõe REST:
GET /profile/users/daily-active-users-report?days=N
        |
        v
FetchDailyActiveUsersReportController
        |
        v
GetDailyActiveUsersReportUseCase
        |
        v
PostHogAnalyticsReportingProvider
        |
        v
PostHog Query API (HogQL)
        |
        v
DailyActiveUsersDto [{ date, web, mobile }]
        |
        v
studio consome via ProfileService.fetchDailyActiveUsersReport(days)
        |
        v
DailyActiveUsersChartView
```

* **Fluxo Browser Web:**

```text
ServerProviders
  AuthService.fetchAccount() -> accountDto
        |
        v
ClientProviders(accountDto)
  inicializa PostHog com bootstrap do usuário autenticado
        |
        v
AuthContextProvider
  useAnalyticsProvider()
        |
        v
useAuthContextProvider
  handleSignIn sucesso -> identifyUser(id, email)
  handleSignUpWithSocialAccount sucesso -> identifyUser(id, email)
  handleSignOut sucesso -> reset()
```

* **Layout:**

```text
RootLayoutView
└── ServerProviders
    ├── NuqsAdapter
    ├── ToastContextProvider
    ├── AudioContextProvider
    ├── AuthContextProvider
    └── ClientProviders(accountDto)
        ├── PostHogProvider / posthog-js initialized client
        ├── TooltipProvider
        ├── RestContextProvider
        ├── RealtimeContextProvider
        └── EditorProvider
```

* **Referências:**

* `packages/core/src/global/interfaces/provision/TelemetryProvider.ts` - contrato de provider desacoplado.
* `apps/server/src/provision/telemetry/sentry/SentryTelemetryProvider.ts` - provider server-side encapsulando SDK externo.
* `apps/server/src/queue/jobs/profile/RegisterUserVisitJob.ts` - padrão de job que executa use case dentro de `amqp.run`.
* `apps/server/src/queue/inngest/functions/NotificationFunctions.ts` - padrão de function Inngest que instancia dependências concretas.
* `apps/server/src/app/hono/HonoApp.ts` - registro das functions Inngest em `/inngest`.
* `apps/server/src/app/hono/routers/profile/UsersRouter.ts` - rota DAU atual a preservar.
* `apps/server/src/rest/controllers/profile/users/FetchDailyActiveUsersReportController.ts` - controller DAU a adaptar.
* `apps/web/src/ui/global/widgets/layouts/Root/ServerProviders/index.tsx` - resolução server-side de `accountDto`.
* `apps/web/src/ui/global/widgets/layouts/Root/ClientProviders/index.tsx` - ponto de composição client-side de providers.
* `apps/web/src/ui/auth/contexts/AuthContext/hooks/useAuthContextProvider.ts` - ponto central de login/logout na UI.
* `apps/studio/src/ui/global/widgets/pages/Dashboard/DailyActiveUsersChart/useDailyActiveUsersChart.ts` - consumo atual do relatório DAU.
* `apps/studio/src/rest/services/ProfileService.ts` - service REST que deve manter a chamada atual.
* PostHog Next.js docs: `https://posthog.com/docs/libraries/next-js`.
* PostHog Node.js docs: `https://posthog.com/docs/libraries/node`.
* PostHog Query API docs: `https://posthog.com/docs/api/query`.

---

# 10. Pendências / Dúvidas (Quando aplicável)

* **Descrição da pendência:** confirmar se o histórico legado de `users_visits` precisa ser exportado antes da migration de drop.
* **Impacto na implementação:** se houver obrigação de retenção, a migration deve ser adiada ou acompanhada de exportação operacional fora do app.
* **Ação sugerida:** validar com produto/operacional antes de aplicar a migration em produção.

* **Descrição da pendência:** confirmar o critério exato de DAU no HogQL: usuário único por `distinct_id` com evento `$pageview` ou qualquer evento identificado.
* **Impacto na implementação:** a escolha altera números exibidos no Studio.
* **Ação sugerida:** validar com produto; se não houver preferência, usar usuário único por `$pageview` e propriedade de plataforma.

* **Descrição da pendência:** eventos existentes `PlanetCompletedEvent` e `SpaceCompletedEvent` não carregam `userId`, apenas `userSlug` e `userName`.
* **Impacto na implementação:** eventos server-side podem não se unir ao perfil identificado por `id` no PostHog.
* **Ação sugerida:** validar se esses eventos devem ter payload ampliado com `userId`; se aprovado, modificar os emissores desses eventos no core.

* **Descrição da pendência:** Context7 não pôde ser usado por API key inválida durante a elaboração desta spec.
* **Impacto na implementação:** referências de SDK foram validadas por documentação pública do PostHog, não por Context7.
* **Ação sugerida:** revalidar detalhes finos de opções do SDK no momento da implementação se o MCP Context7 estiver configurado.
