---
title: Reativacao do Speaker da Story com Audio Persistido
prd: https://github.com/JohnPetros/stardust/milestone/23
issue: https://github.com/JohnPetros/stardust/issues/417
apps: web, studio, server
status: closed
last_updated_at: 2026-05-28
---

# 1. Objetivo

Reativar o controle de audio nos blocos narrativos da `Story` da Lesson Page no app `web`, usando o audio persistido em `TextBlockDto.audio` para blocos elegiveis (`default`, `alert`, `quote` e `image`) e mantendo a progressao sequencial atual da licao. A implementacao deve migrar a Story para usar exclusivamente `TextBlock[]`, remover o consumo de `storyContent`, validar a existencia do arquivo em `audios/story`, propagar os metadados de audio ate os componentes MDX, substituir o uso antigo de text-to-speech em tempo real por reproducao de arquivo persistido e alinhar o fluxo administrativo do `studio`/`server` para gerar, acompanhar e reproduzir esses audios.

---

# 2. Escopo

## 2.1 In-scope

* Reativar o `Speaker` apenas para blocos da `Story` renderizados a partir de `TextBlock[]`.
* Migrar permanentemente a montagem da `Story` da Lesson Page para a estrutura de blocos, removendo o uso de `storyContent` textual separado por `----`.
* Propagar `audio.fileName` e `audio.status` de `TextBlockDto` para o MDX gerado por `useMdx.parseTextBlocksToMdx`.
* Renderizar o `Speaker` em `Text`, `Alert`, `Quote` e `Image` quando `audio.status === 'done'` e `audio.fileName` existir.
* Verificar se o arquivo de audio existe em `audios/story` antes de renderizar o `Speaker`.
* Resolver a URL publica do audio no app `web` usando `FileStorageFolderPath.createAsAudiosStory()` e `useFileStorage`.
* Controlar `play`, `pause`, `volume`, `playbackRate` e reproducao automatica via elemento HTML `<audio>` no browser.
* Preservar leitura cumulativa, animacao dos chunks e progressao obrigatoria `Story -> Quiz`.
* Remover a dependencia do fluxo antigo de `react-text-to-speech` para o `Speaker` da Lesson Page.
* Permitir gerar, cancelar e acompanhar audios no `studio` para blocos `image`, alem dos blocos `default`, `alert` e `quote`.
* Expor no `studio` as vozes `Panda`, `Tubarão`, `Princesa`, `Alien`, `Robô` e `Salmonense`, usando os valores canonicos `panda`, `shark`, `princess`, `alien`, `robot` e `salmonense`.
* Manter o valor de dominio `alien` mesmo quando o provider OpenAI use internamente a voz `echo`.
* Garantir que o evento de batch de audio publicado pelo `core` tenha o mesmo nome registrado no Inngest.

## 2.2 Out-of-scope

* Gerar, regenerar, cancelar ou validar audio no `web`.
* Criar no `web` qualquer UI administrativa para geracao de audio.
* Criar endpoint para gerar audio de todas as estrelas em lote global.
* Criar migration, tabela, indice, view, constraint, grant ou RLS.
* Reproduzir audio para blocos `user`, `code`, `code-line` ou `list`.
* Manter fallback por `storyContent` textual separado por `----`.
* Criar telemetria, analytics ou metricas novas de uso do speaker.
* Redesenhar a Lesson Page ou alterar o contrato atual de rewarding.

---

# 3. Requisitos

## 3.1 Funcionais

* A Lesson Page deve buscar `questions` e `textsBlocks` por `FetchLessonStoryAndQuestionsAction`, sem buscar ou consumir `storyContent` textual.
* `useLessonPage` deve sempre converter `textsBlocksDto` em `TextBlock[]` e montar a `Story` com `parseTextBlocksToMdx(textBlocks)`.
* `parseTextBlocksToMdx(textBlocks: TextBlock[], audioFiles?: Record<string, boolean>): string[]` deve serializar metadados de audio para os componentes MDX `Text`, `Alert`, `Quote` e `Image` quando o bloco puder ter audio e o arquivo existir no storage.
* `Text`, `Alert`, `Quote` e `Image` devem receber os metadados opcionais `audioFileName` e `audioStatus` e repassa-los ao `Content`.
* A Lesson Page deve listar arquivos de `audios/story` e disponibilizar ao MDX quais `fileName` existem no storage.
* `Content` deve renderizar `Speaker` antes do conteudo textual apenas quando `audioStatus === 'done'`, `audioFileName` for uma string nao vazia e o arquivo existir no storage.
* `Speaker` deve montar a URL publica a partir de `audios/story/{fileName}` e reproduzir o arquivo persistido.
* O botao do `Speaker` deve alternar entre iniciar e pausar o audio do bloco correspondente.
* O `Speaker` deve pausar automaticamente quando o chunk deixar de ser o chunk ativo/animado.
* O `Speaker` deve respeitar as configuracoes persistidas de volume, velocidade e reproducao automatica.
* Ao terminar a reproducao, o estado visual do botao deve voltar para o estado de iniciar.
* A ausencia de audio, audio com status diferente de `done`, `fileName` vazio ou arquivo ausente no storage deve ocultar o `Speaker` sem alterar o texto do bloco.
* Blocos ja lidos devem permanecer visiveis e continuar interativos enquanto a Story avanca.

## 3.2 Nao funcionais

