---
title: Controle de áudio dos blocos de texto no Studio
prd: https://github.com/JohnPetros/stardust/milestone/31
issue: https://github.com/JohnPetros/stardust/issues/410
apps: server, studio
status: open
last_updated_at: 2026-05-18
---

# 1. Objetivo

Adicionar ao editor de história do Studio o controle de geração, acompanhamento e pré-visualização de áudio TTS por bloco de texto, consumindo os endpoints assíncronos já existentes no `server`, preservando o estado de áudio dentro do JSONB `stars.texts` e expondo no backend a lista pública de vozes disponíveis para popular o seletor da UI.

# 2. Escopo

## 2.1 In-scope

* Exibir seletor de voz por bloco elegível (`default`, `alert`, `quote`) no card expandido.
* Permitir geração individual para blocos elegíveis com conteúdo preenchido.
* Permitir geração em lote para todos os blocos elegíveis e não pendentes.
* Exibir estado visual por bloco para `idle`, `pending`, `done`, `error` e `cancelled`.
* Exibir player compacto quando `audio.status = 'done'` e `audio.fileName` existir.
* Fazer polling a cada 3s enquanto houver bloco com `audio.status = 'pending'`.
* Permitir drag-and-drop mesmo enquanto houver geração pendente.
* Preservar `audio` no fluxo de edição/salvamento dos blocos para não apagar `fileName`, `status` e `voice` já persistidos.
* Criar endpoint `GET /lesson/audio-voices` no `server` para retornar as vozes fixas aceitas pelo domínio.
* Atualizar o contrato REST compartilhado `LessonService` e a implementação do Studio para os endpoints de áudio.

## 2.2 Out-of-scope

* Reprodução de áudio na Lesson Page do aluno no app `web`.
* Realtime para atualização de status de áudio.
* Cadastro, edição ou remoção de vozes pelo operador.
* Remoção manual de arquivos de áudio antigos.
* Geração automática de áudio ao salvar os blocos.
* Alteração dos jobs Inngest de geração, cancelamento ou upload de áudio já implementados.
* Nova migration de banco.

# 3. Requisitos

## 3.1 Funcionais

* O operador deve conseguir selecionar uma voz por bloco entre `panda`, `shark` e `princess`; quando não houver voz no bloco, a UI deve assumir `panda`.
* Apenas blocos `default`, `alert` e `quote` devem exibir controles de áudio.
* O botão de geração individual deve ficar desabilitado para bloco elegível com `content.trim().length === 0` ou `audio.status = 'pending'`.
* A ação individual deve gerar áudio para o conteúdo e voz atualmente sincronizados com o servidor.
* A ação em lote deve gerar áudio para todos os blocos elegíveis que não estejam `pending`, usando a voz persistida em cada bloco.
* Antes de acionar geração individual ou em lote, a UI deve sincronizar alterações locais de blocos quando houver mudanças não salvas.
* O card deve exibir spinner quando `audio.status = 'pending'`.
* O card deve exibir player compacto quando `audio.status = 'done'` e `audio.fileName` existir.
* O card deve exibir badge de erro quando `audio.status = 'error'`.
* O card deve exibir badge de cancelamento quando `audio.status = 'cancelled'`.
* O polling deve iniciar quando houver pelo menos um bloco `pending` e encerrar automaticamente quando nenhum bloco estiver `pending`.
* O drag-and-drop deve permanecer disponível mesmo quando houver bloco `pending`.
* A regeneração deve permanecer disponível para blocos com `audio.status = 'done'`, `error`, `cancelled` ou `idle`.

## 3.2 Não funcionais

* Segurança: `fileName` e `status` de `audio` devem ser preservados pela UI, mas não alterados por handlers de interação; apenas `voice` pode ser alterada no Studio.
* Segurança: endpoints administrativos de geração/cancelamento continuam protegidos por `verifyAuthentication` e `verifyGodAccount`; o endpoint de vozes é público por retornar apenas enum fixo.
* Compatibilidade retroativa: blocos sem `audio` devem continuar válidos e receber `audio = { fileName: '', voice: 'panda', status: 'idle' }` somente quando o operador alterar a voz localmente.
* Resiliência: falhas nas chamadas de geração, lote, cancelamento ou polling devem exibir toast e preservar o estado local anterior.
* Latência: o polling deve usar intervalo fixo de 3000ms apenas enquanto houver `pending`.
* Consistência operacional: ações de geração devem sincronizar mudanças locais antes de chamar endpoints que operam por `blockIndex`, evitando áudio gerado a partir de conteúdo/voz obsoletos.

