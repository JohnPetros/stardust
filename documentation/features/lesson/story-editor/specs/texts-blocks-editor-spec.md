---
title: Aba de Blocos de Texto do Editor de História
prd: documentation/features/lesson/story-editor/prd.md
apps: server, studio
status: open
last_updated_at: 2026-03-16
---

# 1. Objetivo

Entregar a nova aba de blocos de texto do editor de história no Studio, substituindo o fluxo atual baseado em `story: string` + Monaco por uma edição estruturada de `stars.texts` com cards inline, reordenação via drag-and-drop, seleção opcional de imagem, preview em tempo real e salvamento explícito. Tecnicamente, a implementação deve manter `stars.texts` como fonte de verdade da edição, sem atualizar `stars.story` nesta entrega.

---

# 2. Escopo

## 2.1 In-scope

- Trocar a página `LessonStory` do Studio para editar uma lista ordenada de blocos em vez de uma string MDX livre.
- Carregar contexto da estrela pelo `slug`, exibindo `name` e `number` no cabeçalho.
- Carregar os blocos atuais da estrela e exibir estado de loading antes da edição.
- Permitir adicionar, expandir, editar, remover e reordenar blocos dos tipos `default`, `user`, `alert`, `quote` e `code`.
- Permitir selecionar imagem opcional para blocos `default`, `alert` e `quote` reutilizando o fluxo existente de assets da pasta `story`.
- Exibir preview em tempo real no Studio com base no renderer `Mdx` já existente.
- Persistir o array completo de blocos por estrela com uma ação explícita de salvar.
- Adicionar validação compartilhada para o payload de atualização de blocos.
- Manter o escopo restrito a `studio` e `server`, sem alterar o comportamento atual de leitura do app `web`.

## 2.2 Out-of-scope

- Suporte a áudio nesta spec.
- Aba de vídeo e sincronização de markers.
- Migração automática de histórias legadas armazenadas apenas em `stars.story` para `stars.texts`.
- Edição dos tipos legados `image`, `list` e `code-line` nesta aba.
- Edição do campo `title` já previsto em `TextBlockDto`.
- Alterações funcionais na Lesson Page do app `web`.
- Workflow editorial, versionamento, publicação agendada ou colaboração simultânea.

---

# 3. Requisitos

## 3.1 Funcionais

- O Studio deve continuar acessando o editor pela rota `/lesson/story/:starSlug`, resolvendo a estrela a partir do `slug`.
- A página deve exibir o nome e o número da estrela no cabeçalho antes da área de edição.
- A carga inicial da aba deve buscar os blocos atuais da estrela e exibir loading enquanto a resposta não chega.
- O editor deve listar os blocos como cards inline, com handle de drag, badge do tipo, preview truncado do conteúdo e indicador visual de imagem quando houver `picture`.
- O operador deve conseguir adicionar um novo bloco escolhendo um dos tipos suportados antes da criação; o novo bloco deve entrar expandido no final da lista com conteúdo inicial orientativo.
- O operador deve conseguir expandir um card para editar seu conteúdo sem abrir painel lateral separado.
- O operador deve conseguir reordenar os blocos com `SortableList`, refletindo a nova ordem imediatamente no preview.
- O operador deve conseguir remover um bloco individualmente da lista.
- Blocos `default`, `alert` e `quote` devem expor textarea de conteúdo e seletor opcional de imagem.
- Blocos `user` devem expor apenas textarea de conteúdo.
- Blocos `code` devem expor textarea de código e toggle `isRunnable`.
- O preview deve reagir a cada alteração local sem necessidade de salvar.
- O botão de salvar deve ficar habilitado apenas quando existir pelo menos um bloco, todos os blocos estiverem válidos para persistência e houver diferença em relação ao estado carregado.
- Após sucesso ou erro de salvamento, a próxima edição local deve limpar o estado anterior do `ActionButton`.
- Ao salvar, o server deve substituir a coleção inteira de `stars.texts` da estrela.
- Se a estrela tiver `story` legado preenchido e `texts` vazio, a página deve bloquear a edição e informar que o conteúdo precisa de migração antes do uso da aba, para evitar sobrescrita silenciosa.
- Se a estrela tiver blocos com tipos fora do subconjunto suportado (`default`, `user`, `alert`, `quote`, `code`), a página deve bloquear a edição e informar a presença de blocos legados incompatíveis com a aba.

## 3.2 Não funcionais

