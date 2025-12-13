# Endpoint de CRUD de Foguetes

> **Status:** Concluído

## Objetivo

Implementar a rota/controller para CRUD de foguetes.

módulo: `shop`

## Camada Core

### Use Cases

**`CreateRocketUseCase`** (`packages/core/src/shop/use-cases/CreateRocketUseCase.ts`):
- Receber `RocketDto` como entrada
- Criar entidade `Rocket` a partir do DTO
- **Regra de negócio**: Sempre criar foguetes com `isAcquiredByDefault` e `isSelectedByDefault` como `false`, independente do valor recebido no DTO
- Salvar no repository através do método `add()`
- Retornar o DTO do foguete criado

**`UpdateRocketUseCase`** (`packages/core/src/shop/use-cases/UpdateRocketUseCase.ts`):
- Receber `RocketDto` como entrada (deve conter `id`)
- Validar se o foguete existe através de `findById()`, lançando `RocketNotFoundError` se não encontrado
- **Regra de negócio especial**: Se `isSelectedByDefault` for `true`:
  - Buscar o foguete atualmente selecionado por padrão através de `findSelectedByDefault()`
  - Se existir um foguete selecionado, atualizar seu `isSelectedByDefault` para `false`
  - Garantir que apenas um foguete pode estar selecionado por padrão
- Atualizar o foguete no repository através do método `replace()`
- Retornar o DTO do foguete atualizado

**`DeleteRocketUseCase`** (`packages/core/src/shop/use-cases/DeleteRocketUseCase.ts`):
- Receber `rocketId` (string) como entrada
- Validar se o foguete existe através de `findById()`, lançando `RocketNotFoundError` se não encontrado
- Remover o foguete do repository através do método `remove()`
- Não retornar valor (void)

### Repository Interface

**`RocketsRepository`** (`packages/core/src/shop/interfaces/RocketsRepository.ts`):
- Implementar os seguintes métodos necessários:
  - `add(rocket: Rocket): Promise<void>` - Adicionar novo foguete
  - `replace(rocket: Rocket): Promise<void>` - Atualizar foguete existente
  - `remove(id: Id): Promise<void>` - Remover foguete por ID
  - `findById(id: Id): Promise<Rocket | null>` - Buscar foguete por ID
  - `findSelectedByDefault(): Promise<Rocket | null>` - Buscar foguete selecionado por padrão (usado no UpdateRocketUseCase)

### Erros de Domínio

**`RocketNotFoundError`** (`packages/core/src/shop/domain/errors/RocketNotFoundError.ts`):
- Estender `NotFoundError`
- Lançar quando um foguete não é encontrado nas operações de atualização e deleção
- Usar mensagem: "Rocket não encontrado"

**Arquivos a atualizar:**
- `packages/core/src/shop/use-cases/index.ts` - Adicionar exports dos use cases de foguetes
- `packages/core/src/shop/domain/errors/index.ts` - Exportar o `RocketNotFoundError`

## Camada de Validação

- Criar schema de validação `rocketSchema` em `packages/validation/src/modules/shop/schemas/rocketSchema.ts`
- Schema deve validar os campos: `id` (opcional), `name`, `image`, `price`, `isAcquiredByDefault` (opcional), `isSelectedByDefault` (opcional)
- Exportar através de `packages/validation/src/modules/shop/index.ts` e `packages/validation/src/main.ts`

## Camada REST

- Criados controllers para as seguintes operações de foguetes:

**Create:**
- `apps/server/src/rest/controllers/shop/CreateRocketController.ts`
  - Recebe `RocketDto` no body
  - Retorna `201 Created` com o foguete criado

**Update:**
- `apps/server/src/rest/controllers/shop/UpdateRocketController.ts`
  - Recebe `rocketId` nos route params e `RocketDto` no body
  - Adiciona o `rocketId` ao DTO antes de chamar o use case
  - Retorna `200 OK` com o foguete atualizado

**Delete:**
- `apps/server/src/rest/controllers/shop/DeleteRocketController.ts`
  - Recebe `rocketId` nos route params
  - Retorna `204 No Content` após deletar

**Arquivos atualizados:**
- `apps/server/src/rest/controllers/shop/index.ts` - Adicionados exports dos novos controllers

## Camada de Rotas

- Adicionar rotas HTTP ao `RocketsRouter` em `apps/server/src/app/hono/routers/shop/RocketsRouter.ts`:

**POST `/shop/rockets`**
- Aplicar middleware: `authMiddleware.verifyAuthentication`
- Aplicar validação: `rocketSchema` (body)
- Usar controller: `CreateRocketController`

**PUT `/shop/rockets/:rocketId`**
- Aplicar middleware: `authMiddleware.verifyAuthentication`
- Aplicar validação: `idSchema` (param) e `rocketSchema` (body)
- Usar controller: `UpdateRocketController`

**DELETE `/shop/rockets/:rocketId`**
- Aplicar middleware: `authMiddleware.verifyAuthentication`
- Aplicar validação: `idSchema` (param)
- Usar controller: `DeleteRocketController`

## Camada Banco de Dados

### Repository Implementation

**`SupabaseRocketsRepository`** (`apps/server/src/database/supabase/repositories/shop/SupabaseRocketsRepository.ts`):

**`add(rocket: Rocket): Promise<void>`**
- Converter foguete para formato Supabase usando `SupabaseRocketMapper.toSupabase()`
- Adicionar campos `is_acquired_by_default` e `is_selected_by_default` do DTO
- Executar `insert` na tabela `rockets`
- Tratar erros com `SupabasePostgreError`

