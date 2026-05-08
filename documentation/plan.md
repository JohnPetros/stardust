---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
status: closed
---

## Pendencias (quando aplicavel)

- [ ] Confirmar se o ajuste obrigatorio em `apps/studio/src/rest/services/ProfileService.ts` pode ser tratado como spillover tecnico fora do escopo desta spec. Impacto: ao adicionar metodos de notes em `packages/core/src/profile/interfaces/ProfileService.ts`, o adapter do `studio` deixa de satisfazer a interface compartilhada e o typecheck do monorepo quebra. Acao necessaria: autorizar o ajuste em `studio` ou redefinir como manter compatibilidade do contrato.
- [ ] A codebase atual nao possui Tiptap nem adaptador existente de roundtrip Markdown no `web`. Impacto: a UI depende da instalacao e configuracao das novas dependencias para materializar o `TiptapEditorField`. Acao necessaria: adicionar os pacotes definidos na spec e validar compatibilidade com React 19 / Next 15 no PR tecnico.
- [ ] A feature nao introduz RLS para `public.notes`, embora o recurso seja privado. Impacto: a privacidade continuara concentrada na autenticacao da app, nos grants SQL e no filtro por `user_id` no repository/use case. Acao necessaria: registrar explicitamente essa limitacao no PR e manter grants restritos a `authenticated` e `service_role`.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Definir contratos de `notes` no core e na validacao compartilhada | - | - |
| F2 | Persistir e expor o CRUD autenticado de `notes` no `server` | F1 | F3 |
| F3 | Implementar o drawer de `notes` e a integracao REST na `web` | F1 | F2 |

> **Estrategia de paralelismo:** sempre comece pelo core (dominio, structures e use cases). Assim que o core estiver concluido, as fases de `server` e `web` podem ser executadas em paralelo, pois ambas dependem apenas do contrato definido no core.

---

## F1 — Core: Dominio, Structures e Use Cases

**Objetivo:** Definir o contrato do dominio de notas privadas do usuario no modulo `profile` — entidade, dto, erro, repository, use cases, interface de service e schema compartilhado — sem dependencia de infraestrutura. Essa fase desbloqueia F2 e F3 para rodarem em paralelo.

### Tarefas

- [x] **T1.1** — Criar `packages/core/src/profile/domain/entities/dtos/NoteDto.ts`
  - **Depende de:** -
  - **Resultado observavel:** o DTO `NoteDto` tipa `id`, `title`, `content`, `userId`, `createdAt` e `updatedAt`, permitindo transporte tipado do recurso entre core, server e web.
  - **Camada:** `core`
  - **Artefatos (2026-05-08):** `packages/core/src/profile/domain/entities/dtos/NoteDto.ts`

- [x] **T1.2** — Criar `packages/core/src/profile/domain/entities/Note.ts`
  - **Depende de:** T1.1
  - **Resultado observavel:** `Note.create()` constroi a entidade a partir de `NoteDto`, aplica default de datas, expoe `dto` e permite mutar `title`, `content` e `updatedAt` via metodos da entidade.
  - **Camada:** `core`
  - **Artefatos (2026-05-08):** `packages/core/src/profile/domain/entities/Note.ts`

- [x] **T1.3** — Criar `packages/core/src/profile/domain/errors/NoteNotFoundError.ts`
  - **Depende de:** -
  - **Resultado observavel:** o core passa a ter um erro de dominio explicito para update/delete de nota inexistente ou inacessivel ao autor.
  - **Camada:** `core`
  - **Artefatos (2026-05-08):** `packages/core/src/profile/domain/errors/NoteNotFoundError.ts`

- [x] **T1.4** — Criar `packages/core/src/profile/interfaces/NotesRepository.ts`
  - **Depende de:** T1.2
  - **Resultado observavel:** existe um contrato de repository com `findById`, `findManyByUser`, `add`, `replace` e `remove`, usando `Id`, `OrdinalNumber`, `Text` e retornando `ManyItems<Note>`.
  - **Camada:** `core`
  - **Artefatos (2026-05-08):** `packages/core/src/profile/interfaces/NotesRepository.ts`

- [x] **T1.5** — Criar `packages/core/src/profile/use-cases/CreateNoteUseCase.ts`
  - **Depende de:** T1.2, T1.4
  - **Resultado observavel:** `execute({ noteTitle, noteContent, userId })` cria uma `Note`, persiste via `NotesRepository` e retorna `NoteDto`.
  - **Camada:** `core`
  - **Artefatos (2026-05-08):** `packages/core/src/profile/use-cases/CreateNoteUseCase.ts`

