---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
status: closed
---

## Pendencias (quando aplicavel)

- Testes de rotas de `achievements` no workspace `@stardust/server` dependem do Supabase local em `127.0.0.1:54321`; execucao atual falhou com `ECONNREFUSED` durante `npm run test -w @stardust/server`.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Ajustar o contrato compartilhado de validacao de notes para aceitar content vazio | - | - |
| F2 | Garantir compatibilidade do server com o contrato atualizado sem criar novos endpoints | F1 | F3 |
| F3 | Implementar rota /notes e pagina dedicada com fluxo responsivo de lista e editor na web | F1 | F2 |

> **Estrategia de paralelismo:** sempre comece pelo core (dominio, structures e use cases). Assim que o core estiver concluido, as fases de `server` e `web` podem ser executadas em paralelo, pois ambas dependem apenas do contrato definido no core.

---

## F1 — Core: Dominio, Structures e Use Cases

**Objetivo:** Ajustar o contrato compartilhado de validacao para que create/update de notas aceitem `content` vazio, preservando titulo obrigatorio e sem alterar contratos de dominio ja existentes.

### Tarefas

- [x] **F1-T1** — Atualizar `noteSchema` para aceitar `content` vazio
  - Artefatos: `packages/validation/src/modules/profile/noteSchema.ts` *(alterado)*
  - Concluido em: 2026-05-08
  - **Depende de:** -
  - **Resultado observavel:** `noteSchema` valida `{ title: "Minha nota", content: "" }` como sucesso e continua rejeitando `title` vazio.
  - **Camada:** `core`

- [x] **F1-T2** — Cobrir o novo contrato de `noteSchema` com teste automatizado
  - Artefatos: `packages/validation/src/modules/profile/tests/noteSchema.test.ts` *(novo)*
  - Artefatos: `packages/validation/jest.config.ts` *(novo)*
  - Artefatos: `packages/validation/package.json` *(alterado)*
  - Concluido em: 2026-05-08
  - **Depende de:** F1-T1
  - **Resultado observavel:** existe teste automatizado comprovando `content` vazio valido e `title` vazio invalido.
  - **Camada:** `core`

---

## F2 — Server: Infra, Repositorios e Handlers

> ⚡ Pode rodar em paralelo com F3 apos F1 estar concluida.

**Objetivo:** Assegurar que a borda HTTP existente de notes no server continue aderente ao contrato compartilhado atualizado, sem criar router/controller/repository novos.

### Tarefas

- [x] **F2-T1** — Ajustar teste do fluxo `POST /profile/notes` para aceitar `content` vazio
  - Artefatos: `apps/server/src/rest/controllers/profile/notes/tests/CreateNoteController.test.ts` *(alterado)*
  - Concluido em: 2026-05-08
  - **Depende de:** F1-T2
  - **Resultado observavel:** cobertura automatizada valida resposta de sucesso para criacao autenticada com body contendo `title` valido e `content` vazio.
  - **Camada:** `rest`

- [x] **F2-T2** — Ajustar teste do fluxo `PUT /profile/notes/:noteId` para aceitar `content` vazio
  - Artefatos: `apps/server/src/rest/controllers/profile/notes/tests/UpdateNoteController.test.ts` *(alterado)*
  - Concluido em: 2026-05-08
  - **Depende de:** F2-T1
  - **Resultado observavel:** cobertura automatizada valida resposta de sucesso para atualizacao autenticada com `title` valido e `content` vazio.
  - **Camada:** `rest`

---

## F3 — Web: UI e Integracao

> ⚡ Pode rodar em paralelo com F2 apos F1 estar concluida.

**Objetivo:** Entregar a experiencia completa da rota privada `/notes` no app web, com navegacao via sidenav, lista paginada com busca debounced, editor no mesmo fluxo, confirmacoes com AlertDialog e reconciliacao local apos mutacoes.

### Tarefas

- [x] **F3-T1** — Adicionar `ROUTES.notes` em `apps/web/src/constants/routes.ts`
  - Artefatos: `apps/web/src/constants/routes.ts` *(alterado)*
  - Concluido em: 2026-05-08
  - **Depende de:** F1-T2
  - **Resultado observavel:** existe constante de rota canonica para `/notes` reutilizavel pela navegacao da web.
  - **Camada:** `web`

- [x] **F3-T2** — Criar rota `apps/web/src/app/(home)/notes/page.tsx`
  - Artefatos: `apps/web/src/app/(home)/notes/page.tsx` *(novo)*
  - Concluido em: 2026-05-08
  - **Depende de:** F3-T1
  - **Resultado observavel:** a rota privada `/notes` renderiza o widget `NotesPage` dentro do grupo `(home)`.
  - **Camada:** `web`