# 4. O que já existe?

## Camada UI (Studio)

* **`LessonStoryRoute`** (`apps/studio/src/app/routes/LessonStoryRoute.tsx`) - Resolve `starId`, `starName` e `starNumber` da estrela e renderiza `LessonStoryPage`.
* **`LessonStoryPage`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/index.tsx`) - Entry point da página; injeta `lessonService`, `toastProvider` e `starId` no hook da página.
* **`useLessonStoryPage`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/useLessonStoryPage.ts`) - Carrega blocos, mantém estado local, serializa blocos para salvar, controla preview, reordenação e action button.
* **`LessonStoryPageView`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/LessonStoryPageView.tsx`) - Renderiza editor, preview MDX, loading, erro e bloqueios da aba.
* **`TextBlocks`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/index.tsx`) - Exporta `TextBlocksView` diretamente.
* **`TextBlocksView`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlocksView.tsx`) - Renderiza header, busca, botões de criação de bloco e lista reordenável com `SortableList`.
* **`TextBlockCard`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/index.tsx`) - Entry point do card; conecta `useTextBlockCard` e `TextBlockCardView`.
* **`useTextBlockCard`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/useTextBlockCard.ts`) - Calcula preview, visibilidade de imagem/runnable e label de conteúdo.
* **`TextBlockCardView`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/TextBlockCardView.tsx`) - Renderiza card expansível com campos de conteúdo, imagem e runnable.
* **`useFetch`** (`apps/studio/src/ui/global/hooks/useFetch.ts`) - Hook baseado em TanStack Query; já suporta `refreshInterval`, `refetch` e `updateData`.
* **`useFileStorage`** (`apps/studio/src/ui/global/hooks/useFileStorage.ts`) - Monta URL pública usando `ENV.supabaseCdnUrl` e `FileStorageFolderPath.value`.
* **`SortableList`** (`apps/studio/src/ui/global/widgets/components/SortableList/index.tsx`) - Wrapper de DnD usado para reordenar blocos.
* **`select`, `button`, `badge`, `skeleton`** (`apps/studio/src/ui/shadcn/components`) - Componentes base disponíveis para controles de áudio.

## Camada REST (Studio)

* **`LessonService`** (`apps/studio/src/rest/services/LessonService.ts`) - Implementa `fetchTextsBlocks`, `updateTextBlocks`, `fetchStarStory`, `fetchQuestions`, `updateStory`, `updateQuestions` e métodos de explicação de código.
* **`RestContext`** (`apps/studio/src/ui/global/contexts/RestContext/useRestContextProvider.ts`) - Disponibiliza `lessonService` para a UI.
* **`AxiosRestClient`** (`apps/studio/src/rest/axios/AxiosRestClient.ts`) - Cliente REST usado pelos services do Studio.

## Camada Hono App (Server)

* **`LessonRouter`** (`apps/server/src/app/hono/routers/lesson/LessonRouter.ts`) - Registra routers de `questions`, `stories`, `text-blocks` e `code-explanation` sob `/lesson`.
* **`TextBlocksRouter`** (`apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`) - Já expõe `GET /lesson/text-blocks/star/:starId`, `PUT /lesson/text-blocks/star/:starId`, `POST /lesson/text-blocks/star/:starId/audio`, `POST /lesson/text-blocks/star/:starId/audio/batch`, `DELETE /lesson/text-blocks/star/:starId/audio` e `DELETE /lesson/text-blocks/star/:starId/audio/batch`.
* **`AuthMiddleware`** (`apps/server/src/app/hono/middlewares/AuthMiddleware.ts`) - Protege endpoints administrativos com autenticação e god account.
* **`ValidationMiddleware`** (`apps/server/src/app/hono/middlewares/ValidationMiddleware.ts`) - Valida params/body com schemas Zod.