- [x] **T1.6** — Criar `packages/core/src/profile/use-cases/ListNotesUseCase.ts`
  - **Depende de:** T1.1, T1.4
  - **Resultado observavel:** `execute({ userId, page, itemsPerPage, search })` retorna `PaginationResponse<NoteDto>` ordenada pela persistencia e filtrada por `title` quando houver busca.
  - **Camada:** `core`
  - **Artefatos (2026-05-08):** `packages/core/src/profile/use-cases/ListNotesUseCase.ts`

- [x] **T1.7** — Criar `packages/core/src/profile/use-cases/UpdateNoteUseCase.ts`
  - **Depende de:** T1.2, T1.3, T1.4
  - **Resultado observavel:** `execute({ noteId, noteTitle, noteContent, userId })` carrega a nota, valida ownership, atualiza titulo/corpo, faz `touch()` e retorna `NoteDto` persistido.
  - **Camada:** `core`
  - **Artefatos (2026-05-08):** `packages/core/src/profile/use-cases/UpdateNoteUseCase.ts`

- [x] **T1.8** — Criar `packages/core/src/profile/use-cases/DeleteNoteUseCase.ts`
  - **Depende de:** T1.3, T1.4
  - **Resultado observavel:** `execute({ noteId, userId })` remove apenas a nota do autor autenticado e falha com erro de dominio quando a nota nao puder ser operada.
  - **Camada:** `core`
  - **Artefatos (2026-05-08):** `packages/core/src/profile/use-cases/DeleteNoteUseCase.ts`

- [x] **T1.9** — Atualizar `packages/core/src/profile/interfaces/ProfileService.ts`
  - **Depende de:** T1.1
  - **Resultado observavel:** a interface `ProfileService` passa a expor `fetchNotes`, `createNote`, `updateNote` e `deleteNote` com contratos tipados para `NoteDto` e `PaginationResponse<NoteDto>`.
  - **Camada:** `core`
  - **Artefatos (2026-05-08):** `packages/core/src/profile/interfaces/ProfileService.ts`

- [x] **T1.10** — Criar `packages/validation/src/modules/profile/noteSchema.ts`
  - **Depende de:** -
  - **Resultado observavel:** existe um schema compartilhado com `title: z.string().min(1)` e `content: z.string()`, reutilizavel no `server` e no formulario da `web`.
  - **Camada:** `core`
  - **Artefatos (2026-05-08):** `packages/validation/src/modules/profile/noteSchema.ts`

- [x] **T1.11** — Atualizar os barrels do modulo `profile` em `packages/core`
  - **Depende de:** T1.1, T1.2, T1.3, T1.4, T1.5, T1.6, T1.7, T1.8, T1.9
  - **Resultado observavel:** `Note`, `NoteDto`, `NoteNotFoundError`, `NotesRepository` e os novos use cases podem ser importados pelos barrels oficiais do modulo `profile`.
  - **Camada:** `core`
  - **Artefatos (2026-05-08):** `packages/core/src/profile/domain/entities/index.ts`, `packages/core/src/profile/domain/entities/dtos/index.ts`, `packages/core/src/profile/domain/errors/index.ts`, `packages/core/src/profile/interfaces/index.ts`, `packages/core/src/profile/use-cases/index.ts`

- [x] **T1.12** — Atualizar `packages/validation/src/modules/profile/index.ts`
  - **Depende de:** T1.10
  - **Resultado observavel:** `noteSchema` fica disponivel em `@stardust/validation/profile/schemas`, sem criar schema dedicado dentro das apps.
  - **Camada:** `core`
  - **Artefatos (2026-05-08):** `packages/validation/src/modules/profile/index.ts`

---

## F2 — Server: Infra, Repositorios e Handlers

> ⚡ Pode rodar em paralelo com F3 apos F1 estar concluida.

**Objetivo:** Implementar a persistencia SQL e a exposicao HTTP autenticada do recurso `notes` no modulo `profile`, consumindo os contratos definidos no core.

### Tarefas

- [x] **T2.1** — Criar `apps/server/supabase/migrations/<timestamp>_create_notes.sql`
  - **Depende de:** T1.11
  - **Resultado observavel:** a migration cria `public.notes` com `CHECK (length(title) >= 1)`, `content default ''`, timestamps, FK para `users`, indice `(user_id, updated_at desc)` e grants restritos ao recurso privado.
  - **Camada:** `database`
  - **Artefatos (2026-05-08):** `apps/server/supabase/migrations/20260508132253_create_notes.sql`

