---
title: Drawer de Notas do Usuario em Lesson e Challenge
prd: https://github.com/JohnPetros/stardust/milestone/30
issue: https://github.com/JohnPetros/stardust/issues/403
apps: server, web
status: closed
last_updated_at: 2026-05-08
---

# 1. Objetivo (Obrigatorio)

Implementar o fluxo ponta a ponta de notas privadas do usuario no modulo `profile`, exposto na `web` por um drawer reutilizavel disponivel apenas nas paginas de `lesson` e `challenge`, sem navegacao adicional. A entrega cobre criacao, listagem paginada, edicao e exclusao de notas com persistencia em banco, contratos dedicados no `core`, validacao compartilhada, endpoints REST autenticados em `server`, integracao no `ProfileService` do `web` e planejamento explicito da migration SQL necessaria para criar o recurso `notes` sem acopla-lo ao `UserDto` ou ao fluxo generico de `UpdateUser`.

---

# 2. Escopo (Obrigatorio)

## 2.1 In-scope

- Criar o recurso `notes` dentro do modulo `profile` no `packages/core`.
- Criar a persistencia SQL de notas privadas do usuario em tabela dedicada `public.notes`.
- Expor CRUD autenticado de notas no `server` sob o router `profile`.
- Reutilizar o `ProfileService` existente no `web` para consumir os novos endpoints REST.
- Criar um widget de drawer reutilizavel para abrir, criar, listar, editar e excluir notas nas paginas de `lesson` e `challenge`.
- Exibir o gatilho de notas apenas para usuarios autenticados e apenas nesses dois fluxos.
- Persistir o corpo da nota em Markdown, com editor WYSIWYG leve na UI.
- Ordenar a listagem por `updated_at` decrescente e atualizar a lista local sem refetch completo apos mutacoes bem-sucedidas.
- Retornar a listagem de notas em `PaginationResponse`, mesmo no drawer.

## 2.2 Out-of-scope

- Implementar a pagina dedicada `/notes` da milestone.
- Expor o botao de notas no layout global da `web`, em `space`, `profile`, listagem de desafios ou outras telas fora de `lesson` e `challenge`.
- Vincular notas a `starId`, `challengeId`, questao, comentario ou qualquer outro recurso contextual.
- Compartilhar notas entre usuarios, adicionar tags, pastas, busca ou historico de versoes.
- Criar autosave, rascunho offline ou sincronizacao local fora da persistencia explicita por botao `Salvar`.

---

# 3. Requisitos (Obrigatorio)

## 3.1 Funcionais

- O sistema deve exibir o gatilho de notas apenas quando houver conta autenticada no `AuthContext`.
- O gatilho deve existir apenas nas paginas de `lesson` e `challenge`, sem alterar rota nem desmontar o estado atual da tela.
- O drawer deve abrir por padrao no formulario de nova nota.
- O usuario deve conseguir criar nota com titulo obrigatorio de no minimo 1 caractere e corpo opcional.
- O usuario deve conseguir abrir uma listagem modal sobre o drawer para visualizar suas notas privadas.
- A listagem deve mostrar titulo, preview truncado do corpo e data relativa da ultima atualizacao.
- O usuario deve conseguir filtrar a listagem por busca textual em `title`.
- O usuario deve conseguir selecionar uma nota da lista para preencher o formulario e editar no mesmo drawer.
- O usuario deve conseguir excluir uma nota mediante confirmacao explicita.
- O backend deve retornar apenas notas do usuario autenticado, ordenadas por `updated_at` decrescente, dentro de `PaginationResponse`.
- O backend nao deve aceitar `authorId`, `isPublic`, `status` ou qualquer outro campo controlado pelo servidor nos payloads de entrada.

## 3.2 Nao funcionais

- Seguranca: todas as rotas de notas devem exigir `AuthMiddleware.verifyAuthentication`; update e delete devem validar ownership com o `accountId` autenticado antes de persistir a mutacao.
- Compatibilidade retroativa: a feature nao deve alterar `UpdateUserUseCase`, `UsersRepository` nem o contrato atual de `userSchema` para transportar notas.
- Acessibilidade: drawer, modal e dialogs devem suportar fechamento por `Esc`, navegacao por teclado e `aria-label` explicito em salvar, fechar, ver notas e excluir.
- Responsividade: drawer com largura fixa em desktop e ocupacao integral no mobile, seguindo o padrao visual do uso atual de `vaul`.
- Performance: a listagem deve ser buscada sob demanda ao abrir o modal de notas; apos create/update/delete bem-sucedidos, a UI deve reconciliar o array local sem novo fetch obrigatorio.
- Performance: o filtro por busca deve ser aplicado na consulta paginada do backend, evitando carregar toda a colecao no drawer para filtrar apenas no cliente.
- Consistencia de dados: `updated_at` deve ser atualizado em toda edicao e usado como ordenacao canonica no repositorio.

---

# 4. O que ja existe? (Obrigatorio)

## Camada UI

