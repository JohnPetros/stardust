---
title: Remocao manual de audio de bloco de texto
prd: https://github.com/JohnPetros/stardust/milestone/31
issue: https://github.com/JohnPetros/stardust/issues/419
apps: server, studio
status: closed
last_updated_at: 2026-06-04
---

# 1. Objetivo

Permitir que o operador do Studio remova manualmente o audio associado a um bloco de texto da historia, sem alterar conteudo, titulo, imagem, runnable ou ordem dos blocos. Tecnicamente, a entrega adiciona um endpoint REST dedicado no `server`, um use case de `lesson` para validar e limpar `stars.texts[blockIndex].audio`, uma RPC/migration para remover a chave `audio` do JSONB, um evento disparado pelo modulo `lesson` para solicitar a remocao fisica, um job no modulo `storage` para excluir idempotentemente o arquivo em `audios/story` quando houver `fileName`, e a integracao no editor de historia do `studio` para exibir loading durante a remocao e esconder player/status assim que a resposta atualizada de `TextBlockDto[]` for refletida no estado local.

# 2. Escopo

## 2.1 In-scope

* Criar operacao REST dedicada para remover audio persistido de um bloco por `starId` e `blockIndex`.
* Proteger a rota com autenticacao, `verifyGodAccount`, validacao de `starId`, validacao de body e `verifyStarExists`.
* Criar use case no dominio `lesson` para buscar blocos, validar indice, bloquear remocao quando `audio.status = 'pending'`, limpar o audio do bloco, publicar evento de remocao fisica quando houver `audio.fileName` e retornar os blocos atualizados.
* Criar metodo `clearAudio(starId: Id, blockIndex: Integer): Promise<void>` em `TextBlocksRepository` e implementacao Supabase.
* Criar migration em `apps/server/supabase/migrations/**` para RPC `clear_text_block_audio` removendo a chave `audio` de `stars.texts[blockIndex]`.
* Criar evento de dominio para requisitar remocao fisica do arquivo de audio removido.
* Criar job no modulo `storage` para consumir o evento e remover o arquivo fisico em `audios/story` quando o bloco removido possuir `audio.fileName` preenchido.
* Tratar arquivo fisico ausente como sucesso no job, mantendo a referencia do bloco limpa.
* Adicionar contrato REST compartilhado em `LessonService` e implementacao no `apps/studio`.
* Adicionar acao de remocao nos controles de audio do card apenas quando existir audio persistido e o status nao for `pending`.
* Exibir loading no botao `Remover audio` durante a requisicao e mante-lo ate a resposta atualizada do `server` ser refletida no estado local do Studio.
* Sincronizar `baselineTextBlocks` e `textBlocks` no Studio com a resposta `TextBlockDto[]` do server, sobrescrevendo explicitamente `audio` quando a propriedade vier ausente.

## 2.2 Out-of-scope

* Reproducao de audio na Lesson Page do app `web`.
* Realtime para atualizar status de audio.
* Alteracao dos fluxos de geracao, regeneracao, cancelamento ou polling ja existentes, exceto para integrar a nova acao de remocao.
* Remocao manual de audio de blocos com `audio.status = 'pending'`; estes continuam usando cancelamento.
* Remocao automatica em massa de arquivos antigos fora do fluxo explicito de remocao manual do bloco.
* Cadastro, edicao ou remocao de vozes.
* Alteracao do modelo de armazenamento de `stars.texts` para tabela relacional.
* Testes automatizados nesta spec.

# 3. Requisitos

## 3.1 Funcionais

* O operador autenticado e autorizado como god account deve conseguir remover o audio de um bloco especifico da historia.
* A acao de remocao deve aparecer no Studio apenas para blocos elegiveis (`default`, `alert`, `quote` e `image`) com audio persistido e `audio.status !== 'pending'`.
* Blocos com `audio.status = 'pending'` devem continuar usando o fluxo existente de cancelamento, sem acao de remocao manual.
* A remocao deve limpar a propriedade `audio` do bloco persistido em `stars.texts[blockIndex]`.
* A remocao nao deve alterar `content`, `title`, `picture`, `isRunnable`, `type` ou a ordem dos blocos.
* Quando houver `audio.fileName`, o use case deve publicar um evento para que o modulo `storage` remova `audios/story/{fileName}` em background.
* Se o arquivo fisico ja nao existir, o job de storage deve concluir com sucesso sem reverter a referencia do bloco.
* O endpoint deve retornar `TextBlockDto[]` atualizado para o Studio sincronizar baseline e estado local.
* Durante a remocao, o botao `Remover audio` deve exibir estado de loading e ficar desabilitado junto com os controles conflitantes do card.
* Apos sucesso, o card deve deixar de exibir player, badge/status de audio e acao de remover audio para o bloco assim que o estado local refletir a ausencia de `audio`.
* Em falha, o Studio deve preservar o estado local anterior e exibir erro via `toastProvider.showError`.

## 3.2 Nao funcionais

