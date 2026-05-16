---
title: Endpoints e jobs de geração de áudio nos blocos de texto
prd: https://github.com/JohnPetros/stardust/milestone/31
issue: https://github.com/JohnPetros/stardust/issues/409
apps: server
status: closed
last_updated_at: 2026-05-15
---

# 1. Objetivo

Implementar, no backend, o disparo assíncrono de geração de áudio para blocos de texto de uma estrela, contemplando endpoint individual, endpoint em lote, eventos, jobs Inngest, cancelamento via endpoints REST e persistência do estado de áudio em `stars.texts[blockIndex].audio`. A entrega deve marcar blocos como `pending` antes de enfileirar a geração, processar áudio em background, permitir cancelamento cooperativo individual e em lote e persistir `done`, `error` ou `cancelled` ao final do fluxo, sem alterar a Lesson Page do aluno nem implementar a UI/polling do Studio nesta spec.

# 2. Escopo

## 2.1 In-scope

* Criar endpoint REST para solicitar geração de áudio de um bloco específico.
* Criar endpoint REST para solicitar geração em lote dos blocos elegíveis de uma estrela.
* Criar eventos de domínio para requisição individual e fan-out em lote.
* Criar use cases no domínio `lesson` para marcar áudio como `pending` e publicar eventos.
* Criar método de repositório para atualizar somente `stars.texts[blockIndex].audio`.
* Criar migration para função SQL de atualização parcial do JSONB com `jsonb_set`.
* Criar jobs Inngest para fan-out em lote, geração individual de arquivo de áudio e atualização do bloco após geração.
* Criar evento e job de cancelamento da geração de áudio por bloco.
* Criar endpoint REST para cancelar a geração pendente de um bloco específico.
* Criar endpoint REST para cancelar em lote todas as gerações pendentes de uma estrela.
* Registrar schemas de eventos Inngest e funções Inngest de `lesson` e `storage`.
* Persistir `status: done` com `fileName` quando o áudio for gerado e enviado ao storage.
* Persistir `status: error` quando a função Inngest falhar após retentativas.
* Persistir `status: cancelled` quando a operação de geração for cancelada por evento antes da conclusão.
* Preservar `audio` ao criar/serializar `TextBlock` no core.

## 2.2 Out-of-scope

* UI do Studio para botão individual, botão em lote, seletor de voz, player e polling.
* Reprodução de áudio na Lesson Page do app `web`.
* Cadastro, edição ou remoção de vozes pelo operador.
* Remoção manual de arquivos de áudio antigos após regeneração.
* Geração automática de áudio ao salvar blocos.
* Ajuste manual, edição ou pós-processamento do arquivo de áudio.
* Seleção em runtime ou exposição de UI para alternar entre providers TTS alternativos ao `OpenAITtsProvider`.

# 3. Requisitos

## 3.1 Funcionais

* O operador autenticado e autorizado como god account deve poder disparar geração de áudio para um bloco elegível específico de uma estrela.
* O operador autenticado e autorizado como god account deve poder disparar geração em lote para todos os blocos elegíveis de uma estrela.
* Apenas blocos `default`, `alert` e `quote` devem ser elegíveis para áudio.
* Blocos `user`, `code`, `image`, `list` e `code-line` não devem ter áudio gerado nesta entrega.
* O endpoint individual deve aceitar regeneração de blocos com `audio.status` igual a `done` ou `error`.
* O endpoint individual deve rejeitar a requisição quando o bloco já estiver com `audio.status` igual a `pending`.
* O endpoint em lote deve ignorar blocos que já estejam com `audio.status` igual a `pending`.
* O endpoint em lote deve usar a voz já configurada em cada bloco; quando não houver voz persistida no bloco, deve usar o default de `AudioVoice.create()`.
* A resposta dos endpoints deve ser imediata e retornar os blocos atualizados após marcação local como `pending`.
* A geração real do áudio deve ocorrer em background via Inngest.
* Deve ser possível cancelar uma geração individual pendente via endpoint REST, que publicará um evento de cancelamento para o bloco.
* Deve ser possível cancelar em lote todas as gerações pendentes de uma estrela via endpoint REST, por fan-out de eventos individuais de cancelamento, um por `blockIndex` pendente.
* Ao concluir a geração individual do arquivo, o sistema deve publicar um evento `TextBlockAudioGenerated`.
* Um job separado do módulo `lesson` deve consumir `TextBlockAudioGenerated` e persistir `audio.status = 'done'`, `audio.fileName` e a `voice` usada.
* Ao falhar após retentativas, a função Inngest deve persistir `audio.status = 'error'` preservando a voz do payload.
* Quando um bloco estiver com `audio.status = 'cancelled'`, jobs de geração e atualização não devem voltar o estado para `done` nem `error`.

## 3.2 Não funcionais

* Segurança: os endpoints REST devem usar `verifyAuthentication`, `verifyGodAccount` e `verifyStarExists`, mantendo autenticação/autorização na borda da app.
* Resiliência: a função individual do Inngest deve usar `retries: 2` e `onFailure` para marcar o bloco como `error`.
* Concorrência: a função individual deve limitar concorrência por `starId` com `limit: 3` para reduzir disputa de atualização em `stars.texts`.
* Idempotência operacional: a atualização de áudio deve ser parcial por `blockIndex` via `jsonb_set`, evitando regravar o array inteiro de blocos.
* Compatibilidade retroativa: blocos sem `audio` devem continuar válidos e devem assumir voz default quando entrarem em geração em lote.
* Eficiência operacional: a função Inngest individual deve usar `cancelOn` para reagir a `TextBlockAudioGenerationCancelledEvent` do mesmo `starId` e `blockIndex`, reduzindo processamento desnecessário entre steps.
* Consistência assíncrona: o cancelamento deve ser cooperativo; como o Inngest não interrompe um `step.run` já em execução, os jobs devem reler o estado após steps longos e encerrar sem sobrescrever `cancelled` antes de publicar ou persistir sucesso/erro.

# 4. O que já existe?

## Camada Hono App

* **`TextBlocksRouter`** (`apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`) - Router atual de `/lesson/text-blocks`, já contém `GET /star/:starId` e `PUT /star/:starId` com middlewares de autenticação, validação e `verifyStarExists`.
* **`LessonRouter`** (`apps/server/src/app/hono/routers/lesson/LessonRouter.ts`) - Registra `TextBlocksRouter` sob `/lesson`.
* **`AuthMiddleware`** (`apps/server/src/app/hono/middlewares/AuthMiddleware.ts`) - Expõe `verifyAuthentication` e `verifyGodAccount`, que devem proteger os novos endpoints.
* **`SpaceMiddleware`** (`apps/server/src/app/hono/middlewares/SpaceMiddleware.ts`) - Expõe `verifyStarExists`, já usado nas rotas de blocos.
* **`ValidationMiddleware`** (`apps/server/src/app/hono/middlewares/ValidationMiddleware.ts`) - Valida `param`, `json` e `query` com Zod via `@hono/zod-validator`.

