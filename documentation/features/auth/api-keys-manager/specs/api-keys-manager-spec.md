---
title: Gerenciador de API Keys
prd: https://github.com/JohnPetros/stardust/milestone/27
issue: https://github.com/JohnPetros/stardust/issues/387
apps: web, server
status: closed
last_updated_at: 2026-04-18
---

# 1. Objetivo

Entregar o gerenciador de API keys do Stardust como uma pagina privada do perfil em `/profile/[userSlug]/api-keys`, acessivel apenas pelo proprio usuario autenticado que possua a insignia de Engenheiro. A entrega cobre o fluxo completo entre `web`, `server` e pacotes compartilhados para criar, listar, renomear e revogar API keys com persistencia em banco, validacao compartilhada, exibicao unica do segredo completo e contratos tipados suficientes para implementar a feature sem ambiguidade.

---

# 2. Escopo

## 2.1 In-scope

- Criar o modelo de dominio de API keys no modulo `auth` do `packages/core`.
- Criar casos de uso e contratos dedicados para criar, listar, renomear e revogar API keys.
- Criar a tabela `api_keys` no banco relacional do `server`, com `revoked_at` para soft delete.
- Expor endpoints REST em `apps/server` sob `/auth/api-keys`.
- Criar um provider server-side para geracao aleatoria e hash SHA-256 sem acoplar o core ao `node:crypto`.
- Criar service REST no `web` para consumir `/auth/api-keys`.
- Consumir API keys no `web` via `AuthService` e `useRestContext`, sem criar actions RPC dedicadas para a feature.
- Criar a rota Next.js `/profile/[userSlug]/api-keys`.
- Criar a UI do gerenciador com listagem, estado vazio, loading local, erro, criacao com exibicao unica, renomeacao e revogacao.
- Adicionar o atalho com icone de chave na area de links do perfil.
- Garantir `404` para qualquer acesso da pagina por usuario nao dono ou sem insignia de Engenheiro.

## 2.2 Out-of-scope

- Listar API keys revogadas.
- Reativar API keys revogadas.
- Adicionar expiracao, escopos, permissoes granulares ou auditoria de uso por key.
- Criar suporte administrativo no `studio` para gerenciar keys de terceiros.
- Alterar o fluxo de autenticacao existente com email, senha ou OAuth.
- Incluir testes automatizados nesta spec.

---

# 3. Requisitos

## 3.1 Funcionais

- O sistema deve disponibilizar uma pagina dedicada de gerenciamento em `/profile/[userSlug]/api-keys`.
- O `web` deve retornar `404` quando o `userSlug` da rota nao pertencer ao usuario autenticado.
- O `web` deve retornar `404` quando o usuario autenticado nao possuir a insignia de Engenheiro.
- O `server` deve retornar `401` para requisicoes nao autenticadas aos endpoints `/auth/api-keys`.
- O `server` deve retornar `404` para usuarios autenticados sem a insignia de Engenheiro ao acessar `/auth/api-keys`.
- O usuario engenheiro deve conseguir criar uma API key informando apenas um nome.
- A API key criada deve seguir o padrao `sk_<tokenHex>`.
- O valor completo da key deve ser retornado apenas na resposta de criacao e nunca mais em leituras posteriores.
- O banco deve persistir somente `key_hash` e `key_preview`, nunca o segredo completo.
- A listagem deve retornar apenas keys ativas do usuario autenticado, ordenadas por `created_at` decrescente.
- O usuario deve conseguir renomear apenas keys que pertencem ao proprio usuario autenticado.
- O usuario deve conseguir revogar apenas keys que pertencem ao proprio usuario autenticado.
- A revogacao deve fazer soft delete preenchendo `revoked_at` e removendo a key da listagem ativa.
- O perfil deve exibir um novo atalho com icone de chave apontando para o gerenciador.

## 3.2 Nao funcionais

- Seguranca: o segredo completo da API key nao deve ser persistido nem retornar em `GET /auth/api-keys`, `PUT /auth/api-keys/:apiKeyId` ou `DELETE /auth/api-keys/:apiKeyId`.
- Seguranca: o hash da key deve usar SHA-256 hexadecimal com 64 caracteres.
- Compatibilidade retroativa: nenhuma rota REST existente em `apps/server/src/app/hono/routers/profile/UsersRouter.ts` pode ter assinatura alterada.
- Compatibilidade retroativa: a action `profileActions.accessProfilePage` deve manter contrato inalterado.
- Resiliencia: a revogacao deve ser idempotente no nivel de listagem ativa; apos `revoked_at` preenchido, a key nao pode mais reaparecer em `GET /auth/api-keys`.
- Consistencia de estado: a UI deve refletir criacao, renomeacao e revogacao sem recarregar a pagina inteira, mantendo a listagem local sincronizada com as respostas REST e cache local.
- Acessibilidade: a criacao, renomeacao e revogacao devem usar controles acionaveis por teclado e dialogos acessiveis baseados nos componentes ja existentes com Radix.

