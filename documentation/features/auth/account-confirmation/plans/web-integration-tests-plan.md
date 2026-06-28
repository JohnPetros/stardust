---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
---

## Pendencias

- [ ] **Acesso direto sem conta (REQ-06):** o PRD marca como em construcao; sem comportamento confirmado para usuario nao autenticado em `/auth/account-confirmation`. Manter fora de escopo ate definicao do produto.
- [ ] **Protecao de rota privada (REQ-05):** a rota privada escolhida para o cenario de redirect pode exigir defaults adicionais de dados no `ServerMock`. Escolher a rota com menor dependencia durante a implementacao e registrar os mocks minimos necessarios.
- [ ] **Remocao do Inngest do web:** antes de remover `InngestBroker.ts` e `inngest.ts` do `apps/web`, confirmar via grep que nao ha outros consumidores alem do retry e `server-env`.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Core: adicionar `retryUserCreation` a interface `AuthService` | - | - |
| F2 | Server: rota REST `POST /auth/sign-up/retry`, controller e testes | F1 | F3 |
| F3 | Web: refactor de transporte, remocoes, testIds e suite Playwright | F1 | F2 |

> **Estrategia de paralelismo:** F1 e minima (um metodo na interface). Assim que concluida, F2 (server) e F3 (web) podem rodar em paralelo — F2 cria a rota real e F3 implementa o cliente REST e a suite Playwright contra o mock server.

---

## F1 — Core: Interface AuthService

**Objetivo:** Adicionar `retryUserCreation(): Promise<RestResponse>` a interface `AuthService` no core, desbloqueando as implementacoes no server e no web.

### Tarefas

- [x] **T1.1** — Adicionar metodo `retryUserCreation` a interface `AuthService`
  - **Depende de:** -
  - **Resultado observavel:** `packages/core/src/auth/interfaces/AuthService.ts` exporta `retryUserCreation(): Promise<RestResponse>` e o typecheck passa sem erros na interface (implementacoes quebram ate serem atualizadas em F2/F3).
  - **Camada:** `core`

---

## F2 — Server: Rota REST de Retry e Testes

> ⚡ Pode rodar em paralelo com F3 apos F1 estar concluida.

**Objetivo:** Criar a rota `POST /auth/sign-up/retry` no `apps/server` com `RetryUserCreationController`, registra-la no `AuthRouter`, implementar o stub em `SupabaseAuthService` e adicionar cobertura unitaria e de integracao. A rota recebe request autenticado, re-obtem a conta via `fetchAccount()`, monta `AccountSignedUpEvent` (com fallback de nome) e publica via `broker.publish`.

### Tarefas

- [x] **T2.1** — Implementar `RetryUserCreationController`
  - **Depende de:** T1.1
  - **Resultado observavel:** `apps/server/src/rest/controllers/auth/RetryUserCreationController.ts` existe, exporta classe com `handle(http): Promise<RestResponse>` que chama `authService.fetchAccount()`, valida `account.id`, monta `AccountSignedUpEvent` com fallback de nome (local-part do email quando vazio) e publica via `broker.publish`. Exportado no barrel `index.ts`.
  - **Camada:** `rest`

- [x] **T2.1t** — Testar `RetryUserCreationController` (unitario)
  - **Depende de:** T2.1
  - **Resultado observavel:** testes em `apps/server/src/rest/controllers/auth/tests/RetryUserCreationController.test.ts` passando, cobrindo: (1) conta autenticada publica `AccountSignedUpEvent` com `accountId`/`accountEmail`/`accountName`; (2) fallback de nome quando `accountName` vazio; (3) propaga erro quando `fetchAccount()` falha sem publicar; (4) lanca quando `account.id` ausente.
  - **Camada:** `rest`
  - **Rules:** `documentation/rules/handlers-testing-rules.md`

- [x] **T2.2** — Implementar stub `retryUserCreation` em `SupabaseAuthService`
  - **Depende de:** T1.1
  - **Resultado observavel:** `apps/server/src/rest/services/SupabaseAuthService.ts` implementa `retryUserCreation()` como `throw new MethodNotImplementedError('retryUserCreation')`, seguindo o padrao de `requestSignUp`/api keys. Typecheck passa.
  - **Camada:** `rest`

- [x] **T2.3** — Registrar rota `POST /auth/sign-up/retry` no `AuthRouter`
  - **Depende de:** T2.1, T2.2
  - **Resultado observavel:** `apps/server/src/app/hono/routers/auth/AuthRouter.ts` contem `registerRetryUserCreationRoute()` listado em `registerRoutes()`. A rota usa `authMiddleware.verifyAuthentication`, instancia `HonoHttp`, `SupabaseAuthService`, `InngestBroker` e `RetryUserCreationController`, retornando `http.sendResponse(response)`.
  - **Camada:** `rest`