## Camada REST (Controllers)

* **`FetchTextBlocksController`** (`apps/server/src/rest/controllers/lesson/FetchTextBlocksController.ts`) - Busca blocos por `starId` usando `TextBlocksRepository.findAllByStar` e retorna `textBlock.dto`.
* **`UpdateTextBlocksController`** (`apps/server/src/rest/controllers/lesson/UpdateTextBlocksController.ts`) - Atualiza todos os blocos via `UpdateTextBlocksUseCase`.
* **`lesson controllers barrel`** (`apps/server/src/rest/controllers/lesson/index.ts`) - Exporta controllers REST do domínio `lesson`.

## Camada Core (Use Cases)

* **`UpdateTextBlocksUseCase`** (`packages/core/src/lesson/use-cases/UpdateTextBlocksUseCase.ts`) - Substitui todos os blocos de texto de uma estrela com `repository.updateMany`.

## Camada Core (Structures)

* **`TextBlock`** (`packages/core/src/lesson/domain/structures/TextBlock.ts`) - Structure de bloco; já declara `audio?: TextBlockAudio`, mas atualmente não atribui `audio` no construtor, não lê `dto.audio` e não serializa `audio` no getter `dto`.
* **`TextBlockAudio`** (`packages/core/src/lesson/domain/structures/TextBlockAudio.ts`) - Structure de áudio com `createAsPending(voice)`, `markAsDone(fileName)`, `markAsError()`, `isPending`, `isDone` e `dto`.
* **`AudioVoice`** (`packages/core/src/lesson/domain/structures/AudioVoice.ts`) - Structure de voz com valores `panda`, `shark` e `princess`; usa `panda` como default quando nenhum valor é informado.
* **`FileStorageFolderPath`** (`packages/core/src/storage/domain/structures/FileStorageFolderPath.ts`) - Já possui `createAsAudiosStory()` para a pasta `audios/story`.

## Camada Core (Events e Queue)

* **`Event`** (`packages/core/src/global/domain/abstracts/Event.ts`) - Classe base usada pelos eventos de domínio.
* **`Broker`** (`packages/core/src/global/interfaces/Broker.ts`) - Interface `publish(event: Event): Promise<void>`, já usada por use cases que publicam eventos.
* **`Job`** (`packages/core/src/global/interfaces/queue/Job.ts`) - Interface base para jobs agnósticos de Inngest.
* **`Amqp`** (`packages/core/src/global/interfaces/queue/Amqp.ts`) - Interface usada por jobs para `getPayload`, `run`, `waitFor` e `sleepFor`.

## Camada Core (Interfaces)

* **`TextBlocksRepository`** (`packages/core/src/lesson/interfaces/TextBlocksRepository.ts`) - Define `findAllByStar(starId: Id)` e `updateMany(textBlocks, starId)`, mas ainda não define atualização parcial de áudio.
* **`TtsProvider`** (`packages/core/src/lesson/interfaces/TtsProvider.ts`) - Define `generate(text: Text, voice: AudioVoice): Promise<File>`, mas não é exportado pelo barrel de interfaces e importa o `Text` de entidade, não a structure de texto simples.
* **`FileStorageProvider`** (`packages/core/src/storage/interfaces/FileStorageProvider.ts`) - Define `upload(folder, file)`, `findFile`, `listFiles` e `removeFile`.

## Camada Banco de Dados

* **`SupabaseTextBlocksRepository`** (`apps/server/src/database/supabase/repositories/lesson/SupabaseTextBlocksRepository.ts`) - Lê e regrava `stars.texts`; ainda não atualiza `texts[blockIndex].audio` parcialmente.
* **`SupabaseTextBlockMapper`** (`apps/server/src/database/supabase/mappers/lesson/SupabaseTextBlockMapper.ts`) - Converte DB shape para `TextBlock` e `TextBlock` para DTO usando `TextBlock.create` e `textBlock.dto`.
* **`Database`** (`apps/server/src/database/supabase/types/Database.ts`) - Tipos gerados do Supabase; a tabela `stars` já contém `texts: Json | null`.

## Camada Queue / Inngest

* **`inngest`** (`apps/server/src/queue/inngest/inngest.ts`) - Centraliza `eventsSchema` Zod para eventos Inngest.
* **`InngestBroker`** (`apps/server/src/queue/inngest/InngestBroker.ts`) - Implementa `Broker` publicando `event.name` e `event.payload` no Inngest.
* **`InngestAmqp`** (`apps/server/src/queue/inngest/InngestAmqp.ts`) - Adapta o contexto do Inngest para a interface `Amqp`.
* **`StorageFunctions`** (`apps/server/src/queue/inngest/functions/StorageFunctions.ts`) - Referência de composition root com `createFunction`, `onFailure`, providers e job do módulo `storage`.
* **`GenerateGuideEmbeddingsJob`** (`apps/server/src/queue/jobs/storage/GenerateGuideEmbeddingsJob.ts`) - Referência de job que lê payload com `amqp.getPayload()` e executa use case dentro de `amqp.run`.
* **`HonoApp`** (`apps/server/src/app/hono/HonoApp.ts`) - Registra as funções Inngest em `/inngest`; ainda não registra funções de `lesson`.

## Camada Provision (Providers)

* **`SupabaseFileStorageProvider`** (`apps/server/src/provision/storage/SupabaseFileStorageProvider.ts`) - Implementa `FileStorageProvider` e faz upload para bucket `stardust-bucket`, usando `${folder.value}/${file.name}`.
* **`GoogleDriveStorageProvider`** (`apps/server/src/provision/storage/GoogleDriveStorageProvider.ts`) - Implementa parcialmente `FileStorageProvider`; possui entrada `audios/story`, mas não deve ser usado nesta spec.

## Pacote Validation

* **`textBlockSchema`** (`packages/validation/src/modules/lesson/schemas/textBlockSchema.ts`) - Valida blocos de texto atuais; não valida áudio nem payloads de geração.
* **`idSchema`** (`packages/validation/src/modules/global/schemas/idSchema.ts`) - Schema UUID reutilizado em params.
* **`stringSchema`** (`packages/validation/src/modules/global/schemas/stringSchema.ts`) - Schema base de string reutilizável.
* **`lesson schemas barrel`** (`packages/validation/src/modules/lesson/schemas/index.ts`) - Exporta schemas públicos do módulo `lesson`.

# 5. O que deve ser criado?

## Camada Core (Use Cases)