* **`LessonPage`** (`apps/web/src/ui/lesson/widgets/pages/Lesson/index.tsx`) - Entry point client da pagina de licao; hidrata store e compoe `LessonPageView` sem acoplamento direto ao drawer.
* **`LessonPageView`** (`apps/web/src/ui/lesson/widgets/pages/Lesson/LessonPageView.tsx`) - Compoe `LessonHeader`, `StoryStage` e `QuizStage`, mantendo o fluxo da pagina sem props de notes.
* **`LessonHeader`** (`apps/web/src/ui/lesson/widgets/pages/Lesson/LessonHeader/index.tsx`) - Header fixo da licao com acoes de saida, progresso, vidas e composicao local do `NotesDrawer`.
* **`ChallengePage`** (`apps/web/src/ui/challenging/widgets/pages/Challenge/index.tsx`) - Entry point client da pagina de desafio; ja monta slots de navegacao e alert dialog.
* **`ChallengePageView`** (`apps/web/src/ui/challenging/widgets/pages/Challenge/ChallengePageView.tsx`) - Header do desafio onde existe espaco para um slot adicional independente da navegacao sequencial.
* **`ChallengesNavigationSidebarView`** (`apps/web/src/ui/challenging/widgets/components/ChallengesNavigationSidebar/ChallengesNavigationSidebarView.tsx`) - Referencia existente de `Drawer` com `vaul`, overlay e responsividade lateral.
* **`Dialog`** (`apps/web/src/ui/global/widgets/components/Dialog/Dialog.tsx`) - Abstracao global para modal controlado com `open/onOpenChange`, adequada ao estado `Ver notas` sobre o drawer.
* **`AlertDialog`** (`apps/web/src/ui/global/widgets/components/AlertDialog/index.tsx`) - Componente global reutilizavel para confirmacao de exclusao e descarte.
* **`CreateApiKeyDialog`** (`apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/CreateApiKeyDialog/index.tsx`) - Referencia de dialog client-side com validacao local, reset de estado ao fechar e fluxo de acao assíncrona.
* **`useSnippetPage`** (`apps/web/src/ui/playground/widgets/pages/Snippet/useSnippetPage.ts`) - Referencia de formulario client-side com `react-hook-form`, `zodResolver`, estado de loading, erros e toast em recurso textual do usuario.

## Camada REST (Services)

* **`ProfileService`** (`apps/web/src/rest/services/ProfileService.ts`) - Adapter REST ja consolidado para o modulo `profile`; deve ser reutilizado para notes em vez de criar um novo service HTTP paralelo.
* **`PlaygroundService`** (`apps/web/src/rest/services/PlaygroundService.ts`) - Referencia de CRUD textual do usuario no `web`, mas com payload mais amplo do que o desejado para notes.

## Camada Core

* **`ProfileService`** (`packages/core/src/profile/interfaces/ProfileService.ts`) - Contrato do `web` para endpoints do modulo `profile`; hoje nao contempla notes.
* **`UsersRepository`** (`packages/core/src/profile/interfaces/UsersRepository.ts`) - Contrato atual de usuario completo; evidencia que notes nao devem ser acopladas ao fluxo generico de `replace(user)`.
* **`UpdateUserUseCase`** (`packages/core/src/profile/use-cases/UpdateUserUseCase.ts`) - Faz replacement do `UserDto` inteiro, inadequado para um subrecurso privado e incremental como notes.
* **`UserDto`** (`packages/core/src/profile/domain/entities/dtos/UserDto.ts`) - DTO amplo com varios campos controlados pelo servidor; nao deve ser estendido para receber notas no payload de entrada.
* **`Snippet`** (`packages/core/src/playground/domain/entities/Snippet.ts`) - Referencia de entidade autoral com `title`, `author` e persistencia dedicada.
* **`CreateSnippetUseCase`** (`packages/core/src/playground/use-cases/CreateSnippetUseCase.ts`) - Referencia de caso de uso que recebe dados estreitos da borda, constroi entidade e persiste via repository.
* **`UpdateSnippetUseCase`** (`packages/core/src/playground/use-cases/UpdateSnippetUseCase.ts`) - Referencia de update de recurso textual com `findById -> mutate -> replace`.
* **`Name`** (`packages/core/src/global/domain/structures/Name.ts`) - Estrutura global de titulo com minimo 2; conflita com o requisito de titulo da nota com minimo 1.
* **`Text`** (`packages/core/src/global/domain/structures/Text.ts`) - Estrutura global de texto que aceita string vazia; adequada para o corpo opcional da nota.
* **`Text`** (`packages/core/src/global/domain/structures/Text.ts`) - Estrutura global de texto que aceita string vazia; adequada tanto para titulo quanto para corpo da nota.

## Pacote Validation

* **`titleSchema`** (`packages/validation/src/modules/global/schemas/titleSchema.ts`) - Schema global com minimo 3; nao pode ser reutilizado por notes.
* **`contentSchema`** (`packages/validation/src/modules/global/schemas/contentSchema.ts`) - Schema global com minimo 3; tambem nao atende corpo opcional.
* **`userSchema`** (`packages/validation/src/modules/profile/userSchema.ts`) - Schema parcial de `User`; reforca que notes devem ter schema dedicado.
* **`snippetSchema`** (`packages/validation/src/modules/playground/schema/snippetSchema.ts`) - Referencia de schema compartilhado para recurso textual do usuario.

## Camada Hono App (Routes)

* **`ProfileRouter`** (`apps/server/src/app/hono/routers/profile/ProfileRouter.ts`) - Composition root do modulo `profile` no `server`, hoje montando apenas `UsersRouter` e `AchievementsRouter`.
* **`UsersRouter`** (`apps/server/src/app/hono/routers/profile/UsersRouter.ts`) - Referencia de router autenticado do modulo `profile`, incluindo validacao Zod e instanciacao controller/repository por handler.
* **`SnippetsRouter`** (`apps/server/src/app/hono/routers/playground/SnippetsRouter.ts`) - Referencia mais proxima de CRUD autoral com `GET/POST/PUT/DELETE` autenticados.

## Camada REST (Controllers)