## Camada REST (Controllers Server)

* **`TriggerTextBlockAudioGenerationController`** (`apps/server/src/rest/controllers/lesson/TriggerTextBlockAudioGenerationController.ts`) - Dispara geração individual e retorna `202` com `TextBlockDto[]`.
* **`TriggerTextBlocksAudioGenerationInBatchController`** (`apps/server/src/rest/controllers/lesson/TriggerTextBlocksAudioGenerationInBatchController.ts`) - Dispara geração em lote e retorna `202` com `TextBlockDto[]`.
* **`CancelTextBlockAudioGenerationController`** (`apps/server/src/rest/controllers/lesson/CancelTextBlockAudioGenerationController.ts`) - Publica cancelamento individual e retorna `202`.
* **`CancelTextBlocksAudioGenerationInBatchController`** (`apps/server/src/rest/controllers/lesson/CancelTextBlocksAudioGenerationInBatchController.ts`) - Publica cancelamentos em lote e retorna `202`.

## Pacote Core

* **`LessonService`** (`packages/core/src/lesson/interfaces/LessonService.ts`) - Contrato REST compartilhado; ainda não possui métodos de áudio.
* **`TextBlockDto`** (`packages/core/src/global/domain/entities/dtos/TextBlockDto.ts`) - DTO de bloco; já possui `audio?: TextBlockAudioDto`.
* **`TextBlockAudioDto`** (`packages/core/src/global/domain/entities/dtos/TextBlockAudioDto.ts`) - DTO de áudio com `fileName`, `voice` e `status`.
* **`TextBlock`** (`packages/core/src/lesson/domain/structures/TextBlock.ts`) - Structure do bloco; já possui `canHaveAudio`, `audio` e `setAudio`.
* **`TextBlockAudio`** (`packages/core/src/lesson/domain/structures/TextBlockAudio.ts`) - Structure do áudio; suporta `idle`, `pending`, `error`, `done` e `cancelled`.
* **`AudioVoice`** (`packages/core/src/lesson/domain/structures/AudioVoice.ts`) - Structure de voz; aceita `panda`, `shark`, `princess` e usa `panda` como default.
* **`FileStorageFolderPath.createAsAudiosStory`** (`packages/core/src/storage/domain/structures/FileStorageFolderPath.ts`) - Define a pasta pública `audios/story` usada para arquivos de áudio.

## Pacote Validation

* **`textBlockSchema`** (`packages/validation/src/modules/lesson/schemas/textBlockSchema.ts`) - Valida blocos no `PUT /lesson/text-blocks`, mas ainda não aceita `audio`.
* **`audioVoiceSchema`** (`packages/validation/src/modules/lesson/schemas/audioVoiceSchema.ts`) - Valida `panda`, `shark` e `princess`.
* **`requestTextBlockAudioGenerationSchema`** (`packages/validation/src/modules/lesson/schemas/requestTextBlockAudioGenerationSchema.ts`) - Valida `{ blockIndex, voice }` para geração individual.

# 5. O que deve ser criado?

## Pacote Core (DTOs)

* **Localização:** `packages/core/src/lesson/domain/structures/dtos/AudioVoiceDto.ts` (**novo arquivo**)
* **props:** `value: AudioVoiceValue`, `label: string`.

## Camada REST (Controllers)

* **Localização:** `apps/server/src/rest/controllers/lesson/FetchAudioVoicesController.ts` (**novo arquivo**)
* **Dependências:** Não aplicável.
* **Dados de request:** Não aplicável.
* **Dados de response:** `AudioVoiceDto[]` com `{ value: 'panda', label: 'Panda' }`, `{ value: 'shark', label: 'Tubarão' }` e `{ value: 'princess', label: 'Princesa' }`.
* **Métodos:** `handle(http: Http): Promise<RestResponse<AudioVoiceDto[]>>` — retorna a lista fixa de vozes aceitas pelo domínio com HTTP `200`.

## Pacote Validation (Schemas)

* **Localização:** `packages/validation/src/modules/lesson/schemas/textBlockAudioSchema.ts` (**novo arquivo**)
* **Atributos:** `fileName: z.string()`, `voice: audioVoiceSchema`, `status: z.enum(['idle', 'pending', 'error', 'done', 'cancelled'])`.