- [x] **T2.2** — Atualizar `apps/server/src/database/supabase/types/Database.ts`
  - **Depende de:** T2.1
  - **Resultado observavel:** o tipo gerado do banco passa a conter a tabela `public.notes`, permitindo tipagem segura do repository e mapper.
  - **Camada:** `database`
  - **Artefatos (2026-05-08):** `apps/server/src/database/supabase/types/Database.ts`

- [x] **T2.3** — Criar `apps/server/src/database/supabase/types/SupabaseNote.ts`
  - **Depende de:** T2.2
  - **Resultado observavel:** existe um alias tipado para `Database['public']['Tables']['notes']['Row']`.
  - **Camada:** `database`
  - **Artefatos (2026-05-08):** `apps/server/src/database/supabase/types/SupabaseNote.ts`

- [x] **T2.4** — Criar `apps/server/src/database/supabase/mappers/profile/SupabaseNoteMapper.ts`
  - **Depende de:** T1.11, T2.3
  - **Resultado observavel:** o mapper converte `SupabaseNote` para `Note` e `NoteDto`, e serializa `Note` para o shape persistido da tabela `notes`.
  - **Camada:** `database`
  - **Artefatos (2026-05-08):** `apps/server/src/database/supabase/mappers/profile/SupabaseNoteMapper.ts`

- [x] **T2.5** — Criar `apps/server/src/database/supabase/repositories/profile/SupabaseNotesRepository.ts`
  - **Depende de:** T1.11, T2.1, T2.4
  - **Resultado observavel:** o repository implementa `NotesRepository`, filtra por `user_id`, busca por `title` com `ilike`, ordena por `updated_at desc`, pagina resultados e persiste create/update/delete na tabela `notes`.
  - **Camada:** `database`
  - **Artefatos (2026-05-08):** `apps/server/src/database/supabase/repositories/profile/SupabaseNotesRepository.ts`

- [x] **T2.6** — Atualizar os barrels `apps/server/src/database/supabase/{types,mappers,repositories}/profile`
  - **Depende de:** T2.3, T2.4, T2.5
  - **Resultado observavel:** `SupabaseNote`, `SupabaseNoteMapper` e `SupabaseNotesRepository` ficam acessiveis pelos barrels oficiais usados pelo router `profile`.
  - **Camada:** `database`
  - **Artefatos (2026-05-08):** `apps/server/src/database/supabase/types/index.ts`, `apps/server/src/database/supabase/mappers/profile/index.ts`, `apps/server/src/database/supabase/repositories/profile/index.ts`

- [x] **T2.7** — Criar `apps/server/src/rest/controllers/profile/notes/CreateNoteController.ts`
  - **Depende de:** T1.5
  - **Resultado observavel:** `POST /profile/notes` le `title` e `content` do body validado, resolve o usuario autenticado na borda e retorna `201` com `NoteDto`.
  - **Camada:** `rest`
  - **Artefatos (2026-05-08):** `apps/server/src/rest/controllers/profile/notes/CreateNoteController.ts`

- [x] **T2.8** — Criar `apps/server/src/rest/controllers/profile/notes/ListNotesController.ts`
  - **Depende de:** T1.6
  - **Resultado observavel:** `GET /profile/notes` retorna apenas notas do usuario autenticado em `PaginationResponse`, com `page`, `itemsPerPage` e `search` aplicados.
  - **Camada:** `rest`
  - **Artefatos (2026-05-08):** `apps/server/src/rest/controllers/profile/notes/ListNotesController.ts`

- [x] **T2.9** — Criar `apps/server/src/rest/controllers/profile/notes/UpdateNoteController.ts`
  - **Depende de:** T1.7
  - **Resultado observavel:** `PUT /profile/notes/:noteId` atualiza apenas a nota do autor autenticado e retorna `200` com `NoteDto` atualizado.
  - **Camada:** `rest`
  - **Artefatos (2026-05-08):** `apps/server/src/rest/controllers/profile/notes/UpdateNoteController.ts`

- [x] **T2.10** — Criar `apps/server/src/rest/controllers/profile/notes/DeleteNoteController.ts`
  - **Depende de:** T1.8
  - **Resultado observavel:** `DELETE /profile/notes/:noteId` remove apenas a nota do autor autenticado e retorna resposta de sucesso sem exigir payload extra do cliente.
  - **Camada:** `rest`
  - **Artefatos (2026-05-08):** `apps/server/src/rest/controllers/profile/notes/DeleteNoteController.ts`

