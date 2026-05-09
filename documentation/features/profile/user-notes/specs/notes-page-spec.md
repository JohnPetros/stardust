---
title: Pagina Dedicada de Notas do Usuario em /notes
prd: https://github.com/JohnPetros/stardust/milestone/30
issue: https://github.com/JohnPetros/stardust/issues/404
apps: web, server
status: closed
last_updated_at: 2026-05-08
---

# 1. Objetivo (Obrigatorio)

Entregar a rota autenticada `/notes` na `web` como area dedicada de gerenciamento das notas privadas do usuario, com experiencia responsiva de lista + editor, busca por titulo, selecao local, criacao, edicao e exclusao sem troca de rota. A entrega deve reutilizar o recurso `notes` ja existente em `core` e `server`, preservar o controle de ownership/autenticacao nas bordas atuais e corrigir a validacao compartilhada de `content` para aceitar corpo vazio, alinhando o comportamento real ao PRD.

---

# 2. Escopo (Obrigatorio)

## 2.1 In-scope

- Criar a rota privada `/notes` dentro do grupo `(home)` da `web`.
- Adicionar a entrada de navegacao principal para notas diretamente na `Sidenav` por meio de `SidenavButton`.
- Criar um widget de pagina dedicado no modulo `profile` para listar, buscar, selecionar, criar, editar e excluir notas no mesmo fluxo.
- Reutilizar `ProfileService.fetchNotes/createNote/updateNote/deleteNote` e o endpoint existente `GET/POST/PUT/DELETE /profile/notes`.
- Exibir layout em duas colunas no desktop, com sidebar recolhivel e editor persistente da nota ativa.
- Exibir fluxo mobile em tela unica, alternando entre lista e editor sem mudar de rota.
- Reconciliar a lista local apos create, update e delete sem refetch completo obrigatorio.
- Corrigir a validacao compartilhada de notas para aceitar `content` vazio mantendo titulo obrigatorio.

## 2.2 Out-of-scope

- Alterar o drawer existente para incluir link de acesso a `/notes`.
- Criar novo endpoint REST, nova action RPC, novo repository ou nova migration para notes.
- Alterar o escopo do recurso para notas compartilhadas, tags, pastas, historico de versoes, autosave ou vinculo contextual com `lesson`/`challenge`.
- Implementar a feature no `studio`.
- Reescrever o `NotesDrawer` para compartilhar hook com a pagina nesta entrega.

---

# 3. Requisitos (Obrigatorio)

## 3.1 Funcionais

- O sistema deve disponibilizar a rota `/notes` apenas para usuarios autenticados, com redirecionamento para login pelo fluxo atual da `web` quando nao houver sessao valida.
- A navegacao principal autenticada deve expor uma entrada `Notas` apontando para `/notes`.
- No mobile, o menu lateral (`Sidebar`) deve incluir o botao `Notas`; a `TabNav` inferior permanece com os links de `HOME_LINKS`.
- Ao entrar em `/notes`, a aplicacao deve carregar a listagem paginada das notas do usuario autenticado, ordenadas por `updated_at` decrescente.
- A pagina deve permitir busca por titulo consumindo o filtro `search` ja existente no backend.
- No desktop, a pagina deve exibir sidebar esquerda com lista de notas e coluna direita com editor da nota selecionada.
- No desktop, a sidebar deve suportar estado expandido e recolhido sem esconder o editor.
- No mobile, a lista deve ser a tela inicial e o editor deve ocupar a tela inteira ao criar ou selecionar uma nota.
- O usuario deve conseguir iniciar uma nova nota sem sair da pagina.
- O usuario deve conseguir editar titulo e corpo da nota selecionada no mesmo editor.
- O usuario deve confirmar o descarte antes de trocar de nota, criar nova nota ou voltar para a lista mobile quando houver alteracoes nao salvas.
- O usuario deve confirmar explicitamente a exclusao antes da remocao definitiva.
- A lista local deve refletir create, update e delete imediatamente, mantendo a ordenacao por data de atualizacao.
- O backend nao deve receber `userId`, `authorId`, `createdAt`, `updatedAt` ou qualquer outro campo controlado pelo servidor no payload da pagina.
- O corpo da nota deve poder ser salvo vazio.

## 3.2 Nao funcionais

