---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
---

## Pendencias (quando aplicavel)

- [ ] Confirmar se o historico legado de `users_visits` precisa ser exportado antes da migration; impacto: bloqueia a remocao do schema legado em producao; acao necessaria: validar com produto/operacao antes de executar a migration.
- [ ] Confirmar o criterio exato de DAU no HogQL (`$pageview` identificado vs qualquer evento identificado) e a propriedade de plataforma a ser segmentada; impacto: altera a implementacao do provider de relatorio e os numeros exibidos no `studio`; acao necessaria: alinhar com produto antes de fechar a query.
- [ ] Confirmar se `PlanetCompletedEvent` e `SpaceCompletedEvent` devem ganhar `userId` ou se o fallback atual por `userSlug` sera aceito; impacto: afeta a consistencia de identidade dos eventos server-side no PostHog; acao necessaria: decidir antes de consolidar o mapeamento desses eventos em `AnalyticsFunctions`.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Definir contratos, eventos e use cases de analytics no core e remover o modelo legado de visitas | - | - |
| F2 | Implementar providers, fila, REST e cleanup de banco no `server` | F1 | F3, F4 |
| F3 | Implementar bootstrap, identificacao e cleanup de analytics na `web` | F1 | F2, F4 |
| F4 | Ajustar a semantica do dashboard DAU no `studio` sem mudar o contrato atual | F1 | F2, F3 |

> **Estrategia de paralelismo:** sempre comece pelo core (dominio, structures e use cases). Assim que o core estiver concluido, as fases de `server`, `web` e `studio` podem ser executadas em paralelo, pois todas dependem apenas do contrato definido no core.

---

## F1 — Core: Dominio, Structures e Use Cases

**Objetivo:** Definir o contrato do dominio — entidades, structures, interfaces de repositorio/provider e use cases — sem nenhuma dependencia de infraestrutura. Essa fase desbloqueia F2, F3 e F4 para rodarem em paralelo.

### Tarefas

- [x] **T1.1** — Criar o DTO e a structure de evento de analytics
  - **Depende de:** -
  - **Resultado observavel:** `AnalyticsEventDto` e `AnalyticsEvent` existem no `core`, `AnalyticsEvent.create(...)` valida `name`, `distinctId`, `insertId` e `properties`, e `analyticsEvent.dto` devolve o shape primitivo esperado pelos adapters.
  - **Camada:** `core`

- [x] **T1.2** — Expor os contratos de analytics no pacote `@stardust/core`
  - **Depende de:** T1.1
  - **Resultado observavel:** `ServerAnalyticsProvider`, `ClientAnalyticsProvider` e `AnalyticsReportingProvider` existem com barrel files proprios e podem ser importados via exports publicos de `packages/core/package.json`.
  - **Camada:** `core`

- [x] **T1.3** — Criar e exportar os eventos de dominio faltantes para analytics
  - **Depende de:** T1.2
  - **Resultado observavel:** `StarUnlockedEvent`, `UserRewardedEvent`, `ChallengeCompletedEvent`, `ChallengeDeletedEvent` e `ShopItemPurchasedEvent` existem com payloads definidos e estao expostos nos barrels de `profile` e `challenging`.
  - **Camada:** `core`

- [x] **T1.4** — Publicar os novos eventos nos use cases que confirmam fatos de negocio
  - **Depende de:** T1.3
  - **Resultado observavel:** `UnlockStarUseCase`, `RewardUserUseCase`, `CompleteChallengeUseCase`, `DeleteChallengeUseCase`, `AcquireRocketUseCase`, `AcquireAvatarUseCase` e `AcquireInsigniaUseCase` publicam o evento correto apenas apos a confirmacao do fato e nao emitem duplicatas nas ramificacoes idempotentes.
  - **Camada:** `core`

- [x] **T1.5** — Migrar o use case de DAU para `AnalyticsReportingProvider`
  - **Depende de:** T1.2
  - **Resultado observavel:** `GetDailyActiveUsersReportUseCase.execute({ days })` deixa de consultar `UsersRepository`, delega para `getDailyActiveUsers(...)` e continua retornando `DailyActiveUsersDto` no shape `{ date, web, mobile }[]`.
  - **Camada:** `core`