* **Localização:** `packages/core/src/lesson/use-cases/TriggerTextBlockAudioGenerationUseCase.ts` (**novo arquivo**)
* **Dependências:** `TextBlocksRepository`, `Broker`.
* **Dados de request:** `starId: string`, `blockIndex: number`, `voice: string`.
* **Dados de response:** `TextBlockDto[]` com o bloco alvo marcado como `audio.status = 'pending'`.
* **Métodos:** `execute(request: { starId: string; blockIndex: number; voice: string }): Promise<TextBlockDto[]>` — valida o índice, verifica elegibilidade do bloco, marca o áudio como pending, persiste a atualização parcial e publica `TextBlockAudioGenerationRequestedEvent` com `starId`, `blockIndex`, `content` e `voice`.

* **Localização:** `packages/core/src/lesson/use-cases/TriggerTextBlocksAudioGenerationInBatchUseCase.ts` (**novo arquivo**)
* **Dependências:** `TextBlocksRepository`, `Broker`.
* **Dados de request:** `starId: string`.
* **Dados de response:** `TextBlockDto[]` com os blocos elegíveis e não-pending marcados como `audio.status = 'pending'`.
* **Métodos:** `execute(request: { starId: string }): Promise<TextBlockDto[]>` — busca blocos da estrela, seleciona `default`, `alert` e `quote`, ignora blocos já `pending`, usa a voz persistida por bloco ou o default de `AudioVoice.create()`, persiste cada áudio como pending e publica `TextBlocksAudioGenerationInBatchRequestedEvent` com os blocos selecionados.

* **Localização:** `packages/core/src/lesson/use-cases/CancelTextBlockAudioGenerationUseCase.ts` (**novo arquivo**)
* **Dependências:** `TextBlocksRepository`, `Broker`.
* **Dados de request:** `starId: string`, `blockIndex: number`.
* **Dados de response:** `TextBlockDto[]` com o bloco pendente preservado até o worker de cancelamento consumir o evento.
* **Métodos:** `execute(request: { starId: string; blockIndex: number }): Promise<TextBlockDto[]>` — valida o índice, exige que o bloco esteja `pending`, publica `TextBlockAudioGenerationCancelledEvent` para o `blockIndex` e retorna os blocos atuais.

* **Localização:** `packages/core/src/lesson/use-cases/CancelTextBlocksAudioGenerationInBatchUseCase.ts` (**novo arquivo**)
* **Dependências:** `TextBlocksRepository`, `Broker`.
* **Dados de request:** `starId: string`.
* **Dados de response:** `TextBlockDto[]` com os blocos atuais da estrela.
* **Métodos:** `execute(request: { starId: string }): Promise<TextBlockDto[]>` — busca os blocos da estrela, seleciona os que estiverem `pending`, publica um `TextBlockAudioGenerationCancelledEvent` por `blockIndex` pendente e retorna os blocos atuais.

## Camada Core (Events)

* **Localização:** `packages/core/src/lesson/domain/events/TextBlockAudioGenerationRequestedEvent.ts` (**novo arquivo**)
* **Dependências:** `Event`.
* **Dados de request:** `starId: string`, `blockIndex: number`, `content: string`, `voice: string`.
* **Dados de response:** Não aplicável.
* **Métodos:** `constructor(payload: { starId: string; blockIndex: number; content: string; voice: string })` — cria evento individual com `_NAME = 'lesson/text-block.audio.generation.requested'`.

* **Localização:** `packages/core/src/lesson/domain/events/TextBlocksAudioGenerationInBatchRequestedEvent.ts` (**novo arquivo**)
* **Dependências:** `Event`.
* **Dados de request:** `starId: string`, `blocks: Array<{ blockIndex: number; content: string; voice: string }>`.
* **Dados de response:** Não aplicável.
* **Métodos:** `constructor(payload: { starId: string; blocks: Array<{ blockIndex: number; content: string; voice: string }> })` — cria evento de lote com `_NAME = 'lesson/text-blocks.audio-generation-in-batch.requested'`.

* **Localização:** `packages/core/src/lesson/domain/events/TextBlockAudioGeneratedEvent.ts` (**novo arquivo**)
* **Dependências:** `Event`.
* **Dados de request:** `starId: string`, `blockIndex: number`, `voice: string`, `fileName: string`.
* **Dados de response:** Não aplicável.
* **Métodos:** `constructor(payload: { starId: string; blockIndex: number; voice: string; fileName: string })` — cria evento de áudio gerado com `_NAME = 'lesson/text-block.audio.generated'`.

* **Localização:** `packages/core/src/lesson/domain/events/TextBlockAudioGenerationCancelledEvent.ts` (**novo arquivo**)
* **Dependências:** `Event`.
* **Dados de request:** `starId: string`, `blockIndex: number`.
* **Dados de response:** Não aplicável.
* **Métodos:** `constructor(payload: { starId: string; blockIndex: number })` — cria evento de cancelamento com `_NAME = 'lesson/text-block.audio.generation.cancelled'`.

* **Localização:** `packages/core/src/lesson/domain/events/index.ts` (**novo arquivo**)
* **Dependências:** Eventos do módulo `lesson`.
* **Dados de request:** Não aplicável.
* **Dados de response:** Não aplicável.
* **Métodos:** Não aplicável; barrel exportando os quatro eventos.

## Camada Core (Errors)

* **Localização:** `packages/core/src/lesson/domain/errors/TextBlockNotFoundError.ts` (**novo arquivo**)
* **Dependências:** `NotFoundError`.
* **Métodos:** `constructor()` — representa índice de bloco inexistente para a estrela informada.

* **Localização:** `packages/core/src/lesson/domain/errors/TextBlockAudioNotAllowedError.ts` (**novo arquivo**)
* **Dependências:** `NotAllowedError`.
* **Métodos:** `constructor(type: string)` — representa tentativa de gerar áudio para tipo de bloco não elegível.

* **Localização:** `packages/core/src/lesson/domain/errors/TextBlockAudioGenerationNotPendingError.ts` (**novo arquivo**)
* **Dependências:** `NotAllowedError`.
* **Métodos:** `constructor(status: string)` — representa tentativa de cancelar ou rejeitar operação quando o estado atual não permite a transição esperada.

## Camada REST (Controllers)

* **Localização:** `apps/server/src/rest/controllers/lesson/TriggerTextBlockAudioGenerationController.ts` (**novo arquivo**)
* **Dependências:** `TextBlocksRepository`, `Broker`.
* **Dados de request:** route param `starId`; body `{ blockIndex: number; voice: string }`.
* **Dados de response:** `TextBlockDto[]`.
* **Métodos:** `handle(http: Http<Schema>): Promise<RestResponse>` — lê params/body, executa `TriggerTextBlockAudioGenerationUseCase` e retorna `http.send(response, 202)`.