## Camada Hono App (Routes)

* **Localização:** `apps/server/src/app/hono/routers/lesson/AudioVoicesRouter.ts` (**novo arquivo**)
* **Middlewares:** Não aplicável; rota pública por retornar apenas lista fixa de vozes.
* **Caminho da rota:** `GET /lesson/audio-voices`.
* **Dados de schema:** Não aplicável.

## Camada UI (Hooks)

* **Localização:** `apps/studio/src/ui/global/hooks/useStorageAudio.ts` (**novo arquivo**)
* **Métodos:** `useStorageAudio(fileName?: string): { url: string | null }` — retorna URL pública de `audios/story/{fileName}` usando `useFileStorage(FileStorageFolderPath.createAsAudiosStory(), fileName)` ou `null` quando `fileName` estiver ausente.

* **Localização:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/useAudioGenerationPolling.ts` (**novo arquivo**)
* **Métodos:** `useAudioGenerationPolling(params: { starId: Id; textBlocks: TextBlockEditorItem[]; lessonService: LessonService; onUpdate(textBlocks: TextBlockDto[]): void; onError(message: string): void }): { isPolling: boolean }` — cria intervalo de 3000ms enquanto houver bloco `pending`, chama `lessonService.fetchTextsBlocks(starId)` e envia a resposta para `onUpdate`.

* **Localização:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioPlayer/useBlockAudioPlayer.ts` (**novo arquivo**)
* **Métodos:** `useBlockAudioPlayer(params: { url: string }): { audioRef: RefObject<HTMLAudioElement | null>; isPlaying: boolean; progress: number; currentTimeLabel: string; durationLabel: string; togglePlay(): void; handleSeek(progress: number): void }` — controla reprodução de um `HTMLAudioElement`, progresso percentual e formatação de tempo.

## Camada UI (Widgets)

* **Localização:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockVoiceSelector` (**novo diretório**)
* **Props:** `voices: AudioVoiceDto[]`, `value: AudioVoiceValue`, `isDisabled?: boolean`, `onChange(voice: AudioVoiceValue): void`.
* **Estados (Client Component):** Loading não aplicável no widget; Error não aplicável no widget; Empty renderiza `panda` como opção fallback se `voices` estiver vazio; Content renderiza `Select` com as vozes recebidas.
* **View:** `BlockVoiceSelectorView` em `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockVoiceSelector/BlockVoiceSelectorView.tsx` (**novo arquivo**).
* **Hook (se aplicável):** Não aplicável.
* **Index:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockVoiceSelector/index.tsx` (**novo arquivo**) delega renderização para a View.
* **Widgets internos:** Não aplicável.
* **Estrutura de pastas:**

```text
BlockVoiceSelector/
├── BlockVoiceSelectorView.tsx
└── index.tsx
```

* **Localização:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioPlayer` (**novo diretório**)
* **Props:** `fileName: string`.
* **Estados (Client Component):** Loading não aplicável; Error renderiza fallback compacto quando a URL não puder ser montada; Empty retorna `null` quando `fileName` estiver vazio; Content renderiza player compacto.
* **View:** `BlockAudioPlayerView` em `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioPlayer/BlockAudioPlayerView.tsx` (**novo arquivo**).
* **Hook (se aplicável):** `useBlockAudioPlayer` em `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioPlayer/useBlockAudioPlayer.ts` (**novo arquivo**).
* **Index:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioPlayer/index.tsx` (**novo arquivo**) monta URL com `useStorageAudio`, executa hook e passa estado para a View.
* **Widgets internos:** Não aplicável.
* **Estrutura de pastas:**

```text
BlockAudioPlayer/
├── BlockAudioPlayerView.tsx
├── index.tsx
└── useBlockAudioPlayer.ts
```