* **`CreateSnippetController`** (`apps/server/src/rest/controllers/playground/CreateSnippetController.ts`) - Referencia de controller que le body, resolve `account` autenticado e injeta `authorId` no use case.
* **`FetchSnippetsListController`** (`apps/server/src/rest/controllers/playground/FetchSnippetsListController.ts`) - Referencia de listagem do proprio autor com `http.getAccountId()`.
* **`UpdateSnippetController`** (`apps/server/src/rest/controllers/playground/UpdateSnippetController.ts`) - Referencia de update por `routeParams` + body.
* **`DeleteSnippetController`** (`apps/server/src/rest/controllers/playground/DeleteSnippetController.ts`) - Referencia de exclusao simples por `noteId`/`snippetId`.

## Camada Banco de Dados

* **`SupabaseSnippetsRepository`** (`apps/server/src/database/supabase/repositories/playground/SupabaseSnippetsRepository.ts`) - Referencia de persistencia de recurso textual do usuario com mapper explicito e filtros por autor.
* **`SupabaseSnippetMapper`** (`apps/server/src/database/supabase/mappers/playground/SupabaseSnippetMapper.ts`) - Referencia de mapeamento DB -> DTO -> entidade.
* **`SupabaseSnippet`** (`apps/server/src/database/supabase/types/SupabaseSnippet.ts`) - Referencia de alias tipado para linha Supabase.
* **`Database`** (`apps/server/src/database/supabase/types/Database.ts`) - Tipos gerados do banco que devem refletir a nova tabela `notes`.
* **`20251008214302_create_tables.sql`** (`apps/server/supabase/migrations/20251008214302_create_tables.sql`) - Migration base com exemplos de tabelas autorais (`snippets`, `solutions`, `comments`) e grants atuais.

---

# 5. O que deve ser criado? (Depende da tarefa)

## Camada Banco de Dados (Migration)

* **Localizacao:** `apps/server/supabase/migrations/<timestamp>_create_notes.sql` (**novo arquivo**)
* **Objetivo:** Introduzir o recurso persistido `public.notes` como subrecurso privado do modulo `profile`, sem acopla-lo ao registro `users` nem criar view derivada desnecessaria.
* **Estrutura prevista:**
  * Tabela `public.notes` com colunas `id uuid`, `title text`, `content text`, `created_at timestamptz`, `updated_at timestamptz`, `user_id character varying`.
  * `title` com `CHECK (length(title) >= 1)`.
  * `content` com default `''::text`.
  * `created_at` e `updated_at` com default em UTC.
  * FK `user_id -> public.users(id)` com `ON UPDATE CASCADE` e `ON DELETE CASCADE`.
  * Indice composto `notes_user_id_updated_at_idx` em `(user_id, updated_at desc)`.
  * Grants apenas para `authenticated` e `service_role`, sem permissao para `anon`, por se tratar de recurso explicitamente privado.

## Camada Core (Entities)

* **Localizacao:** `packages/core/src/profile/domain/entities/Note.ts` (**novo arquivo**)
* **Props:** `title: Text`, `content: Text`, `userId: Id`, `createdAt: Date`, `updatedAt: Date`.
* **Metodos:**
  * `static create(dto: NoteDto): Note` - cria a entidade a partir de DTO e aplica defaults de datas.
  * `updateTitle(title: Text): void` - atualiza o titulo mantendo a entidade viva.
  * `updateContent(content: Text): void` - atualiza o corpo Markdown.
  * `touch(updatedAt?: Date): void` - atualiza `updatedAt` antes da persistencia.
  * `get dto(): NoteDto` - serializa a entidade para transporte entre camadas.

## Camada Core (DTOs)

* **Localizacao:** `packages/core/src/profile/domain/entities/dtos/NoteDto.ts` (**novo arquivo**)
* **props:**
  * `id?: string`
  * `title: string`
  * `content: string`
  * `userId: string`
  * `createdAt?: Date`
  * `updatedAt?: Date`

## Camada Core (Errors)

* **Localizacao:** `packages/core/src/profile/domain/errors/NoteNotFoundError.ts` (**novo arquivo**)
* **Responsabilidade:** Representar tentativa de editar ou excluir nota inexistente ou inacessivel ao autor autenticado, sem expor detalhes de ownership no contrato HTTP.

## Camada Core (Interfaces)

* **Localizacao:** `packages/core/src/profile/interfaces/NotesRepository.ts` (**novo arquivo**)
* **Metodos:**
  * `findById(noteId: Id): Promise<Note | null>` - busca uma nota pelo ID para edicao ou exclusao.
  * `findManyByUser(userId: Id, page?: OrdinalNumber, itemsPerPage?: OrdinalNumber, search?: Text): Promise<ManyItems<Note>>` - lista as notas privadas do usuario ordenadas por `updatedAt` desc e filtradas por titulo quando houver busca.
  * `add(note: Note): Promise<void>` - persiste uma nova nota.
  * `replace(note: Note): Promise<void>` - persiste alteracoes de titulo, corpo e `updatedAt`.
  * `remove(noteId: Id): Promise<void>` - remove definitivamente a nota.

## Camada Core (Use Cases)

* **Localizacao:** `packages/core/src/profile/use-cases/CreateNoteUseCase.ts` (**novo arquivo**)
* **Dependencias:** `NotesRepository`
* **Dados de request:** `noteTitle`, `noteContent`, `userId`
* **Dados de response:** `NoteDto`
* **Metodos:**
  * `execute(request: { noteTitle: string; noteContent: string; userId: string }): Promise<NoteDto>` - cria a nota privada do usuario autenticado e a persiste.

* **Localizacao:** `packages/core/src/profile/use-cases/ListNotesUseCase.ts` (**novo arquivo**)
* **Dependencias:** `NotesRepository`
* **Dados de request:** `userId`, `page`, `itemsPerPage`, `search`
* **Dados de response:** `PaginationResponse<NoteDto>`
* **Metodos:**
  * `execute(request: { userId: string; page: number; itemsPerPage: number; search?: string }): Promise<PaginationResponse<NoteDto>>` - lista as notas do usuario ja ordenadas pela persistencia, com filtro opcional por titulo, e encapsuladas em resposta paginada.