* **Acessibilidade:** o botao do `Speaker` deve ser um `<button type='button'>` acionavel por teclado, com `aria-label` alternando entre iniciar e pausar reproducao.
* **Compatibilidade retroativa:** usos de `Mdx`, `Text`, `Alert`, `Quote`, `Image` e `Content` sem props de audio devem manter o comportamento atual.
* **Performance:** o audio deve usar `preload='metadata'` para evitar download completo antecipado de todos os chunks visiveis.
* **Resiliencia:** falha de `audio.play()` ou URL indisponivel nao deve quebrar a renderizacao da Story; o componente deve apenas manter ou retornar ao estado parado.
* **Seguranca:** a URL deve ser montada somente a partir do `fileName` recebido do contrato existente e da pasta fixa `FileStorageFolderPath.createAsAudiosStory()`, sem aceitar pasta dinamica via MDX.
* **Idempotencia operacional:** o Studio deve consultar o storage por `fileName` especifico e repetir a checagem enquanto houver arquivo referenciado ainda ausente, evitando esconder o player quando o upload concluir logo apos o status virar `done`.

---

# 4. O que ja existe?

## Web RPC

* **`FetchLessonStoryAndQuestionsAction`** (`apps/web/src/rpc/actions/lesson/FetchLessonStoryAndQuestionsAction.ts`) - action que busca perguntas e blocos de texto da estrela, retornando `{ questions: QuestionDto[]; textsBlocks: TextBlockDto[] }` sem story textual legada.
* **`lessonActions.fetchLessonStoryAndQuestions`** (`apps/web/src/rpc/next-safe-action/lessonActions.ts`) - composition root que instancia `LessonService` e executa a action com schema `{ starId: idSchema }`.
* **`LessonService`** (`apps/web/src/rest/services/LessonService.ts`) - service REST ja possui `fetchTextsBlocks(starId)` e endpoints relacionados a audio, embora esta spec nao precise chamar endpoints de geracao ou cancelamento.

## Web UI

* **`LessonPage`** (`apps/web/src/ui/lesson/widgets/pages/Lesson/index.tsx`) - widget principal da Lesson Page que recebe `questionsDto` e `textsBlocksDto`, resolve `storageService` via `useRestContext()` e nao recebe `storyContent`.
* **`useLessonPage`** (`apps/web/src/ui/lesson/widgets/pages/Lesson/useLessonPage.ts`) - cria `TextBlock[]` a partir de `textsBlocksDto`, consulta `useStoryAudioFiles` e monta a Story exclusivamente por `Story.create(parseTextBlocksToMdx(textBlocks, audioFiles))`.
* **`StoryStageView`** (`apps/web/src/ui/lesson/widgets/pages/Lesson/StoryStage/StoryStageView.tsx`) - renderiza leitura cumulativa com `story.readChunks.map(...)` sem `SpeakerContextProvider`.
* **`StoryChunk`** (`apps/web/src/ui/lesson/widgets/pages/Lesson/StoryStage/StoryChunk/index.tsx`) - client component memoizado que injeta `hasAnimation` no chunk MDX.
* **`StoryChunkView`** (`apps/web/src/ui/lesson/widgets/pages/Lesson/StoryStage/StoryChunk/StoryChunkView.tsx`) - renderiza `<Mdx lessonCodeExplanation={{ source: 'story', chunkIndex }}>{chunk}</Mdx>`.
* **`useMdx`** (`apps/web/src/ui/global/widgets/components/Mdx/hooks/useMdx.ts`) - serializa `TextBlock[]` para strings MDX, incluindo `title`, `picture`, `audioFileName` e `audioStatus` para tipos elegiveis.
* **`MdxView`** (`apps/web/src/ui/global/widgets/components/Mdx/MdxView.tsx`) - registra overrides de `Text`, `Alert`, `Quote`, `Image`, `User`, `Code`, `strong`, `p` e links via `markdown-to-jsx`.
* **`TextView`** (`apps/web/src/ui/global/widgets/components/Mdx/Text/TextView.tsx`) - renderiza bloco `Text` e delega conteudo textual para `Content`.
* **`AlertView`** (`apps/web/src/ui/global/widgets/components/Mdx/Alert/AlertView.tsx`) - renderiza bloco `Alert` e delega conteudo textual para `Content`.
* **`QuoteView`** (`apps/web/src/ui/global/widgets/components/Mdx/Quote/QuoteView.tsx`) - renderiza bloco `Quote` e delega conteudo textual para `Content`.
* **`ContentView`** (`apps/web/src/ui/global/widgets/components/Mdx/Content/ContentView.tsx`) - ponto comum que renderiza `Speaker` antes do texto quando o bloco possui audio `done` e `fileName`.
* **`ImageView`** (`apps/web/src/ui/global/widgets/components/Mdx/Image/ImageView.tsx`) - renderiza imagem da story e repassa `audioFileName`/`audioStatus` ao `Content` da legenda.
* **`Speaker`** (`apps/web/src/ui/global/widgets/components/Speaker/index.tsx`) - componente baseado em `fileName`, `useStorageAudio`, configuracoes locais de volume/velocidade/autoplay e controle nativo de `<audio>`.
* **`useSpeaker`** (`apps/web/src/ui/global/widgets/components/Speaker/useSpeaker.ts`) - hook que controla `HTMLAudioElement`, aplica volume/velocidade, pausa ao sair do chunk ativo e tenta autoplay quando configurado.
* **`useSpeakerSettings`** (`apps/web/src/ui/global/widgets/components/Speaker/useSpeakerSettings.ts`) - hook que persiste volume, velocidade e reproducao automatica no localStorage.
* **`SpeakerView`** (`apps/web/src/ui/global/widgets/components/Speaker/SpeakerView.tsx`) - view com botao de start/pause, elemento `<audio>` e dialog inline de configuracoes de audio persistido.
* **`useFileStorage`** (`apps/web/src/ui/global/hooks/useFileStorage.ts`) - monta URL publica da CDN com `${CLIENT_ENV.supabaseCdnUrl}/${folderPath.value}/${fileName}`.
* **`StorageService`** (`apps/web/src/rest/services/StorageService.ts`) - implementa `listFiles(params: FilesListingParams)` via `GET /storage/files`, aceitando `folder`, `search`, `page` e `itemsPerPage`.
* **`RestContextProvider`** (`apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`) - disponibiliza `storageService` para widgets client-side do `web`.

