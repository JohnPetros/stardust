---
title: Testes de Integracao do Fluxo de Cadastro Web
prd: https://github.com/JohnPetros/stardust/milestone/34
issue: https://github.com/JohnPetros/stardust/issues/425
apps: web
status: closed
last_updated_at: 2026-06-15
---

# 1. Objetivo

Configurar Playwright na aplicacao `web` para executar testes de integracao com navegador cobrindo a rota `/auth/sign-up`, mantendo os testes Jest/React Testing Library existentes em paralelo. A entrega deve validar a progressao nome/e-mail/senha, a submissao do cadastro sem sucesso prematuro por HTTP, a conclusao somente apos `UserCreatedEvent` via `ProfileChannelMock`, o reenvio de e-mail de confirmacao e o link para login, sem alterar regras de negocio, contratos do `core` ou schemas de validacao existentes.

---

# 2. Escopo

## 2.1 In-scope

* Configurar Playwright no workspace `@stardust/web` com `webServer` apontando para a app Next.js local.
* Adicionar scripts em `apps/web/package.json` para rodar os testes de integracao em modo headless e UI/debug.
* Adicionar dependencia de desenvolvimento `@playwright/test` no workspace `@stardust/web`.
* Criar backend fake HTTP test-only em `/api/tests/server`, consumido tanto pelo server-side do Next quanto pelo browser em `MODE=testing`.
* Configurar `NEXT_PUBLIC_STARDUST_SERVER_URL` durante a suite para apontar para o backend fake HTTP da propria app web.
* Padronizar a suite Playwright na porta `3100`, usando `http://127.0.0.1:3100` como `baseURL`, `http://127.0.0.1:3100/api/tests/server` como `webServer.url` para healthcheck e `http://127.0.0.1:3100/api/tests/server` como `NEXT_PUBLIC_STARDUST_SERVER_URL` durante os testes de integracao.
* Permitir override explicito de `ProfileChannel` no `RealtimeContextProvider` e usar `ProfileChannelMock` no ambiente de testes de integracao.
* Criar `apps/web/src/app/tests/auth/sign-up.test.ts` cobrindo a rota `/auth/sign-up` com os fluxos descritos pela issue.
* Usar o MCP Playwright durante a implementacao para inspecionar a pagina real, confirmar seletores/estados e ajustar esperas/assertions antes de consolidar os testes automatizados.
* Declarar as respostas fake no corpo de cada teste via `ServerMock(page).register(routes)`, mantendo cenarios autocontidos e resetaveis.
* Documentar no proprio tooling de teste que `.env.testing` deve conter valores fake/locais e nunca segredos reais.

## 2.2 Out-of-scope

* Alterar a logica funcional da pagina de cadastro.
* Alterar contratos de `AuthService`, `ProfileService`, `ProfileChannel` ou `UserCreatedEvent` no `packages/core`.
* Criar ou alterar schemas em `packages/validation`.
* Criar endpoints reais no `server`.
* Usar websocket real do Supabase nos testes de integracao.
* Substituir testes Jest/React Testing Library existentes.
* Cobrir cadastro social, confirmacao de e-mail, login automatico, recuperacao de senha ou fluxos administrativos.
* Criar migration ou qualquer alteracao de banco de dados.

---

# 3. Requisitos

## 3.1 Funcionais

* Ao acessar `/auth/sign-up`, apenas `name-input` deve estar visivel inicialmente.
* O preenchimento de nome invalido deve manter a mensagem `Pelo menos 3 caracteres` e nao revelar o e-mail.
* O preenchimento de nome valido e disponivel deve revelar `email-input`.
* O preenchimento de e-mail invalido deve manter a mensagem `E-mail valido, por favor` e nao revelar a senha.
* O preenchimento de e-mail valido e disponivel deve revelar `password-input`.
* O preenchimento de senha invalida deve manter a mensagem de senha minima e nao revelar `submit-button`.
* O preenchimento de senha valida deve revelar `submit-button`.
* A submissao do cadastro deve chamar `POST /auth/sign-up` com `email`, `password` e `name`.
* O sucesso HTTP de `POST /auth/sign-up` nao deve exibir `sign-up-success-message` imediatamente.
* A tela deve exibir `sign-up-success-message` somente apos o teste emitir `UserCreatedEvent` com `payload.userEmail` igual ao e-mail submetido.
* Eventos `UserCreatedEvent` com outro e-mail devem ser ignorados pela pagina.
* Apos o sucesso, o botao de reenvio deve chamar `POST /auth/resend-email/sign-up` usando o e-mail submetido.
* O botao de reenvio deve refletir loading durante a chamada de reenvio.
* Cenarios de sucesso e erro do reenvio devem produzir feedback de toast conforme o comportamento atual da pagina.
* O link `sign-in-link` deve apontar para `/auth/sign-in` enquanto o formulario estiver visivel.

## 3.2 Nao funcionais