* **Localizacao:** `packages/core/src/profile/use-cases/UpdateNoteUseCase.ts` (**novo arquivo**)
* **Dependencias:** `NotesRepository`
* **Dados de request:** `noteId`, `noteTitle`, `noteContent`, `userId`
* **Dados de response:** `NoteDto`
* **Metodos:**
  * `execute(request: { noteId: string; noteTitle: string; noteContent: string; userId: string }): Promise<NoteDto>` - carrega a nota, valida ownership, atualiza titulo/corpo, faz `touch()` e persiste.

* **Localizacao:** `packages/core/src/profile/use-cases/DeleteNoteUseCase.ts` (**novo arquivo**)
* **Dependencias:** `NotesRepository`
* **Dados de request:** `noteId`, `userId`
* **Dados de response:** vazio
* **Metodos:**
  * `execute(request: { noteId: string; userId: string }): Promise<void>` - carrega a nota, valida ownership e remove o registro.

## Pacote Validation (Schemas)

* **Localizacao:** `packages/validation/src/modules/profile/noteSchema.ts` (**novo arquivo**)
* **Atributos:**
  * `title: z.string().min(1)` - valida o titulo minimo exigido pelo PRD.
  * `content: z.string()` - aceita string vazia para o corpo Markdown.

## Camada REST (Controllers)

* **Localizacao:** `apps/server/src/rest/controllers/profile/notes/CreateNoteController.ts` (**novo arquivo**)
* **Dependencias:** `NotesRepository`
* **Dados de request:** `body.title`, `body.content`, `account.id`
* **Dados de response:** `NoteDto`
* **Metodos:**
  * `handle(http: Http<Schema>): Promise<RestResponse>` - le o body validado, resolve `userId` autenticado e delega ao `CreateNoteUseCase`.

* **Localizacao:** `apps/server/src/rest/controllers/profile/notes/ListNotesController.ts` (**novo arquivo**)
* **Dependencias:** `NotesRepository`
* **Dados de request:** `account.id`, `query.page`, `query.itemsPerPage`, `query.search`
* **Dados de response:** `PaginationResponse<NoteDto>`
* **Metodos:**
  * `handle(http: Http<Schema>): Promise<RestResponse>` - usa `http.getAccountId()` para listar apenas as notas do usuario autenticado em formato paginado, aplicando busca por titulo quando enviada.

* **Localizacao:** `apps/server/src/rest/controllers/profile/notes/UpdateNoteController.ts` (**novo arquivo**)
* **Dependencias:** `NotesRepository`
* **Dados de request:** `routeParams.noteId`, `body.title`, `body.content`, `account.id`
* **Dados de response:** `NoteDto`
* **Metodos:**
  * `handle(http: Http<Schema>): Promise<RestResponse>` - resolve nota, ownership e update via `UpdateNoteUseCase`.

* **Localizacao:** `apps/server/src/rest/controllers/profile/notes/DeleteNoteController.ts` (**novo arquivo**)
* **Dependencias:** `NotesRepository`
* **Dados de request:** `routeParams.noteId`, `account.id`
* **Dados de response:** vazio
* **Metodos:**
  * `handle(http: Http<Schema>): Promise<RestResponse>` - remove a nota do proprio autor via `DeleteNoteUseCase`.

## Camada Banco de Dados (Repositories)

* **Localizacao:** `apps/server/src/database/supabase/repositories/profile/SupabaseNotesRepository.ts` (**novo arquivo**)
* **Dependencias:** `SupabaseClient`, `SupabaseNoteMapper`
* **Metodos:**
  * `findById(noteId: Id): Promise<Note | null>` - consulta uma linha de `notes` por `id`.
  * `findManyByUser(userId: Id, page?: OrdinalNumber, itemsPerPage?: OrdinalNumber, search?: Text): Promise<ManyItems<Note>>` - consulta `notes` filtrando por `user_id`, aplicando busca por `title` com `ilike`, ordenando por `updated_at desc` e aplicando range paginado.
  * `add(note: Note): Promise<void>` - insere a nota serializada em `notes`.
  * `replace(note: Note): Promise<void>` - atualiza `title`, `content` e `updated_at` da nota.
  * `remove(noteId: Id): Promise<void>` - exclui a linha da nota.

## Camada Banco de Dados (Mappers)

* **Localizacao:** `apps/server/src/database/supabase/mappers/profile/SupabaseNoteMapper.ts` (**novo arquivo**)
* **Metodos:**
  * `toEntity(supabaseNote: SupabaseNote): Note` - converte a linha do banco para entidade `Note`.
  * `toDto(supabaseNote: SupabaseNote): NoteDto` - converte a linha do banco para `NoteDto`.
  * `toSupabase(note: Note): SupabaseNote` - serializa a entidade para o shape persistido.

## Camada Banco de Dados (Types)

* **Localizacao:** `apps/server/src/database/supabase/types/SupabaseNote.ts` (**novo arquivo**)
* **props:** Alias de `Database['public']['Tables']['notes']['Row']`.

## Camada Hono App (Routes)

* **Localizacao:** `apps/server/src/app/hono/routers/profile/NotesRouter.ts` (**novo arquivo**)
* **Middlewares:** `AuthMiddleware.verifyAuthentication`, `ValidationMiddleware.validate`
* **Caminho da rota:** `/profile/notes`
* **Dados de schema:**
  * `GET /` - valida `page`, `itemsPerPage` e `search` no query.
  * `POST /` - valida `noteSchema` no body.
  * `PUT /:noteId` - valida `noteId` com `idSchema` no param e `noteSchema` no body.
  * `DELETE /:noteId` - valida `noteId` com `idSchema` no param.