* Seguranca: a rota deve usar `verifyAuthentication`, `verifyGodAccount` e `verifyStarExists`, mantendo autenticacao e autorizacao na borda da app.
* Idempotencia: ausencia do arquivo fisico no storage nao deve falhar o job nem impedir que a referencia `audio` permaneca limpa no bloco.
* Consistencia de persistencia: a limpeza deve ser parcial por `blockIndex`, sem regravar manualmente todo o array `stars.texts` no adapter.
* Compatibilidade retroativa: blocos sem `audio` devem continuar validos; a ausencia da chave `audio` representa audio removido.
* Resiliencia: se a chamada REST falhar, o Studio nao deve remover o audio apenas no estado local e deve encerrar o loading de remocao do bloco com seguranca.
* Arquitetura: o use case de `lesson` nao deve depender de `FileStorageProvider`; a integracao com storage deve ocorrer por evento e job do modulo `storage`.

# 4. O que ja existe?

## Camada Hono App (Server)

* **`TextBlocksRouter`** (`apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`) - Router de `/lesson/text-blocks`; ja expoe fetch/update, geracao individual/lote e cancelamento individual/lote de audio.
* **`LessonRouter`** (`apps/server/src/app/hono/routers/lesson/LessonRouter.ts`) - Registra `TextBlocksRouter` sob `/lesson`.
* **`AuthMiddleware`** (`apps/server/src/app/hono/middlewares/AuthMiddleware.ts`) - Expoe `verifyAuthentication` e `verifyGodAccount` usados nas rotas administrativas.
* **`SpaceMiddleware`** (`apps/server/src/app/hono/middlewares/SpaceMiddleware.ts`) - Expoe `verifyStarExists`, ja usado em rotas de blocos por `starId`.
* **`ValidationMiddleware`** (`apps/server/src/app/hono/middlewares/ValidationMiddleware.ts`) - Valida `param`, `json` e `query` com schemas Zod.

## Camada REST (Controllers Server)

* **`TriggerTextBlockAudioGenerationController`** (`apps/server/src/rest/controllers/lesson/TriggerTextBlockAudioGenerationController.ts`) - Referencia de controller com body `{ blockIndex, voice }`, use case e retorno `202`.
* **`CancelTextBlockAudioGenerationController`** (`apps/server/src/rest/controllers/lesson/CancelTextBlockAudioGenerationController.ts`) - Referencia de controller com body `{ blockIndex }`, use case e retorno `202` para cancelamento pendente.
* **`RemoveFileController`** (`apps/server/src/rest/controllers/storage/RemoveFileController.ts`) - Referencia de remocao generica de arquivo via `FileStorageProvider.removeFile`, mas nao limpa `stars.texts`.
* **`lesson controllers barrel`** (`apps/server/src/rest/controllers/lesson/index.ts`) - Barrel que exporta controllers REST do modulo `lesson`.

## Camada Core (Use Cases e Domain)

* **`TriggerTextBlockAudioGenerationUseCase`** (`packages/core/src/lesson/use-cases/TriggerTextBlockAudioGenerationUseCase.ts`) - Busca blocos, valida elegibilidade/status, persiste `pending` via `repository.updateAudio` e publica evento.
* **`CancelTextBlockAudioGenerationUseCase`** (`packages/core/src/lesson/use-cases/CancelTextBlockAudioGenerationUseCase.ts`) - Busca bloco, exige `audio.isPending` e publica evento de cancelamento.
* **`TextBlock`** (`packages/core/src/lesson/domain/structures/TextBlock.ts`) - Structure de bloco; possui `audio?: TextBlockAudio`, `setAudio(audio)` e serializa `audio` no `dto`.
* **`TextBlockAudio`** (`packages/core/src/lesson/domain/structures/TextBlockAudio.ts`) - Structure de audio com status `idle`, `pending`, `error`, `done` e `cancelled`.
* **`TextBlockNotFoundError`** (`packages/core/src/lesson/domain/errors/TextBlockNotFoundError.ts`) - Erro usado quando o indice do bloco nao existe.
* **`TextBlockAudioGenerationNotPendingError`** (`packages/core/src/lesson/domain/errors/TextBlockAudioGenerationNotPendingError.ts`) - Erro atual para transicoes invalidas envolvendo geracao pendente.

## Camada Core (Interfaces)

* **`TextBlocksRepository`** (`packages/core/src/lesson/interfaces/TextBlocksRepository.ts`) - Contrato atual com `findAllByStar`, `updateMany` e `updateAudio`; nao possui limpeza de audio.
* **`LessonService`** (`packages/core/src/lesson/interfaces/LessonService.ts`) - Contrato REST compartilhado consumido pelo Studio; possui geracao/cancelamento de audio, mas nao remocao manual.
* **`FileStorageProvider`** (`packages/core/src/storage/interfaces/FileStorageProvider.ts`) - Contrato de storage com `findFile` e `removeFile`.

## Camada Banco de Dados