---

# 4. O que ja existe?

## Core

* **`AuthService`** (`packages/core/src/auth/interfaces/AuthService.ts`) - contrato atual do modulo `auth`; serve de referencia de organizacao para novas interfaces no mesmo modulo.
* **`User`** (`packages/core/src/profile/domain/entities/User.ts`) - entidade que hoje concentra verificacao de insignias via `hasInsignia(...)` e `hasEngineerRole()`.
* **`UsersRepository`** (`packages/core/src/profile/interfaces/UsersRepository.ts`) - referencia de naming e de persistencia tipada no core; tambem e a fonte usada pelo middleware de insignia.
* **`UpdateUserUseCase`** (`packages/core/src/profile/use-cases/UpdateUserUseCase.ts`) - referencia de padrao para use case que busca recurso existente, aplica alteracao e chama `repository.replace(...)`.
* **`CreateAchievementUseCase`** (`packages/core/src/profile/use-cases/CreateAchievementUseCase.ts`) - referencia de use case que cria entidade, persiste via `repository.add(...)` e retorna DTO.
* **`ListUsersUseCase`** (`packages/core/src/profile/use-cases/ListUsersUseCase.ts`) - referencia de listagem no core com transformacao de entrada primitiva para estruturas tipadas.

## Validation

* **`idSchema`** (`packages/validation/src/modules/global/schemas/idSchema.ts`) - schema base para `apiKeyId` em params de rota.
* **`stringSchema`** (`packages/validation/src/modules/global/schemas/stringSchema.ts`) - referencia para actions RPC com payload simples.
* **`titleSchema`** (`packages/validation/src/modules/global/schemas/titleSchema.ts`) - referencia semantica mais proxima para campos textuais curtos; precisa de schema proprio para respeitar o limite de 100 caracteres da tabela.
* **`accountSchema`** (`packages/validation/src/modules/auth/schemas/accountSchema.ts`) - referencia de organizacao dos schemas do modulo `auth`.

## Hono App / REST

* **`AuthRouter`** (`apps/server/src/app/hono/routers/auth/AuthRouter.ts`) - composition root real do modulo `auth` no `server`; ja concentra autenticacao, conexoes sociais e middlewares de autenticacao/perfil no mesmo router.
* **`UsersRouter`** (`apps/server/src/app/hono/routers/profile/UsersRouter.ts`) - referencia de organizacao para rotas sob `/profile` e para injeicao por request de repositories e controllers.
* **`ProfileMiddleware.verifyUserEngineerInsignia`** (`apps/server/src/app/hono/middlewares/ProfileMiddleware.ts`) - middleware existente que devolve `404` quando o usuario autenticado nao possui a insignia de Engenheiro.
* **`VerifyUserInsigniaController`** (`apps/server/src/rest/controllers/profile/users/VerifyUserInsigniaController.ts`) - controller reutilizado pelo middleware para validar insignias do usuario autenticado.
* **`SnippetsRouter`** (`apps/server/src/app/hono/routers/playground/SnippetsRouter.ts`) - melhor referencia de CRUD parcial com `GET`, `POST`, `PATCH` e `DELETE` em recurso do usuario autenticado.
* **`CreateSnippetController`** (`apps/server/src/rest/controllers/playground/CreateSnippetController.ts`) - referencia de controller que traduz body HTTP em request de use case e retorna `201`.
* **`EditSnippetTitleController`** (`apps/server/src/rest/controllers/playground/EditSnippetTitleController.ts`) - referencia de atualizacao simples focada em um campo.
* **`DeleteAchievementController`** (`apps/server/src/rest/controllers/profile/achievements/DeleteAchievementController.ts`) - referencia de retorno `204 No Content` em remocao.

## Database

* **`SupabaseUsersRepository`** (`apps/server/src/database/supabase/repositories/profile/SupabaseUsersRepository.ts`) - referencia de implementacao de repository Supabase no `server`.
* **`SupabaseSnippetMapper`** (`apps/server/src/database/supabase/mappers/playground/SupabaseSnippetMapper.ts`) - referencia de naming dos metodos `toEntity`, `toDto` e `toSupabase`.
* **`SupabaseUserMapper`** (`apps/server/src/database/supabase/mappers/profile/SupabaseUserMapper.ts`) - referencia de mapper para entidade com datas e estruturas agregadas.
* **`SupabaseSnippet`** (`apps/server/src/database/supabase/types/SupabaseSnippet.ts`) - referencia de type file baseado em `Database['public']...`.
* **`Database`** (`apps/server/src/database/supabase/types/Database.ts`) - tipos gerados do banco que precisarao refletir a nova tabela `api_keys` apos a evolucao do schema via MCP do Supabase.

## Web REST