## Camada UI (Widgets)

* **Localizacao:** `apps/web/src/ui/global/widgets/components/NotesDrawer` (**nova pasta**)
* **Props:** `children: ReactNode`
* **Estados (Client Component):**
  * `Loading` - loading independente para salvar, listar e excluir; a pagina `lesson/challenge` continua interativa.
  * `Error` - toast de erro e CTA de retry apenas na listagem modal quando a busca falhar.
  * `Empty` - modal lista mensagem amigavel e CTA `Nova nota` quando nao houver notas.
  * `Content` - drawer com formulario, toolbar do editor e modal de listagem sobreposto.
* **View:** `NotesDrawerView.tsx`
* **Hook (se aplicavel):** `useNotesDrawer.ts`
* **Index:** Resolve `profileService` via `useRestContext`, `user/isAccountAuthenticated` via `useAuthContext` e `toast` via `useToastContext`; so renderiza trigger e drawer quando autenticado, usando `children` como elemento trigger do `Drawer`.
* **Widgets internos:** `NotesListDialog`, `TiptapEditorField`
* **Estrutura de pastas:**

```text
apps/web/src/ui/global/widgets/components/NotesDrawer/
├── index.tsx
├── useNotesDrawer.ts
├── NotesDrawerView.tsx
├── NotesListDialog/
│   ├── index.tsx
│   └── NotesListDialogView.tsx
└── TiptapEditorField/
    ├── index.tsx
    └── useTiptapEditorField.ts
```

* **Atualizacoes implementadas (2026-05-08):**
  * `NotesListDialog` foi separado em `index.tsx` (composicao) e `NotesListDialogView.tsx` (renderizacao);
  * `TiptapEditorField` recebeu hook dedicado `useTiptapEditorField.ts` para encapsular setup/comandos do editor;
  * o drawer ganhou a acao `Adicionar nota` no header para limpar o formulario e iniciar uma nova nota;
  * o bloco introdutorio `Nova nota` e omitido quando existe nota ativa em edicao;
  * o corpo do drawer passou a usar `overflow-y-auto` para suportar scroll de conteudo;
  * o editor usa `data-vaul-no-drag` para evitar conflito de drag do drawer com selecao multipla de texto.

* **Responsabilidades do hook raiz:**
  * controlar `isDrawerOpen`, `isListDialogOpen`, `selectedNoteId`, `notes`, `isSubmitting`, `isListLoading`, `isDeleting`;
  * abrir confirmacao de descarte quando o formulario estiver dirty e o usuario tentar fechar o drawer ou trocar de nota;
  * buscar notas ao abrir a listagem pela primeira vez;
  * reconciliar a lista local apos create/update/delete sem refetch obrigatorio;
  * aplicar rollback local em delete caso o endpoint falhe.

* **Responsabilidades do `TiptapEditorField`:**
  * encapsular o Tiptap usando `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm`, `@tiptap/extension-placeholder` e `tiptap-markdown` para emitir/receber Markdown;
  * expor toolbar com `bold`, `italic`, `code`, `codeBlock`, `bulletList` e `orderedList`, usando icones para listas;
  * preservar foco e selecao ao aplicar comandos de toolbar via `onMouseDown` com `preventDefault`;
  * expor `value`, `disabled` e `onChange(markdown: string)` para integracao no widget raiz.

* **Responsabilidades do `NotesListDialog`:**
  * renderizar a listagem em `Dialog.Container` usando os dados recebidos do hook raiz;
  * exibir input de busca por titulo com debounce curto antes de disparar nova consulta paginada;
  * exibir preview truncado do corpo, titulo, estado vazio, estado de erro e data relativa via `Datetime.formatTimeAgo()`.

* **Contrato de composicao do `NotesDrawer`:**
  * o componente deve receber `children` obrigatorio;
  * o `children` representa o botao ou elemento visual que disparara a abertura do drawer;
  * o ponto de montagem em `lesson` e `challenge` continua responsavel por definir aparencia e posicao desse trigger.

---

# 6. O que deve ser modificado? (Depende da tarefa)

## Core