* **Localização:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls` (**novo diretório**)
* **Props:** `item: TextBlockEditorItem`, `voices: AudioVoiceDto[]`, `isGenerateDisabled: boolean`, `isGenerating: boolean`, `onVoiceChange(voice: AudioVoiceValue): void`, `onGenerate(): void`, `onCancel(): void`.
* **Estados (Client Component):** Loading exibe botão de geração em estado de loading quando `isGenerating` for `true`; Error exibe badge quando `item.audio?.status === 'error'`; Empty exibe seletor e CTA de gerar quando não houver áudio ou status for `idle`; Content exibe player quando `done`, spinner/botão cancelar quando `pending`, badge quando `cancelled`.
* **View:** `BlockAudioControlsView` em `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/BlockAudioControlsView.tsx` (**novo arquivo**).
* **Hook (se aplicável):** `useBlockAudioControls` em `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/useBlockAudioControls.ts` (**novo arquivo**) calcula `voice`, `status`, `canShowPlayer`, `canCancel`, `statusLabel` e `statusVariant`.
* **Index:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/index.tsx` (**novo arquivo**) compõe `BlockVoiceSelector`, `BlockAudioPlayer` e View.
* **Widgets internos:** `BlockVoiceSelector`, `BlockAudioPlayer`.
* **Estrutura de pastas:**

```text
BlockAudioControls/
├── BlockAudioControlsView.tsx
├── index.tsx
└── useBlockAudioControls.ts
```

# 6. O que deve ser modificado?

## Pacote Core

* **Arquivo:** `packages/core/src/lesson/interfaces/LessonService.ts`
* **Mudança:** Adicionar métodos `fetchAudioVoices(): Promise<RestResponse<AudioVoiceDto[]>>`, `triggerTextBlockAudioGeneration(starId: Id, blockIndex: Integer, voice: AudioVoice): Promise<RestResponse<TextBlockDto[]>>`, `triggerTextBlocksAudioGenerationInBatch(starId: Id): Promise<RestResponse<TextBlockDto[]>>`, `cancelTextBlockAudioGeneration(starId: Id, blockIndex: Integer): Promise<RestResponse<TextBlockDto[]>>` e `cancelTextBlocksAudioGenerationInBatch(starId: Id): Promise<RestResponse<TextBlockDto[]>>`.
* **Justificativa:** Studio precisa consumir contratos REST de áudio de forma tipada e consistente com a regra de services receberem objetos de domínio quando existirem.
* **Camada:** `rest`

* **Arquivo:** `packages/core/src/lesson/domain/structures/dtos/index.ts`
* **Mudança:** Exportar `AudioVoiceDto`.
* **Justificativa:** O DTO de vozes deve ser consumido pelo controller server e pelo service/UI do Studio.
* **Camada:** `core`

## Pacote Validation

* **Arquivo:** `packages/validation/src/modules/lesson/schemas/textBlockSchema.ts`
* **Mudança:** Adicionar `audio: textBlockAudioSchema.optional()` ao schema do bloco.
* **Justificativa:** O editor salva `stars.texts` como documento JSONB completo; sem aceitar `audio`, o `PUT /lesson/text-blocks` remove estado de áudio já persistido.
* **Camada:** `rest`

* **Arquivo:** `packages/validation/src/modules/lesson/schemas/index.ts`
* **Mudança:** Exportar `textBlockAudioSchema`.
* **Justificativa:** Manter schemas do módulo expostos via barrel.
* **Camada:** `rest`

## Camada Hono App

* **Arquivo:** `apps/server/src/app/hono/routers/lesson/LessonRouter.ts`
* **Mudança:** Instanciar `AudioVoicesRouter` e registrar suas rotas sob `/lesson`.
* **Justificativa:** Expor `GET /lesson/audio-voices` no mesmo módulo REST consumido pelo Studio.
* **Camada:** `rest`

## Camada REST (Controllers)

* **Arquivo:** `apps/server/src/rest/controllers/lesson/index.ts`
* **Mudança:** Exportar `FetchAudioVoicesController`.
* **Justificativa:** Seguir padrão de barrel dos controllers de `lesson`.
* **Camada:** `rest`

## Camada REST (Services)

* **Arquivo:** `apps/studio/src/rest/services/LessonService.ts`
* **Mudança:** Implementar `fetchAudioVoices`, `triggerTextBlockAudioGeneration`, `triggerTextBlocksAudioGenerationInBatch`, `cancelTextBlockAudioGeneration` e `cancelTextBlocksAudioGenerationInBatch` usando rotas relativas de `/lesson`.
* **Justificativa:** Disponibilizar à UI os contratos server já existentes e o novo endpoint de vozes.
* **Camada:** `rest`

