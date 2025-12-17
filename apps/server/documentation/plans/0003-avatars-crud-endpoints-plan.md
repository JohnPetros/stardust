# Endpoint de CRUD de Avatares

> **Status:** Concluído

## Objetivo

Implementar a rota/controller para CRUD de avatares.

módulo: `shop`

## Camada Core

- Use o use case `CreateAvatarUseCase` para criar um avatar.
- Use o use case `UpdateAvatarUseCase` para atualizar um avatar.
- Use o use case `DeleteAvatarUseCase` para deletar um avatar.
- Implemente os métodos necessários no repository `AvatarsRepository`
- `AvatarDto` deve ser usado para criar e atualizar um avatar, isto é, a entidade `Avatar` deve ser criada com o `AvatarDto`.

**Arquivos atualizados:**
- `packages/core/src/shop/use-cases/index.ts` - Adicionados exports dos use cases de avatares

## Camada de Validação

- Criado schema de validação `avatarSchema` em `packages/validation/src/modules/shop/schemas/avatarSchema.ts`
- Schema valida os campos: `id` (opcional), `name`, `image`, `price`, `isAcquiredByDefault` (opcional), `isSelectedByDefault` (opcional)
- Exportado através de `packages/validation/src/modules/shop/index.ts` e `packages/validation/src/main.ts`

## Camada REST

- Criados controllers para as seguintes operações de avatares:

**Create:**
- `apps/server/src/rest/controllers/shop/CreateAvatarController.ts`
  - Recebe `AvatarDto` no body
  - Retorna `201 Created` com o avatar criado

**Update:**
- `apps/server/src/rest/controllers/shop/UpdateAvatarController.ts`
  - Recebe `avatarId` nos route params e `AvatarDto` no body
  - Adiciona o `avatarId` ao DTO antes de chamar o use case
  - Retorna `200 OK` com o avatar atualizado

**Delete:**
- `apps/server/src/rest/controllers/shop/DeleteAvatarController.ts`
  - Recebe `avatarId` nos route params
  - Retorna `204 No Content` após deletar

**Arquivos atualizados:**
- `apps/server/src/rest/controllers/shop/index.ts` - Adicionados exports dos novos controllers

## Camada de Rotas

- Adicionadas rotas HTTP ao `AvatarsRouter` em `apps/server/src/app/hono/routers/shop/AvatarsRouter.ts`:

**POST `/shop/avatars`**
- Middleware: `authMiddleware.verifyAuthentication`
- Validação: `avatarSchema` (body)
- Controller: `CreateAvatarController`

**PUT `/shop/avatars/:avatarId`**
- Middleware: `authMiddleware.verifyAuthentication`
- Validação: `idSchema` (param) e `avatarSchema` (body)
- Controller: `UpdateAvatarController`

**DELETE `/shop/avatars/:avatarId`**
- Middleware: `authMiddleware.verifyAuthentication`
- Validação: `idSchema` (param)
- Controller: `DeleteAvatarController`

## Camada Banco de Dados

- Implementados métodos no repository `SupabaseAvatarsRepository` em `apps/server/src/database/supabase/repositories/shop/SupabaseAvatarsRepository.ts`:

**`add(avatar: Avatar): Promise<void>`**
- Converte avatar para formato Supabase usando `SupabaseAvatarMapper.toSupabase()`
- Executa `insert` na tabela `avatars`
- Trata erros com `SupabasePostgreError`

**`replace(avatar: Avatar): Promise<void>`**
- Converte avatar para formato Supabase usando `SupabaseAvatarMapper.toSupabase()`
- Executa `update` na tabela `avatars` filtrando por `id`
- Trata erros com `SupabasePostgreError`

**`remove(id: Id): Promise<void>`**
- Executa `delete` na tabela `avatars` filtrando por `id`
- Trata erros com `SupabasePostgreError`

## Estrutura de Rotas

```
POST   /shop/avatars          -> Criar avatar
GET    /shop/avatars          -> Listar avatares (já existia)
PUT    /shop/avatars/:id      -> Atualizar avatar
DELETE /shop/avatars/:id      -> Deletar avatar
```