- Seguranca: a rota `/notes` deve continuar privada por padrao via `apps/web/src/middleware.ts`, e os endpoints de notes devem continuar exigindo `AuthMiddleware.verifyAuthentication` no `server`.
- Compatibilidade retroativa: a pagina deve reutilizar `GET/POST/PUT/DELETE /profile/notes` e `ProfileService`, sem criar contrato paralelo para `/notes`.
- Compatibilidade retroativa: nao deve haver alteracao de schema SQL, grants, `NotesRepository` ou `ListNotesUseCase`; a unica mudanca compartilhada de contrato e permitir `content` vazio em `noteSchema`.
- Performance: a busca na pagina deve ser debounced no cliente, reaproveitando o padrao ja usado no drawer para evitar uma requisicao por tecla.
- Performance: apos mutacoes bem-sucedidas, a pagina deve reconciliar o cache local em memoria sem refetch completo obrigatorio.
- Performance: a listagem deve continuar paginada e consumir o `PaginationResponse` ja entregue pelo backend.
- Acessibilidade: botoes de criar, salvar, excluir, voltar, recolher sidebar, expandir sidebar e navegar entre paginas devem ter `aria-label` explicito.
- Acessibilidade: o fluxo de confirmacao de descarte e exclusao deve usar `AlertDialog`, com suporte a teclado e fechamento por `Esc`.
- Responsividade: no desktop a sidebar deve manter largura fixa; no mobile a navegacao entre lista e editor deve acontecer sem drawer e sem segunda rota.

---

# 4. O que ja existe? (Obrigatorio)

## Camada Next.js App

* **`middleware`** (`apps/web/src/middleware.ts`) - Protege rotas privadas da `web`; `/notes` sera privada por default se nao for adicionada em `PUBLIC_ROUTES`.
* **`Layout`** (`apps/web/src/app/(home)/layout.tsx`) - Shell autenticado que injeta `HomeLayout`, `FeedbackLayout`, `SidebarProvider` e `AchievementsProvider` nas paginas do grupo `(home)`.
* **`playground/snippets/page.tsx`** (`apps/web/src/app/playground/snippets/page.tsx`) - Referencia de pagina dedicada fora de `profile` com widget principal proprio.
* **`shop/page.tsx`** (`apps/web/src/app/(home)/shop/page.tsx`) - Referencia de rota privada simples dentro do grupo `(home)` sem action adicional de autenticacao.

## Camada UI

* **`NotesDrawer`** (`apps/web/src/ui/global/widgets/components/NotesDrawer/index.tsx`) - Implementacao client-side ja funcional para CRUD de notes, usando `AuthContext`, `RestContext` e `ToastContext`.
* **`useNotesDrawer`** (`apps/web/src/ui/global/widgets/components/NotesDrawer/useNotesDrawer.ts`) - Referencia principal de busca, paginacao, validacao, reconcilacao local e dirty state do recurso `notes`.
* **`NotesDrawerView`** (`apps/web/src/ui/global/widgets/components/NotesDrawer/NotesDrawerView.tsx`) - Referencia visual de editor rico, botoes de salvar/excluir e listagem paginada em overlay.
* **`WYSIWYGEditor`** (`apps/web/src/ui/global/widgets/components/WYSIWYGEditor/index.tsx`) - Editor rico compartilhado entre `NotesDrawer` e pagina `/notes`, com persistencia textual em Markdown e node customizado de bloco de codigo interativo.
* **`TitleInput`** (`apps/web/src/ui/global/widgets/components/TitleInput/index.tsx`) - Componente global reutilizavel para titulo inline com erro de validacao.
* **`AlertDialog`** (`apps/web/src/ui/global/widgets/components/AlertDialog/index.tsx`) - Componente global de confirmacao que deve substituir `window.confirm` na experiencia da pagina.
* **`Sidenav`** (`apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/index.tsx`) - Sidebar autenticada onde hoje convivem entradas via `NavLink` e acoes locais via `SidenavButton`; sera o ponto de entrada de `Notas` nesta spec.
* **`SidenavButton`** (`apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/SidenavButton/index.tsx`) - Componente de acao da sidebar baseado em `IconName`, usado como referencia direta para adicionar o acesso a `/notes`.
* **`AccountLinksView`** (`apps/web/src/ui/profile/widgets/pages/Profile/Account/AccountLinksView/AccountLinksView.tsx`) - Referencia de atalho opcional do modulo profile; hoje ja aponta para `settings`, `api-keys` e `snippets`.
* **`SnippetPageView`** (`apps/web/src/ui/playground/widgets/pages/Snippet/SnippetPageView.tsx`) - Referencia de editor dedicado com `TitleInput`, acao explicita de salvar e `AlertDialog` de confirmacao.

## Camada REST (Services)

