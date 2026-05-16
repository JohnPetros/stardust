---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
---

## Pendencias (quando aplicavel)

- [x] O conflito da spec sobre `KokoroTtsProvider` foi resolvido pela propria definicao dos artefatos obrigatorios nas secoes `5`, `6` e `8`, que foram implementados no `server`.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Definir o contrato do fluxo de geracao e cancelamento de audio no core do modulo `lesson` | - | - |
| F2 | Implementar persistencia parcial, provider TTS, jobs Inngest e endpoints REST no `server` | F1 | - |

> **Estratégia de paralelismo:** sempre comece pelo core (dominio, structures e use cases). Como esta spec impacta apenas o app `server`, toda a implementacao fora do core fica concentrada em F2 e so deve iniciar apos F1 concluir.

---

## F1 — Core: Domínio, Structures e Use Cases

**Objetivo:** Definir o contrato do domínio — entidades, structures, interfaces de repositório/provider e use cases — sem nenhuma dependência de infraestrutura. Essa fase desbloqueia F2.

### Tarefas

- [x] **F1-T1** — Suportar status `cancelled` em `TextBlockAudio`
  - **Depende de:** -
  - **Resultado observavel:** `TextBlockAudio.create(dto)` aceita `status = 'cancelled'`, `markAsCancelled()` retorna uma nova instancia com esse estado, `isCancelled` fica disponivel e `dto.status` preserva o valor cancelado.
  - **Camada:** `core`

- [x] **F1-T2** — Preservar `audio` na structure `TextBlock`
  - **Depende de:** F1-T1
  - **Resultado observavel:** `TextBlock.create(dto)` hidrata `audio`, `textBlock.dto` devolve `audio` quando existir, `clone()` nao perde o estado e `setAudio()` atualiza apenas o audio do bloco.
  - **Camada:** `core`

- [x] **F1-T3** — Exportar `TextBlock`, `TextBlockAudio` e `AudioVoice` no barrel de structures de `lesson`
  - **Depende de:** F1-T2
  - **Resultado observavel:** `@stardust/core/lesson/structures` passa a expor as tres structures usadas pelo fluxo de audio.
  - **Camada:** `core`

- [x] **F1-T4** — Adicionar `updateAudio` ao contrato `TextBlocksRepository`
  - **Depende de:** F1-T2
  - **Resultado observavel:** a interface do repositorio aceita persistencia parcial de `audio` por `starId` e `blockIndex`, usando objetos de dominio do core.
  - **Camada:** `core`

- [x] **F1-T5** — Corrigir o contrato `TtsProvider` para usar a structure global `Text`
  - **Depende de:** F1-T3
  - **Resultado observavel:** `TtsProvider.generate(text, voice)` passa a depender de `#global/domain/structures/Text`, alinhando o contrato ao uso real do provider.
  - **Camada:** `core`

- [x] **F1-T6** — Exportar `TtsProvider` no barrel de interfaces de `lesson`
  - **Depende de:** F1-T5
  - **Resultado observavel:** `@stardust/core/lesson/interfaces` expoe o contrato `TtsProvider` para os adapters do `server`.
  - **Camada:** `core`

- [x] **F1-T7** — Criar `TextBlockNotFoundError`
  - **Depende de:** -
  - **Resultado observavel:** o dominio passa a ter um erro explicito para `blockIndex` inexistente na estrela.
  - **Camada:** `core`

- [x] **F1-T8** — Criar `TextBlockAudioNotAllowedError`
  - **Depende de:** F1-T2
  - **Resultado observavel:** o dominio passa a ter um erro explicito para tentativa de gerar audio em bloco nao elegivel.
  - **Camada:** `core`

- [x] **F1-T9** — Criar `TextBlockAudioGenerationNotPendingError`
  - **Depende de:** F1-T1
  - **Resultado observavel:** o dominio passa a ter um erro explicito para operacoes que exigem `audio.status = 'pending'`.
  - **Camada:** `core`

- [x] **F1-T10** — Exportar os novos erros de `lesson` no barrel do modulo
  - **Depende de:** F1-T7, F1-T8, F1-T9
  - **Resultado observavel:** `@stardust/core/lesson/errors` passa a expor os tres erros novos do fluxo de audio.
  - **Camada:** `core`

- [x] **F1-T11** — Criar `TextBlockAudioGenerationRequestedEvent`
  - **Depende de:** -
  - **Resultado observavel:** existe um evento tipado com `_NAME = 'lesson/text-block.audio.generation.requested'` e payload individual de geracao.
  - **Camada:** `core`