## Camada UI (Types)

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/types.ts`
* **Mudança:** Garantir que `TextBlockEditorItem` preserve `audio?: TextBlockAudioDto` herdado de `TextBlockDto` e, se necessário, importar `AudioVoiceValue` para tipar handlers de voz.
* **Justificativa:** O editor atual descarta `audio` durante normalização/salvamento; a UI precisa manter esse subdocumento junto ao bloco.
* **Camada:** `ui`

## Camada UI (Widgets)

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/useLessonStoryPage.ts`
* **Mudança:** Preservar `audio` em `toEditorItem` e `toPersistedTextBlock`; buscar `audioVoices`; calcular `hasAudioPending`; integrar `useAudioGenerationPolling`; adicionar handlers `handleAudioVoiceChange(blockId, voice)`, `handleGenerateTextBlockAudio(blockId)`, `handleGenerateAllTextBlocksAudios()`, `handleCancelTextBlockAudio(blockId)` e `handleCancelAllTextBlocksAudios()`; criar helper privado `syncTextBlocksBeforeAudioAction(): Promise<boolean>` para salvar alterações locais antes de gerar áudio.
* **Justificativa:** Centralizar orquestração da página, manter geração por `blockIndex` consistente com a versão persistida e alimentar widgets filhos.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/LessonStoryPageView.tsx`
* **Mudança:** Repassar `audioVoices`, `hasAudioPending`, `isAudioPolling`, handlers de voz/geração/cancelamento e estado de execução para `TextBlocks`.
* **Justificativa:** Propagar novos contratos do hook da página sem adicionar lógica à View.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlocksView.tsx`
* **Mudança:** Adicionar botão de geração em lote no header e exibir indicador discreto de polling quando `isAudioPolling` for `true`, mantendo `SortableList` ativo durante todo o ciclo de geração.
* **Justificativa:** Cumprir ação em lote e preservar drag-and-drop mesmo com blocos `pending`.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/index.tsx`
* **Mudança:** Receber vozes, flags e handlers de áudio; calcular `blockIndex` no nível da lista/página e repassar callbacks já vinculados ao bloco.
* **Justificativa:** O card precisa compor controles de áudio mantendo dependências resolvidas acima.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/useTextBlockCard.ts`
* **Mudança:** Adicionar cálculos `canHaveAudio`, `audioStatus`, `isAudioPending`, `isAudioDone`, `isAudioError`, `isAudioCancelled`, `audioVoice` e `isGenerateAudioDisabled`.
* **Justificativa:** Concentrar lógica de estado do card fora da View.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/TextBlockCardView.tsx`
* **Mudança:** Renderizar `BlockAudioControls` dentro do `CollapsibleContent`, abaixo de `BlockContentField` e antes dos campos de imagem/runnable, apenas quando `canHaveAudio` for verdadeiro.
* **Justificativa:** Colocar seletor, geração e player dentro do card expandido, conforme PRD.
* **Camada:** `ui`

# 7. O que deve ser removido?

Não aplicável.

# 8. Decisões Técnicas e Trade-offs

* **Decisão:** Manter geração e cancelamento consumindo os endpoints já existentes em `/lesson/text-blocks/star/:starId/audio`.
* **Alternativas consideradas:** Criar novos endpoints específicos para Studio ou mover geração para RPC local.
* **Motivo da escolha:** O backend da spec anterior já expõe o contrato REST assíncrono com autorização, Inngest e persistência parcial.
* **Impactos / trade-offs:** Reduz escopo desta entrega; a UI precisa respeitar `blockIndex` e sincronizar alterações antes de gerar.

* **Decisão:** Criar `GET /lesson/audio-voices` no `server` em vez de hardcodar vozes apenas no Studio.
* **Alternativas consideradas:** Hardcodar `panda`, `shark` e `princess` na UI.
* **Motivo da escolha:** A issue define o endpoint e isso mantém a lista derivada do contrato do backend/domínio.
* **Impactos / trade-offs:** Adiciona uma rota simples e pública no server, mas evita duplicação silenciosa do enum na UI.

* **Decisão:** A geração em lote no Studio não enviará `voice` global.
* **Alternativas consideradas:** Implementar `triggerTextBlocksAudioGenerationInBatch(starId, voice)` como sugerido no esboço da issue.
* **Motivo da escolha:** O backend real não aceita body no lote e o PRD define voz configurada individualmente por bloco.
* **Impactos / trade-offs:** A UI precisa persistir a voz de cada bloco antes de chamar o endpoint de lote.

* **Decisão:** Sincronizar alterações locais antes de geração individual ou em lote quando `hasChanges` for verdadeiro.
* **Alternativas consideradas:** Permitir geração mesmo com alterações locais não salvas ou exigir que o operador clique manualmente em salvar antes.
* **Motivo da escolha:** O backend gera áudio a partir de `stars.texts` persistido, não do conteúdo enviado no body; sincronizar evita áudio para conteúdo/voz obsoletos e mantém o fluxo direto.
* **Impactos / trade-offs:** Clicar em gerar também pode salvar alterações pendentes do editor; em caso de falha no save, a geração não deve ser disparada.

* **Decisão:** Preservar `audio` completo no payload do `PUT /lesson/text-blocks`, tratando-o como parte do documento JSONB do bloco.
* **Alternativas consideradas:** Aceitar apenas `audio.voice` e recompor `fileName/status` no server, adicionar ID persistente por bloco ou bloquear reordenação sempre que houver áudio.
* **Motivo da escolha:** Os blocos vivem como coluna JSONB da estrela e não possuem ID persistente; preservar o subdocumento completo mantém áudio associado ao bloco durante edição/reordenação com menor alteração estrutural.
* **Impactos / trade-offs:** `fileName/status` chegam no schema de entrada, embora sejam controlados pelo servidor. A mitigação é restringir mutações na UI a `voice`, manter endpoints admin protegidos e preservar `fileName/status` recebidos do servidor sem permitir edição direta.

* **Decisão:** Manter drag-and-drop disponível mesmo com blocos `pending`.
* **Alternativas consideradas:** Bloquear reordenação durante `pending` para reduzir o risco de o operador reorganizar blocos enquanto jobs indexados ainda estão em andamento.
* **Motivo da escolha:** Esta entrega deve permitir drag-and-drop mesmo havendo `pending`.
* **Impactos / trade-offs:** A spec passa a depender ainda mais da preservação de `audio` no payload completo dos blocos e da sincronização antes das ações de geração, porque os jobs continuam orientados por `blockIndex` enquanto a lista pode ser reordenada durante o processamento.

* **Decisão:** Implementar player com `<audio>` e `<input type="range">` estilizado, sem adicionar `Slider` shadcn.
* **Alternativas consideradas:** Adicionar novo componente shadcn `slider` ou usar controles nativos completos do navegador.
* **Motivo da escolha:** O Studio ainda não possui `slider.tsx`; o PRD pede player compacto customizado e a barra nativa estilizada é suficiente.
* **Impactos / trade-offs:** Menor dependência visual, mas o hook precisa controlar progresso, seek e formatação de tempo.

# 9. Diagramas e Referências

* **Fluxo de Dados:**

```text
LessonStoryPage
  -> useLessonStoryPage
  -> LessonService.fetchTextsBlocks(starId)
  -> GET /lesson/text-blocks/star/:starId
  -> TextBlocksView
  -> TextBlockCard
  -> BlockAudioControls
  -> BlockVoiceSelector + BlockAudioPlayer