* **`SupabaseTextBlocksRepository`** (`apps/server/src/database/supabase/repositories/lesson/SupabaseTextBlocksRepository.ts`) - Implementa `findAllByStar`, `updateMany` e `updateAudio` com RPC `update_text_block_audio`.
* **`SupabaseTextBlockMapper`** (`apps/server/src/database/supabase/mappers/lesson/SupabaseTextBlockMapper.ts`) - Converte DB shape para `TextBlock` e de `TextBlock` para DTO persistivel.
* **`update_text_block_audio` migration** (`apps/server/supabase/migrations/20260514120000_create_update_text_block_audio_function.sql`) - Cria funcao para setar `texts[blockIndex].audio` com `jsonb_set`; nao remove a chave.
* **`Database`** (`apps/server/src/database/supabase/types/Database.ts`) - Tipos gerados do Supabase; ja contem RPC `update_text_block_audio`.

## Camada Provision (Storage)

* **`SupabaseFileStorageProvider`** (`apps/server/src/provision/storage/SupabaseFileStorageProvider.ts`) - Implementa `findFile` e `removeFile` no bucket `stardust-bucket`.
* **`FileStorageFolderPath.createAsAudiosStory`** (`packages/core/src/storage/domain/structures/FileStorageFolderPath.ts`) - Define a pasta `audios/story` usada pelos arquivos de audio de historia.

## Camada Queue / Inngest

* **`GenerateTextBlockAudioJob`** (`apps/server/src/queue/jobs/storage/GenerateTextBlockAudioJob.ts`) - Referencia de coordenacao entre `lesson` e `storage`; remove arquivo anterior em regeneracao usando `FileStorageProvider.removeFile`.
* **`UpdateTextBlockAudioJob`** (`apps/server/src/queue/jobs/lesson/UpdateTextBlockAudioJob.ts`) - Persiste audio `done` via `repository.updateAudio`.
* **`CancelTextBlockAudioGenerationJob`** (`apps/server/src/queue/jobs/lesson/CancelTextBlockAudioGenerationJob.ts`) - Marca audio como `cancelled` via `repository.updateAudio`.

## Pacote Validation

* **`requestTextBlockAudioGenerationSchema`** (`packages/validation/src/modules/lesson/schemas/requestTextBlockAudioGenerationSchema.ts`) - Valida `{ blockIndex, voice }`; nao deve ser reutilizado para remocao porque exige `voice`.
* **`textBlockAudioSchema`** (`packages/validation/src/modules/lesson/schemas/textBlockAudioSchema.ts`) - Valida o subdocumento `audio` no payload completo de blocos.
* **`idSchema`** (`packages/validation/src/modules/global/schemas/idSchema.ts`) - Schema UUID usado em params `starId`.

## Camada REST (Studio)

* **`LessonService`** (`apps/studio/src/rest/services/LessonService.ts`) - Implementa fetch/update, vozes, geracao e cancelamento de audio; nao possui remocao manual.

## Camada UI (Studio)

* **`useLessonStoryPage`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/useLessonStoryPage.ts`) - Orquestra fetch, baseline, salvamento, geracao, cancelamento, polling e sincronizacao local de `TextBlockDto[]`.
* **`LessonStoryPageView`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/LessonStoryPageView.tsx`) - Repassa props e handlers do hook para `TextBlocks`.
* **`TextBlocksView`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlocksView.tsx`) - Renderiza lista e repassa handlers de audio para `TextBlockCard`.
* **`TextBlockCard`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/index.tsx`) - Entry point do card; conecta `useTextBlockCard` e `TextBlockCardView`.
* **`useTextBlockCard`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/useTextBlockCard.ts`) - Calcula `canHaveAudio`, status e flags de audio.
* **`TextBlockCardView`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/TextBlockCardView.tsx`) - Renderiza `BlockAudioControls` dentro do card expandido.
* **`BlockAudioControls`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/index.tsx`) - Compoe seletor, player e view de controles.
* **`useBlockAudioControls`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/useBlockAudioControls.ts`) - Calcula `canShowPlayer` e `canCancel`; nao calcula `canRemove`.
* **`BlockAudioControlsView`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/BlockAudioControlsView.tsx`) - Exibe botoes de gerar/cancelar, badge e player; nao possui botao de remover audio.
* **`useTextBlocks`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/useTextBlocks.ts`) - Consulta arquivos existentes em `audios/story` e fornece `hasStoredAudioFile(blockId)`.

# 5. O que deve ser criado?

## Camada Core (Use Cases)

* **Localizacao:** `packages/core/src/lesson/use-cases/RemoveTextBlockAudioUseCase.ts` (**novo arquivo**)
* **Dependencias:** `TextBlocksRepository`, `Broker`.
* **Dados de request:** `starId: string`, `blockIndex: number`.
* **Dados de response:** `TextBlockDto[]` atualizado.
* **Metodos:** `execute(request: { starId: string; blockIndex: number }): Promise<TextBlockDto[]>` - valida `Id` e `Integer`, busca blocos, valida existencia do bloco, bloqueia `audio.status = 'pending'`, captura `audio.fileName` quando preenchido, persiste `clearAudio`, publica `TextBlockAudioFileRemovedEvent` quando houver `fileName` e retorna os blocos com o bloco alvo sem `audio`.

