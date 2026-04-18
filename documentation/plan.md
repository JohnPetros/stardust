---
description: Implementar gerenciador de API keys a partir da spec tecnica.
status: closed
spec: documentation/features/auth/api-keys-manager/specs/api-keys-manager-spec.md
---

## Pendencias (quando aplicavel)

- [ ] Definir e executar o fluxo operacional de evolucao do schema no Supabase via MCP e regeneracao de `apps/server/src/database/supabase/types/Database.ts` para evitar drift de tipos.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Definir contratos e casos de uso de API keys no core. | - | - |
| F2 | Implementar server (database + provision + rest) para `/auth/api-keys`. | F1 | F3 |
| F3 | Implementar web (rest + rpc + ui + web) para o gerenciador em perfil. | F1 | F2 |

---

## F1 — Core: Dominio, Structures e Use Cases

### Tarefas

- [x] **F1-T1** — Criar modelos de dominio (`ApiKeyDto`, `ApiKey`, erros de API key).
  - Artefatos: `packages/core/src/auth/domain/entities/dtos/ApiKeyDto.ts`, `packages/core/src/auth/domain/entities/ApiKey.ts`, `packages/core/src/auth/domain/errors/ApiKeyNotFoundError.ts`, `packages/core/src/auth/domain/errors/ApiKeyAccessDeniedError.ts`.
  - Concluido em: `2026-04-18`.
- [x] **F1-T2** — Criar interfaces `ApiKeysRepository` e `ApiKeySecretProvider`.
  - Artefatos: `packages/core/src/auth/interfaces/ApiKeysRepository.ts`, `packages/core/src/auth/interfaces/ApiKeySecretProvider.ts`.
  - Concluido em: `2026-04-18`.
- [x] **F1-T3** — Implementar `CreateApiKeyUseCase`.
  - Artefatos: `packages/core/src/auth/use-cases/CreateApiKeyUseCase.ts`.
  - Concluido em: `2026-04-18`.
- [x] **F1-T4** — Implementar `ListApiKeysUseCase`.
  - Artefatos: `packages/core/src/auth/use-cases/ListApiKeysUseCase.ts`.
  - Concluido em: `2026-04-18`.
- [x] **F1-T5** — Implementar `RenameApiKeyUseCase` e `RevokeApiKeyUseCase`.
  - Artefatos: `packages/core/src/auth/use-cases/RenameApiKeyUseCase.ts`, `packages/core/src/auth/use-cases/RevokeApiKeyUseCase.ts`.
  - Concluido em: `2026-04-18`.
- [x] **F1-T6** — Atualizar barrels do modulo auth e contrato `AuthService` com metodos de API key.
  - Artefatos: `packages/core/src/auth/use-cases/index.ts`, `packages/core/src/auth/interfaces/AuthService.ts`, `packages/core/src/auth/interfaces/index.ts`, `packages/core/src/auth/domain/entities/index.ts`, `packages/core/src/auth/domain/entities/dtos/index.ts`, `packages/core/src/auth/domain/errors/index.ts`, `packages/core/src/main.ts`.
  - Concluido em: `2026-04-18`.

---

## F2 — Server: Infra, Repositorios e Handlers

### Tarefas

- [x] **F2-T1** — Atualizar tipos de banco para `api_keys` e criar `SupabaseApiKey` + export.
  - Artefatos: `apps/server/src/database/supabase/types/Database.ts`, `apps/server/src/database/supabase/types/SupabaseApiKey.ts`, `apps/server/src/database/supabase/types/index.ts`.
  - Concluido em: `2026-04-18`.
- [x] **F2-T2** — Implementar `SupabaseApiKeyMapper` e barrel de mappers auth.
  - Artefatos: `apps/server/src/database/supabase/mappers/auth/SupabaseApiKeyMapper.ts`, `apps/server/src/database/supabase/mappers/auth/index.ts`.
  - Concluido em: `2026-04-18`.
- [x] **F2-T3** — Implementar `SupabaseApiKeysRepository` e exports de repositories auth.
  - Artefatos: `apps/server/src/database/supabase/repositories/auth/SupabaseApiKeysRepository.ts`, `apps/server/src/database/supabase/repositories/auth/index.ts`, `apps/server/src/database/supabase/repositories/index.ts`, `apps/server/src/database/index.ts`.
  - Concluido em: `2026-04-18`.
- [x] **F2-T4** — Implementar `NodeCryptoApiKeySecretProvider`.
  - Artefatos: `apps/server/src/provision/auth/NodeCryptoApiKeySecretProvider.ts`, `apps/server/src/provision/auth/index.ts`.
  - Concluido em: `2026-04-18`.