* Compatibilidade retroativa
  - O endpoint legado `GET /lesson/stories/star/:starId` permanece inalterado nesta entrega.
  - O app `web` não recebe mudança funcional nem ajuste contratual nesta spec.
* Segurança
  - Leitura dos blocos continua protegida por `verifyAuthentication`.
  - Persistência dos blocos deve exigir `verifyAuthentication`, `verifyGodAccount` e `verifyStarExists`.
* Validação
  - O payload de escrita deve aceitar apenas os tipos `default`, `user`, `alert`, `quote` e `code`.
  - `content` deve usar validação compartilhada baseada em `contentSchema`.
  - `picture` permanece um identificador de arquivo da pasta `story`, não uma URL pública persistida.
* Resiliência
  - A atualização de `stars.texts` deve substituir a coleção inteira em uma única operação de escrita.
* Performance
  - O Studio deve carregar os dados da aba com uma leitura agregada na borda da UI e salvar por um único `PUT` explícito da coleção completa.
  - O preview deve ser 100% local, sem chamadas de rede por edição, reorder ou expansão de card.

---

# 4. O que já existe?

## Camada React Router App (Studio)

* **`ROUTES.lesson.story`** (`apps/studio/src/constants/routes.ts`) - *Define a rota `/lesson/story/:starSlug` usada pela gestão do espaço e pela página do editor.*
* **`LessonStoryRoute`** (`apps/studio/src/app/routes/LessonStoryRoute.tsx`) - *Resolve a estrela pelo `slug` e hoje ainda carrega `story` string para a página.*
* **`StarItemView`** (`apps/studio/src/ui/space/widgets/pages/Planets/PlanetCollapsible/StarItem/StarItemView.tsx`) - *Ponto atual de navegação para o editor de história a partir da gestão de estrelas.*

## Camada UI (Studio)