* **`ProfileService`** (`apps/web/src/rest/services/ProfileService.ts`) - Adapter REST atual que ja expoe `fetchNotes`, `createNote`, `updateNote` e `deleteNote`.

## Camada Core

* **`ProfileService`** (`packages/core/src/profile/interfaces/ProfileService.ts`) - Contrato consumido pela `web`; ja define response paginada para listagem e payloads enxutos para create/update.
* **`NotesRepository`** (`packages/core/src/profile/interfaces/NotesRepository.ts`) - Contrato existente de persistencia do recurso, ja paginado e filtrado por `search`.
* **`Note`** (`packages/core/src/profile/domain/entities/Note.ts`) - Entidade do dominio com `title`, `content`, `userId`, `createdAt`, `updatedAt` e `touch()`.
* **`CreateNoteUseCase`** (`packages/core/src/profile/use-cases/CreateNoteUseCase.ts`) - Cria e persiste a nota a partir de dados controlados pela borda autenticada.
* **`ListNotesUseCase`** (`packages/core/src/profile/use-cases/ListNotesUseCase.ts`) - Lista notas do usuario em `PaginationResponse<NoteDto>` usando `search` e `itemsPerPage`.
* **`UpdateNoteUseCase`** (`packages/core/src/profile/use-cases/UpdateNoteUseCase.ts`) - Atualiza titulo/corpo e valida ownership antes do `replace`.
* **`DeleteNoteUseCase`** (`packages/core/src/profile/use-cases/DeleteNoteUseCase.ts`) - Remove a nota validando ownership antes do `remove`.

## Pacote Validation

* **`noteSchema`** (`packages/validation/src/modules/profile/noteSchema.ts`) - Schema compartilhado hoje usado por `web` e `server`, mas ainda exige `contentSchema` com minimo 3, conflitando com o PRD.
* **`pageSchema`** (`packages/validation/src/modules/global/schemas/pageSchema.ts`) - Validacao reutilizada pela listagem paginada.
* **`itemsPerPageSchema`** (`packages/validation/src/modules/global/schemas/itemsPerPageSchema.ts`) - Validacao reutilizada pela listagem paginada.
* **`searchSchema`** (`packages/validation/src/modules/global/schemas/searchSchema.ts`) - Validacao reutilizada pela busca textual da lista.

## Camada Hono App (Routes)

* **`ProfileRouter`** (`apps/server/src/app/hono/routers/profile/ProfileRouter.ts`) - Router agregador do modulo `profile`; ja registra `NotesRouter`.
* **`NotesRouter`** (`apps/server/src/app/hono/routers/profile/NotesRouter.ts`) - CRUD autenticado atual do recurso `notes`, com query validation para `page`, `itemsPerPage` e `search`.

## Camada REST (Controllers)

* **`ListNotesController`** (`apps/server/src/rest/controllers/profile/notes/ListNotesController.ts`) - Traduz `queryParams` + `account.id` em chamada ao `ListNotesUseCase` e responde com `sendPagination`.
* **`CreateNoteController`** (`apps/server/src/rest/controllers/profile/notes/CreateNoteController.ts`) - Resolve `userId` autenticado e nao aceita campos controlados pelo servidor no body.
* **`UpdateNoteController`** (`apps/server/src/rest/controllers/profile/notes/UpdateNoteController.ts`) - Encaminha `noteId`, `title`, `content` e `userId` para o use case.
* **`DeleteNoteController`** (`apps/server/src/rest/controllers/profile/notes/DeleteNoteController.ts`) - Remove a nota do proprio autor via `noteId` de rota.

## Camada Banco de Dados

* **`SupabaseNotesRepository`** (`apps/server/src/database/supabase/repositories/profile/SupabaseNotesRepository.ts`) - Persistencia atual do recurso com filtro por `user_id`, `ilike` em `title`, ordenacao por `updated_at desc` e range paginado.
* **`SupabaseNoteMapper`** (`apps/server/src/database/supabase/mappers/profile/SupabaseNoteMapper.ts`) - Conversao DB <-> dominio do recurso `notes`.
* **`Database`** (`apps/server/src/database/supabase/types/Database.ts`) - Tipos gerados que ja incluem a tabela `notes`.
* **`20260508132253_create_notes.sql`** (`apps/server/supabase/migrations/20260508132253_create_notes.sql`) - Migration ja aplicada que criou a tabela `public.notes`; nao deve ser recriada nesta entrega.

---

# 5. O que deve ser criado?

## Camada Next.js App (Pages, Layouts)