* **Arquivo:** `packages/core/src/profile/interfaces/ProfileService.ts`
* **Mudanca:** Adicionar `fetchNotes(page: OrdinalNumber, itemsPerPage: OrdinalNumber, search?: Text): Promise<RestResponse<PaginationResponse<NoteDto>>>`, `createNote(noteTitle: string, noteContent: string): Promise<RestResponse<NoteDto>>`, `updateNote(noteId: Id, noteTitle: string, noteContent: string): Promise<RestResponse<NoteDto>>` e `deleteNote(noteId: Id): Promise<RestResponse>`.
* **Justificativa:** Reutilizar a surface REST do modulo `profile` no `web`, sem criar adapter HTTP paralelo para notes.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/interfaces/index.ts`
* **Mudanca:** Exportar `NotesRepository`.
* **Justificativa:** Disponibilizar o novo contrato para `server` e `core` pelo barrel oficial do modulo.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/domain/entities/index.ts`
* **Mudanca:** Exportar `Note`.
* **Justificativa:** Permitir consumo tipado da entidade pela UI e pela camada database.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/domain/entities/dtos/index.ts`
* **Mudanca:** Exportar `NoteDto`.
* **Justificativa:** Centralizar o DTO do novo recurso no barrel do dominio `profile`.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/domain/errors/index.ts`
* **Mudanca:** Exportar `NoteNotFoundError`.
* **Justificativa:** Centralizar o erro de dominio do novo recurso.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/profile/use-cases/index.ts`
* **Mudanca:** Exportar `CreateNoteUseCase`, `ListNotesUseCase`, `UpdateNoteUseCase` e `DeleteNoteUseCase`.
* **Justificativa:** Seguir o padrao de barrel do modulo `profile`.
* **Camada:** `core`

## Validation

* **Arquivo:** `packages/validation/src/modules/profile/index.ts`
* **Mudanca:** Exportar `noteSchema` em `@stardust/validation/profile/schemas`.
* **Justificativa:** Permitir reuso do schema na borda `server` e no formulario do `web`.
* **Camada:** `core`

## Database

* **Arquivo:** `apps/server/src/database/supabase/types/Database.ts`
* **Mudanca:** Atualizar tipos gerados para refletir a nova tabela `public.notes` apos a migration.
* **Justificativa:** Manter `SupabaseNote` e `SupabaseNotesRepository` baseados no schema real do banco.
* **Camada:** `database`

* **Arquivo:** `apps/server/src/database/supabase/types/index.ts`
* **Mudanca:** Exportar `SupabaseNote`.
* **Justificativa:** Manter o barrel de types alinhado aos novos arquivos tipados do banco.
* **Camada:** `database`

* **Arquivo:** `apps/server/src/database/supabase/mappers/profile/index.ts`
* **Mudanca:** Exportar `SupabaseNoteMapper`.
* **Justificativa:** Seguir o padrao atual de barrel por dominio.
* **Camada:** `database`

* **Arquivo:** `apps/server/src/database/supabase/repositories/profile/index.ts`
* **Mudanca:** Exportar `SupabaseNotesRepository`.
* **Justificativa:** Disponibilizar o repositorio de notes para o router `profile`.
* **Camada:** `database`

## REST

* **Arquivo:** `apps/server/src/rest/controllers/profile/index.ts`
* **Mudanca:** Reexportar o namespace `notes` junto dos controllers ja existentes do modulo `profile`.
* **Justificativa:** `ProfileRouter` e os routers internos consomem controllers pelo barrel do dominio.
* **Camada:** `rest`

## Hono App

* **Arquivo:** `apps/server/src/app/hono/routers/profile/ProfileRouter.ts`
* **Mudanca:** Instanciar e montar `NotesRouter` sob o `basePath('/profile')`.
* **Justificativa:** A surface HTTP do recurso deve permanecer dentro do modulo `profile`, em coerencia com a organizacao existente do `server`.
* **Camada:** `rest`

## REST / Web

* **Arquivo:** `apps/web/src/rest/services/ProfileService.ts`
* **Mudanca:** Adicionar os metodos REST de notes apontando para `/profile/notes`, serializando apenas `title` e `content` nos payloads de create/update e enviando `page/itemsPerPage/search` no GET.
* **Justificativa:** Evitar expor `authorId` na borda e manter um unico adapter REST para o modulo `profile`.
* **Camada:** `rest`

* **Arquivo:** `apps/web/src/constants/cache.ts`
* **Mudanca:** Adicionar uma chave dedicada para cache da listagem de notes.
* **Justificativa:** O drawer passa a ter listagem paginada com busca por titulo e nao deve reaproveitar caches de outros modulos.
* **Camada:** `ui`

* **Arquivo:** `apps/web/package.json`
* **Mudanca:** Adicionar explicitamente `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm`, `@tiptap/extension-placeholder` e `tiptap-markdown` para compor o editor do drawer.
* **Justificativa:** A codebase atual nao possui editor rico para texto livre; o PRD exige experiencia WYSIWYG com persistencia em Markdown e a decisao tecnica agora fixa o conjunto minimo de pacotes do Tiptap.
* **Camada:** `ui`

## UI

* **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/index.tsx`
* **Mudanca:** Remover composicao direta de notes no entry point da licao e manter apenas a orquestracao da pagina.
* **Justificativa:** O gatilho e o drawer passam a ser responsabilidade do `LessonHeader`, reduzindo passagem de props intermediarias.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/LessonPageView.tsx`
* **Mudanca:** Nao receber mais `notesSlot`; renderizar `LessonHeader` apenas com `onLeavePage`.
* **Justificativa:** Eliminar prop drilling de notes na licao apos mover a composicao para o header.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/LessonHeader/index.tsx`
* **Mudanca:** Compor `NotesDrawer` diretamente no header da licao, sem dependencia de `notesSlot`.
* **Justificativa:** Manter o botao visivel no fluxo de licao com composicao local e menor acoplamento entre componentes da pagina.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenge/index.tsx`
* **Mudanca:** Montar o slot `<NotesDrawer>{trigger}</NotesDrawer>` no entry point da pagina de desafio.
* **Justificativa:** O drawer deve existir apenas em paginas de desafio, inclusive quando a navegacao sequencial nao estiver disponivel.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenge/ChallengePageView.tsx`
* **Mudanca:** Adicionar `notesSlot?: ReactNode` no grupo de acoes do header, independente de `challengeNavigationSlot`.
* **Justificativa:** Evitar perder o acesso a notes em desafios que nao renderizam `ChallengeNavigation`.
* **Camada:** `ui`

---

# 7. O que deve ser removido? (Depende da tarefa)

**Nao aplicavel**.

---

# 8. Decisoes Tecnicas e Trade-offs (Obrigatorio)