## Core

* **`TextBlockDto`** (`packages/core/src/global/domain/entities/dtos/TextBlockDto.ts`) - contrato compartilhado que ja expoe `audio?: TextBlockAudioDto`.
* **`TextBlockAudioDto`** (`packages/core/src/global/domain/entities/dtos/TextBlockAudioDto.ts`) - contrato de audio com `fileName`, `voice` e `status`.
* **`TextBlock`** (`packages/core/src/lesson/domain/structures/TextBlock.ts`) - estrutura que preserva `audio` no `dto` e expoe `canHaveAudio` para `default`, `alert`, `quote` e `image`.
* **`TextBlockAudio`** (`packages/core/src/lesson/domain/structures/TextBlockAudio.ts`) - estrutura de audio com status aceitos `idle`, `pending`, `error`, `done` e `cancelled`.
* **`AudioVoice`** (`packages/core/src/lesson/domain/structures/AudioVoice.ts`) - estrutura que aceita `panda`, `shark`, `princess`, `alien`, `robot` e `salmonense`.
* **`TextBlocksAudioGenerationInBatchRequestedEvent`** (`packages/core/src/lesson/domain/events/TextBlocksAudioGenerationInBatchRequestedEvent.ts`) - evento de batch com nome canonico `lesson/text-blocks.audio.generation.in-batch.requested`, alinhado ao trigger do Inngest.
* **`FileStorageFolderPath`** (`packages/core/src/storage/domain/structures/FileStorageFolderPath.ts`) - define `createAsAudiosStory()` retornando a pasta canonica `audios/story`.

## Studio Como Referencia