* **Localizacao:** `apps/web/src/app/(home)/notes/page.tsx` (**novo arquivo**)
* **Widget principal:** `NotesPage`
* **Caminho da rota:** `/notes`

## Camada UI (Widgets)

* **Localizacao:** `apps/web/src/ui/profile/widgets/pages/Notes/index.tsx` (**novo arquivo**)
* **Props:** Nao recebe props; resolve dependencias via contexts da `web`.
* **Estados (Client Component):**
  * Loading: renderiza skeletons na sidebar e placeholder no editor enquanto a primeira pagina de notes carrega.
  * Error: renderiza estado de erro na sidebar com acao de retry e mantem o editor em modo vazio/inerte.
  * Empty: renderiza CTA para criar a primeira nota quando a listagem vier vazia.
  * Content: renderiza lista, busca, paginacao, editor, confirmacoes e selecao local.
* **View:** `NotesPageView` (`apps/web/src/ui/profile/widgets/pages/Notes/NotesPageView.tsx`) (**novo arquivo**)
* **Hook:** `useNotesPage` (`apps/web/src/ui/profile/widgets/pages/Notes/useNotesPage.ts`) (**novo arquivo**)
* **Index:** Resolve `profileService` com `useRestContext`, `user` com `useAuthContext` e `showError/showSuccess` com `useToastContext`; repassa dependencias para `useNotesPage` e entrega o state final para `NotesPageView`.
* **Widgets internos:**
  * `NotesSidebar` (`apps/web/src/ui/profile/widgets/pages/Notes/NotesSidebar/index.tsx`) (**novo arquivo**) - widget pai da coluna esquerda, espelhando o bloco visual `Notes Sidebar` do node `Z4ucq`.
  * `NotesSidebarView` (`apps/web/src/ui/profile/widgets/pages/Notes/NotesSidebar/NotesSidebarView.tsx`) (**novo arquivo**) - renderiza, dentro do mesmo widget, cabecalho da sidebar, busca, lista e controles de paginacao sem acessar hooks nem services.
  * `NoteEditor` (`apps/web/src/ui/profile/widgets/pages/Notes/NoteEditor/index.tsx`) (**novo arquivo**) - widget pai da coluna direita, espelhando o bloco visual `Notes Editor` do node `Z4ucq`.
  * `NoteEditorView` (`apps/web/src/ui/profile/widgets/pages/Notes/NoteEditor/NoteEditorView.tsx`) (**novo arquivo**) - renderiza a casca do editor e compoe o widget de formulario com metadata e acoes auxiliares.
  * `NoteEditorForm` (`apps/web/src/ui/profile/widgets/pages/Notes/NoteEditorForm/index.tsx`) (**novo arquivo**) - widget dedicado ao `react-hook-form` da nota, responsavel por inicializar `useForm`, aplicar `zodResolver(noteSchema)`, controlar `title` e `content`, expor `isDirty` e disparar submit para create/update.
  * `NoteEditorFormView` (`apps/web/src/ui/profile/widgets/pages/Notes/NoteEditorForm/NoteEditorFormView.tsx`) (**novo arquivo**) - renderiza campos, `WYSIWYGEditor` e erros de validacao; o botao de salvar fica no header de `NoteEditorView` via `formId`.
  * `EmptyNotesState` (`apps/web/src/ui/profile/widgets/pages/Notes/states/EmptyNotesState/index.tsx`) (**novo arquivo**) - entry point do estado vazio reutilizavel para lista vazia e editor sem nota selecionada.
  * `EmptyNotesStateView` (`apps/web/src/ui/profile/widgets/pages/Notes/states/EmptyNotesState/EmptyNotesStateView.tsx`) (**novo arquivo**) - renderiza mensagem, descricao e CTA do estado vazio.
  * `DeleteNoteDialog` (`apps/web/src/ui/profile/widgets/pages/Notes/dialogs/DeleteNoteDialog/index.tsx`) (**novo arquivo**) - entry point que recebe `open`, callbacks e monta o fluxo de exclusao.
  * `DeleteNoteDialogView` (`apps/web/src/ui/profile/widgets/pages/Notes/dialogs/DeleteNoteDialog/DeleteNoteDialogView.tsx`) (**novo arquivo**) - renderiza o `AlertDialog` de confirmacao de exclusao.
  * `DiscardChangesDialog` (`apps/web/src/ui/profile/widgets/pages/Notes/dialogs/DiscardChangesDialog/index.tsx`) (**novo arquivo**) - entry point que recebe `open`, callbacks e monta o fluxo de descarte.
  * `DiscardChangesDialogView` (`apps/web/src/ui/profile/widgets/pages/Notes/dialogs/DiscardChangesDialog/DiscardChangesDialogView.tsx`) (**novo arquivo**) - renderiza o `AlertDialog` de confirmacao de descarte ao trocar de nota, criar nova nota ou voltar no mobile.