* **`LessonStoryPage`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/index.tsx`) - *Entry point atual da página; injeta `lessonService`, `toastProvider` e repassa dados do loader.*
* **`useLessonStoryPage`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/useLessonStoryPage.ts`) - *Hook atual baseado em `story: string`, `updateStory` e `ActionButtonStore`.*
* **`LessonStoryPageView`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/LessonStoryPageView.tsx`) - *Renderiza o layout atual com `TextEditor`, helper de snippets e preview MDX.*
* **`Header`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/Header/index.tsx`) - *Exibe o nome e o número da estrela no topo da página.*
* **`TextBlocks`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/index.tsx`) - *Hoje funciona como helper de inserção de snippets MDX no Monaco, não como editor de blocos persistidos.*
* **`TextBlockButton`** (`apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockButton/useTextBlockButton.ts`) - *Insere tags MDX no `TextEditorContext` para o fluxo legado.*
* **`PictureInput`** (`apps/studio/src/ui/lesson/widgets/components/PictureInput/index.tsx`) - *Seletor de imagem já integrado ao storage da pasta `story`, com busca, upload e paginação.*
* **`useFetch`** (`apps/studio/src/ui/global/hooks/useFetch.ts`) - *Padrão já consolidado no Studio para estados de loading, error e refetch em páginas administrativas.*
* **`SortableList`** (`apps/studio/src/ui/global/widgets/components/SortableList/index.tsx`) - *Implementação padrão de drag-and-drop baseada em `dnd-kit`.*
* **`Mdx`** (`apps/studio/src/ui/global/widgets/components/Mdx/index.tsx`) - *Renderer já usado para preview de componentes `Text`, `Alert`, `Quote`, `User` e `Code`.*
* **`useMdx`** (`apps/studio/src/ui/global/widgets/components/Mdx/useMdx.ts`) - *Já possui `parseTextBlocksToMdx(textBlocks)` para derivar MDX a partir de `TextBlock[]`.*
* **`useStorageImage`** (`apps/studio/src/ui/global/hooks/useStorageImage.ts`) - *Monta a URL pública do CDN a partir do nome do arquivo salvo na pasta `story`.*
* **`ActionButtonStore`** (`apps/studio/src/ui/global/stores/ActionButtonStore/index.ts`) - *Centraliza os estados de execução, sucesso, falha e disponibilidade do botão principal.*

## Camada REST (Studio)

* **`LessonService`** (`apps/studio/src/rest/services/LessonService.ts`) - *Já expõe `fetchTextsBlocks`, `fetchStarStory` e `updateStory`; precisa evoluir para o save estruturado.*
* **`StorageService`** (`apps/studio/src/rest/services/StorageService.ts`) - *Fluxo já usado pelo `PictureInput` para listar, subir e remover assets da pasta `story`.*

## Camada Hono App (Server)

* **`LessonRouter`** (`apps/server/src/app/hono/routers/lesson/LessonRouter.ts`) - *Agrupa os routers de `questions`, `stories` e `text-blocks` sob `/lesson`.*
* **`TextBlocksRouter`** (`apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`) - *Hoje expõe apenas `GET /lesson/text-blocks/star/:starId`.*
* **`StoriesRouter`** (`apps/server/src/app/hono/routers/lesson/StoriesRouter.ts`) - *Mantém o contrato legado de leitura e escrita de `story` string, sem mudanças nesta spec.*
* **`FilesStorageRouter`** (`apps/server/src/app/hono/routers/storage/FilesStorageRouter.ts`) - *Já expõe o fluxo genérico de listagem/upload/remoção de arquivos da pasta `story`.*

## Camada REST (Server Controllers)

* **`FetchTextBlocksController`** (`apps/server/src/rest/controllers/lesson/FetchTextBlocksController.ts`) - *Traduz a leitura dos blocos para DTOs na borda REST.*
* **`FetchStoryController`** (`apps/server/src/rest/controllers/lesson/FetchStoryController.ts`) - *Expõe a string legada lida de `stars.story`.*
* **`UpdateStoryController`** (`apps/server/src/rest/controllers/lesson/UpdateStoryController.ts`) - *Atualiza a string legada diretamente em `stars.story`, fluxo mantido fora do escopo desta spec.*

## Camada Banco de Dados (Server)

* **`SupabaseTextBlocksRepository`** (`apps/server/src/database/supabase/repositories/lesson/SupabaseTextBlocksRepository.ts`) - *Hoje só lê `stars.texts` e assume que o campo sempre vem preenchido.*
* **`SupabaseTextBlockMapper`** (`apps/server/src/database/supabase/mappers/lesson/SupabaseTextBlockMapper.ts`) - *Hoje só faz o mapeamento DTO -> `TextBlock`.*
* **`SupabaseStoriesRepository`** (`apps/server/src/database/supabase/repositories/lesson/SupabaseStoriesRepository.ts`) - *Persiste a string legada em `stars.story`, sem mudanças previstas nesta spec.*
* **`Database.stars`** (`apps/server/src/database/supabase/types/Database.ts`) - *Confirma a coexistência de `story: string | null` e `texts: Json | null` na mesma linha da estrela.*

## Pacote Core

* **`LessonService`** (`packages/core/src/lesson/interfaces/LessonService.ts`) - *Contrato compartilhado de leitura/escrita hoje consumido pelo `studio`.*
* **`TextBlocksRepository`** (`packages/core/src/lesson/interfaces/TextBlocksRepository.ts`) - *Hoje expõe apenas leitura por estrela.*
* **`StoriesRepository`** (`packages/core/src/lesson/interfaces/StoriesRepository.ts`) - *Contrato atual para a string legada.*
* **`UpdateQuestionsUseCase`** (`packages/core/src/lesson/use-cases/UpdateQuestionsUseCase.ts`) - *Referência do padrão de atualização em lote de uma coleção por estrela.*
* **`TextBlock`** (`packages/core/src/global/domain/structures/TextBlock.ts`) - *Estrutura compartilhada dos blocos, com `type`, `content`, `picture` e `isRunnable`.*
* **`TextBlockType`** (`packages/core/src/global/domain/types/TextBlockType.ts`) - *Define o universo atual de tipos, incluindo valores legados fora do escopo desta aba.*
* **`Story`** (`packages/core/src/lesson/domain/structures/Story.ts`) - *Estrutura legada baseada em chunks separados por `----`, mantida fora do escopo desta entrega.*
* **`FileStorageFolderPath`** (`packages/core/src/storage/domain/structures/FileFileStorageFolderPath.ts`) - *Define a pasta canônica `images/story` para os assets da narrativa.*

## Pacote Validation

* **`contentSchema`** (`packages/validation/src/modules/global/schemas/contentSchema.ts`) - *Validação compartilhada mais adequada para o conteúdo dos blocos.*
* **`booleanSchema`** (`packages/validation/src/modules/global/schemas/booleanSchema.ts`) - *Base para validar `isRunnable`.*
* **`fileStorageFolderPathSchema`** (`packages/validation/src/modules/storage/fileStorageFolderPathSchema.ts`) - *Confirma `story` como pasta válida no fluxo de assets.*

---

# 5. O que deve ser criado?

## Pacote Core (Use Cases)

* **Localização:** `packages/core/src/lesson/use-cases/UpdateTextBlocksUseCase.ts` (**novo arquivo**)
* **Dependências:** `TextBlocksRepository`
* **Métodos:**
  - `execute(request: { starId: string; textBlocks: TextBlockDto[] }): Promise<TextBlockDto[]>` — valida e normaliza os blocos recebidos e persiste a coleção ordenada para a estrela.

## Pacote Validation (Schemas)

* **Localização:** `packages/validation/src/modules/lesson/schemas/textBlockSchema.ts` (**novo arquivo**)
* **Atributos:**
  - `type` — enum restrito a `default`, `user`, `alert`, `quote`, `code`.
  - `content` — conteúdo validado com `contentSchema`.
  - `picture` — nome do arquivo da pasta `story`, opcional apenas para `default`, `alert` e `quote`.
  - `isRunnable` — boolean opcional apenas para `code`.

* **Localização:** `packages/validation/src/modules/lesson/schemas/index.ts` (**novo arquivo**)
* **Atributos:** Barrel file que exporta `textBlockSchema`.

* **Localização:** `packages/validation/src/modules/lesson/index.ts` (**novo arquivo**)
* **Atributos:** Barrel file do módulo `lesson` no pacote `validation`.

## Camada REST (Controllers)

* **Localização:** `apps/server/src/rest/controllers/lesson/UpdateTextBlocksController.ts` (**novo arquivo**)
* **Dependências:** `TextBlocksRepository`
* **Dados de request:** `routeParams { starId }`, `body { textBlocks: TextBlockDto[] }`
* **Dados de response:** `TextBlockDto[]`
* **Métodos:**
  - `handle(http: Http<Schema>)` — extrai `starId` e o array ordenado de blocos, executa `UpdateTextBlocksUseCase` e responde com a coleção persistida.

## Camada UI (Widgets)

* **Localização:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/index.tsx` (**novo arquivo**)
* **Props:**
  - `item: { id: string; type: 'default' | 'user' | 'alert' | 'quote' | 'code'; content: string; picture?: string; isRunnable?: boolean }`
  - `isExpanded: boolean`
  - `onExpand(blockId: string): void`
  - `onRemove(blockId: string): void`
  - `onContentChange(blockId: string, content: string): void`
  - `onPictureChange(blockId: string, picture?: string): void`
  - `onRunnableChange(blockId: string, isRunnable: boolean): void`
