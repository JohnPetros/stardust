---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
---

## Pendencias (quando aplicavel)

- [x] O job de storage pode falhar depois que o endpoint ja tiver limpado a referencia `audio` do bloco e retornado sucesso. Impacto: o bloco fica consistente, mas pode sobrar arquivo orfao em `audios/story`. Acao necessaria: usar as retentativas padrao do Inngest e monitorar falhas operacionais; se a recorrencia justificar, abrir spec futura para rotina de limpeza de orfaos.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Definir o contrato de dominio para remocao manual de audio em blocos de texto | - | - |
| F2 | Implementar persistencia parcial, endpoint REST e remocao fisica assicrona no `server` | F1 | F4 |
| F4 | Integrar a remocao manual de audio no editor de historia do `studio` | F1 | F2 |

> **Estrategia de paralelismo:** sempre comece pelo core (dominio, structures e use cases). Assim que o core estiver concluido, as fases de `server` e `studio` podem ser executadas em paralelo, pois ambas dependem apenas do contrato definido no core.

---

## F1 — Core: Dominio, Structures e Use Cases

**Objetivo:** Definir o contrato do dominio — entidades, structures, interfaces de repositorio/provider e use cases — sem nenhuma dependencia de infraestrutura. Essa fase desbloqueia F2 e F4 para rodarem em paralelo.

### Tarefas

- [x] **T1.1** — Criar `TextBlockAudioRemovalNotAllowedError`
  - **Depende de:** -
  - **Resultado observavel:** existe um erro de dominio dedicado para tentativa de remocao manual em estado invalido, recebendo o `status` atual do audio.
  - **Camada:** `core`

- [x] **T1.2** — Criar `TextBlockAudioFileRemovedEvent`
  - **Depende de:** -
  - **Resultado observavel:** existe um evento de dominio com nome `lesson/text-block.audio-file.removed` e payload `{ fileName: string }`.
  - **Camada:** `core`

- [x] **T1.3** — Adicionar `removeAudio()` em `packages/core/src/lesson/domain/structures/TextBlock.ts`
  - **Depende de:** -
  - **Resultado observavel:** ao chamar `removeAudio()`, o bloco retornado preserva `content`, `title`, `picture`, `isRunnable`, `type` e ordem logica, mas deixa de serializar `audio` no `dto`.
  - **Camada:** `core`

- [x] **T1.4** — Adicionar `clearAudio(starId, blockIndex)` em `packages/core/src/lesson/interfaces/TextBlocksRepository.ts`
  - **Depende de:** -
  - **Resultado observavel:** o contrato do repositorio passa a expor uma operacao explicita para limpar apenas o `audio` de um bloco por indice.
  - **Camada:** `core`

- [x] **T1.5** — Adicionar `removeTextBlockAudio(starId, blockIndex)` em `packages/core/src/lesson/interfaces/LessonService.ts`
  - **Depende de:** -
  - **Resultado observavel:** o contrato REST compartilhado passa a expor uma operacao tipada de remocao retornando `RestResponse<TextBlockDto[]>`.
  - **Camada:** `core`

- [x] **T1.6** — Criar `packages/core/src/lesson/use-cases/RemoveTextBlockAudioUseCase.ts`
  - **Depende de:** T1.1, T1.2, T1.3, T1.4
  - **Resultado observavel:** `execute({ starId, blockIndex })` valida `Id` e `Integer`, busca o bloco, falha quando o indice nao existe, bloqueia `audio.status = 'pending'`, limpa o audio persistido via `clearAudio`, publica `TextBlockAudioFileRemovedEvent` quando houver `fileName` e retorna `TextBlockDto[]` atualizado.
  - **Camada:** `core`

- [x] **T1.7** — Exportar `RemoveTextBlockAudioUseCase` em `packages/core/src/lesson/use-cases/index.ts`
  - **Depende de:** T1.6
  - **Resultado observavel:** o novo use case pode ser importado pelo barrel do modulo `lesson/use-cases`.
  - **Camada:** `core`

- [x] **T1.8** — Exportar `TextBlockAudioFileRemovedEvent` em `packages/core/src/lesson/domain/events/index.ts`
  - **Depende de:** T1.2
  - **Resultado observavel:** o novo evento pode ser importado pelo barrel do modulo `lesson/events`.
  - **Camada:** `core`