* Compatibilidade retroativa: os testes Jest existentes devem continuar rodando via `npm run test -w @stardust/web` sem depender do Playwright.
* Reprodutibilidade: os testes finais devem rodar pela CLI do Playwright sem depender do MCP Playwright; o MCP deve ser usado apenas como apoio de autoria, inspecao e debug.
* Isolamento: cada teste Playwright deve declarar suas proprias rotas fake, resetar respostas fake do backend test-only e resetar listeners do `ProfileChannelMock` entre cenarios.
* Seguranca: rotas e bridges test-only devem responder apenas em `MODE=testing`; fora desse modo devem retornar `404` ou erro equivalente sem expor estado interno.
* Seguranca: `.env.testing` deve usar URLs e tokens fake/locais suficientes para satisfazer `CLIENT_ENV` e `SERVER_ENV`; segredos reais nao devem ser versionados.
* Resiliencia: requests nao registrados no backend fake devem falhar com erro explicito informando metodo e path nao mockados.
* Performance: a configuracao Playwright deve usar apenas Chromium inicialmente para limitar custo de CI, com `workers: 1` em CI e `retries: 2` em CI.
* Observabilidade: Playwright deve capturar trace em retry e usar reporter HTML/list para facilitar diagnostico local.
* Estabilidade: os testes devem priorizar locators e assertions auto-waiting do Playwright, como `getByTestId`, `getByRole`, `expect(locator).toBeVisible()` e `expect(locator).toHaveAttribute(...)`, evitando `waitForTimeout`, sleeps fixos e seletores CSS acoplados a layout.
* Estabilidade: eventos realtime fake e respostas HTTP fake devem ser disparados por APIs deterministicas (`ProfileChannelMock.emitUserCreated(...)` e `ServerMock.register(...)`), nao por dependencias de tempo ou polling arbitrario.

---

# 4. O que ja existe?

## Tooling

* **`apps/web/package.json`** (`apps/web/package.json`) - scripts atuais de `dev`, `build`, `typecheck`, `codecheck`, `test` e `test:watch`; ainda nao possui Playwright.
* **`package-lock.json`** (`package-lock.json`) - lockfile do monorepo que sera atualizado ao instalar novas dependencias do workspace `@stardust/web`.
* **`apps/web/jest.config.ts`** (`apps/web/jest.config.ts`) - configuracao atual de Jest com `.env.testing`, `next/jest` e alias `@/*`.
* **`apps/web/jest.setup.ts`** (`apps/web/jest.setup.ts`) - setup atual de Jest com `@testing-library/jest-dom`, canvas, `ResizeObserver` e `IntersectionObserver`.
* **`apps/web/tsconfig.json`** (`apps/web/tsconfig.json`) - inclui `**/*.ts`, `**/*.tsx` e `**/*.d.ts`, portanto novos arquivos Playwright dentro de `apps/web` entram no typecheck.
* **`documentation/tooling.md`** (`documentation/tooling.md`) - fonte dos comandos globais `npm run codecheck`, `npm run typecheck` e scripts por workspace.

## Next.js App

* **`Page`** (`apps/web/src/app/auth/sign-up/page.tsx`) - entrada da rota `/auth/sign-up`, renderiza `SignUpPage`.
* **`ROUTES`** (`apps/web/src/constants/routes.ts`) - contem `ROUTES.auth.signUp` e `ROUTES.auth.signIn`, referencia para navegacao da rota de cadastro.
* **`ServerProviders`** (`apps/web/src/ui/global/widgets/layouts/Root/ServerProviders/index.tsx`) - faz `AuthService.fetchAccount()` durante renderizacao server-side, exigindo que `GET /auth/account` seja registrado no backend fake antes de `page.goto(...)`.
* **`ClientProviders`** (`apps/web/src/ui/global/widgets/layouts/Root/ClientProviders/index.tsx`) - composition root client-side que hoje monta `RestContextProvider`, `RealtimeContextProvider` e `EditorProvider`.
* **`CLIENT_ENV`** (`apps/web/src/constants/client-env.ts`) - valida variaveis `NEXT_PUBLIC_*`, incluindo `NEXT_PUBLIC_STARDUST_SERVER_URL`, usada como base URL dos services REST no client e no server.
* **`SERVER_ENV`** (`apps/web/src/constants/server-env.ts`) - valida variaveis server-side opcionais de Inngest e `MODE`.

## UI

* **`SignUpPage`** (`apps/web/src/ui/auth/widgets/pages/SignUp/index.tsx`) - widget client que injeta `authService`, `profileService`, `user`, `useSignUpPage(...)` e `useProfileSocket(handleUserCreated)`.
* **`useSignUpPage`** (`apps/web/src/ui/auth/widgets/pages/SignUp/useSignUpPage.ts`) - orquestra `requestSignUp`, guarda `userEmail`, correlaciona `UserCreatedEvent` por e-mail, troca para sucesso e chama `resendSignUpEmail`.
* **`SignUpPageView`** (`apps/web/src/ui/auth/widgets/pages/SignUp/SignUpPageView.tsx`) - alterna entre `sign-up-form` e `sign-up-success-message`, renderiza botao de reenvio e link `sign-in-link`.
* **`SignUpForm`** (`apps/web/src/ui/auth/widgets/pages/SignUp/SignUpForm/index.tsx`) - renderiza `name-input`, `email-input`, `password-input` e `submit-button` de forma progressiva.
* **`useSignUpForm`** (`apps/web/src/ui/auth/widgets/pages/SignUp/SignUpForm/useSignUpForm.ts`) - usa `react-hook-form`, `zodResolver`, `nameSchema`, `emailSchema`, `passwordSchema`, `ProfileService.verifyUserNameInUse(...)` e `ProfileService.verifyUserEmailInUse(...)`.
* **`SignUpForm.test.tsx`** (`apps/web/src/ui/auth/widgets/pages/SignUp/SignUpForm/tests/SignUpForm.test.tsx`) - teste Jest/RTL existente do formulario, referencia de seletores e mensagens.
* **`useSignUpPage.test.ts`** (`apps/web/src/ui/auth/widgets/pages/SignUp/tests/useSignUpPage.test.ts`) - teste Jest existente do hook da pagina, referencia de mocks tipados para services.
* **`SignUpPageView.test.tsx`** (`apps/web/src/ui/auth/widgets/pages/SignUp/tests/SignUpPageView.test.tsx`) - teste Jest existente da view, referencia para estados de UI.

