---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
---

## Pendencias (quando aplicavel)

Sem pendencias bloqueantes identificadas na spec de entrada.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Validar e consolidar o contrato existente de narrativa em blocos com audio persistido no core, sem alterar estruturas compartilhadas | - | - |
| F3 | Migrar a Lesson Page do `web` para consumir apenas `TextBlock[]` e reativar o `Speaker` com audio persistido | F1 | - |

> **Estratégia de paralelismo:** sempre comece pelo core (dominio, structures e use cases). Nesta entrega, a spec impacta apenas o app `web` e declara explicitamente que `server`, `studio`, `core` e banco nao devem receber novos contratos. Por isso, F1 serve para ancorar o contrato canonico ja existente; concluida essa validacao, apenas F3 segue para implementacao.

---

## F1 — Core: Dominio, Structures e Use Cases

**Objetivo:** Confirmar que os contratos existentes do dominio ja suportam a feature sem extensoes no `core`, definindo com clareza quais regras o `web` pode consumir na implementacao.

### Tarefas

- [x] **T1.1** — Validar os contratos de audio ja existentes em `TextBlockDto`, `TextBlockAudioDto` e `TextBlock`
  - **Depende de:** -
  - **Resultado observavel:** fica estabelecido que `TextBlockDto.audio`, `TextBlockAudio.status`, `TextBlock.canHaveAudio` e os tipos `default`, `alert` e `quote` cobrem a regra de elegibilidade do speaker sem criacao de novos DTOs, structures ou use cases.
  - **Camada:** `core`

- [x] **T1.2** — Consolidar o contrato canonico de arquivo de audio persistido para consumo do `web`
  - **Depende de:** T1.1
  - **Resultado observavel:** fica estabelecido que o `web` deve usar `FileStorageFolderPath.createAsAudiosStory()` como pasta fixa, aceitar apenas `audio.status === 'done'` com `fileName` preenchido e nao depender mais de `storyContent` textual para montar a narrativa.
  - **Camada:** `core`

---

## F3 — Web: UI e Integracao

> ⚡ Pode rodar em paralelo com F2 e F4 apos F1 estar concluida.

**Objetivo:** Implementar a migracao da Lesson Page no app `web` para narrativa baseada exclusivamente em `TextBlock[]`, validar existencia de arquivos em `audios/story` e reproduzir audio persistido nos blocos elegiveis via `<audio>` nativo.

### Tarefas

- [x] **T3.1** — Remover `story` do retorno de `FetchLessonStoryAndQuestionsAction`
  - **Depende de:** T1.2
  - **Resultado observavel:** a action deixa de chamar `service.fetchStarStory(starId)` e retorna apenas `{ questions, textsBlocks }` para a Lesson Page.
  - **Camada:** `rpc`

- [x] **T3.2** — Ajustar `apps/web/src/app/lesson/[starSlug]/page.tsx` para consumir apenas `questions` e `textsBlocks`
  - **Depende de:** T3.1
  - **Resultado observavel:** a pagina deixa de repassar `storyContent` para `LessonPage` e o fluxo server component continua renderizando a Lesson Page com os dados restantes da action.
  - **Camada:** `rpc`

- [x] **T3.3** — Criar `apps/web/src/ui/global/hooks/useStorageAudio.ts`
  - **Depende de:** T1.2
  - **Resultado observavel:** o hook `useStorageAudio(fileName?)` retorna `{ url: null }` sem arquivo e monta a URL publica em `audios/story` quando `fileName` existir.
  - **Camada:** `ui`

- [x] **T3.4** — Criar `apps/web/src/ui/lesson/widgets/pages/Lesson/useStoryAudioFiles.ts`
  - **Depende de:** T1.2
  - **Resultado observavel:** o hook lista em `audios/story` apenas os `fileName` referenciados por blocos com audio `done` e expõe um mapa `audioFiles[fileName] = true | false` com fallback seguro em erro.
  - **Camada:** `web`