- [x] **T1.6** — Remover o modelo legado de visitas do modulo `profile`
  - **Depende de:** T1.5
  - **Resultado observavel:** `UsersRepository` nao expoe mais `countVisitsByDateAndPlatform`, `addVisit` ou `hasVisit`; `User.registerVisit`, `Visit`, `VisitDto`, `RegisterUserVisitUseCase` e seus exports associados deixam de existir; e o modulo `profile` nao depende mais do tracking manual de visitas.
  - **Camada:** `core`

---

## F2 — Server: Infra, Repositorios e Handlers

> ⚡ Pode rodar em paralelo com F3 e F4 apos F1 estar concluida.

**Objetivo:** Implementar a camada de infraestrutura e exposicao — repositorios, providers, jobs e handlers RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [x] **T2.1** — Configurar dependencias e variaveis de ambiente do PostHog no `server`
  - **Depende de:** T1.2
  - **Resultado observavel:** `apps/server/package.json`, `apps/server/src/constants/env.ts` e `apps/server/.env.example` passam a declarar e validar `posthog-node`, `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_PERSONAL_API_KEY` e `POSTHOG_PROJECT_ID`.
  - **Camada:** `provision`

- [x] **T2.2** — Implementar o provider server-side de captura no PostHog
  - **Depende de:** T2.1
  - **Resultado observavel:** `PostHogAnalyticsProvider.trackEvent(...)` envia `name`, `distinctId`, `properties` e `$insert_id` para o PostHog e garante flush compativel com a execucao curta de jobs.
  - **Camada:** `provision`

- [x] **T2.3** — Implementar o provider de relatorio DAU via PostHog Query API
  - **Depende de:** T1.5, T2.1
  - **Resultado observavel:** `PostHogAnalyticsReportingProvider.getDailyActiveUsers(days)` consulta a Query API com HogQL, normaliza o retorno por data/plataforma e preenche datas sem dados com `0`, preservando `DailyActiveUsersDto`.
  - **Camada:** `provision`

- [x] **T2.4** — Implementar o job `TrackAnalyticsEventJob`
  - **Depende de:** T1.2, T2.2
  - **Resultado observavel:** o job cria `AnalyticsEvent` a partir de `AnalyticsEventDto` e executa `analyticsProvider.trackEvent(...)` dentro de `amqp.run(...)`.
  - **Camada:** `queue`

- [x] **T2.5** — Criar `AnalyticsFunctions` para traduzir eventos de dominio em eventos PostHog
  - **Depende de:** T1.3, T2.4
  - **Resultado observavel:** existe uma function Inngest para cada evento previsto na spec, todas geram `AnalyticsEventDto` sanitizado, usam `context.event.id` como `insertId` e omitem payloads sensiveis como conteudo de feedback e screenshot.
  - **Camada:** `queue`

- [x] **T2.6** — Registrar `AnalyticsFunctions` no runtime Inngest do `server`
  - **Depende de:** T2.5
  - **Resultado observavel:** `apps/server/src/queue/inngest/functions/index.ts` exporta `AnalyticsFunctions` e `HonoApp` passa a servi-las em `/inngest` junto das functions existentes.
  - **Camada:** `queue`

- [x] **T2.7** — Migrar o endpoint DAU para a nova fonte de analytics
  - **Depende de:** T2.3
  - **Resultado observavel:** `FetchDailyActiveUsersReportController` e `UsersRouter` deixam de instanciar `SupabaseUsersRepository` para DAU, usam `PostHogAnalyticsReportingProvider`, e `GET /profile/users/daily-active-users-report?days=N` continua retornando `200` com `{ date, web, mobile }[]`.
  - **Camada:** `rest`

- [x] **T2.8** — Remover o fluxo legado `RegisterUserVisit` da fila do `server`
  - **Depende de:** T1.6, T2.6
  - **Resultado observavel:** `ProfileFunctions` nao registra mais `AccountSignedInEvent` para visita legada, `RegisterUserVisitJob` deixa de ser exportado/consumido e nao existe mais pipeline server-side para gravar `users_visits`.
  - **Camada:** `queue`