- [x] **F2-T5** — Implementar controllers REST de API keys e barrels.
  - Artefatos: `apps/server/src/rest/controllers/auth/api-keys/ListApiKeysController.ts`, `apps/server/src/rest/controllers/auth/api-keys/CreateApiKeyController.ts`, `apps/server/src/rest/controllers/auth/api-keys/RenameApiKeyController.ts`, `apps/server/src/rest/controllers/auth/api-keys/RevokeApiKeyController.ts`, `apps/server/src/rest/controllers/auth/api-keys/index.ts`, `apps/server/src/rest/controllers/auth/index.ts`.
  - Concluido em: `2026-04-18`.
- [x] **F2-T6** — Implementar `ApiKeysRouter` com middlewares e validacoes.
  - Artefatos: `apps/server/src/app/hono/routers/auth/ApiKeysRouter.ts`.
  - Concluido em: `2026-04-18`.
- [x] **F2-T7** — Integrar `ApiKeysRouter` no `AuthRouter`.
  - Artefatos: `apps/server/src/app/hono/routers/auth/AuthRouter.ts`.
  - Concluido em: `2026-04-18`.

---

## F3 — Web: UI e Integracao

### Tarefas

- [x] **F3-T1** — Adicionar metodos de API keys no `AuthService` web.
  - Artefatos: `apps/web/src/rest/services/AuthService.ts`.
  - Concluido em: `2026-04-18`.
- [x] **F3-T2** — Implementar actions RPC de API keys e atualizar composition roots/barrels.
  - Artefatos: `apps/web/src/rpc/actions/profile/AccessProfileApiKeysPageAction.ts`, `apps/web/src/rpc/actions/profile/ListApiKeysAction.ts`, `apps/web/src/rpc/actions/profile/CreateApiKeyAction.ts`, `apps/web/src/rpc/actions/profile/RenameApiKeyAction.ts`, `apps/web/src/rpc/actions/profile/RevokeApiKeyAction.ts`, `apps/web/src/rpc/actions/profile/index.ts`, `apps/web/src/rpc/next-safe-action/profileActions.ts`, `apps/web/src/rpc/next-safe-action/index.ts`.
  - Concluido em: `2026-04-18`.
- [x] **F3-T3** — Criar rota web `/profile/[userSlug]/api-keys` com gate de acesso via action.
  - Artefatos: `apps/web/src/app/(home)/profile/[userSlug]/api-keys/page.tsx`, `apps/web/src/rpc/actions/profile/AccessProfileApiKeysPageAction.ts`, `apps/web/src/rpc/next-safe-action/profileActions.ts`.
  - Concluido em: `2026-04-18`.
- [x] **F3-T4** — Criar widget `ApiKeyManager` (index, view, hook) com estados e sincronizacao local.
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/index.tsx`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/ApiKeyManagerView.tsx`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/useApiKeyManager.ts`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/index.tsx`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeysPageView.tsx`.
  - Concluido em: `2026-04-18`.
- [x] **F3-T5** — Criar widgets internos (`ApiKeysList`, `ApiKeyItem`, dialogos create/rename/revoke).
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/ApiKeysList/index.tsx`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/ApiKeysList/ApiKeysListView.tsx`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/ApiKeyItem/index.tsx`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/ApiKeyItem/ApiKeyItemView.tsx`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/CreateApiKeyDialog/index.tsx`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/CreateApiKeyDialog/CreateApiKeyDialogView.tsx`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/RenameApiKeyDialog/index.tsx`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/RenameApiKeyDialog/RenameApiKeyDialogView.tsx`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/RevokeApiKeyDialog/index.tsx`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/RevokeApiKeyDialog/RevokeApiKeyDialogView.tsx`.
  - Concluido em: `2026-04-18`.
- [x] **F3-T6** — Integrar `useClipboard` para copia do segredo apenas na criacao.
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/index.tsx`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/useApiKeyManager.ts`, `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/CreateApiKeyDialog/CreateApiKeyDialogView.tsx`.
  - Concluido em: `2026-04-18`.
- [x] **F3-T7** — Adicionar atalho de API keys no `AccountLinksView` e rota em `ROUTES.profile.apiKeys`.
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Profile/Account/AccountLinksView/AccountLinksView.tsx`, `apps/web/src/constants/routes.ts`.
  - Concluido em: `2026-04-18`.

---

## Divergencias em relacao a Spec

- **F2:** Foi necessario adicionar export subpath `./auth/use-cases` em `packages/core/package.json` para permitir import dos novos use cases pelo server.
- **F2:** Foi necessario implementar metodos de API keys em `apps/server/src/rest/services/SupabaseAuthService.ts` com `MethodNotImplementedError` para manter conformidade de interface `AuthService` apos extensao no core.
- **F3:** A acao de acesso da pagina foi criada como `AccessProfileApiKeysPageAction` (nome levemente diferente de `AccessApiKeyManagerPageAction` previsto na spec), mantendo o mesmo comportamento funcional.
- **F3:** A UI foi organizada em `apps/web/src/ui/profile/widgets/pages/ApiKeys/**` em vez de `.../ApiKeyManager/**` na raiz de `pages`, preservando o contrato e estados funcionais descritos.