- [x] **T3.5** — Atualizar `apps/web/src/ui/lesson/widgets/pages/Lesson/index.tsx` para remover `storyContent` e injetar `storageService`
  - **Depende de:** T3.2, T3.4
  - **Resultado observavel:** `LessonPage` passa a receber apenas `questionsDto` e `textsBlocksDto`, resolve `storageService` via `useRestContext()` e encaminha esse service para `useLessonPage`.
  - **Camada:** `ui`

- [x] **T3.6** — Atualizar `apps/web/src/ui/lesson/widgets/pages/Lesson/useLessonPage.ts` para montar a Story exclusivamente por `TextBlock[]`
  - **Depende de:** T3.4, T3.5
  - **Resultado observavel:** o hook deixa de aceitar `storyContent`, usa `useStoryAudioFiles(...)`, cria `TextBlock[]` a partir de `textsBlocksDto` e chama sempre `Story.create(parseTextBlocksToMdx(textBlocks, audioFiles))`.
  - **Camada:** `ui`

- [x] **T3.7** — Atualizar `apps/web/src/ui/global/widgets/components/Mdx/hooks/useMdx.ts` para serializar metadados de audio no MDX
  - **Depende de:** T3.4, T3.6
  - **Resultado observavel:** `parseTextBlocksToMdx(textBlocks, audioFiles)` passa a incluir `audioFileName` e `audioStatus` apenas para `Text`, `Alert` e `Quote` com audio elegivel e arquivo confirmado no storage.
  - **Camada:** `ui`

- [x] **T3.8** — Atualizar `apps/web/src/ui/global/widgets/components/Mdx/Text/TextView.tsx`
  - **Depende de:** T3.7
  - **Resultado observavel:** `TextView` aceita props opcionais `audioFileName` e `audioStatus` e as repassa para `Content` sem alterar os usos que nao informam audio.
  - **Camada:** `ui`

- [x] **T3.9** — Atualizar `apps/web/src/ui/global/widgets/components/Mdx/Alert/AlertView.tsx`
  - **Depende de:** T3.7
  - **Resultado observavel:** `AlertView` aceita props opcionais `audioFileName` e `audioStatus` e as repassa para `Content` sem regressao para alertas sem audio.
  - **Camada:** `ui`

- [x] **T3.10** — Atualizar `apps/web/src/ui/global/widgets/components/Mdx/Quote/QuoteView.tsx`
  - **Depende de:** T3.7
  - **Resultado observavel:** `QuoteView` aceita props opcionais `audioFileName` e `audioStatus` e as repassa para `Content` sem regressao para quotes sem audio.
  - **Camada:** `ui`

- [x] **T3.11** — Atualizar `apps/web/src/ui/global/widgets/components/Mdx/Content/ContentView.tsx` para decidir a exibicao do speaker
  - **Depende de:** T3.8, T3.9, T3.10
  - **Resultado observavel:** `Content` renderiza `<Speaker fileName={audioFileName} />` antes do texto somente quando `audioStatus === 'done'` e `audioFileName` estiver preenchido; nos demais casos, o texto segue renderizado sem player.
  - **Camada:** `ui`

- [x] **T3.12** — Atualizar `apps/web/src/ui/global/widgets/components/Speaker/useSpeaker.ts` para controle nativo de `<audio>`
  - **Depende de:** T3.3
  - **Resultado observavel:** o hook expõe `audioRef`, `isPlaying`, `handleTogglePlay` e `handlePause`, alterna `play/pause`, volta ao estado parado em `ended` e falha de `audio.play()`, e nao depende mais de `react-text-to-speech`.
  - **Camada:** `ui`

- [x] **T3.13** — Atualizar `apps/web/src/ui/global/widgets/components/Speaker/SpeakerView.tsx` para reproduzir arquivo persistido
  - **Depende de:** T3.12
  - **Resultado observavel:** a view renderiza `<audio preload='metadata'>` com `src` recebido por prop e um `<button type='button'>` com `aria-label` alternando entre reproduzir e pausar audio do bloco.
  - **Camada:** `ui`