## REST

* **`RestContextProvider`** (`apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`) - instancia `NextRestClient({ isCacheEnabled: false })`, seta base URL `CLIENT_ENV.stardustServerUrl` e expoe `AuthService` e `ProfileService`.
* **`NextRestClient`** (`apps/web/src/rest/next/NextRestClient.ts`) - adapter REST baseado em `fetch`, usado no browser e no server.
* **`NextServerRestClient`** (`apps/web/src/rest/next/NextServerRestClient.ts`) - adapter REST server-side que tambem usa `CLIENT_ENV.stardustServerUrl` e cookies.
* **`AuthService`** (`apps/web/src/rest/services/AuthService.ts`) - adapter que chama `GET /auth/account`, `POST /auth/sign-up` e `POST /auth/resend-email/sign-up`.
* **`ProfileService`** (`apps/web/src/rest/services/ProfileService.ts`) - adapter que chama `GET /profile/users/verify-name-in-use?name=...` e `GET /profile/users/verify-email-in-use?email=...`.

## Realtime

* **`RealtimeContextProvider`** (`apps/web/src/ui/global/contexts/RealtimeContext/index.tsx`) - provider atual sem prop de override.
* **`useRealtimeContextProvider`** (`apps/web/src/ui/global/contexts/RealtimeContext/useRealtimeContextProvider.ts`) - instancia diretamente `SupabaseProfileChannel(supabaseClient)`.
* **`RealtimeContextValue`** (`apps/web/src/ui/global/contexts/RealtimeContext/types/RealtimeContextValue.ts`) - hoje tipa `profileChannel` como `ReturnType<typeof SupabaseProfileChannel>`, apesar do adapter retornar `ProfileChannel`.
* **`useProfileSocket`** (`apps/web/src/ui/global/hooks/useProfileSocket.ts`) - inscreve o callback em `profileChannel.onCreateUser(...)`.
* **`SupabaseProfileChannel`** (`apps/web/src/realtime/supabase/channels/SupabaseProfileChannel.ts`) - adapter real que escuta `INSERT` em `public.users` e cria `UserCreatedEvent`.

## Core

* **`AuthService`** (`packages/core/src/auth/interfaces/AuthService.ts`) - contrato com `fetchAccount()`, `requestSignUp(email, password, name)` e `resendSignUpEmail(email)`.
* **`ProfileService`** (`packages/core/src/profile/interfaces/ProfileService.ts`) - contrato com `verifyUserNameInUse(userName)` e `verifyUserEmailInUse(userEmail)`.
* **`ProfileChannel`** (`packages/core/src/profile/interfaces/ProfileChannel.ts`) - contrato `onCreateUser(listener: (event: UserCreatedEvent) => void): () => void` que deve guiar o mock.
* **`UserCreatedEvent`** (`packages/core/src/profile/domain/events/UserCreatedEvent.ts`) - evento com payload `userId`, `userName`, `userEmail`, `userSlug`.
* **`UsersFaker`** (`packages/core/src/profile/domain/entities/fakers/UsersFaker.ts`) - faker de `UserDto` para payloads fake de perfil.
* **`AccountsFaker`** (`packages/core/src/auth/domain/entities/fakers/AccountsFaker.ts`) - faker de `AccountDto` para respostas fake de sessao quando necessario.

## Validation

* **`nameSchema`** (`packages/validation/src/modules/global/schemas/nameSchema.ts`) - validacao compartilhada de nome usada pelo formulario.
* **`emailSchema`** (`packages/validation/src/modules/global/schemas/emailSchema.ts`) - validacao compartilhada de e-mail usada pelo formulario.
* **`passwordSchema`** (`packages/validation/src/modules/global/schemas/passwordSchema.ts`) - validacao compartilhada de senha usada pelo formulario.

---

# 5. O que deve ser criado?

## Tooling de Integracao

* **Localizacao:** `apps/web/playwright.config.ts` (**novo arquivo**)
* **Dependencias:** `@playwright/test`, `dotenv`, variaveis de `.env.testing`
* **Dados de request:** nao aplicavel
* **Dados de response:** nao aplicavel
* **Metodos:**
* `defineConfig(config: PlaywrightTestConfig): PlaywrightTestConfig` - configura `testDir: './src/app/tests'`, `baseURL`, projeto `chromium`, retries/workers de CI, reporter e trace.
* `webServer.command: string` - executa a app Next local em `MODE=testing`, com `NEXT_IGNORE_INCORRECT_LOCKFILE=1`, `PORT=3100` e `NEXT_PUBLIC_STARDUST_SERVER_URL=http://127.0.0.1:3100/api/tests/server`.
* `webServer.url: string` - aponta para `http://127.0.0.1:3100/api/tests/server` para usar o healthcheck test-only e evitar depender da rota `/` protegida por middleware.
* `webServer.reuseExistingServer: boolean` - reaproveita servidor local fora de CI e evita reaproveitamento em CI.