* **Estados (Client Component):** Não aplicável; o widget alterna entre os modos colapsado e expandido com base nas props recebidas.
* **View:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/TextBlockCardView.tsx` (**novo arquivo**)
* **Hook:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockCard/useTextBlockCard.ts` (**novo arquivo**) — concentra handlers locais de expansão, preview truncado e delegação dos campos inline.
* **Index:** Recebe o estado do `LessonStoryPage`, renderiza badge do tipo, preview do conteúdo, indicador de imagem e os campos inline do bloco.
* **Widgets internos:** `BlockTypeBadge`, `BlockPreview`, `BlockActions`, `BlockContentField`, `BlockPictureField`, `BlockRunnableField`.
* **Estrutura de pastas:**

```text
apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/
├── index.tsx
├── TextBlocksView.tsx
└── TextBlockCard/
    ├── index.tsx
    ├── TextBlockCardView.tsx
    ├── useTextBlockCard.ts
    ├── BlockTypeBadge/
    │   ├── index.tsx
    │   └── BlockTypeBadgeView.tsx
    ├── BlockPreview/
    │   ├── index.tsx
    │   └── BlockPreviewView.tsx
    ├── BlockActions/
    │   ├── index.tsx
    │   └── BlockActionsView.tsx
    ├── BlockContentField/
    │   ├── index.tsx
    │   └── BlockContentFieldView.tsx
    ├── BlockPictureField/
    │   ├── index.tsx
    │   └── BlockPictureFieldView.tsx
    └── BlockRunnableField/
        ├── index.tsx
        └── BlockRunnableFieldView.tsx
```

---

# 6. O que deve ser modificado?

## Pacote Core