* **Localização:** `apps/server/src/rest/controllers/lesson/TriggerTextBlocksAudioGenerationInBatchController.ts` (**novo arquivo**)
* **Dependências:** `TextBlocksRepository`, `Broker`.
* **Dados de request:** route param `starId`; sem body obrigatório.
* **Dados de response:** `TextBlockDto[]`.
* **Métodos:** `handle(http: Http<Schema>): Promise<RestResponse>` — lê `starId`, executa `TriggerTextBlocksAudioGenerationInBatchUseCase` e retorna `http.send(response, 202)`.

* **Localização:** `apps/server/src/rest/controllers/lesson/CancelTextBlockAudioGenerationController.ts` (**novo arquivo**)
* **Dependências:** `TextBlocksRepository`, `Broker`.
* **Dados de request:** route param `starId`; body `{ blockIndex: number }`.
* **Dados de response:** `TextBlockDto[]`.
* **Métodos:** `handle(http: Http<Schema>): Promise<RestResponse>` — lê params/body, executa `CancelTextBlockAudioGenerationUseCase` e retorna `http.send(response, 202)`.

* **Localização:** `apps/server/src/rest/controllers/lesson/CancelTextBlocksAudioGenerationInBatchController.ts` (**novo arquivo**)
* **Dependências:** `TextBlocksRepository`, `Broker`.
* **Dados de request:** route param `starId`; sem body obrigatório.
* **Dados de response:** `TextBlockDto[]`.
* **Métodos:** `handle(http: Http<Schema>): Promise<RestResponse>` — lê `starId`, executa `CancelTextBlocksAudioGenerationInBatchUseCase` e retorna `http.send(response, 202)`.

## Camada Banco de Dados (Repositories)

* **Localização:** `packages/core/src/lesson/interfaces/TextBlocksRepository.ts`
* **Dependências:** `Id`, `Integer`, `TextBlock`, `TextBlockAudio`.
* **Métodos:** `updateAudio(starId: Id, blockIndex: Integer, audio: TextBlockAudio): Promise<void>` — contrato para atualizar somente o áudio de um bloco da estrela sem regravar todos os blocos.

* **Localização:** `apps/server/src/database/supabase/repositories/lesson/SupabaseTextBlocksRepository.ts`
* **Dependências:** `SupabaseClient<Database>`, `SupabaseTextBlockMapper`, função RPC `update_text_block_audio`.
* **Métodos:** `updateAudio(starId: Id, blockIndex: Integer, audio: TextBlockAudio): Promise<void>` — chama RPC `update_text_block_audio` com `p_star_id`, `p_block_index` e `p_audio`, convertendo `audio.dto` para JSONB.

## Camada Banco de Dados (Migrations)

* **Localização:** `apps/server/supabase/migrations/<timestamp>_create_update_text_block_audio_function.sql` (**novo arquivo**)
* **Objetivo:** Criar função SQL para atualizar `stars.texts[blockIndex].audio` atomicamente com `jsonb_set`.
* **Escopo SQL:** Criar `public.update_text_block_audio(p_star_id uuid, p_block_index integer, p_audio jsonb) returns void`; validar `p_block_index >= 0`; atualizar `public.stars` com `texts = jsonb_set(texts, ARRAY[p_block_index::text, 'audio'], p_audio, true)`; restringir o `where` para `id = p_star_id`, `texts is not null`, `jsonb_typeof(texts) = 'array'` e `p_block_index < jsonb_array_length(texts)`; lançar exceção quando nenhuma linha for atualizada.
* **Segurança:** Não haverá nova tabela nem nova política RLS. A função deve receber `grant execute` para `service_role`, pois o fluxo usará a service role do server.
* **Dependências de código:** Regenerar `apps/server/src/database/supabase/types/Database.ts`; atualizar `SupabaseTextBlocksRepository.updateAudio`; manter mapeamento via `TextBlockAudio.dto`.

## Camada Banco de Dados (Mappers)

* **Localização:** `apps/server/src/database/supabase/mappers/lesson/SupabaseTextBlockMapper.ts`
* **Métodos:** `toSupabase(textBlock: TextBlock): TextBlockDto` — deve retornar `audio` quando existir, após ajuste em `TextBlock.dto`; `toEntity(supabaseTextBlock: TextBlockDto): TextBlock` — deve continuar delegando para `TextBlock.create`, que passará a preservar `audio`.

## Camada Banco de Dados (Types)

* **Localização:** `apps/server/src/database/supabase/types/Database.ts`
* **props:** Adicionar a função gerada `update_text_block_audio` em `Database['public']['Functions']` com args `p_star_id: string`, `p_block_index: number`, `p_audio: Json` e retorno `undefined`/`void`, conforme saída do Supabase CLI.

## Camada Provision (Providers)

* **Localização:** `apps/server/src/provision/tts/open-ai/OpenAITtsProvider.ts` (**novo arquivo**)
* **Dependências:** contrato `TtsProvider`; structures `Text` e `AudioVoice`; `ENV.openaiApiKey`.
* **Biblioteca:** API HTTP da OpenAI.
* **Métodos:** `generate(text: Text, voice: AudioVoice): Promise<File>` — gera arquivo de áudio para o conteúdo informado pela API `POST /v1/audio/speech`, aplica mapeamento de personagem para `voice` e `instructions` e retorna `File` `.wav` com `name` final a ser persistido em `TextBlockAudio.fileName`.

* **Localização:** `apps/server/src/provision/tts/index.ts` (**novo arquivo**)
* **Dependências:** `OpenAITtsProvider` e demais providers TTS mantidos em subpastas próprias.
* **Biblioteca:** Não aplicável.
* **Métodos:** Não aplicável; barrel exportando providers TTS. Cada implementação concreta deve viver em sua própria subpasta sob `apps/server/src/provision/tts/`.

## Pacote Validation (Schemas)

* **Localização:** `packages/validation/src/modules/lesson/schemas/audioVoiceSchema.ts` (**novo arquivo**)
* **Atributos:** `voice` como enum `panda | shark | princess`, com mensagem de erro em PT-BR.

* **Localização:** `packages/validation/src/modules/lesson/schemas/requestTextBlockAudioGenerationSchema.ts` (**novo arquivo**)
* **Atributos:** `blockIndex: z.number().int().min(0)`, `voice: audioVoiceSchema`.

## Camada Queue (Jobs)

* **Localização:** `apps/server/src/queue/jobs/lesson/GenerateTextBlocksAudioBatchJob.ts` (**novo arquivo**)
* **Dependências:** `Broker`.
* **Entrada/Saída:** Entrada via `TextBlocksAudioGenerationInBatchRequestedEvent`; saída são N publicações de `TextBlockAudioGenerationRequestedEvent`.
* **Métodos:** `handle(amqp: Amqp<EventPayload<typeof TextBlocksAudioGenerationInBatchRequestedEvent>>): Promise<void>` — lê `blocks` do payload e publica um evento individual por bloco.