* **Decisao**: modelar notes como recurso proprio do modulo `profile`, com tabela `public.notes` e `NotesRepository` dedicado.
* **Alternativas consideradas**: estender `UsersRepository`; persistir notes dentro do `UserDto`; armazenar notes em coluna JSON do usuario.
* **Motivo da escolha**: `UsersRepository` e `UpdateUserUseCase` operam sobre o usuario inteiro; notes tem ciclo de vida, ordenacao e mutacoes independentes.
* **Impactos / trade-offs**: aumenta o numero de arquivos do modulo `profile`, mas evita sobrecarga no fluxo de usuario completo e reduz risco de sobrescrever campos controlados pelo servidor.

* **Decisao**: reutilizar `ProfileService` e o `ProfileRouter` existentes, mas com controllers, use cases e repository especificos para notes.
* **Alternativas consideradas**: criar `NotesService`/`NotesRouter` fora de `profile`; acoplar notes ao `PlaygroundService` por similaridade textual.
* **Motivo da escolha**: o dominio da feature e `profile`, e a codebase ja concentra a fronteira HTTP do modulo em `ProfileService` e `ProfileRouter`.
* **Impactos / trade-offs**: o service `ProfileService` fica mais amplo, mas o dominio HTTP permanece coerente e sem fragmentacao artificial.

* **Decisao**: reutilizar `Text` para `title` e `content`, mantendo apenas `noteSchema` dedicado na borda.
* **Alternativas consideradas**: criar `NoteTitle`; reaproveitar `Name`; validar titulo apenas no `web`.
* **Motivo da escolha**: `Text` ja aceita string vazia no core e evita nova estrutura; a regra de minimo 1 para titulo fica concentrada no schema de entrada e nos pontos de uso da app.
* **Impactos / trade-offs**: a semantica do titulo fica menos explicita no dominio do que com uma estrutura propria, mas a implementacao fica menor e alinhada a sua diretriz.

* **Decisao**: manter o payload REST de entrada estreito (`title`, `content`) e resolver `userId` exclusivamente na borda autenticada do `server`.
* **Alternativas consideradas**: enviar `NoteDto` completo do `web`; enviar `userId` no body como em referencias antigas do playground.
* **Motivo da escolha**: `userId` e controlado pelo servidor neste fluxo e nao deve ser aceito em schema de entrada.
* **Impactos / trade-offs**: o adapter REST de notes fica levemente diferente de `PlaygroundService`, mas alinha a feature com os guardrails de arquitetura pedidos para esta spec.

* **Decisao**: nao criar `GET /profile/notes/:noteId`; a listagem paginada retorna o conteúdo completo da nota para abastecer a edicao local.
* **Alternativas consideradas**: criar endpoint adicional para buscar uma nota ao seleciona-la na lista; fazer refetch completo apos selecionar cada item.
* **Motivo da escolha**: a issue pede contratos minimos de backend para o drawer, e o modal de listagem ja precisa material suficiente para transicionar ao editor sem roundtrip extra.
* **Impactos / trade-offs**: a resposta de listagem fica um pouco maior, mas elimina uma chamada adicional e simplifica a UI.

* **Decisao**: ler notes diretamente da tabela `public.notes`, sem `notes_view`.
* **Alternativas consideradas**: repetir o padrao de `snippets_view` com join em `users` e `avatars`.
* **Motivo da escolha**: a nota e privada e o drawer nao exibe metadados do autor; o `AuthorAggregate` pode ser hidratado apenas com `id`.
* **Impactos / trade-offs**: reduz complexidade da migration e do repository, mas deixa de padronizar leitura via view como em recursos publicos enriquecidos.

* **Decisao**: montar o widget `NotesDrawer` nas paginas `LessonPage` e `ChallengePage`, e nao em `FeedbackLayout`, `lesson/layout.tsx` ou `challenging/layout.tsx`.
* **Alternativas consideradas**: plugar o drawer no layout compartilhado de feedback; inserir no router raiz de `challenging`.
* **Motivo da escolha**: os layouts atuais cobririam telas fora do escopo da issue, como `/challenging/challenges` e possiveis rotas auxiliares de `lesson`.
* **Impactos / trade-offs**: exige pequenas mudancas de composicao em duas paginas, mas garante aderencia exata ao escopo funcional.

* **Decisao**: atualizar `updated_at` na aplicacao (`UpdateNoteUseCase` + repository) em vez de depender de trigger SQL implicita.
* **Alternativas consideradas**: trigger no banco para `updated_at`; recalculo apenas no mapper.
* **Motivo da escolha**: nao ha evidencia de padrao de triggers para timestamps nas tabelas autorais atuais; a app ja controla a mutacao explicitamente.
* **Impactos / trade-offs**: a responsabilidade fica no `server`, mas a implementacao permanece previsivel e alinhada ao padrao atual.

* **Decisao**: restringir grants da tabela `notes` a `authenticated` e `service_role`.
* **Alternativas consideradas**: copiar os grants amplos de `snippets` incluindo `anon`; depender apenas de checagem de auth na app.
* **Motivo da escolha**: `ENV.supabaseKey` usa `SUPABASE_ANON_KEY`, e notes e um recurso explicitamente privado do usuario.
* **Impactos / trade-offs**: a migration de notes diverge de tabelas legadas mais permissivas; se o time quiser uniformizar toda a superficie do banco, isso deve virar iniciativa de hardening separada.

* **Decisao**: usar Tiptap como editor do drawer.
* **Alternativas consideradas**: outro editor WYSIWYG leve; textarea simples com Markdown cru.
* **Motivo da escolha**: a decisao de produto/implementacao foi fechada explicitamente para Tiptap e atende o requisito de edicao rica com persistencia em Markdown.
* **Impactos / trade-offs**: adiciona dependencias novas e adaptacao de serializacao Markdown na UI.