- [x] **T2.3t** — Adicionar cobertura de integracao da rota de retry em `AuthRouter.test.ts`
  - **Depende de:** T2.3
  - **Resultado observavel:** cenarios adicionais em `apps/server/src/app/hono/routers/auth/tests/AuthRouter.test.ts` passando: (1) `POST /auth/sign-up/retry` sem sessao retorna 401; (2) com sessao valida, publica `AccountSignedUpEvent` e retorna sucesso.
  - **Camada:** `rest`
  - **Rules:** `documentation/rules/server-routes-testing-rules.md`

---

## F3 — Web: Refactor de Transporte, Remocoes e Suite Playwright

> ⚡ Pode rodar em paralelo com F2 apos F1 estar concluida.

**Objetivo:** Implementar `AuthService.retryUserCreation()` no web, repointar o hook de retry para usar REST em vez de RPC, remover `RetryUserCreationAction` e o Inngest do web, adicionar testIds estaveis ao `AccountConfirmationPageView` e criar a suite Playwright completa de confirmacao de conta.

### Tarefas

- [x] **T3.1** — Implementar `retryUserCreation` no `AuthService` do web
  - **Depende de:** T1.1
  - **Resultado observavel:** `apps/web/src/rest/services/AuthService.ts` implementa `retryUserCreation()` como `restClient.post('/auth/sign-up/retry')`, POST sem corpo. Typecheck passa.
  - **Camada:** `rest`

- [x] **T3.2** — Repointar `useRetryUserCreationAction` para usar `AuthService`
  - **Depende de:** T3.1
  - **Resultado observavel:** `apps/web/src/ui/auth/contexts/AuthContext/hooks/useRetryUserCreationAction.ts` chama `AuthService.retryUserCreation()` em vez de `authActions.retryUserCreation`. Contrato `() => Promise<boolean>` preservado. O hook nao importa mais `authActions`.
  - **Camada:** `ui`

- [x] **T3.3** — Remover `RetryUserCreationAction` e registros RPC
  - **Depende de:** T3.2
  - **Resultado observavel:** `apps/web/src/rpc/actions/auth/RetryUserCreationAction.ts` removido. Export removido de `apps/web/src/rpc/actions/auth/index.ts`. Registro `retryUserCreation` removido de `apps/web/src/rpc/next-safe-action/authActions.ts`. Typecheck e codecheck passam.
  - **Camada:** `web`

- [x] **T3.4** — Remover Inngest do web (InngestBroker e inngest.ts)
  - **Depende de:** T3.3
  - **Resultado observavel:** `apps/web/src/queue/inngest/InngestBroker.ts` e `apps/web/src/queue/inngest/inngest.ts` removidos. Grep por `InngestBroker`/`inngest` no `apps/web/src` nao encontra imports remanescentes (exceto `server-env` se aplicavel — ajustar). Typecheck e codecheck passam.
  - **Camada:** `web`

- [x] **T3.5** — Adicionar testIds estaveis ao `AccountConfirmationPageView`
  - **Depende de:** -
  - **Resultado observavel:** `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/AccountConfirmationPageView.tsx` expoe `testId` nos elementos ambiguos: estado pendente (`account-confirmation-pending`), botao `Tentar novamente` (`retry-user-creation-button`), estado de sucesso (`account-confirmation-success`), botao `Ir para a página principal` (`go-to-space-button`). Se a implementacao dos testes conseguir cobrir todos os cenarios sem testIds, esta tarefa deve ser omitida.
  - **Camada:** `ui`

- [x] **T3.6** — Criar suite Playwright `account-confirmation.test.ts`
  - **Depende de:** T3.1, T3.2, T3.5
  - **Resultado observavel:** `apps/web/src/app/tests/auth/account-confirmation.test.ts` existe e todos os 10 cenarios passam com `npx playwright test apps/web/src/app/tests/auth/account-confirmation.test.ts`:
    1. `confirms email, stores session cookies and redirects to account confirmation`
    2. `redirects to sign in with error when email confirmation fails`
    3. `renders pending state while profile does not exist`
    4. `reveals retry button only after the configured delay`
    5. `refetches user and shows success when matching profile creation event arrives`
    6. `ignores profile creation events from another email`
    7. `navigates to space from the main action after success`
    8. `requests retry user creation and shows loading while pending`
    9. `shows error toast when retry user creation fails`
    10. `redirects authenticated account without profile to account confirmation on private route`
  - **Camada:** `web`

- [x] **T3.6t** — Validar suite Playwright (execucao completa)
  - **Depende de:** T3.6
  - **Resultado observavel:** todos os 10 cenarios da suite passam sem flaky failures em execucao sequencial (`workers: 1`). Timeouts ajustados com `test.setTimeout` para cenarios que envolvem atraso de 7s (retry visibility) e animacao de foguete. `afterEach` limpa `ServerMock` e reseta `ProfileChannelMock`.
  - **Camada:** `web`
  - **Rules:** `documentation/rules/widget-tests-rules.md`