* **Arquivo:** `packages/core/src/lesson/interfaces/LessonService.ts`
* **Mudança:** Adicionar `updateTextBlocks(starId: Id, textBlocks: TextBlockDto[]): Promise<RestResponse<TextBlockDto[]>>` ao contrato compartilhado.
* **Justificativa:** O Studio passa a salvar a coleção estruturada de blocos; o contrato precisa refletir a nova escrita sem criar um service local fora do padrão do projeto.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/lesson/interfaces/TextBlocksRepository.ts`
* **Mudança:** Adicionar `updateMany(textBlocks: TextBlock[], starId: Id): Promise<void>` ao repositório.
* **Justificativa:** O server precisa substituir a coleção persistida em `stars.texts` por estrela no fluxo de salvamento explícito.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/lesson/use-cases/index.ts`
* **Mudança:** Exportar `UpdateTextBlocksUseCase`.
* **Justificativa:** Manter o barrel file do módulo `lesson` consistente com o novo caso de uso.
* **Camada:** `core`

## Pacote Validation (Schemas)

* **Arquivo:** `packages/validation/src/main.ts`
* **Mudança:** Exportar o novo módulo `lesson` do pacote `validation`.
* **Justificativa:** Permitir que server e apps importem `textBlockSchema` pelo entry point padrão do pacote.
* **Camada:** `core`

## Camada Hono App (Routes)

* **Arquivo:** `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`
* **Mudança:**
  - Manter `GET /lesson/text-blocks/star/:starId` com `verifyStarExists`.
  - Adicionar `PUT /lesson/text-blocks/star/:starId` validando `param { starId }` e `json { textBlocks: TextBlockDto[] }` com `textBlockSchema`.
  - Proteger o `PUT` com `verifyAuthentication` + `verifyGodAccount` + `verifyStarExists`.
* **Justificativa:** O editor salva a coleção completa em uma única ação explícita e precisa de um endpoint de substituição em lote alinhado ao padrão já usado em `QuestionsRouter`.
* **Camada:** `rest`

## Camada REST (Server Controllers)

* **Arquivo:** `apps/server/src/rest/controllers/lesson/index.ts`
* **Mudança:** Exportar `UpdateTextBlocksController`.
* **Justificativa:** Manter o barrel file de controllers de `lesson` alinhado ao novo fluxo de save.
* **Camada:** `rest`

## Camada Banco de Dados (Repositories)

* **Arquivo:** `apps/server/src/database/supabase/repositories/lesson/SupabaseTextBlocksRepository.ts`
* **Mudança:**
  - Em `findAllByStar`, retornar `[]` quando `stars.texts` vier `null`.
  - Implementar `updateMany(textBlocks, starId)` atualizando apenas `texts` na tabela `stars`.
* **Justificativa:** O editor precisa tratar ausência de blocos como coleção vazia e a escrita desta entrega deve afetar somente `stars.texts`.
* **Camada:** `database`

## Camada Banco de Dados (Mappers)

* **Arquivo:** `apps/server/src/database/supabase/mappers/lesson/SupabaseTextBlockMapper.ts`
* **Mudança:** Adicionar `toSupabase(textBlock: TextBlock): TextBlockDto` para serializar a coleção antes da escrita.
* **Justificativa:** O repositório precisa mapear explicitamente a saída do domínio para o JSON persistido em `stars.texts`.
* **Camada:** `database`

## Camada REST (Services)

* **Arquivo:** `apps/studio/src/rest/services/LessonService.ts`
* **Mudança:** Adicionar `updateTextBlocks(starId, textBlocks)` apontando para `PUT /lesson/text-blocks/star/:starId` com payload `{ textBlocks }`.
* **Justificativa:** O Studio deixa de salvar uma string livre e passa a persistir a coleção estruturada de blocos.
* **Camada:** `rest`

## Camada React Router App (Studio)

* **Arquivo:** `apps/studio/src/app/routes/LessonStoryRoute.tsx`
* **Mudança:** O `clientLoader` deve passar a carregar apenas o contexto da estrela (`starId`, `starName`, `starNumber`) resolvido por `spaceService.fetchStarBySlug`, deixando a carga dos blocos para a página via `useFetch`.
* **Justificativa:** Esse ajuste permite exibir loading, estados bloqueados e retry dentro da própria página, seguindo o padrão dominante do Studio para telas administrativas.
* **Camada:** `ui`

## Camada UI (Widgets)