* **Localização:** `apps/server/src/queue/jobs/lesson/UpdateTextBlockAudioJob.ts` (**novo arquivo**)
* **Dependências:** `TextBlocksRepository`.
* **Entrada/Saída:** Entrada via `TextBlockAudioGeneratedEvent`; saída persistida em `TextBlocksRepository.updateAudio`.
* **Métodos:** `handle(amqp: Amqp<EventPayload<typeof TextBlockAudioGeneratedEvent>>): Promise<void>` — recarrega o bloco alvo, encerra sem efeito quando o estado já estiver `cancelled`, cria `TextBlockAudio` com a `voice` do payload, marca como `done` com `fileName` e persiste o áudio do bloco pelo `blockIndex`.

* **Localização:** `apps/server/src/queue/jobs/lesson/CancelTextBlockAudioGenerationJob.ts` (**novo arquivo**)
* **Dependências:** `TextBlocksRepository`.
* **Entrada/Saída:** Entrada via `TextBlockAudioGenerationCancelledEvent`; saída persistida em `TextBlocksRepository.updateAudio`.
* **Métodos:** `handle(amqp: Amqp<EventPayload<typeof TextBlockAudioGenerationCancelledEvent>>): Promise<void>` — recarrega o bloco alvo, marca o áudio como `cancelled` quando ainda estiver `pending` e encerra sem efeito quando o bloco já não puder ser cancelado.

* **Localização:** `apps/server/src/queue/jobs/lesson/index.ts` (**novo arquivo**)
* **Dependências:** Jobs de `lesson`.
* **Entrada/Saída:** Não aplicável.
* **Métodos:** Não aplicável; barrel exportando jobs, incluindo cancelamento.

* **Localização:** `apps/server/src/queue/jobs/storage/GenerateTextBlockAudioJob.ts` (**novo arquivo**)
* **Dependências:** `TtsProvider`, `FileStorageProvider`, `Broker`.
* **Entrada/Saída:** Entrada via `TextBlockAudioGenerationRequestedEvent`; saída é upload em storage e publicação de `TextBlockAudioGeneratedEvent`.
* **Métodos:** `handle(amqp: Amqp<EventPayload<typeof TextBlockAudioGenerationRequestedEvent>>): Promise<void>` — recarrega o bloco alvo antes de gerar, encerra sem efeito quando o estado já estiver `cancelled`, executa geração e upload em `step.run`s, recarrega novamente após esses steps longos e só então publica `TextBlockAudioGeneratedEvent` com `starId`, `blockIndex`, `voice` e `fileName`; se o cancelamento chegar durante um `step.run`, o job deixa o step atual terminar e encerra antes do próximo efeito observável.

## Camada Inngest App (Functions)

* **Localização:** `apps/server/src/queue/inngest/functions/LessonFunctions.ts` (**novo arquivo**)
* **Métodos:** `getFunctions(supabase: SupabaseClient<Database>): ReturnType<Inngest['createFunction']>[]` — retorna funções de fan-out em lote, cancelamento, atualização pós-geração e marcação de erro; `createGenerateTextBlocksAudioBatchJob()` — cria função de fan-out do lote; `createCancelTextBlockAudioGenerationJob(supabase)` — cria função que consome `TextBlockAudioGenerationCancelledEvent`; `createUpdateTextBlockAudioJob(supabase)` — cria função que consome `TextBlockAudioGeneratedEvent`; `createMarkTextBlockAudioAsErrorFunction(supabase)` — cria handler de falha para o evento individual e persiste `audio.status = 'error'` somente quando o bloco não estiver `cancelled`.

* **Localização:** `apps/server/src/queue/inngest/functions/StorageFunctions.ts`
* **Métodos:** `createGenerateTextBlockAudioJob()` — adicionar função do módulo `storage` que consome `TextBlockAudioGenerationRequestedEvent`, usa `retries: 2`, `concurrency: { limit: 3, key: 'event.data.starId' }`, `cancelOn` para `TextBlockAudioGenerationCancelledEvent` do mesmo `starId` e `blockIndex`, e publica `TextBlockAudioGeneratedEvent` quando o upload concluir; como `cancelOn` não interrompe `step.run` em andamento, a função deve reler o estado após steps longos antes de seguir.

## Camada Hono App (Routes)

* **Localização:** `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`
* **Middlewares:** `verifyAuthentication`, `verifyGodAccount`, validação de `starId` com `idSchema`, `verifyStarExists`; endpoint individual também valida body com `requestTextBlockAudioGenerationSchema`.
* **Caminho da rota:** `POST /lesson/text-blocks/star/:starId/audio`.
* **Dados de schema:** `z.object({ starId: idSchema })` para params e `requestTextBlockAudioGenerationSchema` para body.
* **Resposta esperada:** `202 Accepted` com `TextBlockDto[]` atualizado para refletir `pending`.

* **Localização:** `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`
* **Middlewares:** `verifyAuthentication`, `verifyGodAccount`, validação de `starId` com `idSchema`, `verifyStarExists`.
* **Caminho da rota:** `POST /lesson/text-blocks/star/:starId/audio/batch`.
* **Dados de schema:** `z.object({ starId: idSchema })` para params; sem body obrigatório.
* **Resposta esperada:** `202 Accepted` com `TextBlockDto[]` atualizado para refletir `pending`.

* **Localização:** `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`
* **Middlewares:** `verifyAuthentication`, `verifyGodAccount`, validação de `starId` com `idSchema`, `verifyStarExists`; validação de body com `z.object({ blockIndex: z.number().int().min(0) })` ou schema compartilhado dedicado.
* **Caminho da rota:** `DELETE /lesson/text-blocks/star/:starId/audio`.
* **Dados de schema:** `z.object({ starId: idSchema })` para params e body com `blockIndex`.
* **Resposta esperada:** `202 Accepted` com `TextBlockDto[]` atual da estrela.

* **Localização:** `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`
* **Middlewares:** `verifyAuthentication`, `verifyGodAccount`, validação de `starId` com `idSchema`, `verifyStarExists`.
* **Caminho da rota:** `DELETE /lesson/text-blocks/star/:starId/audio/batch`.
* **Dados de schema:** `z.object({ starId: idSchema })` para params; sem body obrigatório.
* **Resposta esperada:** `202 Accepted` com `TextBlockDto[]` atual da estrela.

# 6. O que deve ser modificado?

## Camada Core (Structures)