* **`useStorageAudio`** (`apps/studio/src/ui/global/hooks/useStorageAudio.ts`) - wrapper que usa `FileStorageFolderPath.createAsAudiosStory()` e `useFileStorage(fileName)` para retornar `{ url: string | null }`.
* **`BlockAudioPlayer`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioPlayer/index.tsx`) - referencia de player com URL publica de audio persistido.
* **`useBlockAudioPlayer`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioPlayer/useBlockAudioPlayer.ts`) - referencia de controle HTMLAudioElement com `audioRef`, `isPlaying`, eventos de metadata/timeupdate/ended e `togglePlay()`.
* **`BlockAudioControls`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioControls/useBlockAudioControls.ts`) - referencia de regra de exibicao de player apenas com `status === 'done'`, `fileName` e arquivo presente no storage.
* **`useTextBlocks`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/useTextBlocks.ts`) - lista arquivos de audio referenciados por `fileName`, com retry enquanto algum arquivo esperado ainda nao estiver disponivel no storage.
* **`useLessonStoryPage`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/useLessonStoryPage.ts`) - pagina administrativa que suporta blocos `image`, sincroniza alteracoes antes de gerar audio e aciona geracao individual/batch.
* **`FetchAudioVoicesController`** (`apps/server/src/rest/controllers/lesson/FetchAudioVoicesController.ts`) - expõe as vozes disponiveis para o Studio com labels simplificados.
* **`OpenAITtsProvider`** (`apps/server/src/provision/tts/open-ai/OpenAITtsProvider.ts`) - provider principal de TTS com mapeamento interno das vozes de dominio, incluindo `alien -> echo`.

---

# 5. O que deve ser criado?

## Camada UI (Hooks)

* **Localizacao:** `apps/web/src/ui/global/hooks/useStorageAudio.ts` - **novo arquivo**
* **Dependencias:** `FileStorageFolderPath` de `@stardust/core/storage/structures` e `useFileStorage` de `apps/web/src/ui/global/hooks/useFileStorage.ts`.
* **Metodos:** `useStorageAudio(fileName?: string): { url: string | null }` - retorna `null` quando `fileName` estiver ausente e, caso contrario, monta a URL publica em `audios/story` usando o helper existente do `web`.

* **Localizacao:** `apps/web/src/ui/global/widgets/components/Speaker/useSpeakerSettings.ts` - **novo arquivo**
* **Dependencias:** `STORAGE` de `apps/web/src/constants/storage.ts` e `useLocalStorage` de `apps/web/src/ui/global/hooks/useLocalStorage.ts`.
* **Metodos:** `useSpeakerSettings(): { volume: number; rate: number; shouldAutoPlay: boolean; handleVolumeChange(volume: number): void; handleRateChange(rate: number): void; handleAutoPlayToggle(isChecked: boolean): void }` - mantem configuracoes de audio persistido no browser sem depender do contexto antigo de TTS.

* **Localizacao:** `apps/web/src/ui/lesson/widgets/pages/Lesson/useStoryAudioFiles.ts` - **novo arquivo**
* **Dependencias:** `StorageService` de `@stardust/core/storage/interfaces`, `TextBlockDto` de `@stardust/core/global/entities/dtos`, `FileStorageFolderPath.createAsAudiosStory()`, `Text` e `Integer` de `@stardust/core/global/structures`.
* **Metodos:** `useStoryAudioFiles(params: { storageService: StorageService; textBlocksDto: TextBlockDto[] }): { audioFiles: Record<string, boolean>; isLoading: boolean }` - lista em `audios/story` apenas os arquivos referenciados por blocos com `audio.status === 'done'`, monta um mapa `fileName -> exists` e considera arquivo ausente como `false` em falhas ou resposta sem correspondencia.

---

# 6. O que deve ser modificado?

## Camada UI

* **Arquivo:** `apps/web/src/app/lesson/[starSlug]/page.tsx`
* **Mudanca:** remover o repasse de `storyContent={lessonResponse.data.story}` para `LessonPage`.
* **Justificativa:** a Lesson Page deve ser montada exclusivamente a partir de `textsBlocksDto`, preservando metadados estruturados como `audio`.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/index.tsx`
* **Mudanca:** remover a prop `storyContent` do tipo de props e da chamada `useLessonPage(...)`; obter `storageService` via `useRestContext()` e repassar para o hook da pagina.
* **Justificativa:** `storyContent` deixa de fazer parte do contrato interno da pagina, e `storageService` passa a ser necessario para validar existencia de arquivos de audio.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/useLessonPage.ts`
* **Mudanca:** remover o parametro `storyContent: string`; receber `storageService: StorageService`; usar `useStoryAudioFiles({ storageService, textBlocksDto })`; criar `TextBlock[]` e chamar sempre `Story.create(parseTextBlocksToMdx(textBlocks, audioFiles))`.
* **Justificativa:** a Story deve ser baseada permanentemente nos blocos estruturados e a serializacao MDX precisa saber se o arquivo de audio existe antes de gerar props para o `Speaker`.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Mdx/hooks/useMdx.ts`
* **Mudanca:** alterar a assinatura para `parseTextBlocksToMdx(textBlocks: TextBlock[], audioFiles?: Record<string, boolean>): string[]`; expandir `parseOrtherProps(textBlockDto: TextBlockDto, canIncludeAudio: boolean)` para serializar tambem `audioFileName` e `audioStatus` somente quando `canIncludeAudio` for verdadeiro, `textBlockDto.audio?.fileName` existir, `textBlockDto.audio?.status` existir e `audioFiles[textBlockDto.audio.fileName] === true`; `parseMdx(textBlock: TextBlock)` deve incluir essas props somente para blocos com `textBlock.canHaveAudio.value === true` e componentes `Text`, `Alert`, `Quote` e `Image`.
* **Justificativa:** o fluxo atual converte `TextBlock` em string MDX e descarta `audio`; sem serializacao explicita, os componentes de renderizacao nao conseguem decidir se devem exibir o `Speaker`.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Mdx/Text/TextView.tsx`
* **Mudanca:** adicionar props opcionais `audioFileName?: string` e `audioStatus?: string` ao tipo do widget e repassa-las para `<Content type='default' ...>`.
* **Justificativa:** `Text` e um dos tipos elegiveis para audio persistido segundo `TextBlock.canHaveAudio`.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Mdx/Alert/AlertView.tsx`
* **Mudanca:** adicionar props opcionais `audioFileName?: string` e `audioStatus?: string` ao tipo do widget e repassa-las para `<Content type='alert' ...>`.
* **Justificativa:** `Alert` e um dos tipos elegiveis para audio persistido segundo `TextBlock.canHaveAudio`.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Mdx/Quote/QuoteView.tsx`
* **Mudanca:** adicionar props opcionais `audioFileName?: string` e `audioStatus?: string` ao tipo do widget e repassa-las para `<Content type='quote' ...>`.
* **Justificativa:** `Quote` e um dos tipos elegiveis para audio persistido segundo `TextBlock.canHaveAudio`.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Mdx/Image/ImageView.tsx`
* **Mudanca:** adicionar props opcionais `audioFileName?: string` e `audioStatus?: string` ao tipo do widget e repassa-las para o `<Content>` da legenda.
* **Justificativa:** `Image` passou a ser um tipo elegivel para audio persistido segundo `TextBlock.canHaveAudio`, usando a legenda/conteudo do bloco como texto do audio.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Mdx/Content/ContentView.tsx`
* **Mudanca:** adicionar props opcionais `audioFileName?: string` e `audioStatus?: string`; calcular `const shouldRenderSpeaker = audioStatus === 'done'`; renderizar `<Speaker fileName={audioFileName} isActive={hasAnimation} />` antes do conteudo textual apenas quando `shouldRenderSpeaker` for verdadeiro e `audioFileName` existir; remover o bloco comentado que passava `text` para o `Speaker` antigo.
* **Justificativa:** `Content` e o ponto comum de renderizacao textual de `Text`, `Alert`, `Quote` e legenda de `Image`, permitindo aplicar a regra de exibicao sem duplicar o player em cada widget.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Speaker/index.tsx`
* **Mudanca:** alterar o contrato de props para `type Props = { fileName?: string; isActive?: boolean }`; usar `useStorageAudio(fileName)` para obter a URL; se `fileName` ou `url` estiverem ausentes, retornar `null`; usar `useSpeakerSettings()`; chamar `useSpeaker({ url, volume, rate, shouldAutoPlay, isActive })`; renderizar `SpeakerView` com `url`, `audioRef`, `isPlaying`, `onTogglePlay`, `volume`, `rate`, `shouldAutoPlay` e handlers de configuracao.
* **Justificativa:** o `Speaker` deve reproduzir audio persistido de storage, nao texto por TTS em tempo real.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Speaker/useSpeaker.ts`
* **Mudanca:** substituir `react-text-to-speech` por controle nativo de `<audio>`.
* **Justificativa:** a feature depende de arquivo persistido em `TextBlockDto.audio.fileName`, e nao de sintese do texto renderizado.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Speaker/useSpeaker.ts`
* **Mudanca:** expor a assinatura `useSpeaker(params: { url: string; volume: number; rate: number; shouldAutoPlay: boolean; isActive: boolean }): { audioRef: RefObject<HTMLAudioElement | null>; isPlaying: boolean; handleTogglePlay: () => void; handlePause: () => void }`; `handleTogglePlay` deve pausar quando `isPlaying` for verdadeiro e chamar `audioElement.play()` quando for falso; `handlePause` deve pausar e setar `isPlaying` como falso; listeners de `ended`, cleanup e erro de `play()` devem retornar o estado para falso; quando `isActive` for falso o audio deve pausar; quando `shouldAutoPlay` e `isActive` forem verdadeiros o hook deve tentar reproduzir automaticamente.
* **Justificativa:** centralizar o estado de reproducao e manter `SpeakerView` como camada de renderizacao.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Speaker/SpeakerView.tsx`
* **Mudanca:** alterar props para `url: string`, `audioRef: RefObject<HTMLAudioElement | null>`, `isPlaying: boolean`, `onTogglePlay: () => void`, `volume: number`, `rate: number`, `onVolumeChange: (volume: number) => void`, `onRateChange: (rate: number) => void`, `shouldAutoPlay: boolean` e `onAutoPlayToggle: (isChecked: boolean) => void`; renderizar `<audio ref={audioRef} src={url} preload='metadata'><track kind='captions' /></audio>`, botao com icone `pause` quando `isPlaying` e `start` quando parado, e dialog de configuracoes para autoplay, velocidade e volume; usar `aria-label={isPlaying ? 'Pausar audio do bloco' : 'Reproduzir audio do bloco'}`.
* **Justificativa:** a view precisa expor controle acessivel de arquivo de audio persistido e remover controles de sintetizador que nao se aplicam ao novo fluxo.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/StoryStage/StoryStageView.tsx`
* **Mudanca:** remover o wrapper `SpeakerContextProvider` e seu import, mantendo a mesma hierarquia visual de `Container`, `Header`, `Content` e `Footer`.
* **Justificativa:** a reproducao persistida nao depende mais do contexto de configuracoes de TTS; manter o provider criaria acoplamento morto e configuracoes sem efeito.
* **Camada:** `ui`

