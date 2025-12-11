# Endpoint de Reordenar Conquistas

> **Status:** Concluído

## Objetivo

Implementar a rota/controller para reordenar as conquistas.

módulo: `profile`

## Camada Core

- Use o use case `ReorderAchievementsUseCase` para executar a lógica de reordenamento.
- Use o repository `AchievementsRepository` para buscar as conquistas e atualizar a posição.
- Criados testes para `ReorderAchievementsUseCase` em `packages/core/src/profile/use-cases/tests/ReorderAchievementsUseCase.test.ts`

## Camada REST

- Criado o arquivo `ReorderAchievementsController.ts` na pasta `apps/server/src/rest/controllers/profile/achievements`.
- Implementado o método `handle` para executar a lógica de reordenamento.
- Adicionado o middleware `AuthMiddleware` para verificar se o usuário está autenticado.
- Adicionado o middleware `ValidationMiddleware` para validar os dados da requisição -> uma lista de ids de conquistas.
- Rota `PATCH /achievements/order` registrada no `AchievementsRouter`.
- Controller exportado no arquivo `index.ts` dos controllers.

## Camada Banco de Dados

- Implementado o método `replaceMany` no repository `SupabaseAchievementsRepository` com Supabase para atualizar a posição das conquistas.

## Arquivos Criados/Modificados

- `apps/server/src/database/supabase/repositories/profile/SupabaseAchievementsRepository.ts` - Adicionado método `replaceMany`
- `apps/server/src/rest/controllers/profile/achievements/ReorderAchievementsController.ts` - Criado controller
- `apps/server/src/rest/controllers/profile/achievements/index.ts` - Exportado controller
- `apps/server/src/app/hono/routers/profile/AchievementsRouter.ts` - Adicionada rota `reorderAchievementsRoute`
- `packages/core/src/profile/use-cases/tests/ReorderAchievementsUseCase.test.ts` - Criados testes unitários