* **`profileActions`** (`apps/web/src/rpc/next-safe-action/profileActions.ts`) - composition root atual das actions do modulo `profile` no `web`.
* **`ProfileService`** (`apps/web/src/rest/services/ProfileService.ts`) - referencia de service REST do `web` para endpoints sob `/profile`.
* **`AuthService`** (`apps/web/src/rest/services/AuthService.ts`) - referencia de service REST do modulo `auth` no `web`.
* **`useRestContext`** (`apps/web/src/ui/global/contexts/RestContext/useRestContext.ts`) - ponto de acesso aos adapters REST na camada UI.
* **`useCache`** (`apps/web/src/ui/global/hooks/useCache.ts`) - referencia para sincronizacao de estado remoto com cache local em widgets client-side.
* **`profile/[userSlug]/page.tsx`** (`apps/web/src/app/(home)/profile/[userSlug]/page.tsx`) - referencia de pagina server-side que busca dados via `profileActions` antes de renderizar o widget.
* **`profile/[userSlug]/settings/page.tsx`** (`apps/web/src/app/(home)/profile/[userSlug]/settings/page.tsx`) - referencia de pagina privada de perfil baseada em App Router.

## UI

* **`AccountLinks`** (`apps/web/src/ui/profile/widgets/pages/Profile/Account/AccountLinksView/index.tsx`) - ponto atual de decisao para exibir links privados do proprio usuario autenticado.
* **`AccountLinksView`** (`apps/web/src/ui/profile/widgets/pages/Profile/Account/AccountLinksView/AccountLinksView.tsx`) - local atual onde o icone de configuracoes e o link de snippets sao renderizados.
* **`SettingsPageView`** (`apps/web/src/ui/profile/widgets/pages/Settings/SettingsPageView.tsx`) - referencia de pagina de configuracoes com composicao simples de widgets internos.
* **`NameInput`** (`apps/web/src/ui/profile/widgets/pages/Settings/NameInput/index.tsx`) - referencia de widget com `index.tsx + useNameInput.ts + NameInputView.tsx`.
* **`useClipboard`** (`apps/web/src/ui/global/hooks/useClipboard.ts`) - hook reutilizavel para copiar a key criada com feedback visual via toast.
* **`AlertDialog`** (`apps/web/src/ui/global/widgets/components/AlertDialog/index.tsx`) - base acessivel para confirmacoes destrutivas.
* **`SignOutAlertDialogView`** (`apps/web/src/ui/global/widgets/components/SignOutAlertDialog/SignOutAlertDialogView.tsx`) - referencia de composicao concreta de `AlertDialog` com acao destrutiva e estado de loading.
* **`EmptyListMessageView`** (`apps/web/src/ui/profile/widgets/pages/Profile/UnlockedAchievementsList/EmptyListMessage/EmptyListMessageView.tsx`) - referencia de empty state ilustrado.
* **`NoRowsMessageView`** (`apps/web/src/ui/profile/widgets/pages/Profile/CraftsTable/TabsGroup/NoRowsMessage/NoRowsMessageView.tsx`) - referencia de empty state textual simples.

---

# 5. O que deve ser criado?

## Pacote Core (DTOs)

* **Localizacao:** `packages/core/src/auth/domain/entities/dtos/ApiKeyDto.ts` (**novo arquivo**)
* **props:** `id: string`, `name: string`, `keyHash: string`, `keyPreview: string`, `userId: string`, `createdAt: Date`, `revokedAt?: Date`

## Pacote Core (Entities)

* **Localizacao:** `packages/core/src/auth/domain/entities/ApiKey.ts` (**novo arquivo**)
* **Dependencias:** `ApiKeyDto` e estruturas globais ja existentes (`Id`, `Name`, `Datetime` quando necessario)
* **Metodos:**
  * `static create(dto: ApiKeyDto): ApiKey` - cria a entidade a partir do DTO persistido.
  * `get dto(): ApiKeyDto` - devolve o DTO persistivel da entidade.

## Pacote Core (Errors)

* **Localizacao:** `packages/core/src/auth/domain/errors/ApiKeyNotFoundError.ts` (**novo arquivo**)
* **Metodos:**
  * `ApiKeyNotFoundError` - erro de dominio para key inexistente.

* **Localizacao:** `packages/core/src/auth/domain/errors/ApiKeyAccessDeniedError.ts` (**novo arquivo**)
* **Metodos:**
  * `ApiKeyAccessDeniedError` - erro de dominio para tentativa de operar key que pertence a outro usuario.

## Pacote Core (Interfaces)

* **Localizacao:** `packages/core/src/auth/interfaces/ApiKeysRepository.ts` (**novo arquivo**)
* **Dependencias:** `ApiKey`, `Id`
* **Metodos:**
  * `findById(apiKeyId: Id): Promise<ApiKey | null>` - busca uma key pelo id.
  * `findManyByUserId(userId: Id): Promise<ApiKey[]>` - lista apenas as keys ativas do usuario, ja ordenadas por criacao decrescente.
  * `add(apiKey: ApiKey): Promise<void>` - persiste uma nova key.
  * `replace(apiKey: ApiKey): Promise<void>` - persiste a alteracao de nome.
  * `revoke(apiKeyId: Id, revokedAt: Date): Promise<void>` - executa o soft delete preenchendo `revoked_at`.