- [x] **T1.9** — Exportar `TextBlockAudioRemovalNotAllowedError` em `packages/core/src/lesson/domain/errors/index.ts`
  - **Depende de:** T1.1
  - **Resultado observavel:** o novo erro pode ser importado pelo barrel do modulo `lesson/errors`.
  - **Camada:** `core`

---

## F2 — Server: Infra, Repositorios e Handlers

> ⚡ Pode rodar em paralelo com F4 apos F1 estar concluida.

**Objetivo:** Implementar a camada de infraestrutura e exposicao — repositorios, providers, jobs e handlers REST — consumindo os contratos definidos no core.

### Tarefas

- [x] **T2.1** — Criar `packages/validation/src/modules/lesson/schemas/removeTextBlockAudioSchema.ts`
  - **Depende de:** T1.6
  - **Resultado observavel:** existe um schema que aceita apenas body com `blockIndex` inteiro e maior ou igual a `0`.
  - **Camada:** `rest`

- [x] **T2.2** — Exportar `removeTextBlockAudioSchema` em `packages/validation/src/modules/lesson/schemas/index.ts`
  - **Depende de:** T2.1
  - **Resultado observavel:** o schema de remocao pode ser importado pelo barrel de validacao do modulo `lesson`.
  - **Camada:** `rest`

- [x] **T2.3** — Criar migration `apps/server/supabase/migrations/<timestamp>_create_clear_text_block_audio_function.sql`
  - **Depende de:** T1.4
  - **Resultado observavel:** existe uma RPC `clear_text_block_audio(p_star_id uuid, p_block_index integer)` que remove apenas a chave `audio` de `stars.texts[blockIndex]`, valida indice invalido e falha quando nenhuma linha e atualizada.
  - **Camada:** `database`

- [x] **T2.4** — Regenerar `apps/server/src/database/supabase/types/Database.ts`
  - **Depende de:** T2.3
  - **Resultado observavel:** os tipos gerados do Supabase passam a incluir a RPC `clear_text_block_audio`.
  - **Camada:** `database`

- [x] **T2.5** — Implementar `clearAudio()` em `apps/server/src/database/supabase/repositories/lesson/SupabaseTextBlocksRepository.ts`
  - **Depende de:** T1.4, T2.4
  - **Resultado observavel:** o repositorio chama `clear_text_block_audio` com `p_star_id` e `p_block_index` e traduz erro do Supabase para `SupabasePostgreError`.
  - **Camada:** `database`

- [x] **T2.6** — Criar `apps/server/src/rest/controllers/lesson/RemoveTextBlockAudioController.ts`
  - **Depende de:** T1.6
  - **Resultado observavel:** o controller le `starId` e `blockIndex`, executa `RemoveTextBlockAudioUseCase` e responde `200` com `TextBlockDto[]`.
  - **Camada:** `rest`

- [x] **T2.7** — Exportar `RemoveTextBlockAudioController` em `apps/server/src/rest/controllers/lesson/index.ts`
  - **Depende de:** T2.6
  - **Resultado observavel:** o novo controller pode ser importado pelo barrel de controllers de `lesson`.
  - **Camada:** `rest`

- [x] **T2.8** — Adicionar o nome do evento de remocao em `apps/server/src/queue/inngest/constants/lesson-event-names.ts`
  - **Depende de:** T1.2
  - **Resultado observavel:** existe uma constante para o evento `lesson/text-block.audio-file.removed` reutilizavel nas functions do Inngest.
  - **Camada:** `queue`

- [x] **T2.9** — Criar `apps/server/src/queue/jobs/storage/RemoveTextBlockAudioFileJob.ts`
  - **Depende de:** T1.8
  - **Resultado observavel:** o job busca `audios/story/{fileName}`, remove o arquivo quando ele existe e encerra com sucesso quando o arquivo ja esta ausente.
  - **Camada:** `queue`

- [x] **T2.10** — Exportar `RemoveTextBlockAudioFileJob` em `apps/server/src/queue/jobs/storage/index.ts`
  - **Depende de:** T2.9
  - **Resultado observavel:** o novo job pode ser importado pelo barrel de jobs de storage.
  - **Camada:** `queue`