- [x] **T2.11** — Criar `apps/server/src/app/hono/routers/profile/NotesRouter.ts`
  - **Depende de:** T1.12, T2.5, T2.7, T2.8, T2.9, T2.10
  - **Resultado observavel:** o router registra `GET/POST/PUT/DELETE` em `/profile/notes` com `AuthMiddleware.verifyAuthentication` e `ValidationMiddleware.validate` para body, query e params.
  - **Camada:** `rest`
  - **Artefatos (2026-05-08):** `apps/server/src/app/hono/routers/profile/NotesRouter.ts`

- [x] **T2.12** — Atualizar `apps/server/src/rest/controllers/profile/index.ts`
  - **Depende de:** T2.7, T2.8, T2.9, T2.10
  - **Resultado observavel:** o barrel de controllers do modulo `profile` reexporta o namespace `notes` junto dos controllers ja existentes.
  - **Camada:** `rest`
  - **Artefatos (2026-05-08):** `apps/server/src/rest/controllers/profile/index.ts`, `apps/server/src/rest/controllers/profile/notes/index.ts`

- [x] **T2.13** — Atualizar `apps/server/src/app/hono/routers/profile/ProfileRouter.ts`
  - **Depende de:** T2.11, T2.12
  - **Resultado observavel:** `ProfileRouter` monta `NotesRouter` sob `basePath('/profile')`, deixando a surface HTTP do recurso disponivel no modulo `profile`.
  - **Camada:** `rest`
  - **Artefatos (2026-05-08):** `apps/server/src/app/hono/routers/profile/ProfileRouter.ts`

---

## F3 — Web: UI e Integracao

> ⚡ Pode rodar em paralelo com F2 apos F1 estar concluida.

**Objetivo:** Implementar a integracao REST e a experiencia client-side do drawer de notas nas paginas de `lesson` e `challenge`, sem alterar rotas nem layout global.

### Tarefas

- [x] **T3.1** — Atualizar `apps/web/src/rest/services/ProfileService.ts`
  - **Depende de:** T1.9
  - **Resultado observavel:** o adapter REST passa a expor `fetchNotes`, `createNote`, `updateNote` e `deleteNote`, limpando query params antes do GET e enviando apenas `title` e `content` nos payloads de mutacao.
  - **Camada:** `rest`
  - **Artefatos (2026-05-08):** `apps/web/src/rest/services/ProfileService.ts`

- [x] **T3.2** — Atualizar `apps/web/src/constants/cache.ts`
  - **Depende de:** T3.1
  - **Resultado observavel:** existe uma chave de cache dedicada para a listagem paginada de `notes`, sem reuso de caches de outros modulos.
  - **Camada:** `ui`
  - **Artefatos (2026-05-08):** `apps/web/src/constants/cache.ts`

- [x] **T3.3** — Atualizar `apps/web/package.json`
  - **Depende de:** -
  - **Resultado observavel:** o workspace `@stardust/web` declara `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm`, `@tiptap/extension-placeholder` e `tiptap-markdown` como dependencias da UI de notas.
  - **Camada:** `ui`
  - **Artefatos (2026-05-08):** `apps/web/package.json`

- [x] **T3.4** — Criar o widget `apps/web/src/ui/global/widgets/components/NotesDrawer/TiptapEditorField`
  - **Depende de:** T3.3
  - **Resultado observavel:** existe um campo de editor rico que recebe `value`, `disabled` e `onChange(markdown)`, usa Tiptap com o subconjunto de extensoes definido na spec e faz roundtrip em Markdown.
  - **Camada:** `ui`
  - **Artefatos (2026-05-08):** `apps/web/src/ui/global/widgets/components/NotesDrawer/TiptapEditorField/index.tsx`

- [x] **T3.5** — Criar o widget `apps/web/src/ui/global/widgets/components/NotesDrawer/NotesListDialog`
  - **Depende de:** T3.1, T3.2
  - **Resultado observavel:** o dialog renderiza lista paginada com busca por titulo, preview truncado, `Datetime.formatTimeAgo()`, estados de loading/erro/vazio e callback de selecao da nota.
  - **Camada:** `ui`
  - **Artefatos (2026-05-08):** `apps/web/src/ui/global/widgets/components/NotesDrawer/NotesListDialog/index.tsx`

- [x] **T3.6** — Criar `apps/web/src/ui/global/widgets/components/NotesDrawer/useNotesDrawer.ts`
  - **Depende de:** T3.1, T3.2, T3.4, T3.5, T1.10
  - **Resultado observavel:** o hook controla drawer, dialog, formulario, debounce de busca, create/update/delete, confirmacao de descarte, reconciliacao local da lista e rollback local em delete com falha.
  - **Camada:** `ui`
  - **Artefatos (2026-05-08):** `apps/web/src/ui/global/widgets/components/NotesDrawer/useNotesDrawer.ts`