## Camada Core (Events)

* **Localizacao:** `packages/core/src/lesson/domain/events/TextBlockAudioFileRemovedEvent.ts` (**novo arquivo**)
* **Dependencias:** `Event`.
* **Dados de request:** `fileName: string`.
* **Dados de response:** Nao aplicavel.
* **Metodos:** `constructor(payload: { fileName: string })` - cria evento com `_NAME = 'lesson/text-block.audio-file.removed'` para solicitar ao modulo `storage` a remocao fisica do arquivo em `audios/story`.

## Camada Core (Errors)

* **Localizacao:** `packages/core/src/lesson/domain/errors/TextBlockAudioRemovalNotAllowedError.ts` (**novo arquivo**)
* **Dependencias:** erro base equivalente ao padrao de `TextBlockAudioGenerationNotPendingError`.
* **Metodos:** `constructor(status: string)` - representa tentativa de remover manualmente audio quando o estado atual nao permite a remocao, especialmente `pending`.

## Camada Core (Domain Structures)

* **Localizacao:** `packages/core/src/lesson/domain/structures/TextBlock.ts`
* **Metodos:** `removeAudio(): TextBlock` - retorna um clone do bloco sem a propriedade `audio`, preservando os demais campos.

## Camada REST (Controllers)

* **Localizacao:** `apps/server/src/rest/controllers/lesson/RemoveTextBlockAudioController.ts` (**novo arquivo**)
* **Dependencias:** `TextBlocksRepository`, `Broker`.
* **Dados de request:** route param `starId`; body `{ blockIndex: number }`.
* **Dados de response:** `TextBlockDto[]` atualizado.
* **Metodos:** `handle(http: Http<Schema>): Promise<RestResponse<TextBlockDto[]>>` - executa `RemoveTextBlockAudioUseCase` e retorna `http.send(textBlocks, HTTP_STATUS_CODE.ok)`.

## Camada Banco de Dados (Repositories)

* **Localizacao:** `packages/core/src/lesson/interfaces/TextBlocksRepository.ts`
* **Dependencias:** `Id`, `Integer`, `TextBlock`, `TextBlockAudio`.
* **Metodos:** `clearAudio(starId: Id, blockIndex: Integer): Promise<void>` - contrato para remover somente a chave `audio` de um bloco persistido, sem regravar todo o array.

* **Localizacao:** `apps/server/src/database/supabase/repositories/lesson/SupabaseTextBlocksRepository.ts`
* **Dependencias:** `SupabaseClient<Database>`, RPC `clear_text_block_audio`.
* **Metodos:** `clearAudio(starId: Id, blockIndex: Integer): Promise<void>` - chama `clear_text_block_audio` com `p_star_id` e `p_block_index`, convertendo erros para `SupabasePostgreError`.

## Camada Banco de Dados (Migrations)

* **Localizacao:** `apps/server/supabase/migrations/<timestamp>_create_clear_text_block_audio_function.sql` (**novo arquivo**)
* **Objetivo:** Criar RPC para remover a chave `audio` de `stars.texts[blockIndex]` de forma parcial e atomica.
* **Escopo SQL:** Criar `public.clear_text_block_audio(p_star_id uuid, p_block_index integer) returns void`; validar `p_block_index >= 0`; atualizar `public.stars` com `texts = jsonb_set(texts, array[p_block_index::text], (texts -> p_block_index) - 'audio', false)`; restringir `where` para `id = p_star_id`, `texts is not null`, `jsonb_typeof(texts) = 'array'` e `p_block_index < jsonb_array_length(texts)`; lancar excecao quando nenhuma linha for atualizada.
* **Seguranca:** Nao havera nova tabela nem nova politica RLS. A funcao deve receber `grant execute` para `service_role`, pois o fluxo usa o Supabase client autenticado do server.
* **Dependencias de codigo:** Regenerar `apps/server/src/database/supabase/types/Database.ts` para incluir `clear_text_block_audio`; atualizar `SupabaseTextBlocksRepository.clearAudio`; manter mapeamento via `SupabaseTextBlockMapper` e `TextBlock.dto`.

## Pacote Validation (Schemas)

* **Localizacao:** `packages/validation/src/modules/lesson/schemas/removeTextBlockAudioSchema.ts` (**novo arquivo**)
* **Atributos:** `blockIndex: z.number().int('Indice do bloco invalido').min(0, 'Indice do bloco invalido')`.

## Camada Hono App (Routes)

* **Localizacao:** `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`
* **Middlewares:** `verifyAuthentication`, `verifyGodAccount`, `validate('param', z.object({ starId: idSchema }))`, `validate('json', removeTextBlockAudioSchema)`, `verifyStarExists`.
* **Caminho da rota:** `DELETE /lesson/text-blocks/star/:starId/audio/file`.
* **Dados de schema:** `removeTextBlockAudioSchema` para body `{ blockIndex }`.