* **Arquivo:** `apps/studio/src/constants/cache.ts`
* **Mudança:** Adicionar uma chave dedicada para a query da página de história, por exemplo `lessonStoryTextBlocks`.
* **Justificativa:** O `useFetch` da página precisa de uma chave estável para cache, refetch e atualização local do estado carregado.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/index.tsx`
* **Mudança:** Remover a dependência de `defaultStory`/`useScreen` e passar a compor a página a partir do contexto da estrela + hook de busca/salvamento dos blocos.
* **Justificativa:** A tela deixa de depender do Monaco e passa a operar sobre o estado estruturado dos cards.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/useLessonStoryPage.ts`
* **Mudança:**
  - Trocar `story: string` por estado local de blocos editáveis com IDs estáveis para DnD.
  - Buscar `textBlocks` e `story` legado com `useFetch`.
  - Criar novos blocos com os mesmos textos orientativos já usados pelo fluxo legado de snippets: `Insira seu texto aqui`, `Insira seu texto de alerta aqui`, `Insira seu texto de reflexão aqui`, `Insira a fala do usuário aqui` e `Insira seu código aqui`.
  - Montar a lista em `SortableItem<TextBlockEditorItem>[]`, preservando um `id` estável por card para drag-and-drop e para o estado expandido.
  - Derivar `previewContent`, `isLoading`, `isBlocked`, `blockingReason` e `isSaveDisabled`.
  - Expor handlers para adicionar, expandir, editar, reordenar, remover e salvar blocos.
  - No reorder, atualizar apenas o estado local e o preview; nenhuma chamada de rede deve ocorrer antes do clique em `Salvar`.
  - Atualizar o baseline local após save bem-sucedido e limpar o estado do `ActionButton` em cada nova edição.
* **Justificativa:** O hook atual é centrado em `story: string`; a nova aba precisa orquestrar dados estruturados, estados visuais e salvamento em lote.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/LessonStoryPageView.tsx`
* **Mudança:**
  - Remover `TextEditor` e `TextEditorContextProvider` da página.
  - Substituir o layout por duas colunas (`Blocos` e `Preview`) inspiradas no mockup anexado.
  - Suportar estados de `loading`, `erro`, `bloqueado`, `vazio` e `conteúdo`.
  - Manter o `ActionButton` no cabeçalho, usando o estado calculado no hook.
* **Justificativa:** A interface final deixa de ser um editor de MDX livre e passa a ser um editor visual de cards com preview lateral.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/index.tsx`
* **Mudança:** Deixar de exportar a view estática de snippets e passar a compor a lista ordenável de blocos com o novo `TextBlockCard`.
* **Justificativa:** Esse widget deixa de ser um helper de inserção no Monaco e passa a ser a superfície principal de edição dos blocos.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlocksView.tsx`
* **Mudança:**
  - Renderizar cabeçalho do painel com contador de blocos.
  - Usar `SortableList.Container` + `SortableList.Item` para reorder com o `handle` padrão já existente no `SortableList`.
  - Exibir o botão `Adicionar bloco` e a grade inline de tipos suportados (`default`, `user`, `alert`, `quote`, `code`).
  - Delegar a edição de cada item ao novo `TextBlockCard`.
  - Manter o card expandido pelo `id` estável mesmo após reorder.
* **Justificativa:** O mockup e o PRD pedem um painel de cards inline, não mais uma lista de atalhos de inserção de MDX.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/components/PictureInput/index.tsx`
* **Mudança:** Adicionar modo opcional de seleção vazia para contextos em que `picture` pode ser removida do bloco sem excluir o asset do bucket.
* **Justificativa:** No editor de história, `picture` é opcional e precisa poder voltar para `undefined` sem forçar `panda.jpg` como valor persistido.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/components/PictureInput/usePictureInput.ts`
* **Mudança:** Permitir `selectedImage` vazio quando o modo opcional estiver habilitado e expor handler para limpar apenas a seleção do bloco, sem remover o arquivo do bucket.
* **Justificativa:** O hook atual sempre inicializa com `panda.jpg`; isso conflita com o contrato opcional de `picture` no editor de blocos.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/components/PictureInput/PictureInputView.tsx`
* **Mudança:** Renderizar trigger/preview vazio e uma opção explícita de `Sem imagem` quando o componente for usado pelo editor de história.
* **Justificativa:** O operador precisa conseguir remover a imagem associada ao bloco sem sair do fluxo visual da aba.
* **Camada:** `ui`

---

# 7. O que deve ser removido?