* **Localizacao:** `packages/core/src/auth/interfaces/ApiKeySecretProvider.ts` (**novo arquivo**)
* **Dependencias:** nenhuma
* **Metodos:**
  * `generateToken(byteLength: number): string` - gera o token hexadecimal bruto que sera prefixado com `sk_` no use case.
  * `hash(value: string): string` - devolve o SHA-256 hexadecimal do valor informado.

## Camada Core (Use Cases)

* **Localizacao:** `packages/core/src/auth/use-cases/index.ts` (**novo arquivo**)
* **Metodos:**
  * `export { CreateApiKeyUseCase } ...` - reexporta os novos use cases do modulo `auth`.
  * `export { ListApiKeysUseCase } ...` - reexporta os novos use cases do modulo `auth`.
  * `export { RenameApiKeyUseCase } ...` - reexporta os novos use cases do modulo `auth`.
  * `export { RevokeApiKeyUseCase } ...` - reexporta os novos use cases do modulo `auth`.

* **Localizacao:** `packages/core/src/auth/use-cases/CreateApiKeyUseCase.ts` (**novo arquivo**)
* **Dependencias:** `ApiKeysRepository`, `ApiKeySecretProvider`
* **Dados de request:** `name`, `userId`
* **Dados de response:** `id`, `name`, `keyPreview`, `createdAt`, `key`
* **Metodos:**
  * `execute({ name, userId }: { name: string; userId: string }): Promise<{ id: string; name: string; keyPreview: string; createdAt: Date; key: string }>` - gera o token bruto, monta `sk_<token>`, calcula hash, gera preview mascarado, persiste a entidade e retorna o segredo completo apenas nesta resposta.

* **Localizacao:** `packages/core/src/auth/use-cases/ListApiKeysUseCase.ts` (**novo arquivo**)
* **Dependencias:** `ApiKeysRepository`
* **Dados de request:** `userId`
* **Dados de response:** `items`
* **Metodos:**
  * `execute({ userId }: { userId: string }): Promise<ListResponse<ApiKeyDto>>` - lista as keys ativas do usuario autenticado sem expor `keyHash`.

* **Localizacao:** `packages/core/src/auth/use-cases/RenameApiKeyUseCase.ts` (**novo arquivo**)
* **Dependencias:** `ApiKeysRepository`
* **Dados de request:** `apiKeyId`, `name`, `userId`
* **Dados de response:** `id`, `name`, `keyPreview`, `createdAt`
* **Metodos:**
  * `execute({ apiKeyId, name, userId }: { apiKeyId: string; name: string; userId: string }): Promise<{ id: string; name: string; keyPreview: string; createdAt: Date }>` - busca a key, valida ownership, atualiza apenas o nome e persiste via `replace(...)`.

* **Localizacao:** `packages/core/src/auth/use-cases/RevokeApiKeyUseCase.ts` (**novo arquivo**)
* **Dependencias:** `ApiKeysRepository`
* **Dados de request:** `apiKeyId`, `userId`
* **Dados de response:** nenhum
* **Metodos:**
  * `execute({ apiKeyId, userId }: { apiKeyId: string; userId: string }): Promise<void>` - busca a key, valida ownership e executa soft delete via `revoke(...)`.

## Camada Provision (Providers)

* **Localizacao:** `apps/server/src/provision/auth/NodeCryptoApiKeySecretProvider.ts` (**novo arquivo**)
* **Dependencias:** `ApiKeySecretProvider`
* **Biblioteca:** `node:crypto`
* **Metodos:**
  * `generateToken(byteLength: number): string` - usa `randomBytes(byteLength).toString('hex')` para gerar o token bruto.
  * `hash(value: string): string` - usa `createHash('sha256').update(value).digest('hex')` para gerar o hash persistido.

## Camada Banco de Dados (Types)

* **Localizacao:** `apps/server/src/database/supabase/types/SupabaseApiKey.ts` (**novo arquivo**)
* **props:** alias tipado de `Database['public']['Tables']['api_keys']['Row']`

## Camada Banco de Dados (Mappers)

* **Localizacao:** `apps/server/src/database/supabase/mappers/auth/index.ts` (**novo arquivo**)
* **Metodos:**
  * `export { SupabaseApiKeyMapper } ...` - reexporta o mapper do submodulo `auth`.

* **Localizacao:** `apps/server/src/database/supabase/mappers/auth/SupabaseApiKeyMapper.ts` (**novo arquivo**)
* **Metodos:**
  * `toEntity(supabaseApiKey: SupabaseApiKey): ApiKey` - converte a linha do Supabase para entidade do core.
  * `toDto(supabaseApiKey: SupabaseApiKey): ApiKeyDto` - converte a linha do banco para DTO interno do dominio.
  * `toSupabase(apiKey: ApiKey): SupabaseApiKey` - converte a entidade para o shape persistivel do banco.