* **Arquivo:** `packages/core/src/lesson/domain/structures/TextBlock.ts`
* **Mudança:** Adicionar `audio?: TextBlockAudio` em `TextBlockProps`, atribuir `props.audio` no construtor, criar `TextBlockAudio.create(dto.audio)` em `create`, retornar `audio: this.audio?.dto` no getter `dto`, preservar `audio` em `clone` e adicionar `setAudio(audio: TextBlockAudio): TextBlock`.
* **Justificativa:** O campo `audio` já existe no DTO e na classe, mas é descartado no fluxo atual; sem esse ajuste, GET/PUT de blocos e jobs perderiam estado de áudio.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/lesson/domain/structures/TextBlockAudio.ts`
* **Mudança:** Adicionar status `cancelled`, método `markAsCancelled(): TextBlockAudio`, getter `isCancelled` e aceitar o novo status no parse/DTO.
* **Justificativa:** O fluxo novo exige cancelamento por evento sem sobrescrever posteriormente para `done` ou `error`.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/lesson/domain/structures/index.ts`
* **Mudança:** Exportar `TextBlock`, `TextBlockAudio` e `AudioVoice`.
* **Justificativa:** Permitir consumo por use cases, jobs e adapters via barrels públicos do pacote.
* **Camada:** `core`

## Camada Core (Interfaces)