## Camada RPC

* **Arquivo:** `apps/web/src/rpc/actions/lesson/FetchLessonStoryAndQuestionsAction.ts`
* **Mudanca:** remover a chamada `service.fetchStarStory(starId)` do `Promise.all` e alterar o response para `{ questions: QuestionDto[]; textsBlocks: TextBlockDto[] }`.
* **Justificativa:** `storyContent` deixa de ser consumido pela Lesson Page; manter a chamada adicionaria dependencia e latencia sem uso.
* **Camada:** `rpc`

* **Arquivo:** `apps/web/src/app/lesson/[starSlug]/page.tsx`
* **Mudanca:** ajustar o consumo de `lessonResponse.data` para usar apenas `questions` e `textsBlocks`.
* **Justificativa:** alinhar a pagina ao novo response da action.
* **Camada:** `rpc`

## Camada REST

* **Arquivo:** `apps/web/src/rest/services/LessonService.ts`
* **Mudanca:** remover `fetchStarStory(starId)` se nao houver outros consumidores no app `web` apos a migracao.
* **Justificativa:** a Lesson Page nao deve depender mais de story textual; a remocao deve ocorrer somente se a busca por referencias confirmar ausencia de outros usos.
* **Camada:** `rest`

* **Arquivo:** `apps/web/package.json`
* **Mudanca:** remover a dependencia `react-text-to-speech`.
* **Justificativa:** apos a migracao do `Speaker` para `<audio>`, a biblioteca fica sem uso no app `web`.
* **Camada:** `ui`

* **Arquivo:** `package-lock.json`
* **Mudanca:** atualizar o lockfile para refletir a remocao de `react-text-to-speech` do workspace `@stardust/web`.
* **Justificativa:** manter consistencia entre manifest e lockfile.
* **Camada:** `ui`

## Camada Studio

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/useLessonStoryPage.ts`
* **Mudanca:** incluir `image` entre os tipos suportados/elegiveis para `picture`, validar que blocos `image` tenham `picture`, sincronizar blocos antes de acionar geracao de audio individual/batch e atualizar `textBlocks`/baseline com respostas do polling.
* **Justificativa:** a geracao de audio precisa operar sobre a versao persistida mais recente dos blocos e suportar legendas de imagem como narracao.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/useTextBlockCard.ts`
* **Mudanca:** incluir `image` em `canHaveAudio` e ajustar label de campo para `Legenda` quando o tipo for `image`.
* **Justificativa:** permitir que o Studio exiba controles de audio para blocos de imagem e deixe claro que o conteudo textual e a legenda narrada.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/useTextBlocks.ts`
* **Mudanca:** consultar o storage por cada `fileName` de audio referenciado, usando `search` especifico, e repetir a checagem a cada 3s enquanto algum arquivo esperado ainda nao estiver disponivel.
* **Justificativa:** evitar que o player fique oculto quando o status ja virou `done`, mas o arquivo acabou de ser enviado ou nao aparece em uma listagem geral/paginada.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/tests/LessonStoryPageView.test.tsx`
* **Mudanca:** atualizar fixtures de vozes para incluir `alien`, `robot` e `salmonense` com labels simplificados.
* **Justificativa:** manter testes alinhados ao contrato exposto pelo servidor.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/rest/services/LessonService.ts`
* **Mudanca:** remover `fetchStarStory(starId)` se nao houver consumidores no app `studio` apos a migracao para blocos.
* **Justificativa:** eliminar consumo REST obsoleto da story textual tambem no Studio.
* **Camada:** `rest`

## Camada Server / Queue / Providers

* **Arquivo:** `apps/server/src/rest/controllers/lesson/FetchAudioVoicesController.ts`
* **Mudanca:** retornar as vozes `panda`, `shark`, `princess`, `alien`, `robot` e `salmonense` com labels `Panda`, `Tubarão`, `Princesa`, `Alien`, `Robô` e `Salmonense`.
* **Justificativa:** expor nomes de personagens sem adjetivos e cobrir as vozes novas no Studio.
* **Camada:** `rest`

* **Arquivo:** `apps/server/src/provision/tts/open-ai/OpenAITtsProvider.ts`
* **Mudanca:** adicionar mapeamentos para `alien`, `robot` e `salmonense`; usar internamente `echo` para `alien`, preservando `alien` como valor de dominio.
* **Justificativa:** permitir gerar audio para as novas vozes sem vazar identificadores internos do provider para o dominio/UI.
* **Camada:** `provision`

* **Arquivo:** `apps/server/src/provision/tts/eleven-labs/ElevenLabsTtsProvider.ts`
* **Mudanca:** adicionar mapeamentos para `alien`, `robot` e `salmonense`.
* **Justificativa:** manter providers alternativos compativeis com todos os valores de `AudioVoice`.
* **Camada:** `provision`

* **Arquivo:** `apps/server/src/provision/tts/open-router-eleven-labs/OpenRouterElevenLabsTtsProvider.ts`
* **Mudanca:** adicionar mapeamentos para `alien`, `robot` e `salmonense`.
* **Justificativa:** manter providers alternativos compativeis com todos os valores de `AudioVoice`.
* **Camada:** `provision`

* **Arquivo:** `apps/server/src/app/hono/routers/storage/FilesStorageRouter.ts`
* **Mudanca:** permitir `GET /storage/files` sem autenticação, preservando autenticação/admin para `DELETE /storage/files`.
* **Justificativa:** o `web` precisa validar existencia de arquivos publicos da Story sem depender de sessao administrativa.
* **Camada:** `rest`

## Camada Core / Validation

* **Arquivo:** `packages/core/src/lesson/domain/structures/TextBlock.ts`
* **Mudanca:** incluir `image` em `canHaveAudio`.
* **Justificativa:** centralizar no dominio a nova regra de elegibilidade para audio de blocos de imagem.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/lesson/domain/structures/AudioVoice.ts`
* **Mudanca:** aceitar `alien`, `robot` e `salmonense` como valores validos alem de `panda`, `shark` e `princess`.
* **Justificativa:** ampliar o contrato canonico de vozes de audio.
* **Camada:** `core`