## Camada Inngest App (Functions)

* **Localizacao:** `apps/server/src/queue/inngest/functions/StorageFunctions.ts`
* **Metodos:** Registrar uma nova function Inngest para `TextBlockAudioFileRemovedEvent`, instanciando `RemoveTextBlockAudioFileJob` com `SupabaseFileStorageProvider`.

## Camada Queue (Jobs)

* **Localizacao:** `apps/server/src/queue/jobs/storage/RemoveTextBlockAudioFileJob.ts` (**novo arquivo**)
* **Dependencias:** `FileStorageProvider`.
* **Dados de request:** payload `{ fileName: string }` vindo de `TextBlockAudioFileRemovedEvent`.
* **Dados de response:** Nao aplicavel.
* **Metodos:** `handle(amqp: Amqp<EventPayload<typeof TextBlockAudioFileRemovedEvent>>): Promise<void>` - busca o arquivo em `FileStorageFolderPath.createAsAudiosStory()` com `findFile`; se existir, remove com `removeFile`; se nao existir, encerra com sucesso.

# 6. O que deve ser modificado?

## Camada Core

* **Arquivo:** `packages/core/src/lesson/interfaces/LessonService.ts`
* **Mudanca:** Adicionar `removeTextBlockAudio(starId: Id, blockIndex: Integer): Promise<RestResponse<TextBlockDto[]>>`.
* **Justificativa:** Studio precisa consumir a operacao REST dedicada com contrato compartilhado e tipado.
* **Camada:** `rest`

* **Arquivo:** `packages/core/src/lesson/interfaces/TextBlocksRepository.ts`
* **Mudanca:** Adicionar `clearAudio(starId: Id, blockIndex: Integer): Promise<void>`.
* **Justificativa:** A remocao de audio precisa ser uma atualizacao parcial por indice, distinta de `updateAudio`, que exige `TextBlockAudio`.
* **Camada:** `database`