- [x] **F1-T12** — Criar `TextBlocksAudioGenerationInBatchRequestedEvent`
  - **Depende de:** -
  - **Resultado observavel:** existe um evento tipado com `_NAME = 'lesson/text-blocks.audio-generation-in-batch.requested'` e payload de fan-out em lote.
  - **Camada:** `core`

- [x] **F1-T13** — Criar `TextBlockAudioGeneratedEvent`
  - **Depende de:** -
  - **Resultado observavel:** existe um evento tipado com `_NAME = 'lesson/text-block.audio.generated'` e payload com `voice` e `fileName`.
  - **Camada:** `core`

- [x] **F1-T14** — Criar `TextBlockAudioGenerationCancelledEvent`
  - **Depende de:** -
  - **Resultado observavel:** existe um evento tipado com `_NAME = 'lesson/text-block.audio.generation.cancelled'` e payload de cancelamento por bloco.
  - **Camada:** `core`

- [x] **F1-T15** — Criar o barrel `packages/core/src/lesson/domain/events/index.ts`
  - **Depende de:** F1-T11, F1-T12, F1-T13, F1-T14
  - **Resultado observavel:** os quatro eventos de audio podem ser importados por um unico ponto publico do modulo `lesson`.
  - **Camada:** `core`

- [x] **F1-T16** — Implementar `RequestTextBlockAudioUseCase`
  - **Depende de:** F1-T2, F1-T4, F1-T7, F1-T8, F1-T11
  - **Resultado observavel:** ao executar o caso de uso para um bloco elegivel e nao-pending, o bloco alvo fica `pending`, a atualizacao parcial e persistida e o evento individual de geracao e publicado com `content` e `voice`.
  - **Camada:** `core`

- [x] **F1-T17** — Implementar `RequestTextBlocksAudioGenerationInBatchUseCase`
  - **Depende de:** F1-T2, F1-T4, F1-T12
  - **Resultado observavel:** ao executar o caso de uso em lote, apenas blocos `default`, `alert` e `quote` que nao estao `pending` sao marcados como `pending`, com voz persistida ou default, e um evento de lote e publicado com os blocos selecionados.
  - **Camada:** `core`

- [x] **F1-T18** — Implementar `CancelTextBlockAudioGenerationUseCase`
  - **Depende de:** F1-T2, F1-T4, F1-T7, F1-T9, F1-T14
  - **Resultado observavel:** ao cancelar um bloco `pending`, o caso de uso publica o evento individual de cancelamento e retorna os blocos atuais sem antecipar a persistencia de `cancelled`.
  - **Camada:** `core`

- [x] **F1-T19** — Implementar `CancelTextBlocksAudioGenerationInBatchUseCase`
  - **Depende de:** F1-T2, F1-T4, F1-T14
  - **Resultado observavel:** ao cancelar em lote, o caso de uso publica um evento de cancelamento por `blockIndex` pendente e retorna o estado atual da estrela.
  - **Camada:** `core`

- [x] **F1-T20** — Exportar os novos use cases de `lesson` no barrel do modulo
  - **Depende de:** F1-T16, F1-T17, F1-T18, F1-T19
  - **Resultado observavel:** `@stardust/core/lesson/use-cases` passa a expor os quatro casos de uso do fluxo de audio.
  - **Camada:** `core`

- [x] **F1-T21** — Publicar `./lesson/events` em `packages/core/package.json`
  - **Depende de:** F1-T15
  - **Resultado observavel:** o subpath `@stardust/core/lesson/events` fica disponivel para `server` importar os eventos no runtime do Inngest.
  - **Camada:** `core`

---

## F2 — Server: Infra, Repositórios e Handlers

> ⚡ So pode iniciar apos F1 estar concluida.

**Objetivo:** Implementar a camada de infraestrutura e exposição — repositórios, providers, jobs e handlers REST/queue — consumindo os contratos definidos no core.

### Tarefas

- [x] **F2-T1** — Criar a migration `create_update_text_block_audio_function.sql`
  - **Depende de:** F1-T4
  - **Resultado observavel:** o banco passa a ter a funcao `public.update_text_block_audio(...)`, com `jsonb_set`, validacao de indice e erro quando o bloco/estrela nao puder ser atualizado.
  - **Camada:** `database`