## Camada UI (Studio)

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockButton/index.tsx`
* **Motivo da remoção:** O widget existe apenas para injetar snippets MDX no Monaco, fluxo que deixa de ser a base da edição da história.
* **Impacto esperado:** A página `LessonStory` passa a editar `stars.texts` por cards inline; não deve haver impacto fora da rota de história.

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockButton/useTextBlockButton.ts`
* **Motivo da remoção:** O hook depende de `TextEditorContext` e gera tags MDX, comportamento obsoleto para a nova aba.
* **Impacto esperado:** Remove o acoplamento entre a página de história e o editor textual legado.

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/pages/LessonStory/TextBlocks/TextBlockButton/TextBlockButtonView.tsx`
* **Motivo da remoção:** A view representa apenas botões de inserção do fluxo legado.
* **Impacto esperado:** Limpa o código de UI não utilizado após a troca para o editor visual de blocos.

---

# 8. Decisões Técnicas e Trade-offs

* **Decisão:** Carregar os blocos na própria página com `useFetch`, deixando o `clientLoader` da rota responsável apenas por resolver a estrela.
* **Alternativas consideradas:** Manter a busca de blocos dentro de `LessonStoryRoute.tsx` como acontece hoje com `story`.
* **Motivo da escolha:** O Studio já usa `useFetch` em páginas administrativas para expor `loading`, `error`, `refetch` e mutações locais; a aba precisa desses estados para o editor visual.
* **Impactos / trade-offs:** A renderização da página depende de uma query adicional após o loader, mas ganha estados visuais explícitos e evita acoplar a rota à composição do editor.

* **Decisão:** Salvar a coleção inteira por `PUT /lesson/text-blocks/star/:starId`.
* **Alternativas consideradas:** Criar endpoints incrementais por item (`POST`, `PATCH`, `DELETE`) ou manter o save de `story` string.
* **Motivo da escolha:** O PRD define salvamento explícito no cabeçalho e a codebase já tem precedente de atualização em lote por estrela (`QuestionsRouter` + `UpdateQuestionsUseCase`).
* **Impactos / trade-offs:** O payload do save é maior, mas o backend fica mais simples, a UI mantém toda a edição em memória e o número de endpoints não explode.

* **Decisão:** Tratar `stars.texts` como única escrita desta entrega, sem sincronizar `stars.story`.
* **Alternativas consideradas:** Atualizar `stars.story` junto com `stars.texts` ou manter `story` como fonte principal.
* **Motivo da escolha:** A direção funcional foi explicitamente redefinida para não tocar `stars.story` ainda.
* **Impactos / trade-offs:** O editor novo fica isolado e mais seguro para entrega incremental, mas o app `web` continua dependente do fluxo legado até uma etapa futura de integração/migração.

* **Decisão:** Reutilizar `SortableList` existente para o drag-and-drop, com reorder totalmente local até o salvamento explícito.
* **Alternativas consideradas:** Implementar DnD manualmente com `dnd-kit` na página ou persistir a ordem a cada movimento.
* **Motivo da escolha:** O projeto já possui um wrapper consolidado de ordenação, com handle e callbacks compatíveis com o comportamento desejado.
* **Impactos / trade-offs:** Reduz código novo e mantém consistência visual/técnica, mas exige um `id` estável por card na camada de UI para que expansão e reorder não se percam.

* **Decisão:** Persistir `picture` como nome do arquivo da pasta `story`, não como URL pública.
* **Alternativas consideradas:** Salvar a URL pública completa do Supabase no bloco.
* **Motivo da escolha:** O contrato atual de `Image`, `PictureInput`, `StorageImage` e `useStorageImage` já opera com nomes de arquivo e compõe a URL na UI.
* **Impactos / trade-offs:** Mantém consistência com a codebase atual, mas adia uma possível mudança futura para URLs explícitas se esse requisito voltar a ser priorizado.

* **Decisão:** Reaproveitar `PictureInput` com um modo opcional de seleção vazia, em vez de criar um seletor de imagem paralelo para a aba.
* **Alternativas consideradas:** Criar um novo widget exclusivo de seleção de imagem para o editor de história.
* **Motivo da escolha:** O fluxo existente já cobre busca, paginação e upload; a feature precisa apenas flexibilizar o estado vazio para `picture` opcional.
* **Impactos / trade-offs:** O componente compartilhado fica um pouco mais complexo, mas evita duplicação de lógica de storage no Studio.

* **Decisão:** Bloquear a aba quando houver história legada sem `texts` migrados ou quando houver tipos de bloco fora do subconjunto suportado.
* **Alternativas consideradas:** Tentar converter `story` automaticamente em blocos ou ignorar silenciosamente os tipos legados.
* **Motivo da escolha:** Não existe parser confiável na codebase para converter MDX legado em `TextBlockDto[]`, e ignorar tipos/strings legadas pode causar perda de conteúdo no primeiro save.
* **Impactos / trade-offs:** Alguns casos ficam indisponíveis até a migração/backfill, mas a implementação evita corrupção silenciosa de dados.

---

# 9. Diagramas e Referências

* **Fluxo de Dados:**

```ascii
[LessonStoryRoute]
    |
    | resolve star by slug
    v