**`replace(rocket: Rocket): Promise<void>`**
- Converter foguete para formato Supabase usando `SupabaseRocketMapper.toSupabase()`
- Adicionar campos `is_acquired_by_default` e `is_selected_by_default` do DTO
- Executar `update` na tabela `rockets` filtrando por `id`
- Tratar erros com `SupabasePostgreError`

**`remove(id: Id): Promise<void>`**
- Executar `delete` na tabela `rockets` filtrando por `id`
- Tratar erros com `SupabasePostgreError`

**`findSelectedByDefault(): Promise<Rocket | null>`**
- Buscar foguete na tabela `rockets` onde `is_selected_by_default = true`
- Retornar `null` se nenhum foguete estiver selecionado por padrão
- Usar pelo `UpdateRocketUseCase` para garantir unicidade do foguete selecionado

### Mapper

**`SupabaseRocketMapper`** (`apps/server/src/database/supabase/mappers/shop/SupabaseRocketMapper.ts`):
- `toEntity(supabaseRocket: SupabaseRocket): Rocket` - Converter dados do Supabase para entidade de domínio
- `toDto(supabaseRocket: SupabaseRocket): RocketDto` - Converter dados do Supabase para DTO
- `toSupabase(rocket: Rocket)` - Converter entidade de domínio para formato Supabase (excluir campos booleanos que são tratados separadamente)

## Estrutura de Rotas Resultante

```
POST   /shop/rockets          -> Criar foguete
GET    /shop/rockets          -> Listar foguetes (já existia)
PUT    /shop/rockets/:id      -> Atualizar foguete
DELETE /shop/rockets/:id      -> Deletar foguete
```

## Arquivos a Criar

1. `packages/validation/src/modules/shop/schemas/rocketSchema.ts`
2. `packages/validation/src/modules/shop/schemas/index.ts`
3. `packages/validation/src/modules/shop/index.ts`
4. `apps/server/src/rest/controllers/shop/CreateRocketController.ts`
5. `apps/server/src/rest/controllers/shop/UpdateRocketController.ts`
6. `apps/server/src/rest/controllers/shop/DeleteRocketController.ts`

## Testes Unitários

### Use Cases

**`CreateRocketUseCase.test.ts`** (`packages/core/src/shop/use-cases/tests/CreateRocketUseCase.test.ts`):
- ✅ Testar criação de foguete chamando `repository.add()`
- ✅ Testar que sempre cria foguete com `isAcquiredByDefault` e `isSelectedByDefault` como `false`, mesmo quando recebidos como `true`
- ✅ Testar retorno do DTO do foguete criado com todos os campos corretos

**`UpdateRocketUseCase.test.ts`** (`packages/core/src/shop/use-cases/tests/UpdateRocketUseCase.test.ts`):
- ✅ Testar lançamento de `RocketNotFoundError` se o foguete não for encontrado
- ✅ Testar atualização do foguete quando `isSelectedByDefault` é `false`
- ✅ Testar atualização do foguete atualmente selecionado por padrão quando atualizando com `isSelectedByDefault` como `true`
- ✅ Testar atualização de foguete quando `isSelectedByDefault` é `true` mas nenhum foguete está selecionado
- ✅ Testar retorno do DTO do foguete atualizado

**`DeleteRocketUseCase.test.ts`** (`packages/core/src/shop/use-cases/tests/DeleteRocketUseCase.test.ts`):
- ✅ Testar lançamento de `RocketNotFoundError` se o foguete não for encontrado
- ✅ Testar deleção do foguete chamando `repository.remove()` com o ID correto

**Nota**: Usar `Id.create().value` em vez de um ID inválido (`'fake-id'`) nos testes, garantindo que a validação do ID ocorra antes da verificação de existência do foguete.

Todos os testes devem passar ✅

## Observações Importantes

### Regras de Negócio a Implementar

1. **Criação de Foguetes**: Garantir que todos os foguetes criados tenham `isAcquiredByDefault` e `isSelectedByDefault` como `false`, garantindo que apenas foguetes existentes possam ser marcados como padrão.

2. **Unicidade do Foguete Selecionado**: Garantir que apenas um foguete possa estar selecionado por padrão (`isSelectedByDefault = true`). Ao atualizar um foguete para ser selecionado por padrão, desmarcar automaticamente o foguete anteriormente selecionado.

3. **Validação de Existência**: Validar a existência do foguete antes de executar operações de atualização e deleção, lançando `RocketNotFoundError` quando apropriado.

### Padrão Arquitetural

Seguir o mesmo padrão arquitetural usado em `Avatars`, garantindo consistência no código:
- Implementar use cases na camada Core
- Implementar controllers na camada REST
- Implementar repository na camada Database
- Aplicar validação através de schemas Zod
- Exigir autenticação para operações de escrita

## Arquivos a Modificar

1. `packages/core/src/shop/use-cases/index.ts` - Adicionar exports dos use cases
2. `packages/core/src/shop/domain/errors/index.ts` - Adicionar export do `RocketNotFoundError`
3. `packages/validation/src/main.ts` - Adicionar export do `rocketSchema`
4. `apps/server/src/rest/controllers/shop/index.ts` - Adicionar exports dos controllers
5. `apps/server/src/database/supabase/repositories/shop/SupabaseRocketsRepository.ts` - Implementar métodos CRUD
6. `apps/server/src/app/hono/routers/shop/RocketsRouter.ts` - Registrar rotas HTTP