* **Arquivo:** `packages/core/src/lesson/interfaces/TextBlocksRepository.ts`
* **Mudança:** Adicionar `updateAudio(starId: Id, blockIndex: Integer, audio: TextBlockAudio): Promise<void>`.
* **Justificativa:** O job e os use cases precisam persistir apenas o áudio do bloco sem regravar `stars.texts` inteiro.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/lesson/interfaces/TtsProvider.ts`
* **Mudança:** Trocar import de `Text` para `#global/domain/structures/Text` mantendo `generate(text: Text, voice: AudioVoice): Promise<File>`.
* **Justificativa:** TTS recebe conteúdo textual simples; a entidade `Text` global exige DTO com tipo/id e não corresponde ao uso esperado do provider.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/lesson/interfaces/index.ts`
* **Mudança:** Exportar `TtsProvider`.
* **Justificativa:** O provider concreto do server deve implementar contrato público do core.
* **Camada:** `core`

## Camada Core (Use Cases)

* **Arquivo:** `packages/core/src/lesson/use-cases/index.ts`
* **Mudança:** Exportar `TriggerTextBlockAudioGenerationUseCase`, `TriggerTextBlocksAudioGenerationInBatchUseCase`, `CancelTextBlockAudioGenerationUseCase` e `CancelTextBlocksAudioGenerationInBatchUseCase`.
* **Justificativa:** Controllers REST devem importar use cases pelo barrel de `@stardust/core/lesson/use-cases`.
* **Camada:** `core`

## Camada Core (Errors)

* **Arquivo:** `packages/core/src/lesson/domain/errors/index.ts`
* **Mudança:** Exportar `TextBlockNotFoundError`, `TextBlockAudioNotAllowedError` e `TextBlockAudioGenerationNotPendingError`.
* **Justificativa:** Use cases devem expor erros de domínio pelo barrel do módulo.
* **Camada:** `core`

## Pacote Core (Exports)

* **Arquivo:** `packages/core/package.json`
* **Mudança:** Adicionar export `./lesson/events`: `./src/lesson/domain/events/index.ts`.
* **Justificativa:** `apps/server/src/queue/inngest/inngest.ts` e jobs precisam importar eventos via subpath público, seguindo os demais domínios.
* **Camada:** `core`

## Pacote Validation (Schemas)

* **Arquivo:** `packages/validation/src/modules/lesson/schemas/index.ts`
* **Mudança:** Exportar `audioVoiceSchema` e `requestTextBlockAudioGenerationSchema`.
* **Justificativa:** `TextBlocksRouter` deve validar body do endpoint individual usando schemas compartilhados.
* **Camada:** `rest`

## Camada REST (Controllers)

* **Arquivo:** `apps/server/src/rest/controllers/lesson/index.ts`
* **Mudança:** Exportar `TriggerTextBlockAudioGenerationController`, `TriggerTextBlocksAudioGenerationInBatchController`, `CancelTextBlockAudioGenerationController` e `CancelTextBlocksAudioGenerationInBatchController`.
* **Justificativa:** Router deve importar controllers pelo barrel do domínio.
* **Camada:** `rest`

## Camada Hono App

* **Arquivo:** `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`
* **Mudança:** Adicionar métodos privados para registrar as rotas `POST /star/:starId/audio`, `POST /star/:starId/audio/batch`, `DELETE /star/:starId/audio` e `DELETE /star/:starId/audio/batch`; instanciar `SupabaseTextBlocksRepository`, `InngestBroker` e controllers correspondentes.
* **Justificativa:** Expor os contratos REST da issue #409 preservando middlewares de autenticação/autorização na borda.
* **Camada:** `rest`

## Camada Banco de Dados

* **Arquivo:** `apps/server/src/database/supabase/repositories/lesson/SupabaseTextBlocksRepository.ts`
* **Mudança:** Implementar `updateAudio(starId, blockIndex, audio)` chamando RPC `update_text_block_audio` e mantendo tratamento de erro com `SupabasePostgreError`.
* **Justificativa:** Persistir áudio por bloco de forma parcial e compatível com jobs concorrentes.
* **Camada:** `database`

* **Arquivo:** `apps/server/src/database/supabase/types/Database.ts`
* **Mudança:** Regenerar tipos após migration para incluir a função `update_text_block_audio`.
* **Justificativa:** O repositório Supabase deve chamar `.rpc()` com tipos gerados.
* **Camada:** `database`

## Camada Queue / Inngest

* **Arquivo:** `apps/server/src/queue/jobs/storage/index.ts`
* **Mudança:** Exportar `GenerateTextBlockAudioJob` do módulo `storage`.
* **Justificativa:** `StorageFunctions` segue o padrão atual de importar jobs pelo barrel do domínio.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/queue/inngest/inngest.ts`
* **Mudança:** Importar eventos de `@stardust/core/lesson/events` e adicionar schemas de `TextBlockAudioGenerationRequestedEvent._NAME`, `TextBlocksAudioGenerationInBatchRequestedEvent._NAME`, `TextBlockAudioGeneratedEvent._NAME` e `TextBlockAudioGenerationCancelledEvent._NAME` em `eventsSchema`.
* **Justificativa:** Inngest precisa validar payloads dos novos eventos.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/queue/inngest/functions/StorageFunctions.ts`
* **Mudança:** Adicionar `createGenerateTextBlockAudioJob()` com `cancelOn` vinculado a `TextBlockAudioGenerationCancelledEvent` e incluir a função retornada em `getFunctions()`.
* **Justificativa:** A geração do arquivo de áudio passa a pertencer ao módulo `storage`.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/queue/inngest/functions/index.ts`
* **Mudança:** Exportar `LessonFunctions`; manter `StorageFunctions` e registrar a nova função de geração de áudio dentro dele.
* **Justificativa:** `HonoApp` registra functions por barrel.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/app/hono/HonoApp.ts`
* **Mudança:** Importar `LessonFunctions`, instanciar em `registerInngestRoute` e incluir `...lessonFunctions.getFunctions(supabase)` na lista de funções servidas em `/inngest`; manter `StorageFunctions` como owner da função que gera o arquivo de áudio.
* **Justificativa:** Sem registro no handler `/inngest`, os eventos de lesson não serão processados.
* **Camada:** `queue`

## Camada Provision

* **Arquivo:** `apps/server/src/provision/tts/index.ts`
* **Mudança:** Exportar `OpenAITtsProvider` a partir de `apps/server/src/provision/tts/open-ai/OpenAITtsProvider.ts` e manter os demais providers TTS em subpastas separadas da mesma capability.
* **Justificativa:** O fluxo principal da feature passa a usar `OpenAITtsProvider`, mas outras implementações permanecem disponíveis como adapters alternativos sem sobrescrever arquivos entre si.
* **Camada:** `provision`

# 7. O que deve ser removido?

Não aplicável.

# 8. Decisões Técnicas e Trade-offs

* **Decisão:** Manter autenticação, autorização god account e verificação da estrela no `TextBlocksRouter`.
* **Alternativas consideradas:** Mover autorização para use cases do core.
* **Motivo da escolha:** A codebase já aplica `verifyAuthentication`, `verifyGodAccount` e `verifyStarExists` nas rotas atuais de atualização dos blocos.
* **Impactos / trade-offs:** Preserva limites do core e evita acoplamento com transporte; use cases assumem que a borda já autorizou a operação.

* **Decisão:** Rejeitar requisição individual quando o bloco já estiver com `audio.status = 'pending'`.
* **Alternativas consideradas:** Ignorar silenciosamente a requisição ou reenfileirar um novo job para o mesmo bloco.
* **Motivo da escolha:** A decisão foi confirmada durante a elaboração da spec e evita duplicidade de jobs para o mesmo `blockIndex`.
* **Impactos / trade-offs:** O controller/use case precisa retornar erro explícito para o operador quando houver geração em andamento.

* **Decisão:** Implementar cancelamento por endpoints REST, com execução assíncrona por eventos e jobs.
* **Alternativas consideradas:** Não suportar cancelamento ou permitir apenas cancelamento interno sem borda HTTP.
* **Motivo da escolha:** O cancelamento precisa estar disponível para o consumidor da API e também em lote; os endpoints apenas publicam eventos, enquanto a execução continua desacoplada nos jobs.
* **Impactos / trade-offs:** A API pública cresce com duas rotas `DELETE`, mas o processamento continua assíncrono e consistente com o modelo event-driven.

* **Decisão:** Usar `cancelOn` na função Inngest de geração individual como complemento ao estado `cancelled` persistido no domínio.
* **Alternativas consideradas:** Depender apenas da persistência de `cancelled` no banco ou apenas de cancelamento do runtime do Inngest.
* **Motivo da escolha:** `cancelOn` reduz trabalho desnecessário entre steps do runtime, enquanto a persistência de `cancelled` garante consistência do estado mesmo quando um `step.run` já iniciou.
* **Impactos / trade-offs:** O fluxo fica mais robusto, mas `cancelOn` não interrompe um `step.run` em andamento; por isso, a implementação continua exigindo releitura defensiva do estado antes de publicar `done` ou `error`.

* **Decisão:** O endpoint em lote não recebe `voice` global e usa a voz persistida por bloco, com default `panda` quando ausente.
* **Alternativas consideradas:** Seguir a issue #409 e aceitar `{ voice: string }` para o lote.
* **Motivo da escolha:** O PRD define voz configurada individualmente por bloco; a decisão foi confirmada durante a elaboração da spec.
* **Impactos / trade-offs:** O batch depende de o bloco preservar `audio.voice`; enquanto a UI não persistir voz por bloco, o backend usará o default de `AudioVoice.create()`.

* **Decisão:** Usar RPC SQL com `jsonb_set` para atualizar `stars.texts[blockIndex].audio`.
* **Alternativas consideradas:** Buscar todos os blocos, alterar em memória e regravar `stars.texts` inteiro com `updateMany`.
* **Motivo da escolha:** A issue #409 cita atualização parcial por `jsonb_set`; jobs concorrentes reduzem risco de sobrescrever alterações quando não regravam o array completo.
* **Impactos / trade-offs:** Exige migration e regeneração de tipos Supabase; grants da função precisam ser compatíveis com a credencial usada pelo server.

* **Decisão:** Separar a geração do arquivo e a atualização do bloco em dois módulos de queue: `storage` gera o arquivo e publica `TextBlockAudioGeneratedEvent`; `lesson` consome esse evento para atualizar `stars.texts[blockIndex].audio`.
* **Alternativas consideradas:** Concentrar geração e persistência do bloco em um único job de `lesson`.
* **Motivo da escolha:** A geração de arquivo pertence ao módulo `storage`; a atualização do agregado de lição pertence ao módulo `lesson`, reduzindo acoplamento entre responsabilidades.
* **Impactos / trade-offs:** Introduz um evento extra e duas funções Inngest para o fluxo individual, mas deixa a divisão modular consistente com a responsabilidade de cada domínio.

* **Decisão:** Usar `OpenAITtsProvider` em `apps/server/src/provision/tts/open-ai/OpenAITtsProvider.ts` como adapter concreto do fluxo principal de geração de áudio.
* **Alternativas consideradas:** `OpenRouterElevenLabsTtsProvider` e `ElevenLabsTtsProvider` mantidos como implementações alternativas em subpastas próprias de `apps/server/src/provision/tts/`.
* **Motivo da escolha:** A integração HTTP com a OpenAI encaixa no contrato atual `TtsProvider`, evita dependência do runtime local de inferência e mantém a implementação simples dentro da camada `provision`.
* **Impactos / trade-offs:** O fluxo principal passa a depender de `OPENAI_API_KEY`, latência/custo externos e disponibilidade da API; em contrapartida, o monorepo preserva implementações alternativas sem conflitar paths nem sobrescrever adapters. A entrega nao inclui mais `KokoroTtsProvider` nem a dependencia `kokoro-js`.

* **Decisão:** Não criar schema de entrada que aceite `audio.status` ou `audio.fileName` nos endpoints novos.
* **Alternativas consideradas:** Reutilizar um schema completo de `TextBlockAudio` no body.
* **Motivo da escolha:** `status` e `fileName` são controlados pelo servidor no fluxo do PRD; aceitar esses campos na borda abriria bypass de estado.
* **Impactos / trade-offs:** O endpoint individual aceita somente `blockIndex` e `voice`; o batch não aceita body obrigatório.

# 9. Diagramas e Referências

* **Fluxo de Dados:**

```text
POST /lesson/text-blocks/star/:starId/audio
  -> TextBlocksRouter
  -> verifyAuthentication + verifyGodAccount + validate(starId/body) + verifyStarExists
  -> TriggerTextBlockAudioGenerationController
  -> TriggerTextBlockAudioGenerationUseCase
  -> TextBlocksRepository.findAllByStar(starId)
  -> TextBlock.setAudio(TextBlockAudio.createAsPending(voice))
  -> TextBlocksRepository.updateAudio(starId, blockIndex, pendingAudio)
  -> InngestBroker.publish(TextBlockAudioGenerationRequestedEvent)
  -> immediate response TextBlockDto[] with 202 Accepted