## Tooling de Integracao (MCP Playwright)

* **Localizacao:** nao aplicavel; ferramenta externa de apoio durante a implementacao.
* **Dependencias:** MCP Playwright disponivel no ambiente do agente/desenvolvedor.
* **Dados de request:** navegacao manual/assistida para `/auth/sign-up` com a app rodando em `MODE=testing`.
* **Dados de response:** snapshot/DOM/acoes observadas para orientar os testes finais.
* **Metodos:**
* `navigate('/auth/sign-up')` - abrir a rota real apos o `webServer` estar disponivel.
* `inspect selectors` - confirmar `name-input`, `email-input`, `password-input`, `submit-button`, `sign-in-link` e `sign-up-success-message` no DOM real.
* `perform interactions` - preencher nome, e-mail e senha para validar progressao visual antes de codificar assertions.
* `debug waits` - observar estados de loading, animacoes e transicoes para calibrar `expect(...).toBeVisible()` e esperas Playwright.
* `validate no dependency` - apos ajustar os testes, executar a suite via CLI para garantir que o MCP nao e necessario para rodar CI/local.

## Camada Next.js App (Testing API Routes)

* **Localizacao:** `apps/web/src/app/api/tests/server/route.ts` (**novo arquivo**)
* **Dependencias:** `registerServerMockRoutes`, `resetServerMockRoutes` de `@/app/tests/shared/mocks/serverMockRegistry`.
* **Dados de request:** `GET` nao recebe body; `PUT` recebe payload JSON com `routes: ServerMockRoute[]`; `DELETE` nao recebe body.
* **Dados de response:** `{ ok: true }` quando `MODE=testing`; `404` fora de `MODE=testing`.
* **Metodos:**
* `GET(): Promise<Response>` - responde `{ ok: true }` e funciona como healthcheck do `webServer` da suite Playwright.
* `PUT(request: Request): Promise<Response>` - substitui completamente as respostas fake do cenario atual no registry temporario compartilhado pelas rotas test-only.
* `DELETE(): Promise<Response>` - reseta as respostas fake para uma lista vazia.

* **Localizacao:** `apps/web/src/app/api/tests/server/[...path]/route.ts` (**novo arquivo**)
* **Dependencias:** `findServerMockRoute` de `@/app/tests/shared/mocks/serverMockRegistry`.
* **Dados de request:** qualquer request HTTP para o backend fake, com path dinamico e query string.
* **Dados de response:** `body`, `status` e `headers` definidos pela rota registrada no teste; erro `500` explicito quando nenhuma rota registrada corresponder ao metodo/path/query.
* **Metodos:**
* `GET(request: Request, context: RouteContext): Promise<Response>` - responde requests fake `GET`.
* `POST(request: Request, context: RouteContext): Promise<Response>` - responde requests fake `POST`.
* `PUT(request: Request, context: RouteContext): Promise<Response>` - responde requests fake `PUT`.
* `PATCH(request: Request, context: RouteContext): Promise<Response>` - responde requests fake `PATCH`.
* `DELETE(request: Request, context: RouteContext): Promise<Response>` - responde requests fake `DELETE`.

## Camada Next.js App (Server Mock Registry)

* **Localizacao:** `apps/web/src/app/tests/shared/mocks/serverMockRegistry.ts` (**novo arquivo**)
* **Dependencias:** `ServerMockRoute`.
* **Dados de request:** lista serializavel de rotas fake registrada por `ServerMock(page).register(routes)`.
* **Dados de response:** rota fake correspondente ao metodo/path/query de uma request.
* **Responsabilidade:** manter em um arquivo temporario local compartilhado pelo runtime de rotas test-only apenas as rotas declaradas pelo teste atual. O registry nao define cenarios globais; ele armazena temporariamente o que cada teste registrou e deve ser limpo por `ServerMock.reset()`.
* **Metodos:**
* `registerServerMockRoutes(routes: ServerMockRoute[]): void` - substitui completamente a lista de respostas fake registradas.
* `resetServerMockRoutes(): void` - limpa todas as respostas fake registradas.
* `findServerMockRoute(params: { method: string; path: string; query: Record<string, string> }): ServerMockRoute | null` - encontra a resposta fake correspondente ou retorna `null`.

## Camada Realtime (Mocks)

* **Localizacao:** `apps/web/src/app/tests/shared/mocks/ProfileChannelMock.ts` (**novo arquivo**)
* **Dependencias:** `ProfileChannel`, `UserCreatedEvent`.
* **Dados de request:** listeners registrados por `useProfileSocket` e payloads emitidos pelos testes.
* **Dados de response:** callbacks executados com `UserCreatedEvent`.
* **Metodos:**
* `ProfileChannelMock(): ProfileChannelMockContract` - factory function que cria o test double aderente ao contrato `ProfileChannel` e expoe utilitarios de teste no mesmo objeto retornado.
* `onCreateUser(listener: (event: UserCreatedEvent) => void): () => void` - implementa o contrato `ProfileChannel`, registra listener e retorna cleanup.
* `emitUserCreated(payload: UserCreatedEvent['payload']): void` - cria `UserCreatedEvent` e notifica todos os listeners registrados.
* `reset(): void` - remove listeners acumulados entre cenarios.
* `getListenersCount(): number` - expone quantos listeners estao ativos no momento para sincronizacao deterministica dos testes.
* `getSubscriptionsCount(): number` - expone quantas inscricoes ja aconteceram no mock para debug local quando necessario.