- [x] **F2-T2** — Regenerar `apps/server/src/database/supabase/types/Database.ts`
  - **Depende de:** F2-T1
  - **Resultado observavel:** `Database['public']['Functions']` passa a incluir `update_text_block_audio` com argumentos tipados.
  - **Camada:** `database`

- [x] **F2-T3** — Implementar `updateAudio` em `SupabaseTextBlocksRepository`
  - **Depende de:** F1-T4, F2-T2
  - **Resultado observavel:** o repositorio concreto passa a persistir somente `stars.texts[blockIndex].audio` via `.rpc('update_text_block_audio', ...)`, mantendo a traducao de erro com `SupabasePostgreError`.
  - **Camada:** `database`

- [x] **F2-T4** — Ajustar `SupabaseTextBlockMapper` para round-trip de `audio`
  - **Depende de:** F1-T2
  - **Resultado observavel:** o mapeamento DB -> dominio -> DTO preserva `audio` quando o bloco ja possui esse estado salvo.
  - **Camada:** `database`

- [x] **F2-T5** — Criar `audioVoiceSchema`
  - **Depende de:** F1-T3
  - **Resultado observavel:** existe um schema compartilhado que aceita apenas `panda`, `shark` e `princess`, com mensagem de erro em PT-BR.
  - **Camada:** `rest`

- [x] **F2-T6** — Criar `requestTextBlockAudioGenerationSchema`
  - **Depende de:** F2-T5
  - **Resultado observavel:** existe um schema compartilhado que valida `blockIndex` inteiro nao negativo e `voice` valido para o endpoint individual.
  - **Camada:** `rest`

- [x] **F2-T7** — Exportar os novos schemas no barrel de `lesson`
  - **Depende de:** F2-T5, F2-T6
  - **Resultado observavel:** `@stardust/validation/lesson/schemas` passa a expor `audioVoiceSchema` e `requestTextBlockAudioGenerationSchema`.
  - **Camada:** `rest`

- [x] **F2-T8** — Adicionar `kokoro-js` em `apps/server/package.json`
  - **Depende de:** -
  - **Resultado observavel:** o workspace `@stardust/server` passa a declarar a dependencia necessaria para o provider TTS concreto.
  - **Camada:** `provision`

- [x] **F2-T9** — Criar `KokoroTtsProvider`
  - **Depende de:** F1-T5, F2-T8
  - **Resultado observavel:** existe um adapter TTS que recebe `Text` e `AudioVoice`, gera um `File` de audio e mapeia as vozes do dominio para vozes concretas do Kokoro.
  - **Camada:** `provision`

- [x] **F2-T10** — Criar o barrel `apps/server/src/provision/tts/index.ts`
  - **Depende de:** F2-T9
  - **Resultado observavel:** `@/provision/tts` passa a exportar `KokoroTtsProvider` para composicao dos jobs.
  - **Camada:** `provision`

- [x] **F2-T11** — Criar `GenerateTextBlocksAudioBatchJob`
  - **Depende de:** F1-T11, F1-T12
  - **Resultado observavel:** ao consumir o evento de lote, o job publica um `TextBlockAudioGenerationRequestedEvent` para cada bloco do payload.
  - **Camada:** `queue`

- [x] **F2-T12** — Criar `UpdateTextBlockAudioJob`
  - **Depende de:** F1-T1, F1-T2, F1-T13, F2-T3
  - **Resultado observavel:** ao consumir `TextBlockAudioGeneratedEvent`, o job rele o bloco, ignora estado `cancelled` e persiste `status = done`, `fileName` e `voice` no `blockIndex` correto.
  - **Camada:** `queue`

- [x] **F2-T13** — Criar `CancelTextBlockAudioGenerationJob`
  - **Depende de:** F1-T1, F1-T14, F2-T3
  - **Resultado observavel:** ao consumir o evento de cancelamento, o job marca o bloco como `cancelled` apenas quando ele ainda estiver `pending`.
  - **Camada:** `queue`

- [x] **F2-T14** — Criar o barrel `apps/server/src/queue/jobs/lesson/index.ts`
  - **Depende de:** F2-T11, F2-T12, F2-T13
  - **Resultado observavel:** os jobs de `lesson` envolvidos no fluxo de audio ficam acessiveis por um unico ponto de importacao.
  - **Camada:** `queue`