Geração individual
  -> operador altera voz/conteúdo no card
  -> useLessonStoryPage.handleGenerateTextBlockAudio(blockId)
  -> syncTextBlocksBeforeAudioAction() quando hasChanges
  -> LessonService.updateTextBlocks(starId, persistedTextBlocks)
  -> PUT /lesson/text-blocks/star/:starId
  -> LessonService.triggerTextBlockAudioGeneration(starId, blockIndex, voice)
  -> POST /lesson/text-blocks/star/:starId/audio
  -> response 202 TextBlockDto[] com audio.status = pending
  -> update local textBlocks/baseline
  -> useAudioGenerationPolling inicia se existir pending

Polling
  -> useAudioGenerationPolling a cada 3000ms enquanto pending
  -> LessonService.fetchTextsBlocks(starId)
  -> GET /lesson/text-blocks/star/:starId
  -> merge response por índice mantendo ids locais
  -> cards renderizam spinner/player/badges conforme audio.status
  -> encerra quando nenhum bloco estiver pending

Geração em lote
  -> TextBlocksView botão "Gerar áudios"
  -> useLessonStoryPage.handleGenerateAllTextBlocksAudios()
  -> syncTextBlocksBeforeAudioAction() quando hasChanges
  -> LessonService.triggerTextBlocksAudioGenerationInBatch(starId)
  -> POST /lesson/text-blocks/star/:starId/audio/batch
  -> response 202 TextBlockDto[] com blocos elegíveis pending
  -> polling acompanha conclusão individual