* **Arquivo:** `packages/core/src/lesson/domain/structures/TextBlock.ts`
* **Mudanca:** Adicionar `removeAudio(): TextBlock` e usa-lo no novo use case.
* **Justificativa:** A ausencia de `audio` e o modelo existente para bloco sem audio; a regra deve ficar no objeto de dominio em vez de manipular DTO manualmente no use case.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/lesson/use-cases/index.ts`
* **Mudanca:** Exportar `RemoveTextBlockAudioUseCase`.
* **Justificativa:** Manter padrao de barrel dos use cases de `lesson`.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/lesson/domain/events/index.ts`
* **Mudanca:** Exportar `TextBlockAudioFileRemovedEvent`.
* **Justificativa:** Disponibilizar o evento para o use case de `lesson`, schema Inngest e job de `storage`.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/lesson/domain/errors/index.ts`
* **Mudanca:** Exportar `TextBlockAudioRemovalNotAllowedError`.
* **Justificativa:** Manter padrao de barrel dos erros de `lesson`.
* **Camada:** `core`

## Camada REST (Controllers)

* **Arquivo:** `apps/server/src/rest/controllers/lesson/index.ts`
* **Mudanca:** Exportar `RemoveTextBlockAudioController`.
* **Justificativa:** Permitir importacao pelo `TextBlocksRouter` seguindo o padrao dos controllers atuais.
* **Camada:** `rest`

## Camada Hono App

* **Arquivo:** `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`
* **Mudanca:** Importar `removeTextBlockAudioSchema`, `RemoveTextBlockAudioController` e `InngestBroker`; adicionar metodo privado `removeTextBlockAudioRoute()` e registra-lo em `registerRoutes()`.
* **Justificativa:** Expor a rota administrativa dedicada sem conflitar com `DELETE /star/:starId/audio`, que permanece cancelamento de geracao pendente.
* **Camada:** `rest`

## Camada Banco de Dados

* **Arquivo:** `apps/server/src/database/supabase/repositories/lesson/SupabaseTextBlocksRepository.ts`
* **Mudanca:** Implementar `clearAudio(starId, blockIndex)` chamando RPC `clear_text_block_audio`.
* **Justificativa:** Persistir remocao da chave `audio` sem regravar todo o array JSONB.
* **Camada:** `database`

* **Arquivo:** `apps/server/src/database/supabase/types/Database.ts`
* **Mudanca:** Regenerar tipos Supabase para incluir a RPC `clear_text_block_audio`.
* **Justificativa:** Evitar chamadas RPC sem tipagem e manter contrato do banco refletido nos adapters.
* **Camada:** `database`

## Camada Queue / Inngest

* **Arquivo:** `apps/server/src/queue/inngest/inngest.ts`
* **Mudanca:** Adicionar schema do evento `lesson/text-block.audio-file.removed` com payload `{ fileName: z.string() }`.
* **Justificativa:** Permitir que o Inngest valide e roteie o evento publicado pelo use case de `lesson`.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/queue/inngest/functions/StorageFunctions.ts`
* **Mudanca:** Registrar function para consumir `TextBlockAudioFileRemovedEvent` e executar `RemoveTextBlockAudioFileJob`.
* **Justificativa:** A remocao fisica pertence ao modulo `storage` e deve executar fora do request HTTP.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/queue/jobs/storage/index.ts`
* **Mudanca:** Exportar `RemoveTextBlockAudioFileJob`, se houver barrel para jobs de storage.
* **Justificativa:** Manter padrao de exports do modulo de jobs.
* **Camada:** `queue`

## Camada Provision

* **Arquivo:** `apps/server/src/provision/storage/SupabaseFileStorageProvider.ts`
* **Mudanca:** Nao alterar o contrato; o job deve usar `findFile` antes de `removeFile` para tratar arquivo ausente como sucesso.
* **Justificativa:** A idempotencia exigida e especifica deste fluxo e nao precisa mudar o comportamento global de `removeFile`.
* **Camada:** `provision`

## Pacote Validation

* **Arquivo:** `packages/validation/src/modules/lesson/schemas/index.ts`
* **Mudanca:** Exportar `removeTextBlockAudioSchema`.
* **Justificativa:** Manter schemas do modulo `lesson` expostos por barrel.
* **Camada:** `rest`

## Camada REST (Services)

* **Arquivo:** `apps/studio/src/rest/services/LessonService.ts`
* **Mudanca:** Implementar `removeTextBlockAudio(starId, blockIndex)` chamando `DELETE /lesson/text-blocks/star/:starId/audio/file` com body `{ blockIndex: blockIndex.value }` e retorno `RestResponse<TextBlockDto[]>`.
* **Justificativa:** Disponibilizar a operacao dedicada para a UI do Studio via contrato `LessonService`.
* **Camada:** `rest`

## Camada UI (Widgets)

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/useLessonStoryPage.ts`
* **Mudanca:** Adicionar `handleRemoveTextBlockAudio(blockId: string): Promise<void>`; encontrar `blockIndex`, opcionalmente sincronizar alteracoes locais antes da remocao quando `hasChanges`, controlar `removingAudioBlockIds`, chamar `lessonService.removeTextBlockAudio(starId, Integer.create(blockIndex))`, tratar falha com `toastProvider.showError`, e em sucesso atualizar `baselineTextBlocks` e `textBlocks` com `toEditorItemsFromPersisted`, sobrescrevendo explicitamente `audio` com o valor persistido retornado pelo server.
* **Justificativa:** Manter o mesmo padrao de orquestracao e sincronizacao usado por geracao/cancelamento, evitando remover audio de indice desatualizado quando houver alteracoes locais e garantindo que o loading termine quando o estado local refletir a ausencia de `audio`.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/LessonStoryPageView.tsx`
* **Mudanca:** Receber `onRemoveAudio` do hook e repassar para `TextBlocks`.
* **Justificativa:** Propagar o novo handler sem adicionar logica na View.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlocksView.tsx`
* **Mudanca:** Receber `onRemoveAudio(blockId: string)` e `isRemovingAudioByBlockId(blockId: string)`, repassando ambos para cada `TextBlockCard`.
* **Justificativa:** Conectar a acao do card ao handler da pagina preservando o padrao atual de callbacks por `blockId` e permitindo que a UI renderize loading por bloco.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/index.tsx`
* **Mudanca:** Adicionar props `onRemoveAudio(blockId: string): void` e `isRemovingAudio: boolean`, repassando ambas para `TextBlockCardView` vinculada ao `item.id`.
* **Justificativa:** Manter o entry point do widget como composicao de hook/view enquanto propaga o estado visual de remocao.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/TextBlockCardView.tsx`
* **Mudanca:** Repassar `onRemove` e `isRemoving` para `BlockAudioControls`.
* **Justificativa:** A view do card apenas compoe o widget de controles de audio e precisa encaminhar o estado visual da remocao.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/index.tsx`
* **Mudanca:** Adicionar props `onRemove(): void` e `isRemoving: boolean`; obter `canRemove` de `useBlockAudioControls`; repassar `canRemove`, `onRemove` e `isRemoving` para a View, alem de desabilitar o seletor durante a remocao.
* **Justificativa:** Manter regra visual no hook e renderizacao na View, evitando acoes conflitantes enquanto a remocao estiver em andamento.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/useBlockAudioControls.ts`
* **Mudanca:** Calcular `hasPersistedAudio = Boolean(item.audio?.fileName)` e `canRemove = hasPersistedAudio && status !== 'pending'`.
* **Justificativa:** A acao deve aparecer somente quando ha audio associado e nao ha geracao em andamento.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/BlockAudioControlsView.tsx`
* **Mudanca:** Adicionar props `canRemove` e `isRemoving`; renderizar botao `Remover audio` somente quando `canRemove`, trocando o label para `Removendo...` e exibindo loading enquanto `isRemoving` for verdadeiro.
* **Justificativa:** Expor a acao manual junto aos controles de audio do card expandido com feedback visual imediato e previsivel durante a remocao.
* **Camada:** `ui`

# 7. O que deve ser removido?

Nao aplicavel.

# 8. Decisoes Tecnicas e Trade-offs

* **Decisao:** Criar rota dedicada `DELETE /lesson/text-blocks/star/:starId/audio/file` para remocao manual.
* **Alternativas consideradas:** Reutilizar `DELETE /lesson/text-blocks/star/:starId/audio` com comportamento condicional por status; usar rota generica de storage `DELETE /storage/files` combinada com `PUT /text-blocks`.
* **Motivo da escolha:** A rota atual de `DELETE /audio` ja significa cancelamento de geracao pendente; misturar semanticas aumentaria ambiguidade e risco de regressao.
* **Impactos / trade-offs:** Adiciona mais um endpoint, mas preserva contratos existentes e deixa claro que remocao manual nao substitui cancelamento.

* **Decisao:** Modelar audio removido como ausencia da propriedade `audio`, nao como `audio: null` ou `status: 'removed'`.
* **Alternativas consideradas:** Gravar `audio: null`; adicionar novo status `removed`; manter `audio` com `fileName: ''` e `status: 'idle'`.
* **Motivo da escolha:** `TextBlockDto.audio` ja e opcional e blocos sem audio ja sao validos na codebase.
* **Impactos / trade-offs:** Evita ampliar enum/status e reduz alteracoes no dominio; consumidores devem tratar ausencia de `audio` como sem audio.

* **Decisao:** Criar RPC `clear_text_block_audio` para remover a chave no JSONB.
* **Alternativas consideradas:** Reusar `update_text_block_audio` com `null`; regravar todos os blocos com `updateMany`.
* **Motivo da escolha:** A issue pede limpar a referencia do bloco e a codebase ja adotou atualizacao parcial por RPC para audio.
* **Impactos / trade-offs:** Exige migration e regeneracao de tipos, mas mantem consistencia e reduz risco de sobrescrever o array completo.

* **Decisao:** O use case de `lesson` deve publicar evento para o modulo `storage` remover o arquivo fisico.
* **Alternativas consideradas:** Injetar `FileStorageProvider` diretamente em `RemoveTextBlockAudioUseCase`; deixar o controller remover o arquivo de forma sincrona apos limpar o banco.
* **Motivo da escolha:** A remocao da referencia do audio e regra do dominio `lesson`, mas a exclusao fisica pertence ao modulo `storage`; evento + job preserva fronteiras e segue o padrao de jobs assíncronos ja usado em audio.
* **Impactos / trade-offs:** A resposta HTTP confirma a limpeza do bloco e o disparo do evento, nao a exclusao fisica imediata. Pode haver atraso ate o arquivo sumir do storage.

* **Decisao:** O job de `storage` deve fazer a remocao de arquivo de forma idempotente usando `findFile` antes de `removeFile`.
* **Alternativas consideradas:** Chamar `removeFile` diretamente e tratar erro do provider; mudar globalmente `SupabaseFileStorageProvider.removeFile` para ignorar arquivos ausentes.
* **Motivo da escolha:** A idempotencia e requisito deste fluxo, enquanto alterar o provider global mudaria semantica de outros consumidores.
* **Impactos / trade-offs:** Adiciona uma chamada de listagem antes da remocao, mas evita falhas quando o arquivo ja nao existe.

* **Decisao:** Sincronizar alteracoes locais do Studio antes de remover audio quando `hasChanges` for verdadeiro.
* **Alternativas consideradas:** Remover usando o indice local sem salvar antes; bloquear remocao quando houver alteracoes nao salvas.
* **Motivo da escolha:** As operacoes de audio usam `blockIndex`; salvar antes reduz risco de remover audio de um bloco diferente quando houve reordenacao/edicao local.
* **Impactos / trade-offs:** A acao de remover audio tambem pode persistir alteracoes pendentes do editor, seguindo a decisao ja adotada para geracao.

* **Decisao:** Manter um estado local de remocao por bloco no Studio ate que a resposta atualizada do server seja refletida em `textBlocks` e `baselineTextBlocks`.
* **Alternativas consideradas:** Encerrar o loading imediatamente apos o `DELETE`; depender de polling para desligar o loading; usar apenas o status retornado pelo hook de fetch.
* **Motivo da escolha:** A UI precisa impedir cliques repetidos e sinalizar claramente a transicao ate que o bloco realmente deixe de ter `audio` no estado local.
* **Impactos / trade-offs:** Adiciona estado client-side temporario (`removingAudioBlockIds`) e exige sobrescrever explicitamente `audio` na sincronizacao para evitar stale state quando o payload volta sem a chave.

# 9. Diagramas e Referencias

* **Fluxo de Dados:**

```text
Studio
  LessonStoryPage
    -> useLessonStoryPage.handleRemoveTextBlockAudio(blockId)
    -> syncTextBlocksBeforeAudioAction() se houver alteracoes locais
    -> setRemovingAudioBlockIds(blockId)
    -> LessonService.removeTextBlockAudio(starId, blockIndex)
    -> DELETE /lesson/text-blocks/star/:starId/audio/file { blockIndex }