- [x] **T2.11** — Registrar a function de remocao em `apps/server/src/queue/inngest/functions/StorageFunctions.ts`
  - **Depende de:** T2.8, T2.9, T2.10
  - **Resultado observavel:** o modulo de storage passa a consumir o evento `lesson/text-block.audio-file.removed` e instanciar `RemoveTextBlockAudioFileJob` com `SupabaseFileStorageProvider`.
  - **Camada:** `queue`

- [x] **T2.12** — Adicionar a rota `DELETE /lesson/text-blocks/star/:starId/audio/file` em `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`
  - **Depende de:** T2.2, T2.5, T2.7
  - **Resultado observavel:** a rota exige `verifyAuthentication`, `verifyGodAccount`, validacao de `starId`, validacao do body com `removeTextBlockAudioSchema`, `verifyStarExists` e retorna `200` com o array atualizado.
  - **Camada:** `rest`

---

## F4 — Studio: UI e Integracao

> ⚡ Pode rodar em paralelo com F2 apos F1 estar concluida.

**Objetivo:** Implementar a interface e integracao client-side na aplicacao studio — widgets, services e chamadas REST — consumindo os contratos definidos no core.

### Tarefas

- [x] **T4.1** — Implementar `removeTextBlockAudio()` em `apps/studio/src/rest/services/LessonService.ts`
  - **Depende de:** T1.5
  - **Resultado observavel:** o service passa a chamar `DELETE /lesson/text-blocks/star/:starId/audio/file` com body `{ blockIndex }` e retornar `RestResponse<TextBlockDto[]>`.
  - **Camada:** `rest`

- [x] **T4.2** — Adicionar `handleRemoveTextBlockAudio()` em `apps/studio/src/ui/lesson/widgets/pages/LessonStory/useLessonStoryPage.ts`
  - **Depende de:** T4.1
  - **Resultado observavel:** ao remover audio de um bloco, o hook salva alteracoes locais pendentes quando necessario, preserva o estado local em falha com `toastProvider.showError`, e em sucesso sincroniza `baselineTextBlocks` e `textBlocks` com a resposta do server.
  - **Camada:** `ui`

- [x] **T4.3** — Repassar `onRemoveAudio` em `apps/studio/src/ui/lesson/widgets/pages/LessonStory/LessonStoryPageView.tsx`
  - **Depende de:** T4.2
  - **Resultado observavel:** a view da pagina expoe o handler de remocao de audio para o widget `TextBlocks` sem adicionar regra de negocio.
  - **Camada:** `ui`

- [x] **T4.4** — Repassar `onRemoveAudio(blockId)` em `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlocksView.tsx`
  - **Depende de:** T4.3
  - **Resultado observavel:** cada `TextBlockCard` recebe o callback de remocao vinculado ao `blockId` correspondente.
  - **Camada:** `ui`

- [x] **T4.5** — Adicionar a prop `onRemoveAudio(blockId)` em `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/index.tsx`
  - **Depende de:** T4.4
  - **Resultado observavel:** o entry point do card repassa o callback de remocao para a view usando o `item.id` atual.
  - **Camada:** `ui`

- [x] **T4.6** — Repassar `onRemove` em `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/TextBlockCardView.tsx`
  - **Depende de:** T4.5
  - **Resultado observavel:** a view do card encaminha a acao de remocao para `BlockAudioControls`.
  - **Camada:** `ui`

- [x] **T4.7** — Calcular `canRemove` em `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/useBlockAudioControls.ts`
  - **Depende de:** -
  - **Resultado observavel:** o hook passa a expor `canRemove = Boolean(item.audio?.fileName) && status !== 'pending'`, mantendo `canCancel` apenas para `pending`.
  - **Camada:** `ui`

- [x] **T4.8** — Atualizar `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/index.tsx`
  - **Depende de:** T4.6, T4.7
  - **Resultado observavel:** o componente composto passa a receber `onRemove`, ler `canRemove` do hook e repassar ambos para a view.
  - **Camada:** `ui`

- [x] **T4.9** — Renderizar o botao `Remover audio` em `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/BlockAudioControlsView.tsx`
  - **Depende de:** T4.8
  - **Resultado observavel:** blocos com audio persistido e status diferente de `pending` exibem o botao `Remover audio`, e apos resposta atualizada sem `audio` o player, badge/status e a propria acao deixam de renderizar.
  - **Camada:** `ui`