* **Estrutura de pastas:**

```text
apps/web/src/ui/profile/widgets/pages/Notes/
├── index.tsx
├── dialogs/
│   ├── DeleteNoteDialog/
│   │   ├── DeleteNoteDialogView.tsx
│   │   └── index.tsx
│   └── DiscardChangesDialog/
│       ├── DiscardChangesDialogView.tsx
│       └── index.tsx
├── states/
│   └── EmptyNotesState/
│       ├── EmptyNotesStateView.tsx
│       └── index.tsx
├── NoteEditor/
│   ├── index.tsx
│   └── NoteEditorView.tsx
├── NoteEditorForm/
│   ├── index.tsx
│   ├── NoteEditorFormView.tsx
│   └── useNoteEditorForm.ts
├── NotesSidebar/
│   ├── index.tsx
│   └── NotesSidebarView.tsx
├── NotesPageView.tsx
├── tests/
│   └── useNotesPage.test.ts
└── useNotesPage.ts
```

**Hook `useNotesPage`**

* **Localizacao:** `apps/web/src/ui/profile/widgets/pages/Notes/useNotesPage.ts` (**novo arquivo**)
* **Dependencias:** `ProfileService`, `userId`, `showError`, `showSuccess`
* **Metodos:**
  * `useNotesPage(params: { profileService: ProfileService; userId: string; showError: (message: string) => void; showSuccess: (message: string) => void }): NotesPageState` - orquestra fetch, busca, selecao, dirty state, responsividade, sincronizacao com o formulario e mutacoes de notes.
  * `handleSearchChange(value: string): void` - aplica debounce, reseta `page` para `1` e dispara nova listagem com `search` por titulo.
  * `handleSelectNote(note: NoteDto): void` - tenta trocar a nota ativa; se houver dirty state, abre confirmacao de descarte antes de substituir o rascunho local.
  * `handleCreateNewClick(): void` - prepara o editor para nova nota; no mobile tambem navega da lista para o editor.
  * `handleFormSubmit(values: { title: string; content: string }): Promise<void>` - executa create ou update conforme exista `activeNote.id` e reconcilia a lista local mantendo ordenacao por `updatedAt`.
  * `handleFormDirtyChange(isDirty: boolean): void` - recebe o dirty state emitido por `NoteEditorForm` e sincroniza o fluxo global de descarte.
  * `handleDeleteIntent(): void` - abre o `AlertDialog` de exclusao apenas quando houver nota ativa.
  * `handleDeleteConfirm(): Promise<void>` - executa delete, remove a nota da lista local e seleciona a proxima nota disponivel no desktop ou retorna ao estado vazio/lista no mobile.
  * `handleDiscardIntent(nextAction: NotesPendingAction): void` - registra a proxima acao interrompida por dirty state (`select`, `create`, `backToList`).
  * `handleDiscardConfirm(): void` - descarta alteracoes locais e executa a acao pendente registrada.
  * `handleSidebarToggle(): void` - alterna o estado expandido/recolhido da sidebar no desktop.
  * `handleMobileBackClick(): void` - retorna do editor para a lista no mobile, pedindo confirmacao se houver alteracoes nao salvas.
  * `handlePreviousPageClick(): void` - navega para a pagina anterior da listagem.
  * `handleNextPageClick(): void` - navega para a proxima pagina da listagem.
  * `handleRetryList(): void` - refaz o fetch da listagem apos falha.

**View `NotesPageView`**

* **Localizacao:** `apps/web/src/ui/profile/widgets/pages/Notes/NotesPageView.tsx` (**novo arquivo**)
* **Props:** `NotesPageState` retornado pelo hook, incluindo lista, pagina, busca, estados de loading/error, nota ativa, `initialValues` do formulario, flags de dialog e handlers.
* **Responsabilidade:** renderizar a pagina `/notes` com layout de duas colunas no desktop e fluxo lista/editor no mobile, compondo `NotesSidebar`, `NoteEditor`, `EmptyNotesState`, `DeleteNoteDialog` e `DiscardChangesDialog` sem acessar services ou contexts diretamente.
* **Referencia visual:** o layout desktop deve seguir o padrao do node `Z4ucq` (`Notes Body`) no arquivo de design ativo, preservando especialmente os blocos `Notes Sidebar`, `Sidebar Header`, `Sidebar Search`, `Notes List`, `Notes Editor`, `Editor Title Row`, `Editor Body Surface` e `Editor Footer`.