Server
  TextBlocksRouter.removeTextBlockAudioRoute
    -> verifyAuthentication
    -> verifyGodAccount
    -> validate starId + body
    -> verifyStarExists
    -> RemoveTextBlockAudioController
    -> RemoveTextBlockAudioUseCase
    -> TextBlocksRepository.findAllByStar(starId)
    -> TextBlock.removeAudio()
    -> TextBlocksRepository.clearAudio(starId, blockIndex)
    -> Supabase RPC clear_text_block_audio
    -> Broker.publish(TextBlockAudioFileRemovedEvent) quando houver fileName
    -> 200 TextBlockDto[]

Storage background
  Inngest StorageFunctions
    -> RemoveTextBlockAudioFileJob
    -> SupabaseFileStorageProvider.findFile(audios/story, fileName)
    -> SupabaseFileStorageProvider.removeFile(audios/story, fileName) quando existir

Studio sync
  response.body
    -> setBaselineTextBlocks(response.body)
    -> setTextBlocks(toEditorItemsFromPersisted(current, response.body))
    -> toEditorItemsFromPersisted sobrescreve audio com o valor persistido retornado
    -> BlockAudioControls recebe item sem audio
    -> player/status/botao remover deixam de renderizar
    -> removingAudioBlockIds deixa de conter o bloco