```

* **Fluxo Cross-app:**

```text
Studio UI
  -> REST GET /lesson/audio-voices
  -> REST GET /lesson/text-blocks/star/:starId
  -> REST PUT /lesson/text-blocks/star/:starId
  -> REST POST /lesson/text-blocks/star/:starId/audio
  -> REST POST /lesson/text-blocks/star/:starId/audio/batch
  -> REST DELETE /lesson/text-blocks/star/:starId/audio
  -> REST DELETE /lesson/text-blocks/star/:starId/audio/batch

Server Hono/REST
  -> controllers de lesson
  -> use cases de audio generation já existentes
  -> Inngest events/jobs
  -> Supabase stars.texts JSONB
  -> Supabase storage public URL em audios/story/{fileName}

Formato de comunicação: REST JSON.
App que expõe: server.
App que consome: studio.
```

* **Layout:**

```text
LessonStoryPage
├── Header
│   └── ActionButton salvar
├── Editor panel
│   └── TextBlocks
│       ├── Header sticky
│       │   ├── contagem de blocos
│       │   ├── badge/label "atualizando áudio" quando polling
│       │   ├── botão Buscar bloco
│       │   ├── botão Gerar áudios
│       │   └── botões de criação por tipo
│       └── TextBlockCard[]
│           └── expanded content
│               ├── BlockContentField
│               ├── BlockAudioControls
│               │   ├── BlockVoiceSelector
│               │   ├── botão Gerar/Regenerar
│               │   ├── botão Cancelar quando pending
│               │   ├── spinner/status badge
│               │   └── BlockAudioPlayer quando done
│               ├── BlockPictureField quando aplicável
│               └── BlockRunnableField quando code
└── Preview panel
    └── Mdx
```

* **Referências:**

* `documentation/features/lesson/text-blocks-audio-generation/jobs-for-text-blocks-audio-generation-spec.md` - spec backend já implementada para endpoints e jobs de áudio.
* `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts` - rotas existentes de blocos e áudio.
* `apps/server/src/rest/controllers/lesson/TriggerTextBlockAudioGenerationController.ts` - controller de geração individual.
* `apps/server/src/rest/controllers/lesson/TriggerTextBlocksAudioGenerationInBatchController.ts` - controller de geração em lote.
* `apps/studio/src/ui/lesson/widgets/pages/LessonStory/useLessonStoryPage.ts` - hook central que deve orquestrar estado, save, polling e ações de áudio.
* `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard` - widget base do card a ser estendido.
* `apps/studio/src/rest/services/LessonService.ts` - service REST do Studio a ser ampliado.
* `packages/core/src/lesson/interfaces/LessonService.ts` - contrato compartilhado do service.
* `packages/core/src/lesson/domain/structures/TextBlockAudio.ts` - estados de áudio aceitos.
* `packages/core/src/lesson/domain/structures/AudioVoice.ts` - vozes aceitas e default.
* `packages/core/src/storage/domain/structures/FileStorageFolderPath.ts` - pasta pública `audios/story`.
* `packages/validation/src/modules/lesson/schemas/textBlockSchema.ts` - schema que precisa preservar `audio` no update dos blocos.

# 10. Pendências / Dúvidas

Sem pendências.