* **Arquivo:** `packages/validation/src/modules/lesson/schemas/audioVoiceSchema.ts`
* **Mudanca:** aceitar `alien`, `robot` e `salmonense` no schema compartilhado.
* **Justificativa:** manter validação HTTP/Inngest alinhada ao dominio.
* **Camada:** `validation`

* **Arquivo:** `packages/core/src/lesson/domain/events/TextBlocksAudioGenerationInBatchRequestedEvent.ts`
* **Mudanca:** alinhar `_NAME` para `lesson/text-blocks.audio.generation.in-batch.requested`.
* **Justificativa:** garantir que o evento publicado pelo use case de batch seja capturado pelo trigger registrado em `apps/server/src/queue/inngest/functions/LessonFunctions.ts`.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/lesson/interfaces/LessonService.ts`
* **Mudanca:** remover `fetchStarStory(starId)` do contrato se nao houver consumidores apos a migracao para blocos.
* **Justificativa:** o contrato compartilhado nao deve expor fluxo legado de story textual quando nenhum adapter o consome.
* **Camada:** `core`

---

# 7. O que deve ser removido?

## Camada UI

* **Arquivo:** `apps/web/src/ui/global/widgets/components/SpeakerSettingsDialog/index.tsx`
* **Motivo da remocao:** o dialog separado pertencia ao contexto antigo de TTS e incluia configuracoes que nao se aplicam a arquivo persistido, como `pitch` e enabled global.
* **Impacto esperado:** remover UI obsoleta sem impedir que `SpeakerView` exponha configuracoes aplicaveis ao `<audio>` nativo, como volume, velocidade e autoplay.

* **Arquivo:** `apps/web/src/ui/global/widgets/components/SpeakerSettingsDialog/SpeakerSettingsDialogView.tsx`
* **Motivo da remocao:** view exclusiva do dialog de sintetizador de voz removido.
* **Impacto esperado:** eliminar codigo morto do dialog antigo, substituido por configuracoes inline no `SpeakerView`.

* **Arquivo:** `apps/web/src/ui/lesson/contexts/Speaker/index.tsx`
* **Motivo da remocao:** contexto era usado apenas pelo speaker TTS e deixa de ser consumido quando `StoryStageView` remove o provider.
* **Impacto esperado:** eliminar provider sem consumidores.

* **Arquivo:** `apps/web/src/ui/lesson/contexts/Speaker/useSpeakerContextProvider.ts`
* **Motivo da remocao:** hook exclusivo para estado/configuracoes do speaker TTS.
* **Impacto esperado:** remover o contexto legado e concentrar as configuracoes ainda aplicaveis ao audio persistido em `useSpeakerSettings`.

* **Arquivo:** `apps/web/src/ui/lesson/contexts/Speaker/SpeakerContextValue.ts`
* **Motivo da remocao:** tipo exclusivo do contexto de TTS removido.
* **Impacto esperado:** eliminar contrato sem consumidores.

* **Arquivo:** `apps/web/src/ui/global/hooks/useSpeakerContext.ts`
* **Motivo da remocao:** hook exclusivo para consumir `SpeakerContext`, que deixa de existir.
* **Impacto esperado:** eliminar import cross-module obsoleto entre `global/hooks` e `lesson/contexts`.

* **Arquivo:** `apps/web/src/constants/storage.ts`
* **Motivo da alteracao:** remover apenas chaves obsoletas do sintetizador antigo, preservando `speakerVolume`, `speakerRate` e adicionando/usando `speakerAutoPlay` para o player persistido.
* **Impacto esperado:** manter configuracoes relevantes para `<audio>` nativo e eliminar somente configuracoes sem efeito como `pitch`/enabled do TTS antigo.

* **Arquivo:** `apps/web/src/rest/services/LessonService.ts`
* **Motivo da remocao:** remover o metodo `fetchStarStory(starId)` caso ele fique sem consumidores apos `FetchLessonStoryAndQuestionsAction` deixar de buscar `storyContent`.
* **Impacto esperado:** eliminar consumo REST obsoleto de story textual no app `web`.

---

# 8. Decisoes Tecnicas e Trade-offs

* **Decisao:** remover o uso de `storyContent` e montar a Story sempre a partir de `TextBlock[]`.
  **Alternativas consideradas:** manter fallback por `storyContent`; criar mapeamento entre chunks textuais e indices de `TextBlock`; alterar `Story` para carregar objetos estruturados.
  **Motivo da escolha:** produto confirmou que a migracao deve ser permanente para estrutura de blocos, que ja preserva `audio`, `title`, `picture`, `isRunnable` e tipo do bloco.
  **Impactos / trade-offs:** reduz ambiguidade e remove uma chamada REST sem uso, mas depende de `textsBlocksDto` como fonte canonica da narrativa.

* **Decisao:** propagar audio pelo MDX como props `audioFileName` e `audioStatus` apenas quando o arquivo existir no storage.
  **Alternativas consideradas:** alterar `Story` para carregar objetos estruturados; manter mapa paralelo por `chunkIndex`; buscar o audio diretamente no `Content` por contexto; renderizar speaker sem validar existencia do arquivo.
  **Motivo da escolha:** o fluxo atual da Lesson Page ja transforma `TextBlock[]` em strings MDX e `Story` trabalha apenas com `string[]`; serializar props continua sendo a menor mudanca consistente, e a validacao previa evita player quebrado para arquivos ausentes.
  **Impactos / trade-offs:** adiciona uma consulta ao storage na entrada da Lesson Page, mas evita renderizar controles sem audio reproduzivel.

* **Decisao:** resolver URL no `web` com novo `useStorageAudio`, espelhando o `studio`.
  **Alternativas consideradas:** chamar Supabase SDK, criar endpoint REST para URL publica ou expor contrato novo no `core`.
  **Motivo da escolha:** `apps/web/src/ui/global/hooks/useFileStorage.ts` ja monta URLs publicas via CDN, e `apps/studio/src/ui/global/hooks/useStorageAudio.ts` e uma referencia direta para `audios/story`.
  **Impactos / trade-offs:** mantem a resolucao de URL simples e local; a validacao de existencia fica separada em `useStoryAudioFiles` para evitar acoplar storage listing ao player.

* **Decisao:** substituir TTS por `<audio>` no `Speaker` existente, preservando configuracoes aplicaveis a arquivo persistido.
  **Alternativas consideradas:** criar um novo `PersistedAudioSpeaker` e manter `Speaker` antigo; manter TTS como fallback quando nao houver audio persistido.
  **Motivo da escolha:** o unico uso ativo pretendido do `Speaker` esta na Lesson Story, e o PRD pede audio persistido dos `TextBlock`; manter fallback TTS recriaria a dependencia que a feature quer evitar. Volume, velocidade e autoplay continuam uteis para `HTMLAudioElement`, mas `pitch` deixa de se aplicar.
  **Impactos / trade-offs:** reduz escopo e dependencia externa, mas remove apenas configuracoes exclusivas do sintetizador antigo.

* **Decisao:** renderizar `Speaker` em `Content` e nao individualmente em `TextView`, `AlertView` e `QuoteView`.
  **Alternativas consideradas:** duplicar a renderizacao do player em cada view; colocar speaker no `MdxView` via override; colocar speaker no `StoryChunk`.
  **Motivo da escolha:** `Content` e o ponto comum dos blocos narrativos elegiveis (`Text`, `Alert`, `Quote` e legenda de `Image`) e ja continha o `Speaker` comentado.
  **Impactos / trade-offs:** centraliza a regra, mas exige que apenas componentes elegiveis repassem as props de audio.

* **Decisao:** alterar o dominio apenas onde a regra de negocio mudou.
  **Alternativas consideradas:** tratar `image` e vozes novas apenas na UI/providers; manter o core sem mudancas e duplicar listas de tipos/vozes nos apps.
  **Motivo da escolha:** elegibilidade de audio (`canHaveAudio`) e valores validos de voz (`AudioVoice`) sao regras canonicas do dominio; mantê-las no `core` evita divergencia entre `web`, `studio`, `server` e validações Inngest/HTTP.
  **Impactos / trade-offs:** amplia o escopo além do `web`, mas preserva a arquitetura hexagonal porque o `core` continua agnostico a frameworks e SDKs.

* **Decisao:** manter `alien` como valor de dominio e mapear `echo` somente dentro do OpenAI provider.
  **Alternativas consideradas:** expor `echo` como voz no Studio/core; usar `robo` em portugues no dominio; criar enum especifico por provider.
  **Motivo da escolha:** `alien` representa o personagem da experiencia e `echo` e detalhe tecnico do provider OpenAI.
  **Impactos / trade-offs:** exige mapeamento no adapter, mas evita vazamento de infraestrutura para contratos compartilhados.

* **Decisao:** alinhar o nome do evento de batch no evento do core.
  **Alternativas consideradas:** alterar o trigger em `LessonFunctions`; criar alias temporario para dois nomes de evento.
  **Motivo da escolha:** o trigger registrado no Inngest ja usava `lesson/text-blocks.audio.generation.in-batch.requested`, e o evento publicado pelo core precisava casar exatamente com esse nome para acionar o job.
  **Impactos / trade-offs:** correcao direta e sem fallback; eventos antigos com o nome incorreto permanecem sem consumidor.

* **Decisao:** validar arquivos de audio no Studio por `fileName` especifico com retry.
  **Alternativas consideradas:** listar a pasta inteira uma vez; renderizar player assim que `status === 'done'` sem confirmar storage; delegar fallback apenas ao `BlockAudioPlayer`.
  **Motivo da escolha:** a listagem geral pode estar paginada ou defasada logo apos o upload; a consulta por nome e retry reduzem falso negativo e permitem que o player apareca quando o arquivo ficar disponivel.
  **Impactos / trade-offs:** aumenta o numero de chamadas REST proporcionalmente aos arquivos referenciados, mas somente enquanto houver arquivos ainda ausentes.

---

# 9. Diagramas e Referencias

* **Fluxo de Dados:**

```text
GitHub PRD / Issue
  -> Lesson Page (/lesson/[starSlug])
    -> lessonActions.fetchLessonStoryAndQuestions({ starId })
      -> FetchLessonStoryAndQuestionsAction
        -> LessonService.fetchTextsBlocks(starId)
        -> retorna TextBlockDto[] com audio?: { fileName, voice, status }
    -> LessonPage
      -> useLessonPage
        -> useStoryAudioFiles(storageService, textsBlocksDto)
          -> StorageService.listFiles(folder='audios/story', search=fileName)
          -> audioFiles[fileName] = true | false
        -> TextBlock.create(dto) preserva audio
        -> useMdx.parseTextBlocksToMdx(textBlocks, audioFiles)
          -> <Text audioFileName audioStatus>...</Text>
          -> <Alert audioFileName audioStatus>...</Alert>
          -> <Quote audioFileName audioStatus>...</Quote>
          -> <Image audioFileName audioStatus>...</Image>
        -> Story.create(chunks: string[])
      -> StoryStageView
        -> StoryChunk
          -> Mdx
            -> TextView / AlertView / QuoteView / ImageView
              -> ContentView
                -> se audioStatus === 'done', audioFileName existir e audioFiles[fileName] === true
                  -> Speaker
                    -> useStorageAudio(fileName)
                    -> useSpeakerSettings()
                      -> useFileStorage(FileStorageFolderPath.createAsAudiosStory(), fileName)
                    -> <audio src='{CDN}/audios/story/{fileName}' preload='metadata'>
                    -> pausa quando isActive=false e tenta autoplay quando configurado