```

* **Fluxo Cross-app:**

```text
apps/studio (consome)
  REST LessonService.removeTextBlockAudio(starId, blockIndex)
      |
      | HTTP DELETE /lesson/text-blocks/star/:starId/audio/file
      | Body: { blockIndex: number }
      | Response: TextBlockDto[]
      v
apps/server (expoe)
  Hono TextBlocksRouter -> RemoveTextBlockAudioController
      |
      | RPC clear_text_block_audio + Inngest event
      v
Supabase Postgres
      |
      | event lesson/text-block.audio-file.removed
      v
apps/server queue/storage (consome)
  RemoveTextBlockAudioFileJob -> Supabase Storage audios/story
```

* **Layout:**

```text
TextBlockCard (expanded)
  Content field
  BlockAudioControls
    BlockVoiceSelector
    [Gerar audio]
    [Cancelar]         apenas pending
    [Remover audio]    apenas audio.fileName && status !== pending
    [Removendo...]     enquanto a requisicao estiver em andamento para o bloco
    Status badge       pending/error/cancelled
    BlockAudioPlayer   done && fileName && arquivo existe
  Picture/Runnable fields
```

* **Referencias:**

* `documentation/features/lesson/text-blocks-audio-generation/jobs-for-text-blocks-audio-generation-spec.md`
* `documentation/features/lesson/text-blocks-audio-generation/text-blocks-audio-ui-control-spec.md`
* `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`
* `apps/server/src/rest/controllers/lesson/CancelTextBlockAudioGenerationController.ts`
* `apps/server/src/rest/controllers/storage/RemoveFileController.ts`
* `apps/server/src/database/supabase/repositories/lesson/SupabaseTextBlocksRepository.ts`
* `apps/server/supabase/migrations/20260514120000_create_update_text_block_audio_function.sql`
* `apps/server/src/provision/storage/SupabaseFileStorageProvider.ts`
* `apps/server/src/queue/jobs/storage/GenerateTextBlockAudioJob.ts`
* `packages/core/src/lesson/use-cases/TriggerTextBlockAudioGenerationUseCase.ts`
* `packages/core/src/lesson/use-cases/CancelTextBlockAudioGenerationUseCase.ts`
* `packages/core/src/lesson/domain/structures/TextBlock.ts`
* `packages/core/src/lesson/interfaces/TextBlocksRepository.ts`
* `packages/core/src/lesson/interfaces/LessonService.ts`
* `packages/validation/src/modules/lesson/schemas/requestTextBlockAudioGenerationSchema.ts`
* `apps/studio/src/ui/lesson/widgets/pages/LessonStory/useLessonStoryPage.ts`
* `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/useBlockAudioControls.ts`
* `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/BlockAudioControlsView.tsx`
* `apps/studio/src/rest/services/LessonService.ts`

# 10. Pendencias / Duvidas

* **Descricao da pendencia:** O job de storage pode falhar apos o endpoint ja ter limpado a referencia do bloco e retornado sucesso.
* **Impacto na implementacao:** Pode sobrar arquivo orfao em `audios/story`, embora o bloco deixe de apontar para ele.
* **Acao sugerida:** Usar retentativas padrao do Inngest e monitorar falhas; se houver recorrencia, criar rotina operacional de limpeza de orfaos em spec futura.