* **Localizacao:** `apps/web/src/app/tests/shared/utils/profile-channel-mock.ts` (**novo arquivo**)
* **Dependencias:** `ProfileChannelMock`.
* **Dados de request:** nao aplicavel.
* **Dados de response:** singleton usado pelo provider em `MODE=testing`.
* **Metodos:**
* `profileChannelMock: ProfileChannelMock` - instancia unica compartilhada no bundle browser durante testes.
* `exposeProfileChannelMock(): void` - atribui API segura em `window.__STARDUST_PROFILE_CHANNEL_MOCK__` para Playwright disparar eventos.

## Camada Next.js App (Integration Tests)

* **Localizacao:** `apps/web/src/app/tests/auth/sign-up.test.ts` (**novo arquivo**)
* **Widget principal:** `SignUpPage`, carregado pela rota real `apps/web/src/app/auth/sign-up/page.tsx`.
* **Caminho da rota:** `/auth/sign-up`
* **Metodos:**
* `fillValidSignUpForm(page: Page, fields: { name: string; email: string; password: string }): Promise<void>` - preenche nome, e-mail e senha validos usando `data-testid` estaveis.
* `emitUserCreated(page: Page, payload: UserCreatedEvent['payload']): Promise<void>` - dispara evento fake no `ProfileChannelMock` exposto no browser.
* `test('progressively reveals sign-up fields', ...): Promise<void>` - cobre validacao progressiva de nome, e-mail, senha e botao.
* `test('waits for realtime user creation before showing success', ...): Promise<void>` - cobre submissao HTTP bem-sucedida, ausencia de sucesso prematuro e sucesso apos evento correlacionado por e-mail.
* `test('ignores user created events from another email', ...): Promise<void>` - garante que evento de outro usuario nao conclui a tela.
* `test('resends sign-up confirmation email after success', ...): Promise<void>` - cobre reenvio bem-sucedido apos sucesso.
* `test('shows resend error when resend endpoint fails', ...): Promise<void>` - cobre falha do reenvio com feedback de erro.
* `test('keeps sign-in link pointing to sign-in page', ...): Promise<void>` - valida `sign-in-link` apontando para `/auth/sign-in` enquanto o formulario esta visivel.

## Camada Next.js App (Server Mock Helper)

* **Localizacao:** `apps/web/src/app/tests/shared/mocks/ServerMock.ts` (**novo arquivo**)
* **Widget principal:** nao aplicavel.
* **Caminho da rota:** `/api/tests/server`
* **Metodos:**
* `ServerMock(page: Page): ServerMockController` - cria um controller de mocks server-side para o teste atual usando `page.request`.
* `ServerMockController.register(routes: ServerMockRoute[]): Promise<void>` - chama `PUT /api/tests/server` com `{ routes }` e substitui completamente as respostas fake server-side do cenario.
* `ServerMockController.reset(): Promise<void>` - chama `DELETE /api/tests/server` para limpar respostas fake server-side antes/depois de cada teste.
* `ServerMockController.registerSuccessDefaults(overrides?: ServerMockRoute[]): Promise<void>` - opcional; registra respostas default de sucesso para `/auth/account`, verificacoes de nome/e-mail e `/auth/sign-up`, permitindo sobrescrever rotas especificas sem repetir todo o setup.

## Camada Next.js App (Global Test Types)

* **Localizacao:** `apps/web/src/app/tests/shared/types/Window.d.ts`, `apps/web/src/app/tests/shared/types/ServerMockMethod.ts` e `apps/web/src/app/tests/shared/types/ServerMockMethodMethod.ts` (**novos arquivos**)
* **Widget principal:** nao aplicavel.
* **Caminho da rota:** nao aplicavel.
* **Metodos:**
* `ServerMockRoute` - tipo serializavel usado por `ServerMock(page).register(routes)` para declarar `method`, `path`, `query`, `status`, `delayInMs`, `body` e `headers` de cada resposta fake.
* `Window.__STARDUST_PROFILE_CHANNEL_MOCK__` - declaracao global para API de emissao/reset do mock realtime no browser.

---

# 6. O que deve ser modificado?

## Tooling

* **Arquivo:** `apps/web/package.json`
* **Mudanca:** Adicionar scripts `test:integration`, `test:integration:ui`, `test:integration:debug` e `test:integration:install`; adicionar devDependency `@playwright/test`.
* **Justificativa:** O workspace `@stardust/web` precisa expor comandos dedicados para testes de integracao sem substituir Jest.
* **Camada:** `ui`

* **Arquivo:** `apps/web/package.json`
* **Mudanca:** Definir `test:integration` como execucao headless da suite Playwright, por exemplo `playwright test --config=playwright.config.ts`.
* **Justificativa:** Deve ser o comando padrao para CI/local sem interface grafica.
* **Camada:** `ui`

* **Arquivo:** `apps/web/package.json`
* **Mudanca:** Definir `test:integration:ui` como execucao interativa, por exemplo `playwright test --config=playwright.config.ts --ui`.
* **Justificativa:** Facilita autoria e debug visual da suite durante desenvolvimento.
* **Camada:** `ui`

* **Arquivo:** `apps/web/package.json`
* **Mudanca:** Definir `test:integration:debug` como execucao debug/headed, por exemplo `playwright test --config=playwright.config.ts --debug`.
* **Justificativa:** Permite pausar, inspecionar locators e acompanhar interacoes quando um fluxo falhar.
* **Camada:** `ui`