- [x] **T3.14** — Atualizar `apps/web/src/ui/global/widgets/components/Speaker/index.tsx` para usar `fileName` e `useStorageAudio`
  - **Depende de:** T3.3, T3.12, T3.13
  - **Resultado observavel:** `Speaker` passa a aceitar `fileName?: string`, retorna `null` quando `fileName` ou `url` estiverem ausentes e renderiza o player persistido quando houver URL publica valida.
  - **Camada:** `ui`

- [x] **T3.15** — Remover `SpeakerContextProvider` de `apps/web/src/ui/lesson/widgets/pages/Lesson/StoryStage/StoryStageView.tsx`
  - **Depende de:** T3.14
  - **Resultado observavel:** a Story Stage mantem a mesma hierarquia visual, mas deixa de envolver os chunks com o provider do speaker TTS.
  - **Camada:** `ui`

- [x] **T3.16** — Remover `apps/web/src/ui/global/widgets/components/SpeakerSettingsDialog/index.tsx`
  - **Depende de:** T3.13, T3.14
  - **Resultado observavel:** o entrypoint do dialog de configuracoes de sintetizador deixa de existir no app `web`.
  - **Camada:** `ui`

- [x] **T3.17** — Remover `apps/web/src/ui/global/widgets/components/SpeakerSettingsDialog/SpeakerSettingsDialogView.tsx`
  - **Depende de:** T3.16
  - **Resultado observavel:** a view exclusiva do dialog de configuracoes do speaker TTS e eliminada da codebase.
  - **Camada:** `ui`

- [x] **T3.18** — Remover `apps/web/src/ui/lesson/contexts/Speaker/index.tsx`
  - **Depende de:** T3.15
  - **Resultado observavel:** o provider do speaker TTS deixa de existir apos a remocao do ultimo uso em `StoryStageView`.
  - **Camada:** `ui`

- [x] **T3.19** — Remover `apps/web/src/ui/lesson/contexts/Speaker/useSpeakerContextProvider.ts`
  - **Depende de:** T3.18
  - **Resultado observavel:** o hook de estado/configuracao do speaker TTS e removido da codebase do `web`.
  - **Camada:** `ui`

- [x] **T3.20** — Remover `apps/web/src/ui/lesson/contexts/Speaker/SpeakerContextValue.ts`
  - **Depende de:** T3.18
  - **Resultado observavel:** o contrato tipado do contexto TTS deixa de existir apos a retirada do provider.
  - **Camada:** `ui`

- [x] **T3.21** — Remover `apps/web/src/ui/global/hooks/useSpeakerContext.ts`
  - **Depende de:** T3.18
  - **Resultado observavel:** o hook global que consumia `SpeakerContext` deixa de existir e nao sobra import cruzado do contexto removido.
  - **Camada:** `ui`

- [x] **T3.22** — Limpar chaves obsoletas de speaker em `apps/web/src/constants/storage.ts`
  - **Depende de:** T3.18, T3.21
  - **Resultado observavel:** as chaves de localStorage usadas apenas por volume, rate, pitch e enabled do TTS sao removidas se nao houver mais referencias no app `web`.
  - **Camada:** `web`

- [x] **T3.23** — Remover `fetchStarStory(starId)` de `apps/web/src/rest/services/LessonService.ts` se ficar sem consumidores
  - **Depende de:** T3.1
  - **Resultado observavel:** o service deixa de expor a busca da story textual caso a busca por referencias confirme que nenhum fluxo do `web` ainda usa esse metodo.
  - **Camada:** `rest`

- [x] **T3.24** — Remover `react-text-to-speech` de `apps/web/package.json`
  - **Depende de:** T3.12, T3.13, T3.14
  - **Resultado observavel:** o manifesto do app `web` deixa de declarar a biblioteca de TTS apos a migracao completa do `Speaker` para `<audio>`.
  - **Camada:** `ui`

- [x] **T3.25** — Atualizar `package-lock.json` para refletir a remocao da dependencia de TTS
  - **Depende de:** T3.24
  - **Resultado observavel:** o lockfile do workspace deixa de registrar `react-text-to-speech` como dependencia do `@stardust/web`.
  - **Camada:** `ui`