- [x] **T2.9** — Remover suporte a visitas do adapter Supabase de usuarios
  - **Depende de:** T1.6
  - **Resultado observavel:** `SupabaseUsersRepository` nao implementa mais `countVisitsByDateAndPlatform`, `addVisit` ou `hasVisit`, e os imports de `Platform`/`Visit` deixam de existir quando exclusivos desse fluxo.
  - **Camada:** `database`

- [x] **T2.10** — Remover `users_visits` do schema e alinhar tipos gerados do banco
  - **Depende de:** T2.7, T2.8, T2.9
  - **Resultado observavel:** a migration canonica remove `public.users_visits`, remove `public.platform` somente se nao houver outras dependencias, e `apps/server/src/database/supabase/types/Database.ts` deixa de expor a tabela e o enum removidos.
  - **Camada:** `database`

---

## F3 — Web: UI e Integracao

> ⚡ Pode rodar em paralelo com F2 e F4 apos F1 estar concluida.

**Objetivo:** Implementar a interface e integracao client-side na aplicacao web — widgets, actions e chamadas RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [x] **T3.1** — Configurar SDK e variaveis publicas do PostHog na `web`
  - **Depende de:** T1.2
  - **Resultado observavel:** `apps/web/package.json`, `apps/web/src/constants/client-env.ts` e `apps/web/.env.example` passam a declarar e validar `posthog-js`, `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` e `NEXT_PUBLIC_POSTHOG_HOST`.
  - **Camada:** `provision`

- [x] **T3.2** — Reestruturar os providers raiz para bootstrap autenticado do PostHog
  - **Depende de:** T3.1
  - **Resultado observavel:** `RootLayoutView`, `ServerProviders` e `ClientProviders` passam `accountDto` resolvido server-side para a camada client-side, permitindo bootstrap autenticado sem expor secrets do `server`.
  - **Camada:** `ui`

- [x] **T3.3** — Implementar `useAnalyticsProvider` como adapter de `posthog-js`
  - **Depende de:** T1.2, T3.1
  - **Resultado observavel:** `useAnalyticsProvider()` retorna um `ClientAnalyticsProvider` com `trackEvent`, `identifyUser` e `reset`, e esses metodos sao no-op seguro quando o client ainda nao foi inicializado.
  - **Camada:** `provision`

- [x] **T3.4** — Integrar analytics ao contexto de autenticacao da `web`
  - **Depende de:** T3.2, T3.3
  - **Resultado observavel:** `AuthContextProvider` e `useAuthContextProvider` identificam o usuario no primeiro render autenticado, reaplicam `identifyUser` apos login/cadastro social bem-sucedido e executam `reset()` no logout sem bloquear a UI.
  - **Camada:** `ui`

- [x] **T3.5** — Remover a publicacao legada de `AccountSignedInEvent` das actions de auth
  - **Depende de:** T3.4
  - **Resultado observavel:** `SignInAction`, `SignUpWithSocialAccountAction` e `authActions` deixam de instanciar/publicar `Broker` para login e cadastro social, enquanto o fluxo de cookies e sessao permanece funcional.
  - **Camada:** `rpc`

- [x] **T3.6** — Limpar a infra Inngest da `web` apenas se ficar sem consumidores
  - **Depende de:** T3.5
  - **Resultado observavel:** `apps/web/src/queue/inngest/InngestBroker.ts` e `apps/web/src/queue/inngest/inngest.ts` sao removidos somente se nenhuma referencia restar apos a migracao; caso contrario, permanecem com o consumidor remanescente explicitamente identificado.
  - **Camada:** `web`

---

## F4 — Studio: UI e Integracao

> ⚡ Pode rodar em paralelo com F2 e F3 apos F1 estar concluida.

**Objetivo:** Implementar a interface e integracao client-side na aplicacao studio — widgets, actions e chamadas RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [x] **T4.1** — Atualizar a copy do grafico DAU para refletir usuarios unicos ativos
  - **Depende de:** T1.5
  - **Resultado observavel:** `DailyActiveUsersChartView` troca a descricao de "visitas" para "usuarios unicos ativos" e continua renderizando o mesmo `DailyActiveUsersDto` sem alterar o contrato visual ou de integracao do dashboard.
  - **Camada:** `ui`