* **Arquivo:** `apps/web/package.json`
* **Mudanca:** Definir `test:integration:install` como instalacao dos browsers Playwright, por exemplo `playwright install chromium`.
* **Justificativa:** Torna explicito o setup necessario em ambiente local/CI para baixar o browser usado pela suite.
* **Camada:** `ui`

* **Arquivo:** `package-lock.json`
* **Mudanca:** Atualizar lockfile com a dependencia de Playwright instalada no workspace `@stardust/web`.
* **Justificativa:** O monorepo usa npm workspaces e lockfile unico; novas dependencias devem ficar reproduziveis.
* **Camada:** `ui`

## UI

* **Arquivo:** `apps/web/src/ui/global/widgets/layouts/Root/ClientProviders/index.tsx`
* **Mudanca:** Em `CLIENT_ENV.mode === 'testing'`, passar `profileChannelMock` para `RealtimeContextProvider`; em outros modos, manter comportamento atual com `SupabaseProfileChannel`.
* **Justificativa:** Os testes Playwright precisam substituir Supabase Realtime sem afetar producao; chamadas REST client-side devem usar o backend fake via `NEXT_PUBLIC_STARDUST_SERVER_URL`.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/contexts/RealtimeContext/index.tsx`
* **Mudanca:** Aceitar prop opcional `profileChannel?: ProfileChannel` e repassar para `useRealtimeContextProvider(profileChannel)`.
* **Justificativa:** O provider deve depender do contrato `ProfileChannel`, permitindo injetar mock test-only sem acoplar widgets a Supabase.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/contexts/RealtimeContext/useRealtimeContextProvider.ts`
* **Mudanca:** Alterar assinatura para `useRealtimeContextProvider(profileChannel?: ProfileChannel): RealtimeContextValue` e retornar o override quando fornecido; caso contrario, instanciar `SupabaseProfileChannel(supabaseClient)` como hoje.
* **Justificativa:** Preserva o padrao atual em producao e abre boundary explicito para testes.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/contexts/RealtimeContext/types/RealtimeContextValue.ts`
* **Mudanca:** Tipar `profileChannel` como `ProfileChannel` de `@stardust/core/profile/interfaces`, removendo a dependencia do retorno concreto de `SupabaseProfileChannel`.
* **Justificativa:** O contrato publico do contexto deve ser a interface do core, nao a implementacao Supabase.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/hooks/useProfileSocket.ts`
* **Mudanca:** Incluir `profileChannel` no array de dependencias do `useEffect`.
* **Justificativa:** Com override de canal, o hook deve limpar e reinscrever listener se a instancia do canal mudar.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/middleware.ts`
* **Mudanca:** Ignorar explicitamente `/api/tests/server` no middleware.
* **Justificativa:** As rotas test-only nao podem passar pela verificacao normal de autenticacao, senao o backend fake entra em recursao ao tentar resolver `fetchAccount()` via a propria URL fake.
* **Camada:** `web`

* **Arquivo:** `apps/web/src/ui/auth/widgets/pages/SignUp/useSignUpPage.ts`
* **Mudanca:** Tornar o estado `isResendingEmail` observavel de forma deterministica antes do await da request de reenvio.
* **Justificativa:** A suite Playwright precisa conseguir verificar o loading do botao de reenvio sem depender de timing incidental do React durante requests muito rapidas.
* **Camada:** `ui`

---

# 7. O que deve ser removido?

**Nao aplicavel**.

---

# 8. Decisoes Tecnicas e Trade-offs

* **Decisao**: configurar Playwright apenas no workspace `@stardust/web`, com testes em `apps/web/src/app/tests`.
* **Alternativas consideradas**: criar configuracao global na raiz do monorepo; colocar testes em uma pasta `e2e` fora da app.
* **Motivo da escolha**: a issue define a entrega como escopo da aplicacao web e exige testes proximos das rotas de auth cobertas.
* **Impactos / trade-offs**: reduz impacto no monorepo e facilita ownership da app, mas scripts globais de Turbo so passam a executar Playwright se forem explicitamente integrados depois.

* **Decisao**: usar o MCP Playwright como ferramenta de autoria e debug dos testes, nao como runtime da suite.
* **Alternativas consideradas**: escrever os testes apenas por leitura de codigo; depender do MCP para executar os fluxos; usar somente traces gerados pela CLI.
* **Motivo da escolha**: o MCP acelera a confirmacao de seletores, estados visuais e timings reais da pagina, mas os testes precisam ser reproduziveis em CLI/CI sem dependencia externa.
* **Impactos / trade-offs**: melhora confianca durante a implementacao e reduz ajustes cegos, mas exige uma validacao final obrigatoria via `npm run test:integration -w @stardust/web`.

* **Decisao**: priorizar metodos nao flake do Playwright na escrita dos testes.
* **Alternativas consideradas**: usar `page.waitForTimeout(...)`; buscar elementos por seletores CSS estruturais; depender de sleeps para aguardar animacoes/realtime.
* **Motivo da escolha**: Playwright ja possui auto-wait em locators e assertions, e os seletores estaveis do PRD (`data-testid`) existem exatamente para reduzir flakiness.
* **Impactos / trade-offs**: pode exigir assertions mais especificas e eventos fake explicitos, mas reduz falhas intermitentes em CI e evita testes dependentes de timing.

* **Decisao**: usar backend fake HTTP test-only em `/api/tests/server` para requests server-side e client-side.
* **Alternativas consideradas**: usar `server.use(...)` com MSW no processo do Playwright; usar `page.route(...)`; usar backend real local; inicializar MSW dentro do processo Next.
* **Motivo da escolha**: browser e server-side do Next ja consomem `CLIENT_ENV.stardustServerUrl`; em `MODE=testing`, apontar essa URL para `http://127.0.0.1:3100/api/tests/server` permite que ambos usem a mesma tabela de respostas fake declarada por teste.
* **Impactos / trade-offs**: evita dependencia de MSW e resolve o boundary multi-processo, mas exige rotas test-only protegidas por `MODE=testing`, uma porta fixa dedicada e um mecanismo local compartilhado entre route handlers para persistir as respostas fake do cenario ativo.