## Camada Banco de Dados (Repositories)

* **Localizacao:** `apps/server/src/database/supabase/repositories/auth/index.ts` (**novo arquivo**)
* **Metodos:**
  * `export { SupabaseApiKeysRepository } ...` - reexporta o repository do submodulo `auth`.

* **Localizacao:** `apps/server/src/database/supabase/repositories/auth/SupabaseApiKeysRepository.ts` (**novo arquivo**)
* **Dependencias:** `SupabaseClient`, `ApiKeysRepository`, `SupabaseApiKeyMapper`
* **Metodos:**
  * `findById(apiKeyId: Id): Promise<ApiKey | null>` - consulta uma key por id.
  * `findManyByUserId(userId: Id): Promise<ApiKey[]>` - consulta keys com `user_id = ?`, `revoked_at IS NULL` e `ORDER BY created_at DESC`.
  * `add(apiKey: ApiKey): Promise<void>` - insere o registro usando `toSupabase(...)`.
  * `replace(apiKey: ApiKey): Promise<void>` - atualiza o nome da key sem alterar hash, preview ou owner.
  * `revoke(apiKeyId: Id, revokedAt: Date): Promise<void>` - preenche `revoked_at` para a key informada.

## Camada REST (Controllers)

* **Localizacao:** `apps/server/src/rest/controllers/auth/api-keys/index.ts` (**novo arquivo**)
* **Metodos:**
  * `export { FetchApiKeysListController } ...` - reexporta os controllers de API keys do modulo `auth`.
  * `export { CreateApiKeyController } ...` - reexporta os controllers de API keys do modulo `profile`.
  * `export { RenameApiKeyController } ...` - reexporta os controllers de API keys do modulo `profile`.
  * `export { RevokeApiKeyController } ...` - reexporta os controllers de API keys do modulo `profile`.

* **Localizacao:** `apps/server/src/rest/controllers/auth/api-keys/FetchApiKeysListController.ts` (**novo arquivo**)
* **Dependencias:** `ApiKeysRepository`
* **Dados de request:** nenhum body; usa `http.getAccount()` para obter `account.id`
* **Dados de response:** `items`
* **Metodos:**
  * `handle(http: Http): Promise<RestResponse>` - executa `ListApiKeysUseCase` para o usuario autenticado e retorna `200` com `ListResponse<ApiKeyDto>`.

* **Localizacao:** `apps/server/src/rest/controllers/auth/api-keys/CreateApiKeyController.ts` (**novo arquivo**)
* **Dependencias:** `ApiKeysRepository`, `ApiKeySecretProvider`
* **Dados de request:** `name`
* **Dados de response:** `id`, `name`, `keyPreview`, `createdAt`, `key`
* **Metodos:**
  * `handle(http: Http<{ body: { name: string } }>): Promise<RestResponse>` - executa `CreateApiKeyUseCase` para o usuario autenticado e retorna `201`.

* **Localizacao:** `apps/server/src/rest/controllers/auth/api-keys/RenameApiKeyController.ts` (**novo arquivo**)
* **Dependencias:** `ApiKeysRepository`
* **Dados de request:** `apiKeyId`, `name`
* **Dados de response:** `id`, `name`, `keyPreview`, `createdAt`
* **Metodos:**
  * `handle(http: Http<{ routeParams: { apiKeyId: string }; body: { name: string } }>): Promise<RestResponse>` - executa `RenameApiKeyUseCase` e retorna `200`.

* **Localizacao:** `apps/server/src/rest/controllers/auth/api-keys/RevokeApiKeyController.ts` (**novo arquivo**)
* **Dependencias:** `ApiKeysRepository`
* **Dados de request:** `apiKeyId`
* **Dados de response:** nenhum
* **Metodos:**
  * `handle(http: Http<{ routeParams: { apiKeyId: string } }>): Promise<RestResponse>` - executa `RevokeApiKeyUseCase` e retorna `204`.

## Camada RPC (Actions)

**Nao aplicavel**.

## Camada UI (Widgets)

* **Localizacao:** `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/` (**nova pasta**)
* **Props:** nao recebe `initialApiKeys`; carrega lista via `AuthService.listApiKeys()` no hook.
* **Estados (Client Component):**
  * Loading: desabilitar botoes de acao e exibicao de loading local durante create, rename e revoke.
  * Error: manter dialog aberto, exibir toast de erro e preservar a listagem anterior.
  * Empty: renderizar mensagem informando que o usuario ainda nao criou nenhuma key e CTA para abrir o dialog de criacao.
  * Content: renderizar listagem com nome, preview, data formatada, acao de renomear e acao de revogar; a confirmacao de revogacao deve usar `AlertDialog` destrutivo.
