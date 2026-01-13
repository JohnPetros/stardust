# Spec para deletar embeddings de uma guia deletada

`Status`: Concluído
`Application`: Server

## Objetivo

Implementar o job que deleta os embeddings de uma guia que foi previamente
deletada.

## Implementação

### Pacote Core

- ✅ `GuideDeletedEvent` - Evento que indica que uma guia foi deletada (já existia)
- ✅ `DeleteGuideUseCase` - Use case que executa a lógica de exclusão de uma guia e publica o evento (atualizado para incluir Broker)
- ✅ `EmbeddingsStorageProvider` - Interface que define a operação de exclusão de embeddings (já existia)
- ✅ Testes do `DeleteGuideUseCase` atualizados para verificar publicação do evento

### Camada REST

- ✅ `DeleteGuideController` - Atualizado para injetar o Broker como dependência
- ✅ `GuidesRouter` - Atualizado para instanciar e passar o `InngestBroker` ao controller

### Camada Queue

#### `DeleteGuideEmbeddingsJob`

- ✅ Job criado que recebe o payload de `GuideDeletedEvent` e usa o `EmbeddingsStorageProvider` para deletar os embeddings do namespace `guides`
- ✅ Job registrado no `StorageFunctions` para ser executado quando o evento `GuideDeletedEvent` for disparado

## Arquivos Modificados

- `packages/core/src/manual/use-cases/tests/DeleteGuideUseCase.test.ts`
- `apps/server/src/rest/controllers/manual/DeleteGuideController.ts`
- `apps/server/src/app/hono/routers/manual/GuidesRouter.ts`
- `apps/server/src/queue/jobs/storage/DeleteGuideEmbeddingsJob.ts` (novo)
- `apps/server/src/queue/jobs/storage/index.ts`
- `apps/server/src/queue/inngest/functions/StorageFunctions.ts`