* **Decisao**: fixar a porta `3100` para a suite Playwright da web.
* **Alternativas consideradas**: usar a porta default `3000`; alocar porta aleatoria; depender apenas da porta definida em `.env.testing`.
* **Motivo da escolha**: a porta default `3000` ja e usada pelo desenvolvimento local da web/Inngest; uma porta fixa dedicada permite montar `NEXT_PUBLIC_STARDUST_SERVER_URL=http://127.0.0.1:3100/api/tests/server` sem divergencia entre browser, server-side e Playwright.
* **Impactos / trade-offs**: evita ambiguidade e simplifica configuracao, mas exige liberar a porta `3100` no ambiente local/CI antes da execucao.

* **Decisao**: criar as routes test-only `apps/web/src/app/api/tests/server/route.ts` e `apps/web/src/app/api/tests/server/[...path]/route.ts`.
* **Alternativas consideradas**: handlers default globais fixos; serializar funcoes de handler a partir do teste; depender de arquivos temporarios compartilhados.
* **Motivo da escolha**: funcoes nao podem ser compartilhadas diretamente entre runner e processo do Next; uma tabela JSON de rotas/respostas e simples, auditavel e resetavel.
* **Impactos / trade-offs**: o requisito de `server.use(...)` do PRD fica adaptado para a realidade multi-processo: os cenarios continuam explicitos por teste via `const server = ServerMock(page); await server.register(routes)`, em vez de instancia compartilhada. Na implementacao final, essa tabela ficou persistida em arquivo temporario local para sobreviver ao isolamento entre route handlers do App Router.

* **Decisao**: criar a helper `ServerMock(page)` para abstrair chamadas diretas a `/api/tests/server`.
* **Alternativas consideradas**: chamar `page.request.put(...)` diretamente em cada teste; esconder configuracao server-side dentro de uma helper especifica do fluxo de cadastro.
* **Motivo da escolha**: a helper torna os testes mais declarativos, reduz repeticao de URL/metodo HTTP e centraliza reset/setup do registry server-side.
* **Impactos / trade-offs**: adiciona uma abstracao pequena nos testes, mas preserva a clareza porque cada teste ainda declara explicitamente a lista `ServerMockRoute[]`.

* **Decisao**: concentrar doubles stateful em `apps/web/src/app/tests/shared/mocks` e bridges/helpers browser-safe em `apps/web/src/app/tests/shared/utils`.
* **Alternativas consideradas**: colocar tudo junto da rota em `src/app/auth/__tests__`; criar pasta generica `src/testing/integration`; colocar arquivos de teste dentro de `ui`.
* **Motivo da escolha**: o test double principal continua pertencendo ao tooling de testes da camada `app`, enquanto a bridge global para `window` fica melhor classificada como utilitario compartilhado de execucao da suite.
* **Impactos / trade-offs**: evita duplicacao entre suites e melhora a separacao entre mock stateful e utilitario browser-side, mas exige que arquivos test-only nao sejam importados por codigo de produto.

* **Decisao**: tipar `RealtimeContextValue.profileChannel` como `ProfileChannel` e aceitar override no provider.
* **Alternativas consideradas**: mockar `SupabaseProfileChannel`; interceptar websocket real; alterar `useProfileSocket` para aceitar canal diretamente.
* **Motivo da escolha**: a interface do core ja existe e e o boundary correto para realtime; widgets continuam consumindo o mesmo contrato.
* **Impactos / trade-offs**: exige pequena refatoracao no provider, mas reduz acoplamento a Supabase e melhora testabilidade sem mudar comportamento de producao.

* **Decisao**: implementar `ProfileChannelMock` como test double orientado por contrato, exposto por factory function e com emissao explicita de `UserCreatedEvent` pelo teste.
* **Alternativas consideradas**: usar Supabase Realtime local; simular sucesso somente por resposta HTTP de signup; alterar `useSignUpPage` para receber callbacks de teste.
* **Motivo da escolha**: o PRD exige que o sucesso final dependa do evento realtime e que o teste controle esse evento sem websocket real.
* **Impactos / trade-offs**: adiciona API global test-only no browser e pequenas utilidades de introspeccao (`getListenersCount`, `getSubscriptionsCount`) para sincronizacao deterministica, mas preserva a regra de negocio da pagina.

* **Decisao**: nao alterar `packages/core` nem `packages/validation`.
* **Alternativas consideradas**: criar faker de `UserCreatedEvent`; criar schema compartilhado de signup.
* **Motivo da escolha**: os contratos e fakers necessarios ja existem, e o schema do formulario e local ao widget atual.
* **Impactos / trade-offs**: mantem a entrega menor e evita acoplamento cross-domain, mas o teste monta `UserCreatedEvent` a partir do payload conhecido em vez de usar faker dedicado.