* **View:** `ApiKeyManagerView.tsx`
* **Hook (se aplicavel):** `useApiKeyManager.ts`
* **Index:** usar `useRestContext`, `AuthService` e `useClipboard` nos pontos corretos da composicao, sem `next-safe-action` para API keys.
* **Widgets internos:** `ApiKeysList`, `CreateApiKeyDialog`, `RenameApiKeyDialog`, `RevokeApiKeyDialog`
* **Estrutura de pastas:**

```text
apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/
├── index.tsx
├── ApiKeyManagerView.tsx
├── useApiKeyManager.ts
├── ApiKeysList/
│   ├── index.tsx
│   ├── ApiKeysListView.tsx
│   ├── useApiKeysList.ts
│   └── ApiKeyItem/
│       ├── index.tsx
│       └── ApiKeyItemView.tsx
├── CreateApiKeyDialog/
│   ├── index.tsx
│   ├── CreateApiKeyDialogView.tsx
│   └── useCreateApiKeyDialog.ts
├── RenameApiKeyDialog/
│   ├── index.tsx
│   ├── RenameApiKeyDialogView.tsx
│   └── useRenameApiKeyDialog.ts
└── RevokeApiKeyDialog/
    ├── index.tsx
    └── RevokeApiKeyDialogView.tsx
```

## Camada Hono App (Routes)

* **Localizacao:** `apps/server/src/app/hono/routers/auth/ApiKeysRouter.ts` (**novo arquivo**)
* **Middlewares:** `AuthMiddleware.verifyAuthentication`, `ProfileMiddleware.verifyUserEngineerInsignia`, `ValidationMiddleware`
* **Caminho da rota:** `/auth/api-keys`
* **Dados de schema:**
  * `POST /` valida inline com `z.object({ name: z.string().min(3).max(100) })`
  * `PUT /:apiKeyId` valida `apiKeyId` com `idSchema` no param e valida inline o body com `z.object({ name: z.string().min(3).max(100) })`
  * `DELETE /:apiKeyId` usa `idSchema` no param

## Camada Next.js App (Pages, Layouts)

* **Localizacao:** `apps/web/src/app/(home)/profile/[userSlug]/api-keys/page.tsx` (**novo arquivo**)
* **Widget principal:** `ApiKeyManager`
* **Caminho da rota:** `/profile/[userSlug]/api-keys`

---

# 6. O que deve ser modificado?

## Core

* **Arquivo:** `packages/core/src/auth/interfaces/AuthService.ts`
* **Mudanca:** Adicionar ao contrato `AuthService` os metodos `listApiKeys()`, `createApiKey(name: string)`, `renameApiKey(apiKeyId: Id, name: string)` e `revokeApiKey(apiKeyId: Id)`.
* **Justificativa:** O consumo HTTP do `web` deve permanecer centralizado no service de autenticacao existente, sem criar um adapter REST paralelo so para API keys.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/auth/interfaces/index.ts`
* **Mudanca:** Exportar `ApiKeysRepository` e `ApiKeySecretProvider`.
* **Justificativa:** Os novos contratos do modulo `auth` precisam ficar disponiveis para `server` e `web` sem imports por caminho interno.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/auth/domain/entities/index.ts`
* **Mudanca:** Exportar `ApiKey`.
* **Justificativa:** Mantem o barrel do modulo `auth` consistente com o padrao existente.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/auth/domain/entities/dtos/index.ts`
* **Mudanca:** Exportar `ApiKeyDto`.
* **Justificativa:** Permite reuso do DTO pela camada database e pelos novos use cases.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/auth/domain/errors/index.ts`
* **Mudanca:** Exportar `ApiKeyNotFoundError` e `ApiKeyAccessDeniedError`.
* **Justificativa:** Centraliza os novos erros de dominio do modulo `auth` no barrel oficial.
* **Camada:** `core`

## Database

* **Arquivo:** `apps/server/src/database/supabase/types/Database.ts`
* **Mudanca:** Atualizar os tipos gerados para incluir a tabela `api_keys` apos a alteracao do banco via MCP do Supabase.
* **Justificativa:** `SupabaseApiKey.ts` e `SupabaseApiKeysRepository` devem depender do tipo gerado real, sem hardcode de shape, e a fonte de verdade da mudanca de banco nao deve ser `schema.sql`.
* **Camada:** `database`

* **Arquivo:** `apps/server/src/database/supabase/types/index.ts`
* **Mudanca:** Exportar `SupabaseApiKey`.
* **Justificativa:** Mantem o barrel de types coerente com os novos arquivos tipados do banco.
* **Camada:** `database`

* **Arquivo:** `apps/server/src/database/supabase/repositories/index.ts`
* **Mudanca:** Exportar o novo submodulo `auth` de repositories.
* **Justificativa:** Segue o padrao atual de agregacao dos repositories Supabase por dominio.
* **Camada:** `database`