**Widget `NoteEditorForm`**

* **Localizacao:** `apps/web/src/ui/profile/widgets/pages/Notes/NoteEditorForm/index.tsx` (**novo arquivo**)
* **Props:** `initialValues: { title: string; content: string }`, `isSubmitting: boolean`, `onSubmit: (values: { title: string; content: string }) => Promise<void>`, `onDirtyChange: (isDirty: boolean) => void`
* **Estados (Client Component):**
  * Loading: nao aplicavel; usa `isSubmitting` vindo da pagina.
  * Error: exibe erros de validacao de `noteSchema` no proprio formulario.
  * Empty: nao aplicavel; o widget sempre representa o formulario do editor.
  * Content: renderiza campo de titulo, `WYSIWYGEditor` e erros; a acao de salvar e disparada pelo botao no header de `NoteEditorView` associado ao `formId`.
* **View:** `NoteEditorFormView` (`apps/web/src/ui/profile/widgets/pages/Notes/NoteEditorForm/NoteEditorFormView.tsx`) (**novo arquivo**)
* **Hook (se aplicavel):** Nao aplicavel. O proprio `index.tsx` deve conter a integracao direta com `react-hook-form` para evitar fragmentar demais a pasta.
* **Index:** Inicializa `useForm` com `react-hook-form`, aplica `zodResolver(noteSchema)`, faz `reset()` quando `initialValues` mudarem e notifica `onDirtyChange` a partir do `formState.isDirty`.
* **Widgets internos:** Nao aplicavel.

**Comportamento da paginacao da listagem**

* A listagem da sidebar deve continuar usando o contrato paginado existente do backend com `page`, `itemsPerPage` e `search`.
* `useNotesPage` deve manter `page` como estado unico da listagem.
* Ao alterar o termo de busca, a pagina deve resetar `page` para `1` antes de refazer o fetch.
* Os controles de paginacao devem ser renderizados dentro de `NotesSidebarView`, abaixo da lista, quando `totalPagesCount > 1`.
* O botao de pagina anterior deve ficar desabilitado em `page === 1`.
* O botao de proxima pagina deve ficar desabilitado em `page === totalPagesCount` ou `totalPagesCount === 0`.
* O indicador visual deve seguir o formato `Pagina X de Y`.
* Em loading inicial da lista, os controles podem ficar ocultos; em refetch/paginacao, devem permanecer visiveis e desabilitados enquanto a nova pagina carrega.
* A paginacao deve existir tanto no desktop quanto no mobile dentro da tela de lista; ela nao aparece na tela do editor mobile.

# 6. O que deve ser modificado? (Depende da tarefa)

## Aplicacao Web