Inngest TextBlockAudioGenerationRequestedEvent
  -> StorageFunctions.createGenerateTextBlockAudioJob
  -> storage/GenerateTextBlockAudioJob.handle(amqp)
  -> reload current block audio state
  -> if status == cancelled: stop
  -> step.run(TtsProvider.generate)
  -> step.run(FileStorageProvider.upload)
  -> reload current block audio state
  -> if status == cancelled: stop
  -> Broker.publish(TextBlockAudioGeneratedEvent)

DELETE /lesson/text-blocks/star/:starId/audio
  -> TextBlocksRouter
  -> verifyAuthentication + verifyGodAccount + validate(starId/body) + verifyStarExists
  -> CancelTextBlockAudioGenerationController
  -> CancelTextBlockAudioGenerationUseCase
  -> TextBlocksRepository.findAllByStar(starId)
  -> Broker.publish(TextBlockAudioGenerationCancelledEvent)
  -> immediate response TextBlockDto[] with 202 Accepted

DELETE /lesson/text-blocks/star/:starId/audio/batch
  -> TextBlocksRouter
  -> verifyAuthentication + verifyGodAccount + validate(starId) + verifyStarExists
  -> CancelTextBlocksAudioGenerationInBatchController
  -> CancelTextBlocksAudioGenerationInBatchUseCase
  -> TextBlocksRepository.findAllByStar(starId)
  -> filter blocks where audio.status == pending
  -> Broker.publish(TextBlockAudioGenerationCancelledEvent) x N
  -> immediate response TextBlockDto[] with 202 Accepted

Inngest TextBlockAudioGeneratedEvent
  -> LessonFunctions.createUpdateTextBlockAudioJob
  -> lesson/UpdateTextBlockAudioJob.handle(amqp)
  -> reload current block audio state
  -> if status == cancelled: stop
  -> TextBlockAudio.markAsDone(fileName)
  -> TextBlocksRepository.updateAudio(starId, blockIndex, doneAudio)

Inngest TextBlockAudioGenerationCancelledEvent
  -> LessonFunctions.createCancelTextBlockAudioGenerationJob
  -> lesson/CancelTextBlockAudioGenerationJob.handle(amqp)
  -> TextBlockAudio.markAsCancelled()
  -> TextBlocksRepository.updateAudio(starId, blockIndex, cancelledAudio)

onFailure after retries
  -> LessonFunctions.createMarkTextBlockAudioAsErrorFunction
  -> reload current block audio state
  -> if status == cancelled: stop
  -> TextBlockAudio.markAsError()
  -> TextBlocksRepository.updateAudio(starId, blockIndex, errorAudio)
```

* **Fluxo de Dados em Lote:**

```text
POST /lesson/text-blocks/star/:starId/audio/batch
  -> TextBlocksRouter
  -> verifyAuthentication + verifyGodAccount + validate(starId) + verifyStarExists
  -> TriggerTextBlocksAudioGenerationInBatchController
  -> TriggerTextBlocksAudioGenerationInBatchUseCase
  -> TextBlocksRepository.findAllByStar(starId)
  -> filter type in [default, alert, quote]
  -> skip audio.status == pending
  -> resolve voice from block.audio.voice or AudioVoice.create()
  -> TextBlocksRepository.updateAudio(...) for each selected block as pending
  -> InngestBroker.publish(TextBlocksAudioGenerationInBatchRequestedEvent)
  -> immediate response TextBlockDto[] with 202 Accepted

Inngest TextBlocksAudioGenerationInBatchRequestedEvent
  -> GenerateTextBlocksAudioBatchJob.handle(amqp)
  -> for each payload.blocks item
  -> InngestBroker.publish(TextBlockAudioGenerationRequestedEvent)
  -> N x individual generation flow
```

* **Fluxo Cross-app:**

```text
Studio (spec futura de UI)
  -> REST POST /lesson/text-blocks/star/:starId/audio
  -> REST POST /lesson/text-blocks/star/:starId/audio/batch
  -> Server REST + Queue + Supabase

Server expõe contrato REST; Studio apenas consumirá em outra entrega.
Esta spec modifica somente o app server e pacotes compartilhados.
```

* **Layout:** Não aplicável.

* **Referências:**

* `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts` - padrão atual de rotas dos blocos de texto.
* `apps/server/src/rest/controllers/lesson/UpdateTextBlocksController.ts` - padrão de controller REST de lesson usando use case.
* `packages/core/src/manual/use-cases/EditGuideContentUseCase.ts` - referência de use case que persiste alteração e publica evento via `Broker`.
* `packages/core/src/manual/domain/events/GuideContentEditedEvent.ts` - referência de evento com `_NAME` e payload tipado.
* `apps/server/src/queue/jobs/storage/GenerateGuideEmbeddingsJob.ts` - referência de job com `amqp.getPayload()` e `amqp.run`.
* `apps/server/src/queue/inngest/functions/StorageFunctions.ts` - referência de composition root Inngest.
* `apps/server/src/queue/jobs/lesson` - novo agrupamento para jobs que alteram estado do domínio `lesson`.
* `apps/server/src/queue/inngest/inngest.ts` - local para registrar schemas dos novos eventos.
* `apps/server/src/queue/inngest/InngestBroker.ts` - adapter de publicação de eventos.
* `apps/server/src/queue/inngest/InngestAmqp.ts` - adapter de execução dos jobs.
* `apps/server/src/database/supabase/repositories/lesson/SupabaseTextBlocksRepository.ts` - repository concreto que deve receber `updateAudio`.
* `apps/server/src/provision/storage/SupabaseFileStorageProvider.ts` - provider de storage a ser usado com `FileStorageFolderPath.createAsAudiosStory()`.
* `packages/core/src/lesson/domain/structures/TextBlockAudio.ts` - structure de estado do áudio.
* `packages/core/src/lesson/domain/structures/AudioVoice.ts` - structure de voz e default.

# 10. Pendências / Dúvidas

Sem pendências.