- [x] **F3-T3** — Adicionar entrada `Notas` na `Sidenav` via `SidenavButton`
  - Artefatos: `apps/web/src/ui/profile/widgets/layouts/Home/home-links.ts` *(alterado)*
  - Artefatos: `apps/web/public/icons/notes.svg` *(novo)*
  - Concluido em: 2026-05-08
  - **Depende de:** F3-T1
  - **Resultado observavel:** usuarios autenticados veem botao `Notas` na sidebar e a acao navega para `/notes`.
  - **Camada:** `ui`

- [x] **F3-T4** — Criar widget `NotesPage` (entry point + view + hook)
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/index.tsx` *(novo)*
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/NotesPageView.tsx` *(novo)*
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/useNotesPage.ts` *(novo)*
  - Concluido em: 2026-05-08
  - **Depende de:** F3-T2
  - **Resultado observavel:** pagina carrega lista paginada via `profileService.fetchNotes`, controla loading/error/empty/content e orquestra handlers de busca, selecao, create, update e delete.
  - **Camada:** `ui`

- [x] **F3-T5** — Criar widget `NotesSidebar` (entry point + view)
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/NotesSidebar/index.tsx` *(novo)*
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/NotesSidebar/NotesSidebarView.tsx` *(novo)*
  - Concluido em: 2026-05-08
  - **Depende de:** F3-T4
  - **Resultado observavel:** sidebar renderiza busca por titulo, lista de notas, botoes de pagina e estado expandido/recolhido com `aria-label`.
  - **Camada:** `ui`

- [x] **F3-T6** — Criar widget `NoteEditor` (entry point + view)
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/NoteEditor/index.tsx` *(novo)*
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/NoteEditor/NoteEditorView.tsx` *(novo)*
  - Concluido em: 2026-05-08
  - **Depende de:** F3-T4
  - **Resultado observavel:** editor renderiza cabecalho e integra formulario da nota mantendo estado persistente da nota ativa no desktop.
  - **Camada:** `ui`

- [x] **F3-T7** — Criar widget `NoteEditorForm` com `react-hook-form` e `noteSchema`
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/NoteEditorForm/index.tsx` *(novo)*
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/NoteEditorForm/NoteEditorFormView.tsx` *(novo)*
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/NoteEditorForm/useNoteEditorForm.ts` *(novo)*
  - Concluido em: 2026-05-08
  - **Depende de:** F3-T6
  - **Resultado observavel:** formulario valida titulo, aceita `content` vazio, expoe dirty state e envia submit para create/update sem incluir campos controlados pelo servidor.
  - **Camada:** `ui`

- [x] **F3-T8** — Criar widgets `EmptyNotesState`, `DeleteNoteDialog` e `DiscardChangesDialog`
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/states/EmptyNotesState/index.tsx` *(novo)*
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/states/EmptyNotesState/EmptyNotesStateView.tsx` *(novo)*
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/dialogs/DeleteNoteDialog/index.tsx` *(novo)*
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/dialogs/DeleteNoteDialog/DeleteNoteDialogView.tsx` *(novo)*
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/dialogs/DiscardChangesDialog/index.tsx` *(novo)*
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/dialogs/DiscardChangesDialog/DiscardChangesDialogView.tsx` *(novo)*
  - Concluido em: 2026-05-08
  - **Depende de:** F3-T4
  - **Resultado observavel:** fluxo usa `AlertDialog` para confirmar exclusao/descarte e renderiza estado vazio reutilizavel para lista sem itens/editor sem selecao.
  - **Camada:** `ui`

- [x] **F3-T9** — Implementar fluxo responsivo desktop/mobile sem trocar rota
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/NotesPageView.tsx` *(novo)*
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/useNotesPage.ts` *(novo)*
  - Concluido em: 2026-05-08
  - **Depende de:** F3-T5, F3-T6, F3-T7, F3-T8
  - **Resultado observavel:** desktop mostra lista+editor em duas colunas; mobile alterna entre lista e editor, com confirmacao ao voltar quando houver alteracoes nao salvas.
  - **Camada:** `ui`

- [x] **F3-T10** — Cobrir `useNotesPage` com testes de interacao critica
  - Artefatos: `apps/web/src/ui/profile/widgets/pages/Notes/tests/useNotesPage.test.ts` *(novo)*
  - Concluido em: 2026-05-08
  - **Depende de:** F3-T9
  - **Resultado observavel:** testes automatizados cobrem busca debounced, confirmacao de descarte e reconciliacao local de create/update/delete.
  - **Camada:** `ui`

---

## Divergencias em relacao a Spec

Nenhuma ate o momento.