* **Decisao**: nao criar migration.
* **Alternativas consideradas**: nenhuma, pois a feature nao altera persistencia.
* **Motivo da escolha**: a entrega e de tooling/testes e usa mocks para REST/realtime.
* **Impactos / trade-offs**: sem impacto em `apps/server/supabase/migrations/**`, `Database.ts`, repositories ou mappers.

---

# 9. Diagramas e Referencias

* **Fluxo de Dados:**

```text
Playwright test
    |
    | author/debug with MCP Playwright during implementation
    | confirm selectors, states and waits
    v
Playwright test file finalized for CLI execution
    |
    | const server = ServerMock(page)
    | await server.register(routes)
    v
Next testing route: PUT /api/tests/server
    |
    | registerServerMockRoutes(routes)
    v
Server mock registry in Next process
    |
    | route table for fake backend responses
    v
/auth/sign-up route
    |
    | ServerProviders fetches GET /auth/account
    v
GET /api/tests/server/auth/account
    |
    | findServerMockRoute(...)
    v
ClientProviders (MODE=testing)
    |
    | injects ProfileChannelMock
    v
SignUpPage
    |
    | name/email async validation
    v
Backend fake dynamic route
    |
    | GET /api/tests/server/profile/users/verify-name-in-use
    | GET /api/tests/server/profile/users/verify-email-in-use
    v
SignUpForm reveals email -> password -> submit
    |
    | POST /api/tests/server/auth/sign-up
    v
Backend fake returns registered sign-up response
    |
    | no success message yet
    v
Playwright emits UserCreatedEvent through ProfileChannelMock
    |
    v
useProfileSocket -> useSignUpPage.handleUserCreated
    |
    | event.payload.userEmail === submitted email
    v
SignUpPageView renders sign-up-success-message
    |
    | resend button -> POST /api/tests/server/auth/resend-email/sign-up
    v
Backend fake returns registered resend response
```

* **Fluxo Cross-app (se aplicavel):** Nao aplicavel. A feature toca apenas `apps/web`; chamadas para o backend real sao substituidas pelo backend fake HTTP test-only e nao exigem alteracao em `apps/server`.

* **Layout (se aplicavel):**

```text
/auth/sign-up
`- SignUpPage
   |- SignUpPageView
   |  |- Estado formulario
   |  |  |- Title
   |  |  |- SignUpForm
   |  |  |  |- name-input
   |  |  |  |- email-input (apos nome valido)
   |  |  |  |- password-input (apos e-mail valido)
   |  |  |  `- submit-button (apos senha valida)
   |  |  `- sign-in-link
   |  `- Estado sucesso
   |     |- sign-up-success-message
   |     `- Botao de reenvio de e-mail
   `- useProfileSocket(handleUserCreated)
```

* **Referencia:** `apps/web/package.json`
* **Referencia:** `apps/web/jest.config.ts`
* **Referencia:** `apps/web/jest.setup.ts`
* **Referencia:** `apps/web/src/app/auth/sign-up/page.tsx`
* **Referencia:** `apps/web/src/constants/routes.ts`
* **Referencia:** `apps/web/src/ui/global/widgets/layouts/Root/ServerProviders/index.tsx`
* **Referencia:** `apps/web/src/ui/global/widgets/layouts/Root/ClientProviders/index.tsx`
* **Referencia:** `apps/web/src/ui/auth/widgets/pages/SignUp/index.tsx`
* **Referencia:** `apps/web/src/ui/auth/widgets/pages/SignUp/useSignUpPage.ts`
* **Referencia:** `apps/web/src/ui/auth/widgets/pages/SignUp/SignUpPageView.tsx`
* **Referencia:** `apps/web/src/ui/auth/widgets/pages/SignUp/SignUpForm/index.tsx`
* **Referencia:** `apps/web/src/ui/auth/widgets/pages/SignUp/SignUpForm/useSignUpForm.ts`
* **Referencia:** `apps/web/src/ui/global/contexts/RealtimeContext/index.tsx`
* **Referencia:** `apps/web/src/ui/global/contexts/RealtimeContext/useRealtimeContextProvider.ts`
* **Referencia:** `apps/web/src/ui/global/contexts/RealtimeContext/types/RealtimeContextValue.ts`
* **Referencia:** `apps/web/src/ui/global/hooks/useProfileSocket.ts`
* **Referencia:** `apps/web/src/realtime/supabase/channels/SupabaseProfileChannel.ts`
* **Referencia:** `apps/web/src/rest/services/AuthService.ts`
* **Referencia:** `apps/web/src/rest/services/ProfileService.ts`
* **Referencia:** `packages/core/src/auth/interfaces/AuthService.ts`
* **Referencia:** `packages/core/src/profile/interfaces/ProfileService.ts`
* **Referencia:** `packages/core/src/profile/interfaces/ProfileChannel.ts`
* **Referencia:** `packages/core/src/profile/domain/events/UserCreatedEvent.ts`
* **Referencia:** `packages/core/src/profile/domain/entities/fakers/UsersFaker.ts`
* **Referencia:** `packages/core/src/auth/domain/entities/fakers/AccountsFaker.ts`

---

# 10. Pendencias / Duvidas

**Sem pendencias**.