## REST

* **Arquivo:** `apps/server/src/rest/controllers/auth/index.ts`
* **Mudanca:** Reexportar o novo namespace `api-keys` junto dos controllers ja existentes de autenticacao.
* **Justificativa:** `AuthRouter` importa seus controllers pelo barrel do modulo `auth`.
* **Camada:** `rest`

## Hono App

* **Arquivo:** `apps/server/src/app/hono/routers/auth/AuthRouter.ts`
* **Mudanca:** Instanciar e montar `ApiKeysRouter` dentro do composition root de autenticacao, adicionando o prefixo `/api-keys` em `AuthRouter.ROUTES` se o time preferir seguir o padrao de constantes do router.
* **Justificativa:** O endpoint foi fechado para viver sob o `AuthRouter`, alinhando surface HTTP com o modulo de dominio `auth`.
* **Camada:** `rest`

## REST / Web

* **Arquivo:** `apps/web/src/rest/services/AuthService.ts`
* **Mudanca:** Adicionar ao adapter existente os metodos `listApiKeys()`, `createApiKey(name)`, `renameApiKey(apiKeyId, name)` e `revokeApiKey(apiKeyId)`, todos apontando para `/auth/api-keys`.
* **Justificativa:** A feature deve reutilizar o adapter REST de autenticacao ja existente no `web`, mantendo um unico service para endpoints do router `auth`.
* **Camada:** `rest`

* **Arquivo:** `apps/web/src/rest/services/index.ts`
* **Mudanca:** Nao adicionar novo service; manter apenas `AuthService` como surface de consumo HTTP para API keys.
* **Justificativa:** Evita fragmentar a fronteira REST do modulo `auth` no `web`.
* **Camada:** `rest`

## RPC

**Nao aplicavel**.

## UI

* **Arquivo:** `apps/web/src/constants/routes.ts`
* **Mudanca:** Adicionar `profile.apiKeys(userSlug)` apontando para `/profile/${userSlug}/api-keys`.
* **Justificativa:** O novo link privado do perfil precisa usar o registro central de rotas da app.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/profile/widgets/pages/Profile/Account/AccountLinksView/AccountLinksView.tsx`
* **Mudanca:** Adicionar o terceiro atalho com icone de chave apontando para `ROUTES.profile.apiKeys(accountSlug)`.
* **Justificativa:** A feature exige acesso a partir do perfil pelo proprio usuario autenticado.
* **Camada:** `ui`

---

# 7. O que deve ser removido?

**Nao aplicavel**.

---

# 8. Decisoes Tecnicas e Trade-offs

* **Decisao**: modelar API keys no modulo `auth` do `packages/core`, expor os endpoints sob `/auth/api-keys` e manter a UI sob `ui/profile`.
* **Alternativas consideradas**: modelar tudo em `profile`; expor `/profile/api-keys`; acoplar API keys a `UsersRepository` e `ProfileService`.
* **Motivo da escolha**: a key e uma credencial de autenticacao, entao tanto o dominio quanto a surface HTTP ficam mais coerentes em `auth`; a experiencia do usuario continua ancorada no perfil apenas como ponto de entrada da interface.
* **Impactos / trade-offs**: a feature continua cruzando modulo de dominio (`auth`) com modulo de superficie (`profile`), mas elimina a divergencia entre dominio `auth` e router `profile` no `server`.

* **Decisao**: usar um repository dedicado `ApiKeysRepository` em vez de ampliar `UsersRepository`.
* **Alternativas consideradas**: adicionar metodos de API keys em `UsersRepository`; persistir API keys como colecao agregada do `User`.
* **Motivo da escolha**: `UsersRepository` ja esta extenso e a tabela `api_keys` e um recurso proprio com ciclo de vida e consultas especificas.
* **Impactos / trade-offs**: cria mais arquivos e barrels novos, mas reduz acoplamento no adapter de usuarios e deixa ownership, hash e soft delete isolados.

* **Decisao**: criar `ApiKeysRouter` dedicado e monta-lo em `AuthRouter`.
* **Alternativas consideradas**: adicionar as quatro rotas novas diretamente dentro de `AuthRouter`; montar o recurso em `ProfileRouter`.
* **Motivo da escolha**: a feature agora precisa viver sob o router de autenticacao, e um sub-router dedicado preserva coesao sem inflar `AuthRouter` com quatro handlers adicionais inline.
* **Impactos / trade-offs**: aumenta a quantidade de arquivos, mas preserva coesao no `server` e evita misturar endpoints de API keys com os fluxos ja existentes de sessao e OAuth dentro do mesmo arquivo.

* **Decisao**: manter `PUT /auth/api-keys/:apiKeyId` para renomeacao, apesar de a referencia mais proxima (`SnippetsRouter`) usar `PATCH` para alteracao parcial.
* **Alternativas consideradas**: usar `PATCH` para seguir exatamente o padrao de `EditSnippetTitleController`.
* **Motivo da escolha**: a issue e o PRD ja fecham `PUT` como contrato esperado do endpoint de renomeacao.
* **Impactos / trade-offs**: o contrato fica alinhado com o insumo de produto, mas diverge do exemplo mais proximo de alteracao parcial na codebase; a spec precisa deixar essa divergencia explicita para evitar reinterpretacao durante a implementacao.

* **Decisao**: encapsular `randomBytes` e `createHash` em `ApiKeySecretProvider` implementado no `server`.
* **Alternativas consideradas**: usar `node:crypto` diretamente em `CreateApiKeyUseCase`; gerar token e hash dentro do controller.
* **Motivo da escolha**: o core deve permanecer agnostico de runtime e nao deve importar bibliotecas especificas de Node.
* **Impactos / trade-offs**: adiciona um contrato extra e um provider novo no `server`, mas preserva a direcao correta de dependencias e mantem a regra de negocio no use case.

* **Decisao**: remover actions RPC de API keys no `web` e usar `AuthService` via `useRestContext` diretamente no widget.
* **Alternativas consideradas**: manter `next-safe-action` para listagem e mutacoes; criar action dedicada apenas para gate de pagina.
* **Motivo da escolha**: reduz camadas intermediarias para uma feature estritamente REST e elimina `ActionResponse` no fluxo da UI de API keys.
* **Impactos / trade-offs**: simplifica a composicao do widget e o estado local com `useCache`, mas desloca a responsabilidade de tratamento de erro/sucesso para o proprio hook client-side.

---

# 9. Diagramas e Referencias

* **Fluxo de Dados:**

```text
[Next.js page /profile/[userSlug]/api-keys]
  -> ApiKeysPage
  -> ApiKeyManager (client)
  -> useRestContext().authService.listApiKeys()
  -> GET /auth/api-keys
  -> AuthMiddleware.verifyAuthentication
  -> ProfileMiddleware.verifyUserEngineerInsignia
  -> FetchApiKeysListController
  -> ListApiKeysUseCase
  -> ApiKeysRepository.findManyByUserId(account.id)
  -> SupabaseApiKeysRepository
  -> public.api_keys