* **Decisao**: fixar a composicao do editor em `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm`, `@tiptap/extension-placeholder` e `tiptap-markdown`.
* **Alternativas consideradas**: deixar a escolha aberta para a implementacao; usar mais extensoes do `StarterKit`; introduzir extensoes extras de formatacao fora do PRD.
* **Motivo da escolha**: o drawer precisa apenas de formatacao essencial, placeholder e roundtrip em Markdown, sem ampliar a superficie de UX alem do solicitado.
* **Impactos / trade-offs**: reduz ambiguidade para quem implementar, mas assume desde ja uma estrategia especifica de serializacao e um subconjunto enxuto do `StarterKit`.

* **Decisao**: retornar a listagem em `PaginationResponse<NoteDto>` mesmo no drawer.
* **Alternativas consideradas**: retornar `NoteDto[]` simples; buscar lista inteira sem paginacao.
* **Motivo da escolha**: manter consistencia com outros fluxos listados do projeto e permitir crescimento da lista sem mudar contrato depois.
* **Impactos / trade-offs**: o `web` precisa carregar metadados de paginacao que o drawer inicial talvez use pouco, mas o contrato fica mais estavel.

* **Decisao**: aplicar o filtro de busca por `title` no backend, como parametro opcional do `GET /profile/notes`.
* **Alternativas consideradas**: filtrar apenas no cliente apos carregar a pagina atual; remover paginacao enquanto houver busca.
* **Motivo da escolha**: a feature agora exige search por titulo e a listagem ja foi padronizada em `PaginationResponse`; filtrar no backend preserva consistencia e evita carregar itens irrelevantes no drawer.
* **Impactos / trade-offs**: aumenta o contrato do endpoint e o repositorio precisa montar query com `ilike`, mas a UX da busca fica previsivel.

---

# 9. Diagramas e Referencias (Obrigatorio)

* **Fluxo de Dados:**

```text
LessonPage / ChallengePage
        |
        v
NotesDrawer (widget client)
        |
        +--> open drawer -> form state local
        |
        +--> click "Ver notas"
               |
               v
         ProfileService.fetchNotes()
               |
               v
      GET /profile/notes (Hono)
               |
               v
       ListNotesController.handle(http)
               |
               v
       ListNotesUseCase.execute({ userId, page, itemsPerPage, search })
               |
               v
    SupabaseNotesRepository.findManyByUser(userId, page, itemsPerPage, search)
               |
               v
            public.notes

create/update/delete seguem o mesmo fluxo:
NotesDrawer -> ProfileService -> Hono route -> Controller -> UseCase -> Repository -> public.notes
```

* **Fluxo Cross-app:**

```text
apps/web
  NotesDrawer
    -> REST /profile/notes

apps/server
  ProfileRouter -> NotesRouter
    -> Create/List/Update/DeleteNoteController
    -> Profile use cases
    -> SupabaseNotesRepository
    -> PostgreSQL (public.notes)
```

* **Layout:**

```text
LessonHeader / ChallengeHeader
├── acao de sair / titulo / navegacao existente
└── botao "Notas"
    └── NotesDrawer
        ├── cabecalho
        │   ├── titulo
        │   ├── botao "Ver notas"
        │   └── botao fechar
        ├── formulario da nota
        │   ├── input titulo
        │   ├── toolbar WYSIWYG
        │   ├── editor rico (persistindo markdown)
        │   └── acoes salvar / excluir
        └── NotesListDialog (sobre o drawer)
            ├── lista de notas
            ├── estado vazio / erro
            └── selecao de nota para edicao
```

* **Referencias:**
  * `apps/web/src/ui/challenging/widgets/components/ChallengesNavigationSidebar/ChallengesNavigationSidebarView.tsx`
  * `apps/web/src/ui/profile/widgets/pages/ApiKeys/ApiKeyManager/CreateApiKeyDialog/index.tsx`
  * `apps/web/src/ui/playground/widgets/pages/Snippet/useSnippetPage.ts`
  * `apps/web/src/rest/services/ProfileService.ts`
  * `apps/server/src/app/hono/routers/playground/SnippetsRouter.ts`
  * `apps/server/src/rest/controllers/playground/CreateSnippetController.ts`
  * `apps/server/src/rest/controllers/playground/FetchSnippetsListController.ts`
  * `apps/server/src/database/supabase/repositories/playground/SupabaseSnippetsRepository.ts`
  * `packages/core/src/playground/domain/entities/Snippet.ts`
  * `packages/core/src/playground/use-cases/CreateSnippetUseCase.ts`
  * `packages/validation/src/modules/playground/schema/snippetSchema.ts`

---

# 10. Pendencias / Duvidas (Quando aplicavel)

* **Descricao da pendencia:** A codebase atual nao possui Tiptap nem adaptador existente de Markdown roundtrip no `web`.
* **Impacto na implementacao:** A implementacao ainda precisa apenas materializar a configuracao ja definida na spec dentro do widget `TiptapEditorField`.
* **Acao sugerida:** Implementar o editor com os pacotes e extensoes fixados nesta spec e registrar eventuais ajustes finos de toolbar no PR tecnico.

* **Descricao da pendencia:** O baseline de grants das tabelas autorais legadas (`snippets`, `solutions`, `comments`) e mais permissivo do que o requerido por `notes`, e esta entrega nao deve introduzir RLS para `notes`.
* **Impacto na implementacao:** A seguranca do recurso continuara concentrada na autenticacao da app e no filtro por `user_id` no repository/use case, com grants SQL restritos sem policies RLS adicionais.
* **Acao sugerida:** Manter a migration sem RLS e registrar no PR que a privacidade de `notes` nesta entrega depende da borda da aplicacao e dos grants da tabela.