- [x] **T3.7** — Criar `apps/web/src/ui/global/widgets/components/NotesDrawer/NotesDrawerView.tsx`
  - **Depende de:** T3.4, T3.5, T3.6
  - **Resultado observavel:** a view renderiza drawer responsivo com formulario de nova/edicao, toolbar do editor, CTA `Ver notas`, acoes `Salvar` e `Excluir`, e labels acessiveis para fechar, salvar, listar e excluir.
  - **Camada:** `ui`
  - **Artefatos (2026-05-08):** `apps/web/src/ui/global/widgets/components/NotesDrawer/NotesDrawerView.tsx`

- [x] **T3.8** — Criar `apps/web/src/ui/global/widgets/components/NotesDrawer/index.tsx`
  - **Depende de:** T3.6, T3.7
  - **Resultado observavel:** o entry point resolve `profileService`, auth e toast na borda, usa `children` como trigger do drawer e so monta a experiencia de notas quando houver usuario autenticado.
  - **Camada:** `ui`
  - **Artefatos (2026-05-08):** `apps/web/src/ui/global/widgets/components/NotesDrawer/index.tsx`

- [x] **T3.9** — Atualizar `apps/web/src/ui/lesson/widgets/pages/Lesson/index.tsx`
  - **Depende de:** T3.8
  - **Resultado observavel:** `LessonPage` passa a montar um `notesSlot` baseado em `<NotesDrawer>{trigger}</NotesDrawer>` sem alterar o fluxo atual da pagina.
  - **Camada:** `ui`
  - **Artefatos (2026-05-08):** `apps/web/src/ui/lesson/widgets/pages/Lesson/index.tsx`

- [x] **T3.10** — Atualizar `apps/web/src/ui/lesson/widgets/pages/Lesson/LessonPageView.tsx`
  - **Depende de:** T3.9
  - **Resultado observavel:** `LessonPageView` recebe `notesSlot` e o encaminha ao header da licao sem acoplar o widget por import direto no layout global.
  - **Camada:** `ui`
  - **Artefatos (2026-05-08):** `apps/web/src/ui/lesson/widgets/pages/Lesson/LessonPageView.tsx`

- [x] **T3.11** — Atualizar `apps/web/src/ui/lesson/widgets/pages/Lesson/LessonHeader/index.tsx`
  - **Depende de:** T3.10
  - **Resultado observavel:** o header da licao renderiza o gatilho de notas junto das acoes existentes, preservando progresso, vidas e saida da licao.
  - **Camada:** `ui`
  - **Artefatos (2026-05-08):** `apps/web/src/ui/lesson/widgets/pages/Lesson/LessonHeader/index.tsx`

- [x] **T3.12** — Atualizar `apps/web/src/ui/challenging/widgets/pages/Challenge/index.tsx`
  - **Depende de:** T3.8
  - **Resultado observavel:** `ChallengePage` passa a montar um `notesSlot` baseado em `<NotesDrawer>{trigger}</NotesDrawer>` no entry point da pagina.
  - **Camada:** `ui`
  - **Artefatos (2026-05-08):** `apps/web/src/ui/challenging/widgets/pages/Challenge/index.tsx`

- [x] **T3.13** — Atualizar `apps/web/src/ui/challenging/widgets/pages/Challenge/ChallengePageView.tsx`
  - **Depende de:** T3.12
  - **Resultado observavel:** o header do desafio recebe e renderiza `notesSlot` de forma independente de `challengeNavigationSlot`, mantendo o acesso a notas mesmo quando a navegacao sequencial nao existir.
  - **Camada:** `ui`
  - **Artefatos (2026-05-08):** `apps/web/src/ui/challenging/widgets/pages/Challenge/ChallengePageView.tsx`

---

## Divergencias em relacao a Spec

- **F3-T3.7:** o drawer foi entregue com editor rico funcional e roundtrip Markdown, porem sem uma toolbar visual dedicada de formatacao separada do campo de edicao.
- **Qualidade/ambiente:** `npm run test -w @stardust/server` falhou por dependencia de infraestrutura local indisponivel (`ECONNREFUSED 127.0.0.1:54321` em suites de integracao com Supabase local), sem indicio de regressao funcional de notes.
- **Qualidade/contrato compartilhado:** `npm run typecheck -w @stardust/studio` falhou porque `apps/studio/src/rest/services/ProfileService.ts` ainda nao implementa os metodos novos de notes adicionados ao contrato do core.