```

* **Fluxo Cross-app (se aplicavel):**

```text
web (Next.js)
  ApiKeyManager (client)
    -> authService.createApiKey(name)
    -> REST /auth/api-keys (POST)

server (Hono)
  ApiKeysRouter
    -> CreateApiKeyController
    -> CreateApiKeyUseCase
    -> ApiKeySecretProvider + ApiKeysRepository
    -> Supabase public.api_keys

server -> web response
  { id, name, keyPreview, createdAt, key }

web (UI)
  CreateApiKeyDialog
    -> exibe key uma unica vez
    -> useClipboard.copy(key, ...)
    -> atualiza lista local sem recarregar a pagina
```

* **Layout (se aplicavel):**

```text
ProfilePage
└── AccountLinks
    ├── Gear -> /profile/[slug]/settings
    ├── Snippet -> /playground/snippets
    └── Key -> /profile/[slug]/api-keys

ApiKeyManagerPage
├── Header / descricao
├── Primary CTA: Nova API Key
├── ApiKeysList
│   └── ApiKeyItem[*]
│       ├── nome
│       ├── keyPreview
│       ├── createdAt formatado
│       ├── acao renomear
│       └── acao revogar
├── CreateApiKeyDialog
│   ├── formulario de nome
│   └── estado de sucesso com segredo completo + copiar
├── RenameApiKeyDialog
└── RevokeApiKeyAlertDialog (AlertDialog destrutivo)
```

* **Referencias:**

- `apps/server/src/app/hono/routers/playground/SnippetsRouter.ts`
- `apps/server/src/rest/controllers/playground/CreateSnippetController.ts`
- `apps/server/src/rest/controllers/playground/EditSnippetTitleController.ts`
- `apps/server/src/rest/controllers/profile/users/VerifyUserInsigniaController.ts`
- `apps/server/src/database/supabase/repositories/profile/SupabaseUsersRepository.ts`
- `apps/server/src/database/supabase/mappers/playground/SupabaseSnippetMapper.ts`
- `apps/web/src/rpc/next-safe-action/profileActions.ts`
- `apps/web/src/ui/profile/widgets/pages/Profile/Account/AccountLinksView/AccountLinksView.tsx`
- `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/index.tsx`
- `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/useApiKeyManager.ts`
- `apps/web/src/ui/profile/widgets/pages/Settings/NameInput/index.tsx`
- `apps/web/src/ui/global/widgets/components/AlertDialog/index.tsx`
- `apps/web/src/ui/global/widgets/components/SignOutAlertDialog/SignOutAlertDialogView.tsx`
- `apps/web/src/ui/global/hooks/useClipboard.ts`

---

# 10. Pendencias / Duvidas

**Nao aplicavel**.