[LessonStoryPage]
    |
    | useFetch (studio)
    |-- GET /lesson/text-blocks/star/:starId
    v
[useLessonStoryPage]
    | local state: ordered textBlocks + dirty snapshot
    | SortableItem[] com id estavel por card
    | preview: parseTextBlocksToMdx(...)
    v
[TextBlocksView + TextBlockCard + Mdx preview]
    |
    | PUT /lesson/text-blocks/star/:starId
    v
[TextBlocksRouter]
    -> verifyAuthentication
    -> verifyGodAccount
    -> validate(param/json)
    -> verifyStarExists
    v
[UpdateTextBlocksController]
    v
[UpdateTextBlocksUseCase]
    -> TextBlock.create(dto)
    v
[SupabaseTextBlocksRepository.updateMany]
    -> update stars.texts
    v
[Supabase / table stars]
```

* **Fluxo Cross-app:**

```ascii
Studio (consome) --REST--> Server (expõe /lesson/text-blocks)
   |                              |
   |                              +-- Hono router/controller
   |                              +-- Core use case
   |                              +-- Supabase repository
   |
   +-- preview local com Mdx

Server (atualiza) --> stars.texts  [fonte de edição]

Web permanece fora do escopo desta entrega

Formato de comunicação funcional: REST HTTP
Formato de comunicação entre camadas: contrato TypeScript compartilhado (`LessonService`)
```

* **Layout:**

```ascii
┌──────────────────────────────────────────────────────────────────────────────┐
│ Editor de história                                    [Salvar]              │
│ Estrela 3 - Condicionais                                                     │
├───────────────────────────────────┬──────────────────────────────────────────┤
│ Blocos (N blocos)                 │ Preview                                  │
│ ┌───────────────────────────────┐ │ ┌──────────────────────────────────────┐ │
│ │ ≡ [default] Preview truncado  │ │ │ bubble default / alert / quote      │ │
│ │ ≡ [user]    Preview truncado  │ │ │ bubble user invertido               │ │
│ │ ≡ [code]    Preview truncado  │ │ │ bloco de código                      │ │
│ │                               │ │ │ atualização local imediata           │ │
│ │ Conteúdo                      │ │ └──────────────────────────────────────┘ │
│ │ [textarea inline]             │ │                                          │
│ │ Imagem (quando aplicável)     │ │                                          │
│ │ [PictureInput / Sem imagem]   │ │                                          │
│ └───────────────────────────────┘ │                                          │
│ [ + Adicionar bloco ]             │                                          │
│ [default] [user] [alert] [code] [quote]                                     │
└───────────────────────────────────┴──────────────────────────────────────────┘
```

* **Referências:**
  - `apps/studio/src/app/routes/LessonStoryRoute.tsx`
  - `apps/studio/src/ui/lesson/widgets/pages/LessonStory/useLessonStoryPage.ts`
  - `apps/studio/src/ui/lesson/widgets/components/PictureInput/index.tsx`
  - `apps/studio/src/ui/global/widgets/components/SortableList/index.tsx`
  - `apps/studio/src/ui/global/widgets/components/Mdx/useMdx.ts`
  - `apps/studio/src/ui/challenging/ChallengeSources/useChallengeSourcesPage.ts`
  - `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`
  - `apps/server/src/app/hono/routers/lesson/QuestionsRouter.ts`
  - `apps/server/src/database/supabase/repositories/lesson/SupabaseTextBlocksRepository.ts`
  - `packages/core/src/lesson/use-cases/UpdateQuestionsUseCase.ts`
  - Mockup visual anexado na conversa desta spec (cards inline + preview lateral)

---