* **Arquivo:** `apps/web/src/constants/routes.ts`
* **Mudanca:** Adicionar `ROUTES.notes = '/notes'` no mapa principal de rotas.
* **Justificativa:** A pagina dedicada precisa de um caminho canonico reutilizavel por navegacao, redirects e links internos.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/index.tsx`
* **Mudanca:** Adicionar um `SidenavButton` para `Notas`, usando `useNavigationProvider().goTo(ROUTES.notes)` e um `IconName` ja existente do sistema.
* **Justificativa:** A decisao desta spec e inserir o acesso diretamente na sidebar, sem depender de `HOME_LINKS` nem exigir novo asset SVG para navegacao.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/profile/widgets/layouts/Home/Sidebar/SidebarView.tsx`
* **Mudanca:** Adicionar botao `Notas` no menu lateral mobile, navegando para `ROUTES.notes` via callback do entry point.
* **Justificativa:** Garantir acesso a `/notes` tambem no fluxo mobile de sidebar lateral, sem deslocar a feature para a `TabNav`.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/profile/widgets/layouts/Home/TabNav/index.tsx`
* **Mudanca:** Manter a `TabNav` com os itens de `HOME_LINKS` (sem `Notas`).
* **Justificativa:** Evitar duplicacao de entrada de navegacao mobile e preservar o pedido de acesso por sidebar.
* **Camada:** `ui`

## Pacote Validation

* **Arquivo:** `packages/validation/src/modules/profile/noteSchema.ts`
* **Mudanca:** Trocar a validacao de `content` baseada em `contentSchema` por uma regra que aceite string vazia e mantenha apenas limite superior compatível com o editor (`max 5000`).
* **Justificativa:** O contrato atual conflita com o PRD e bloqueia create/update com corpo vazio tanto na pagina quanto no drawer ja existente.
* **Camada:** `rest`

---

# 7. O que deve ser removido? (Depende da tarefa)

**Nao aplicavel**.

---

# 8. Decisoes Tecnicas e Trade-offs (Obrigatorio)

* **Decisao:** Criar a rota como `apps/web/src/app/(home)/notes/page.tsx` com URL final `/notes` e expor o acesso diretamente na `Sidenav` via `SidenavButton`.
* **Alternativas consideradas:** `apps/web/src/app/(home)/profile/[userSlug]/notes/page.tsx`; `apps/web/src/app/notes/page.tsx` fora do grupo `(home)`.
* **Motivo da escolha:** Notas sao um workspace privado do usuario autenticado e nao dependem de `userSlug`; colocá-las em `(home)` reaproveita o shell autenticado e a protecao ja existente do middleware.
* **Impactos / trade-offs:** A feature continua pertencendo ao modulo `profile` na pasta de widgets, mas a URL fica fora do namespace `/profile/*` e a navegacao de `Notas` deixa de ser derivada de `HOME_LINKS`.

* **Decisao:** Reutilizar o contrato REST atual `/profile/notes` com paginacao e busca por `search`.
* **Alternativas consideradas:** Criar endpoint dedicado sem paginacao para `/notes`; criar endpoint separado so para busca da pagina.
* **Motivo da escolha:** O backend ja entrega listagem paginada, filtro por titulo e ownership; a pagina pode consumir esse contrato sem reabrir escopo de `core`, `repository`, router ou migration.
* **Impactos / trade-offs:** A UI da pagina precisa manter controles de pagina e sincronizar a lista local com o `PaginationResponse`, em vez de assumir colecao inteira em memoria.

* **Decisao:** Manter a autenticacao da rota na borda da `web` via `middleware.ts`, sem criar `authActionClient` ou action dedicada para acesso a `/notes`.
* **Alternativas consideradas:** Repetir o padrao de `playgroundActions.accessSnippetsPage()`; validar autenticacao no proprio widget client-side.
* **Motivo da escolha:** As paginas privadas do grupo `(home)` ja dependem do middleware global; a nova rota nao exige regra adicional alem de sessao valida.
* **Impactos / trade-offs:** O controle de acesso da pagina fica implícito na infraestrutura de rotas da app, nao em um arquivo de action especifico.

* **Decisao:** Criar um hook dedicado `useNotesPage` em vez de refatorar `useNotesDrawer` para um hook compartilhado nesta entrega.
* **Alternativas consideradas:** Extrair um `useNotesManager` compartilhado entre drawer e pagina.
* **Motivo da escolha:** A issue fecha o escopo da pagina; mexer na arquitetura do drawer reabre uma superficie ja entregue e aumentaria o risco de regressao em `lesson` e `challenge`.
* **Impactos / trade-offs:** Havera alguma duplicacao de logica de reconciliacao local e dirty state entre drawer e pagina, compensada por menor risco na entrega.

* **Decisao:** Isolar `react-hook-form` em um widget dedicado `NoteEditorForm`, em vez de espalhar a integracao de formulario pela pagina inteira.
* **Alternativas consideradas:** Controlar `title` e `content` manualmente em `useNotesPage`; colocar `useForm` diretamente em `NoteEditor`.
* **Motivo da escolha:** O formulario da nota e a unica area com validacao de campos e dirty tracking detalhado; isolá-lo em um widget proprio reduz acoplamento visual no editor sem distribuir a orquestracao principal em varios hooks.
* **Impactos / trade-offs:** `useNotesPage` continua dono do fluxo macro da pagina, mas passa a coordenar `react-hook-form` via callbacks e sincronizacao de estado com `NoteEditorForm`.

* **Decisao:** Usar o node `Z4ucq` como referencia visual do layout desktop da pagina.
* **Alternativas consideradas:** Desenhar a pagina apenas a partir de referencias de widgets existentes na codebase; criar um layout novo sem ancora visual no design aberto.
* **Motivo da escolha:** O node ja organiza a tela nos mesmos blocos exigidos pela issue, reduz ambiguidade visual e ajuda a decompor a pagina em widgets internos semanticamente alinhados.
* **Impactos / trade-offs:** A arquitetura de widgets segue a semantica da codebase, nao a arvore literal do design; portanto o layout serve como referencia visual, nao como contrato 1:1 de implementacao.

* **Decisao:** Corrigir `noteSchema` para aceitar `content` vazio no contrato compartilhado.
* **Alternativas consideradas:** Inserir placeholder de conteudo na pagina; tratar `content` vazio apenas no client e manter o server mais restritivo.
* **Motivo da escolha:** O PRD define corpo opcional e o dominio `Text` ja aceita string vazia; a divergencia atual esta apenas na borda de validacao.
* **Impactos / trade-offs:** A mudanca afeta tambem o drawer existente, mas corrige um desvio funcional compartilhado em vez de criar excecao apenas para `/notes`.

* **Decisao:** Substituir o `codeBlock` padrao do Tiptap por um node customizado `interactiveCodeBlock`, renderizado com React NodeView e o componente `Code` da `web`.
* **Alternativas consideradas:** manter o bloco de codigo padrao e renderizar `Code` apenas em preview MDX; salvar MDX bruto como fonte primaria do editor.
* **Motivo da escolha:** O usuario precisa interagir com o componente `Code` dentro do proprio editor, sem alternar para preview.
* **Impactos / trade-offs:** A edicao do bloco passa a acontecer dentro do componente interativo; a persistencia continua em fenced code block Markdown para compatibilidade com notas ja salvas e com o backend existente.

---

# 9. Diagramas e Referencias (Obrigatorio)

* **Fluxo de Dados:**

```text
/notes (Next.js route em (home))
        |
        v
NotesPage (entry point client)
        |
        +--> useAuthContext -> user.id
        +--> useRestContext -> profileService
        +--> useToastContext -> feedback UI
        |
        v
useNotesPage
        |
        +--> useCache(CACHE.keys.notesList, [userId, page, search])
        +--> noteSchema.safeParse({ title, content })
        |
        +--> profileService.fetchNotes({ page, itemsPerPage, search })
        +--> profileService.createNote({ noteTitle, noteContent })
        +--> profileService.updateNote({ noteId, noteTitle, noteContent })
        +--> profileService.deleteNote(noteId)
        |
        v
GET/POST/PUT/DELETE /profile/notes
        |
        v
NotesRouter -> Controller -> UseCase -> SupabaseNotesRepository -> public.notes
```

* **Fluxo Cross-app:**

```text
apps/web
  NotesPage
    |
    | REST
    v
apps/server
  /profile/notes
    |
    v
packages/core
  ListNotesUseCase / CreateNoteUseCase / UpdateNoteUseCase / DeleteNoteUseCase
    |
    v
apps/server database
  SupabaseNotesRepository -> public.notes
```

* **Layout:**

```text
Desktop (/notes)
+-------------------------------------------------------------+
| HomeLayout                                                  |
| +-------------------- Sidebar ----------------------------+ |
| | titulo + nova nota + recolher                         | |
| | busca por titulo                                      | |
| | nota ativa                                            | |
| | outras notas                                          | |
| | paginacao                                             | |
| +-------------------------------------------------------+ |
| +---------------------- Editor --------------------------+ |
| | titulo + salvar + excluir                             | |
| | NoteEditorForm                                         | |
| | metadata / ultima edicao                               | |
| +-------------------------------------------------------+ |
+-------------------------------------------------------------+

Mobile (/notes)
+------------------------------+
| Lista de notas               |
| busca + cards + paginacao    |
| tap em nota / Nova nota      |
+------------------------------+
              |
              v
+------------------------------+
| Editor da nota               |
| voltar | salvar | excluir    |
| titulo                       |
| toolbar + corpo              |
+------------------------------+
```

* **Referencias:**

- `apps/web/src/ui/global/widgets/components/NotesDrawer/useNotesDrawer.ts`
- `apps/web/src/ui/global/widgets/components/NotesDrawer/NotesDrawerView.tsx`
- `apps/web/src/ui/playground/widgets/pages/Snippet/SnippetPageView.tsx`
- `apps/web/src/app/playground/snippets/page.tsx`
- `apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/index.tsx`
- `apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/SidenavButton/index.tsx`
- `design/stardust` node `Z4ucq` (`Notes Body`)
- `apps/web/src/rest/services/ProfileService.ts`
- `apps/server/src/app/hono/routers/profile/NotesRouter.ts`
- `apps/server/src/database/supabase/repositories/profile/SupabaseNotesRepository.ts`
- `packages/core/src/profile/interfaces/ProfileService.ts`
- `packages/validation/src/modules/profile/noteSchema.ts`

---

# 10. Pendencias / Duvidas (Quando aplicavel)

**Sem pendencias**.