- [x] **F2-T15** — Criar `GenerateTextBlockAudioJob`
  - **Depende de:** F1-T1, F1-T11, F1-T13, F2-T3, F2-T9
  - **Resultado observavel:** ao consumir o evento individual, o job rele o estado antes e depois dos `step.run`, gera o audio, faz upload em `audios/story` e so publica `TextBlockAudioGeneratedEvent` se o bloco nao tiver sido cancelado.
  - **Camada:** `queue`

- [x] **F2-T16** — Exportar `GenerateTextBlockAudioJob` no barrel de `storage`
  - **Depende de:** F2-T15
  - **Resultado observavel:** `apps/server/src/queue/jobs/storage/index.ts` passa a expor o job individual de geracao de audio.
  - **Camada:** `queue`

- [x] **F2-T17** — Registrar os quatro eventos de audio em `apps/server/src/queue/inngest/inngest.ts`
  - **Depende de:** F1-T15
  - **Resultado observavel:** `eventsSchema` do Inngest passa a validar os payloads dos eventos `requested`, `batch requested`, `generated` e `cancelled`.
  - **Camada:** `queue`

- [x] **F2-T18** — Criar `LessonFunctions.ts`
  - **Depende de:** F2-T11, F2-T12, F2-T13, F2-T17
  - **Resultado observavel:** existe uma composition root que expoe as funcoes de fan-out em lote, cancelamento, atualizacao para `done` e marcacao de `error` apos falha.
  - **Camada:** `queue`

- [x] **F2-T19** — Estender `StorageFunctions.ts` com a funcao individual de geracao
  - **Depende de:** F2-T15, F2-T17, F2-T10
  - **Resultado observavel:** `StorageFunctions.getFunctions()` passa a incluir a funcao que consome `TextBlockAudioGenerationRequestedEvent` com `retries: 2`, concorrencia por `starId` e `cancelOn` vinculado ao evento de cancelamento.
  - **Camada:** `queue`

- [x] **F2-T20** — Exportar `LessonFunctions` no barrel `apps/server/src/queue/inngest/functions/index.ts`
  - **Depende de:** F2-T18
  - **Resultado observavel:** o barrel de funcoes do Inngest passa a expor `LessonFunctions`.
  - **Camada:** `queue`

- [x] **F2-T21** — Registrar as funcoes de `lesson` em `HonoApp.ts`
  - **Depende de:** F2-T18, F2-T19, F2-T20
  - **Resultado observavel:** a rota `/inngest` passa a servir tambem as funcoes de audio do modulo `lesson`.
  - **Camada:** `queue`

- [x] **F2-T22** — Criar `RequestTextBlockAudioController`
  - **Depende de:** F1-T16
  - **Resultado observavel:** o controller le `starId`, `blockIndex` e `voice`, executa o caso de uso e devolve `202 Accepted` com `TextBlockDto[]`.
  - **Camada:** `rest`

- [x] **F2-T23** — Criar `RequestTextBlocksAudioGenerationInBatchController`
  - **Depende de:** F1-T17
  - **Resultado observavel:** o controller le `starId`, executa o caso de uso em lote e devolve `202 Accepted` com os blocos atualizados.
  - **Camada:** `rest`

- [x] **F2-T24** — Criar `CancelTextBlockAudioGenerationController`
  - **Depende de:** F1-T18
  - **Resultado observavel:** o controller le `starId` e `blockIndex`, executa o cancelamento individual e devolve `202 Accepted` com os blocos atuais.
  - **Camada:** `rest`

- [x] **F2-T25** — Criar `CancelTextBlocksAudioGenerationInBatchController`
  - **Depende de:** F1-T19
  - **Resultado observavel:** o controller le `starId`, executa o cancelamento em lote e devolve `202 Accepted` com os blocos atuais.
  - **Camada:** `rest`

- [x] **F2-T26** — Exportar os novos controllers no barrel de `lesson`
  - **Depende de:** F2-T22, F2-T23, F2-T24, F2-T25
  - **Resultado observavel:** `apps/server/src/rest/controllers/lesson/index.ts` passa a expor os quatro controllers de audio.
  - **Camada:** `rest`

- [x] **F2-T27** — Expor as quatro novas rotas em `TextBlocksRouter.ts`
  - **Depende de:** F2-T3, F2-T7, F2-T26
  - **Resultado observavel:** o router passa a registrar `POST /star/:starId/audio`, `POST /star/:starId/audio/batch`, `DELETE /star/:starId/audio` e `DELETE /star/:starId/audio/batch` com `verifyAuthentication`, `verifyGodAccount`, validacao de entrada e `verifyStarExists`.
  - **Camada:** `rest`