```

* **Fluxo Cross-app:**

```text
web (Lesson Page)
  -> REST GET /storage/files?folder=audios/story&search={fileName}
    -> server (StorageRouter existente)
      -> StorageService.listFiles existente
    <- arquivos encontrados na pasta audios/story
  -> renderiza Speaker somente para fileName encontrado

studio (Lesson Story)
  -> POST /lesson/text-blocks/star/{starId}/audio/batch
    -> TriggerTextBlocksAudioGenerationInBatchUseCase
      -> TextBlocksAudioGenerationInBatchRequestedEvent('lesson/text-blocks.audio.generation.in-batch.requested')
        -> Inngest GenerateTextBlocksAudioBatchJob
          -> TextBlockAudioGenerationRequestedEvent por bloco
            -> GenerateTextBlockAudioJob
              -> TTS provider -> Supabase Storage audios/story -> TextBlockAudioGeneratedEvent
  -> polling fetchTextsBlocks enquanto houver audio pending
  -> GET /storage/files?folder=audios/story&search={fileName} com retry ate o arquivo aparecer
```

* **Layout:**

```text
LessonPage
└─ StoryStageView
   ├─ Header
   ├─ Content
   │  └─ StoryChunk[]
   │     └─ Mdx
   │        └─ Text | Alert | Quote | Image
   │           └─ Content
   │              ├─ SpeakerButton (somente audio done)
   │              └─ Texto / TypeWriter
   └─ Footer
      └─ ContinueButton
```

* **Referencias:**

* `documentation/issue.md`
* `apps/web/src/app/lesson/[starSlug]/page.tsx`
* `apps/web/src/ui/global/widgets/components/Mdx/hooks/useMdx.ts`
* `apps/web/src/ui/global/widgets/components/Mdx/Content/ContentView.tsx`
* `apps/web/src/ui/global/widgets/components/Speaker/index.tsx`
* `apps/web/src/ui/global/widgets/components/Speaker/useSpeaker.ts`
* `apps/web/src/ui/global/widgets/components/Speaker/useSpeakerSettings.ts`
* `apps/web/src/ui/global/widgets/components/Speaker/SpeakerView.tsx`
* `apps/web/src/ui/global/hooks/useFileStorage.ts`
* `apps/web/src/rest/services/StorageService.ts`
* `apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`
* `apps/web/src/ui/lesson/widgets/pages/Lesson/useLessonPage.ts`
* `apps/web/src/ui/lesson/widgets/pages/Lesson/StoryStage/StoryChunk/index.tsx`
* `packages/core/src/global/domain/entities/dtos/TextBlockDto.ts`
* `packages/core/src/global/domain/entities/dtos/TextBlockAudioDto.ts`
* `packages/core/src/lesson/domain/structures/TextBlock.ts`
* `packages/core/src/lesson/domain/structures/AudioVoice.ts`
* `packages/core/src/lesson/domain/events/TextBlocksAudioGenerationInBatchRequestedEvent.ts`
* `packages/core/src/storage/domain/structures/FileStorageFolderPath.ts`
* `packages/validation/src/modules/lesson/schemas/audioVoiceSchema.ts`
* `apps/server/src/rest/controllers/lesson/FetchAudioVoicesController.ts`
* `apps/server/src/provision/tts/open-ai/OpenAITtsProvider.ts`
* `apps/server/src/provision/tts/eleven-labs/ElevenLabsTtsProvider.ts`
* `apps/server/src/provision/tts/open-router-eleven-labs/OpenRouterElevenLabsTtsProvider.ts`
* `apps/server/src/queue/inngest/functions/LessonFunctions.ts`
* `apps/server/src/app/hono/routers/storage/FilesStorageRouter.ts`
* `apps/studio/src/ui/global/hooks/useStorageAudio.ts`
* `apps/studio/src/ui/lesson/widgets/pages/LessonStory/useLessonStoryPage.ts`
* `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/useTextBlocks.ts`
* `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/BlockAudioPlayer/useBlockAudioPlayer.ts`

---

# 10. Pendencias / Duvidas

Sem pendencias
