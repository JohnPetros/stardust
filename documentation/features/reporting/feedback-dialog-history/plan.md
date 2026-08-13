---
spec: ./spec.md
spec_revision: 3
status: completed
judge_plan: accepted
implementation_judgment_mode: final
current_phase: F6
current_task: F6-T3
findings_active: none
attempts: 3
last_updated_at: 2026-08-11
---

# Plan — Histórico e conversas no diálogo de feedback

## Estado operacional

- **Spec:** `completed`, revisão 2, aceite final registrado.
- **Plan:** `completed`; implementação, sensores e encerramento concluídos.
- **Fase atual:** F6 — integração, sensores e preflight final.
- **Judge Plan:** a avaliação read-only da revisão 2 foi concluída e aceita;
  JP-01–JP-05 permanecem como histórico resolvido.
- **Judge Implementation:** o primeiro Judge Final da revisão 2 reprovou por
  JI-FINAL-01/02/03; após as correções, o Judge Final independente aceitou a
  revisão 2 sem findings bloqueantes.
- **Findings:** JI-05, JI-06, JI-07 e JI-FINAL-01/02/03 estão resolvidos; não há
  finding ativo.
  JI-01–JI-04 receberam correções posteriores ao Judge anterior e foram
  incluídos na revalidação final.
- **Próxima ação:** nenhuma; handoff para revisão/PR.

## Objetivo

Estender o diálogo de feedback da Web para um canal privado e contínuo entre a
conta autenticada e a Equipe StarDust: criação com anexo inicial, badge de
novidades, histórico paginado, detalhe cronológico, leitura idempotente,
resposta com anexos, drafts em memória, deep link e experiência responsiva e
acessível. A implementação deve reutilizar o domínio conversacional, o evento
e o job existentes da Issue #518, sem duplicar o fluxo administrativo.

## Escopo do Plan

- `packages/core/src/reporting` e `packages/validation/src/modules/reporting`:
  agregado, DTOs, requests, ports, use cases e schemas de ownership, leitura,
  paginação e uploads.
- `apps/server/supabase/migrations`, `apps/server/supabase/schemas/schema.sql`
  e `apps/server/src/database/supabase`: migration aditiva, backfill, índices,
  funções invoker, grants, tipos, repository e mappers.
- `apps/server/src/rest/controllers/reporting`,
  `apps/server/src/app/hono/routers/reporting` e testes de rota: endpoints
  autenticados `mine`, upload contextual, leitura e preservação das rotas
  administrativas.
- `apps/server/src/queue`: somente validação/reuso do evento
  `FeedbackUserMessageCreatedEvent` e `SendFeedbackReplyDiscordJob`, sem novo
  evento/job ou outbox.
- `apps/web/src/rest/services/ReportingService.ts`,
  `apps/web/src/constants/routes.ts`, `apps/web/src/middleware.ts`,
  `apps/web/src/app/feedback/[feedbackReportId]/page.tsx`, autenticação e toda
  a UI de reporting/global indicada na Spec.
- `design/stardust.pen`: preservar `bTYzS`, `r6xBJD` e `hi2Ot`; alterar somente
  `r6xBJD`/`zSm9F` de `2` para `Nova resposta` e comparar o resultado final.
- Testes unitários, de rota, integração Web e validação manual autenticada com
  Playwright; migration e comportamento devem ser verificados no Supabase Dev.

## Fora do escopo

- Feedback de visitante, realtime/polling/push, edição/exclusão/arquivamento pelo
  usuário e resposta por e-mail ou Discord.
- Persistência de drafts entre reloads/abas/sessões, canais adicionais de
  anexo, alteração de status pelo usuário, SLA/prioridade/tags/votação/roadmap.
- Alteração do painel administrativo do Studio, salvo compatibilidade dos
  contratos compartilhados já existentes.
- Nova tabela, outbox, novo evento/job, ou alteração da cascata de deleção da
  fundação.
- Criação de novos Node IDs ou de frames canônicos mobile/loading/error/empty;
  esses estados seguem o sistema visual existente e são validados no browser.

## Contratos e referências canônicas

Qualquer mudança de requisito, assinatura pública, path, regra de autorização,
status HTTP, garantia de idempotência ou referência visual exige amendment da
Spec e nova avaliação do Judge Spec antes da tarefa afetada.

| Referência | Uso no Plan |
| --- | --- |
| `RF-01`–`RF-05`, `RF-15`, `RF-16`, `RF-19` / `CA-01`–`CA-07`, `CA-20`, `CA-21`, `CA-24` | disponibilidade global, criação, upload, drafts, reconsulta, responsividade e acessibilidade |
| `RF-06`–`RF-11`, `RF-14`, `RF-18` / `CA-08`–`CA-15`, `CA-19`, `CA-24`, `CA-25` | badge, histórico, ownership, detalhe, leitura concorrente, fechado e falha segura |
| `RF-12`, `RF-13` / `CA-16`–`CA-18`, `CA-26` | resposta, uploads atômicos, idempotência, atividade, evento e Discord |
| `RF-17` / `CA-22`, `CA-23` | deep link, `nextRoute` interno e fallback contra open redirect |

### Design e Pencil

Fonte visual: `design/stardust.pen`.

| Node ID | Nome | Estado/viewport | Fases |
| --- | --- | --- | --- |
| `bTYzS` | `Feedback Reporting Dialog` | entrada desktop `720×450`, badge numérico no acesso principal | F5 |
| `r6xBJD` | `My Feedback Reports Modal` | histórico desktop `720×680`, filtros, itens e footer | F5 |
| `hi2Ot` | `Feedback Report Detail View` | detalhe desktop `720×680`, anexo, resposta e compositor | F5 |

O Builder de UI deve manter esses IDs, nomes e viewports, atualizar o conteúdo
`zSm9F` de `r6xBJD` para `Nova resposta`, e registrar a comparação visual
separada da validação de runtime. Mobile, loading, error, empty, closed e
sucesso não possuem frames canônicos; devem preservar a linguagem existente,
usar painel fullscreen no mobile e ser comprovados pelo Playwright.

## Dependências e ordem das fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Congelar agregado, DTOs, requests, ports e schemas compartilhados | — | — |
| F2 | Aplicar migration, backfill, funções, grants, tipos e persistência | F1 | — |
| F3 | Implementar use cases, controllers, rotas e reuso da fila | F1, F2 | — |
| F4 | Implementar REST Web, composição de rota e preservação segura do destino de autenticação | F3 | F5, após contrato HTTP de F3 estabilizar |
| F5 | Alinhar Pencil e implementar UI global, diálogo, histórico, detalhe e composer | F3 | F4, após os contratos REST necessários de F3 estabilizarem |
| F6 | Integrar testes, banco Dev, browser real, sensores e preflight final | F2–F5 | — |

O paralelismo entre F4 e F5 é limitado e condicionado à estabilização do
contrato HTTP de F3: F4 possui ownership sobre REST/auth/routes, enquanto F5
possui ownership sobre `apps/web/src/ui/**` e não deve editar os mesmos arquivos.
O aceite formal de todas as fases fica adiado para o Judge Implementation Final,
conforme a Spec.

## F1 — Core e Validation

**Estado:** `verified`
**Dependências:** nenhuma  
**Critério de prontidão:** contratos públicos da Spec implementados e testes
unitários de domínio/validation verdes; nenhuma dependência de Server, Supabase,
Inngest ou UI no Core.

### Tarefas

- [x] **F1-T1 — Evoluir `FeedbackReport` e invariantes de leitura/título**
  - **Paths:** `packages/core/src/reporting/domain/entities/FeedbackReport.ts`
    e testes do agregado.
  - **Refs:** RF-03, RF-06, RF-07, RF-10, RF-14; CA-03, CA-08, CA-09,
    CA-14, CA-15, CA-19.
  - **Resultado observável:** entidade expõe `lastAdminMessageAt`,
    `authorReadAt`, `hasUnreadAdminReply`, `registerActivity(..., 'admin')` e
    `markAuthorRead(...)` monotônico; título normaliza apenas a cópia derivada
    e conteúdo original permanece intacto.
  - **Parallelizable:** `false`; DTOs e use cases dependem destas invariantes.

- [x] **F1-T2 — Atualizar DTOs, requests, tipos e ports de reporting**
  - **Paths:** `packages/core/src/reporting/domain/entities/dtos/**`,
    `packages/core/src/reporting/domain/types/**`,
    `packages/core/src/reporting/interfaces/FeedbackReportsRepository.ts`,
    `FeedbackMessagesRepository.ts` e `ReportingService.ts`.
  - **Refs:** RF-03, RF-06–RF-13; CA-03, CA-08–CA-18, CA-25, CA-26.
  - **Resultado observável:** existem `UserFeedbackReportsPageDto`, requests de
    criação/lista/detalhe/count/leitura, attachment inicial e as assinaturas
    de `listByAuthor`, `findByIdAndAuthor`, `countUnreadByAuthor`, `markAsRead`
    e métodos próprios do `ReportingService`, sem `userId` confiável vindo do
    client.
  - **Depende de:** F1-T1.
  - **Parallelizable:** `false`; estes shapes são a base de F2–F5.

- [x] **F1-T3 — Implementar use cases de autor e upload contextual**
  - **Paths:** `packages/core/src/reporting/use-cases/**`, incluindo
    `ListUserFeedbackReportsUseCase.ts`, `GetUserFeedbackReportUseCase.ts`,
    `CountUnreadFeedbackReportsUseCase.ts` e
    `CreateFeedbackReportAttachmentUploadUrlUseCase.ts`; ajustar
    `SendFeedbackReportUseCase.ts`, `MarkFeedbackReportAsReadUseCase.ts` e
    `SendFeedbackMessageUseCase.ts`.
  - **Refs:** RF-03–RF-14, RF-18; CA-03–CA-06, CA-08–CA-19, CA-25, CA-26.
  - **Resultado observável:** ownership é exigido no use case, ausente e outra
    conta são equivalentes, fechado rejeita mutações, uploads são validados
    antes da persistência, leitura usa a mensagem administrativa observada e
    resposta mantém idempotência/evento depois da persistência.
  - **Depende de:** F1-T1, F1-T2.
  - **Parallelizable:** `false`; depende das invariantes e ports.

- [x] **F1-T4 — Fechar schemas e cobertura de Validation**
  - **Paths:** `packages/validation/src/modules/reporting/schemas/feedbackReportSchema.ts`,
    `feedbackMessageSchema.ts`, `feedbackReadSchema.ts`,
    `feedbackReportsQuerySchema.ts`, `feedbackAttachmentUploadSchema.ts` e
    `packages/validation/src/modules/reporting/schemas/feedbackSchemas.test.ts`.
  - **Refs:** RF-03, RF-04, RF-07, RF-10, RF-12, RF-17; CA-04, CA-06,
    CA-16–CA-18, CA-22, CA-23, CA-25.
  - **Resultado observável:** limites de texto, whitespace, PNG/JPEG, MIME,
    tamanho, quantidade, query `mine`, `lastSeenMessageId` e `nextRoute`
    inválido são rejeitados com shapes estáveis e sem aceitar author/title/
    userId do cliente.
  - **Depende de:** F1-T2.
  - **Parallelizable:** `true` com F1-T3 depois de os shapes públicos estarem
    congelados; não compartilha paths de implementação.

### Sensores e evidências esperados

- Testes de domínio/use cases para título, unread simétrico, ownership, closed,
  leitura monotônica, idempotência e evento após persistência.
- Testes de Validation para limites, anexos, queries, leitura e open redirect.
- `npm run check:types`, `npm run check:code` e `npm run test:unit` direcionados
  aos pacotes afetados; `npm run check:architecture` se o sensor for aplicável
  aos contratos cross-layer.

## F2 — Database e adapters Supabase


**Estado:** `verified`
**Dependências:** F1  
**Critério de prontidão:** migration aplicada no Supabase Dev e consultas de
ownership, count, ordenação, grants e leitura concorrente validadas no remoto.

### Tarefas

- [x] **F2-T1 — Criar migration aditiva, backfill, índices, funções e grants**
  - **Path:** `apps/server/supabase/migrations/20260806120000_add_user_feedback_history.sql`
    e `apps/server/supabase/schemas/schema.sql`.
  - **Refs:** RF-06, RF-07, RF-09, RF-10; CA-08–CA-15, CA-25.
  - **Resultado observável:** colunas `last_admin_message_at` e
    `author_read_at`, backfill somente da última resposta admin, índices
    parciais, funções `list_user_feedback_reports` e
    `count_unread_user_feedback_reports` `security invoker`, update de leitura
    monotônico e grants mínimos existem sem tabela/FK/deleção nova.
  - **Parallelizable:** `false`; tipos e repositories dependem do schema.

- [x] **F2-T2 — Atualizar tipos gerados, entidade Supabase e mappers**
  - **Paths:** `apps/server/src/database/supabase/types/Database.ts`,
    `apps/server/src/database/supabase/types/SupabaseFeedbackReport.ts`,
    `apps/server/src/database/supabase/mappers/reporting/SupabaseFeedbackReportMapper.ts`
    e barrels relacionados.
  - **Refs:** RF-06–RF-10; CA-08–CA-15, CA-25.
  - **Resultado observável:** rows/functions remotos são convertidos para Core
    sem vazar tipos Supabase; timestamps e `hasUnreadAdminReply` são mapeados
    explicitamente.
  - **Depende de:** F2-T1.
  - **Parallelizable:** `false` na execução integrada; os arquivos podem ser
    preparados depois de F2-T1, mas exigem validação conjunta.

- [x] **F2-T3 — Implementar repository por autor e leitura concorrente**
  - **Path:** `apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackReportsRepository.ts`
    e testes de repository/mapper.
  - **Refs:** RF-07, RF-09, RF-10; CA-09–CA-15, CA-25.
  - **Resultado observável:** `findByIdAndAuthor` filtra ID+`user_id`, list/count
    usam as funções declaradas, a ordem é novidade/atividade/id, paginação é de
    10 e `markAsRead` não avança além da mensagem observada.
  - **Depende de:** F2-T1, F2-T2.
  - **Parallelizable:** `false`; semântica de SQL, mapper e concorrência é única.

- [x] **F2-T4 — Validar migration e comportamento no Supabase Dev**
  - **Paths/evidência:** MCP Supabase Dev, migration e testes de integração do
    Server; banco local não substitui esta evidência.
  - **Refs:** RF-06, RF-07, RF-09, RF-10; CA-08–CA-15, CA-25.
  - **Resultado observável:** migration aplicada no projeto remoto usado pelo
    Server; assinaturas, `security invoker`, grants, backfill, índices,
    ownership, count, paginação e leitura monotônica são confirmados.
  - **Depende de:** F2-T1–F2-T3.
  - **Parallelizable:** `false`; é o gate remoto da fase.

### Sensores e evidências esperados

- Testes de migration/repository com listagem por autor misturada, count por
  reporte, backfill, paginação e corrida M2/M3.
- `npm run check:code`, `npm run check:types`, `npm run test:unit` e testes de
  integração do Server aplicáveis.
- Registro da saída do MCP Supabase Dev no `evaluation.md` durante a execução;
  o Plan apenas define o gate.

## F3 — Server HTTP e fila

**Estado:** `verified`
**Dependências:** F1 e F2
**Critério de prontidão:** contratos HTTP autenticados cobrem criação, upload,
  listagem, detalhe, unread-count, leitura e mensagem sem regressão admin.

### Tarefas

- [x] **F3-T1 — Implementar controllers e registrar rotas próprias**
  - **Paths:** `apps/server/src/rest/controllers/reporting/**`,
    `apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts` e barrels.
  - **Refs:** RF-03–RF-14, RF-18; CA-03–CA-19, CA-25, CA-26.
  - **Resultado observável:** rotas estáticas são registradas antes de `/:id`:
    upload inicial, `GET /mine`, `GET /mine/unread-count`, `GET /mine/:id` e
    `PUT /mine/:id/read`; actor/author vêm da sessão, admin mantém god account,
    404 de ausência/ownership é indistinguível e status HTTP seguem a Spec.
  - **Depende de:** F1-T3, F2-T3.
  - **Parallelizable:** `false`; depende da composição server e repository.

- [x] **F3-T2 — Preservar criação, mensagens e upload contextual existentes**
  - **Paths:** controllers/use cases/routers existentes de reporting e testes
    dos fluxos `POST /reporting/feedback` e `POST /:id/messages`.
  - **Refs:** RF-03–RF-05, RF-12–RF-14; CA-03–CA-07, CA-16–CA-19, CA-25.
  - **Resultado observável:** payload não aceita identidade/título/status
    confiáveis, anexo inicial vira a storage key validada, uploads de mensagem
    são all-or-nothing, `messageId` repetido retorna a mensagem canônica e
    reporte fechado rejeita mutação.
  - **Depende de:** F3-T1.
  - **Parallelizable:** `false`; compartilha controllers e contratos HTTP.

- [x] **F3-T3 — Verificar reuso da fila sem criar novo efeito assíncrono**
  - **Paths:** `apps/server/src/queue/**` existentes de feedback, testes de
    `FeedbackUserMessageCreatedEvent` e `SendFeedbackReplyDiscordJob`.
  - **Refs:** RF-13; CA-16, CA-18, CA-26.
  - **Resultado observável:** resposta persistida publica a chave
    `feedback-user-message:<messageId>`, job mantém `KEY`, IO está em
    `amqp.run`, retry é idempotente e falha do Discord não remove a mensagem.
  - **Depende de:** F3-T2.
  - **Parallelizable:** `true` com F3-T4 após F3-T2; possui ownership exclusivo
    dos paths de queue e não edita os testes de rota HTTP.

- [x] **F3-T4 — Cobrir rotas e efeitos assíncronos**
  - **Paths:** `apps/server/src/tests/routes/reporting/FeedbackConversationsPersistence.test.ts`
    (modificar), `apps/server/src/tests/routes/reporting/UserFeedbackHistoryRoutes.test.ts`
    (novo) e testes de handlers dos controllers de usuário; testes de queue
    permanecem exclusivamente em F3-T3.
  - **Refs:** CA-03–CA-06, CA-08–CA-19, CA-25, CA-26.
  - **Resultado observável:** testes de rota cobrem auth, ownership,
    paginação, payload sem `userId`, upload inválido/parcial, 404 seguro,
    closed, leitura concorrente e idempotência HTTP; a evidência de Discord
    após persistência fica em F3-T3.
  - **Depende de:** F3-T1, F3-T2.
  - **Parallelizable:** `true` com F3-T3; os conjuntos de paths são disjuntos.

### Sensores e evidências esperados

- `server-routes-testing-rules.md`, `handlers-testing-rules.md` e
  `queue-layer-rules.md` aplicados aos testes e jobs.
- `npm run check:code`, `npm run check:types`, `npm run test:unit` e
  `npm run test:integration` direcionados ao Server.

## F4 — REST Web, deep link e autenticação

**Estado:** `verified`  
**Dependências:** F3  
**Critério de prontidão:** Web serializa somente contratos próprios, preserva
`nextRoute` interno e expõe a rota de deep link sem duplicar autorização.

### Tarefas

- [x] **F4-T1 — Implementar métodos próprios do `ReportingService` Web**
  - **Path:** `apps/web/src/rest/services/ReportingService.ts` e testes do
    service.
  - **Refs:** RF-03, RF-04, RF-06–RF-13; CA-03–CA-06, CA-08–CA-18, CA-25, CA-26.
  - **Resultado observável:** service implementa criação, upload contextual,
    lista, count, detalhe e read com paths relativos, `RestResponse<T>`, query
    limpa e nenhum `userId`, preservando métodos administrativos do Studio.
  - **Parallelizable:** `true` com F4-T2 após F3 estabilizar; paths distintos.

- [x] **F4-T2 — Implementar rota e constante de deep link**
  - **Paths:** `apps/web/src/constants/routes.ts` e
    `apps/web/src/app/feedback/[feedbackReportId]/page.tsx` (novo).
  - **Refs:** RF-01, RF-17, RF-18; CA-01, CA-02, CA-12, CA-22, CA-23.
  - **Resultado observável:** `feedback.report(id)` existe e a rota endereçável
    inicializa o detalhe via composição global, oferecendo fallback acessível
    durante a hidratação sem renderizar recurso para visitante.
  - **Parallelizable:** `true` com F4-T1; não edita UI de reporting.

- [x] **F4-T3 — Preservar destino privado com validação anti-open-redirect**
  - **Paths:** `apps/web/src/middleware.ts`, componentes/hooks de `SignIn` e
    testes de autenticação/deep link.
  - **Refs:** RF-17, RF-18; CA-22, CA-23.
  - **Resultado observável:** redirect usa pathname+query interno codificado;
    login/social login valida e preserva `nextRoute`, rejeita absoluto,
    protocol-relative e rotas auth recursivas e usa fallback seguro.
  - **Depende de:** F4-T2.
  - **Parallelizable:** `false`; middleware e login compartilham o contrato.

### Sensores e evidências esperados

- Testes unitários do service e auth/middleware; testes de rota App Router onde
  aplicável.
- `npm run check:code`, `npm run check:types` e `npm run test:unit` do Web.

## F5 — UI Web e Pencil

**Estado:** `verified*`  
**Dependências:** F3; F4-T1–F4-T3 para integração final  
**Critério de prontidão:** uma única montagem global produz a experiência
desktop/mobile completa nos estados declarados e sem regressões de rotas.

### Tarefas

- [x] **F5-T1 — Consolidar montagem global autenticada**
  - **Paths:** `apps/web/src/ui/global/widgets/layouts/Root/RootLayoutView.tsx`,
    `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/**` e layouts
    duplicados listados na Spec.
  - **Refs:** RF-01, RF-02, RF-16; CA-01, CA-02, CA-21.
  - **Resultado observável:** existe uma única instância de `FeedbackLayout`
    sob providers client-side; wrappers repetidos são removidos; visitante,
    login, cadastro e páginas públicas não renderizam trigger/badge/dialog.
  - **Parallelizable:** `false`; a composição controla toda a árvore Web.

- [x] **F5-T2 — Evoluir máquina de views e criação com upload/drafts**
  - **Paths:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/**`
    e testes do hook/widget.
  - **Refs:** RF-03–RF-05, RF-12, RF-15, RF-16; CA-03–CA-07, CA-16–CA-18,
    CA-20, CA-21.
  - **Resultado observável:** estados `home|create|createSuccess|history|detail`
    e `idle|loading|error|empty|content` funcionam; upload é concluído antes
    da criação, submit concorrente é bloqueado, erro preserva draft e sucesso
    limpa somente o draft enviado.
  - **Depende de:** F5-T1, F4-T1.
  - **Parallelizable:** `false`; é o orquestrador dos novos widgets.

- [x] **F5-T3 — Criar histórico, badge, conversa, composer e anexos**
  - **Paths:** `apps/web/src/ui/reporting/**`, incluindo
    `FeedbackReportsHistory`, `FeedbackReportConversation`,
    `FeedbackMessageComposer`, `FeedbackAttachmentsInput` e
    `FeedbackUnreadBadge` com `index.tsx`, Views e hooks necessários.
  - **Refs:** RF-06–RF-16, RF-18, RF-19; CA-08–CA-21, CA-24, CA-25.
  - **Resultado observável:** lista em lotes de 10 e filtros `Todos/Abertos/
    Fechados`, `Nova resposta`, detalhe cronológico com identidade/anexos,
    leitura pelo último admin observado, resposta aberta/fechada, até três
    anexos, drafts por report ID, loading/error/empty/content, foco, Escape,
    labels, anúncios, scroll interno, safe area e retorno ao histórico. Reaberta
    para a auditoria estrutural exigida por CA-28.
  - **Depende de:** F5-T2.
  - **Parallelizable:** `false`; widgets compartilham a máquina de views e drafts.

- [x] **F5-T4 — Aplicar e verificar mudança visual no Pencil**
  - **Path:** `design/stardust.pen`, somente nodes `bTYzS`, `r6xBJD`/`zSm9F`
    e `hi2Ot` conforme necessário.
  - **Refs:** RF-02, RF-06–RF-15, RF-19; CA-02, CA-08–CA-24.
  - **Resultado observável:** `r6xBJD` exibe `Nova resposta` no item, o badge
    numérico permanece em `bTYzS`, os três Node IDs/nomes/viewports são
    preservados (`bTYzS` 720×450; `r6xBJD`/`hi2Ot` 720×680) e a comparação
    visual separada foi registrada por node, viewport, estado, rota e HEAD,
    com tolerância objetiva de 4 px; divergências de conteúdo real versus
    fixture foram documentadas em `evaluation.md`.
  - **Depende de:** F5-T3.
  - **Parallelizable:** `true` com F5-T5; não edita código.

- [x] **F5-T5 — Cobrir Web com unitários e Playwright test-only**
  - **Paths:** `apps/web/src/ui/reporting/**/tests`,
    `apps/web/src/app/tests/reporting/**` e mocks compartilhados somente se
    necessário em `apps/web/src/app/tests/shared/mocks/**`.
  - **Refs:** CA-01–CA-07, CA-10–CA-24.
  - **Resultado observável:** ServerMock cobre criação, histórico, detalhe,
    resposta, fechado, ownership seguro, filtros/paginação, upload parcial,
    badge, drafts, deep link/login, mobile e estados de erro/loading/empty;
    seletores validam comportamento observável, não CSS cosmético.
  - **Depende de:** F5-T2, F5-T3; F4-T3 para deep link.
  - **Parallelizable:** `false`; integra todos os widgets e rotas Web.

### Sensores e evidências esperados

- `widget-tests-rules.md`, `web-app-routes-testing-rules.md` e `ui-layer-rules.md`.
- Auditoria de `ui-layer-rules.md` por widget alterado, com Entry Point, View,
  Hook, linhas e resultado; `check:architecture` não substitui essa auditoria.
- Testes unitários Web, `npm run check:code`, `npm run check:types` e
  `npm run test:unit`.
- `npm --workspace @stardust/web run test:integration` com `ServerMock` e
  `127.0.0.1`, sem credenciais reais nem API de produção.
- Inspeção visual Pencil separada do fluxo Playwright; nenhuma das duas
  evidências substitui a outra.

## F6 — Integração, validação manual e preflight

**Estado:** `completed`
**Dependências:** F2–F5  
**Critério de prontidão:** todos os CAs possuem evidência real, sensores passam,
browser autenticado valida rota protegida e não há findings abertos.

### Tarefas

- [x] **F6-T1 — Executar sensores locais integrados**
  - **Paths:** todo o diff da feature.
  - **Refs:** CA-01–CA-28.
  - **Resultado observável:** `check:code`, `check:architecture`, `check:types`
    e os cenários Web direcionados passam, com warnings preexistentes; o teste
    de cascata que usa Supabase local, a execução longa da suíte Web completa e seus warnings estão
    registrados em `evaluation.md` conforme as regras do AGENTS.md.
  - **Parallelizable:** `false`; requer diff integrado.

- [x] **F6-T2 — Validar fluxo real autenticado no Playwright**
  - **Paths/evidência:** Web em porta alternativa livre (preservando a `3000` do
    usuário), Server em `http://localhost:3334` (preservando a `3333`), scripts
    de ambiente do projeto e registro no
    `evaluation.md`. Antes do browser, preparar no Supabase Dev uma fixture
    controlada para a conta de teste: 11 reportes próprios (misturando `open` e
    `closed`), pelo menos um reporte com duas respostas admin não lidas, um
    reporte com resposta já observada, e um segundo usuário com reporte
    semelhante. Usar a rota administrativa existente ou o MCP Supabase Dev
    para inserir respostas com `author_role='admin'`, registrar apenas IDs e
    remover/limpar a fixture ao final; nunca registrar credenciais. O fixture
    deve ser repetível antes de cada execução e não usar Supabase local como
    fonte de verdade.
  - **Refs:** CA-01, CA-02, CA-07, CA-10–CA-24, CA-27.
  - **Resultado observável:** fixture remota foi criada e limpa pelo MCP
    `supabase_dev`, com 11 reportes próprios (8 `open`, 3 `closed`), duas
    respostas admin não lidas, uma observada e um reporte de outro usuário;
    login real navegou por `waitForURL`, rota protegida foi acessada no mesmo
    contexto, trigger, histórico 200, detalhe 200, leitura 204, resposta 201
    com draft vazio após refresh e deep link fechado somente leitura foram
    exercitados. Os cenários test-only também cobrem criação `201` com seleção
    JPEG, resposta `201`, falha recuperável de criação e fechado; o 401
    transitório da renovação de sessão permanece como warning conhecido.
    Mobile/desktop,
    seleção de arquivo no formulário e erro recuperável de carregamento da
    lista foram validados; a execução final também confirmou upload R2 real,
    criação `201`, histórico/detalhe `200` e resposta `201`.
  - **Depende de:** F6-T1.
  - **Parallelizable:** `false`; é a validação manual obrigatória da Web real.

- [x] **F6-T3 — Consolidar matriz CA, riscos e handoff**
  - **Owner:** Orchestrator; não é tarefa de Builder.
  - **Paths/evidência:** `documentation/features/reporting/feedback-dialog-history/evaluation.md`.
  - **Refs:** CA-01–CA-28.
  - **Resultado observável:** a matriz, findings, limitações (inclusive
    ausência de outbox), auditoria UI, matriz Pencil/Web e o handoff estão
    registrados em `evaluation.md`; a revalidação final aceitou o worktree após
    os sensores e builds concluídos.
  - **Depende de:** F6-T1, F6-T2.
  - **Parallelizable:** `false`; depende de todas as evidências.

### Sensores e evidências esperados

- Preflight local completo e resultados separados de unit, integration,
  arquitetura, Supabase Dev, Pencil e browser.
- Judge Implementation Final read-only compara Spec revisão 2, Plan, diff,
  Supabase Dev, Pencil, sensores, auditoria UI e Playwright.
- Quality Gate e build final permanecem responsabilidade do CI e não são
  simulados pelo Plan.

## Riscos, findings e decisões operacionais

| ID | Risco/finding | Mitigação / evidência | Estado |
| --- | --- | --- | --- |
| R-01 | Ownership pode ser aplicado só na UI | cliente JWT contextual, use case sem `userId` confiável do client, RLS por `auth.uid()` e policies remotas auditadas; CA-09/12/25 | mitigado; browser/Dev auditados |
| R-02 | Leitura com `now()` pode engolir M3 concorrente | `lastSeenAdminMessageId` e update monotônico no domínio/repository; testes direcionados passaram; CA-14/15 | mitigado em código; integração concorrente pendente |
| R-03 | Upload inicial genérico não garante MIME/tamanho real | endpoint contextual, metadata real e validação antes da persistência; testes direcionados passaram; browser obteve signed URL `201`, mas o PUT externo R2/Cloudflare falhou antes da criação; CA-05/06 | mitigado em código; bloqueio externo de storage |
| R-04 | Múltiplas instâncias do diálogo em layouts | montagem única autenticada e supressão em `/auth/*`; integração Web 49/49; CA-01/02/21 | mitigado |
| R-05 | Deep link pode virar open redirect | allowlist de path interno e rejeição de absoluto/protocol-relative/auth recursivo; testes Web passaram; deep link real retornou detalhe 200/read 204; CA-22/23 | mitigado |
| R-06 | Broker pode falhar após persistência | evento/job existentes reutilizados; limitação de ausência de outbox documentada; testes de queue passaram; CA-26 | aceito pela Spec; limitação conhecida |
| R-07 | Requisições autenticadas concorrentes podem renovar o mesmo refresh token | refresh client-side compartilhado, consulta inicial de unread idempotente e teste concorrente 4/4; 401 residual do middleware permanece registrado como warning | mitigado no client; warning externo |
| F-01 | PRD referenciado não está no checkout | usar milestone 41 e Contract da Spec; não alterar requisito sem amendment | não bloqueante, resolvido documentalmente |
| JI-05 | evidência automatizada de rotas ainda depende de Supabase local | fluxo manual autenticado real cobriu criação, histórico, detalhe e resposta; teste de cascata não usa mais `psql` local | encerrado pelo Judge Final |
| JI-06 | Judge anterior não executou auditoria efetiva de `ui-layer-rules.md` | lógica do layout movida para `useFeedbackLayout`; entry points explícitos e matriz completa em `evaluation.md` | encerrado pelo Judge Final |
| JI-07 | comparação Pencil/Web não comprovou fidelidade visual do diálogo/chat | três nodes capturados nos viewports canônicos, com screenshots e regra objetiva de 4 px em `evaluation.md` | encerrado pelo Judge Final |

### Judge Spec da revisão 2 — histórico

O Judge Spec independente da revisão 2 retornou `failed` com JS-01–JS-04.
JS-01 e JS-02 foram tratados no Contract, no código e na auditoria desta
revisão. JS-03 e JS-04 foram encerrados após o Judge Final, os gates locais e a
validação remota da migration pelo MCP Supabase Dev.

## Tentativas e encerramento

- **Tentativas de Judge Plan:** 2.
- **Última decisão:** segunda avaliação `accepted`; JP-01–JP-05 foram resolvidos
  e nenhum finding bloqueante permanece.
- **Encerramento:** o Plan foi concluído em F6 após o Judge Implementation Final
  independente aceitar a revisão 2 sem findings bloqueantes.

## Judge Plan

### Judge Plan Result

- **Verdict:** `accepted`
- **Plan:** `documentation/features/reporting/feedback-dialog-history/plan.md`
- **Spec:** `documentation/features/reporting/feedback-dialog-history/spec.md`
- **Spec revision:** 2

O primeiro veredito foi `failed` com JP-01–JP-05. Após as correções, a segunda
avaliação read-only foi `accepted`; nenhum Builder foi criado nesta task. O
Judge especializado não estava disponível como tipo invocável nesta sessão,
então foi usado um agente padrão com o protocolo do `judge-plan-agent`.

## Histórico do Judge Implementation Final

A Spec determinou julgamento `Final`; o primeiro aceite da revisão 2 foi
invalidado por uma correção posterior na View. A revalidação final foi
executada após o preflight no HEAD mais o diff do worktree e aceitou a
implementação inteira:

| Fase | Estado | Veredito | Evidência mínima |
| --- | --- | --- | --- |
| F1 | verified | accepted pelo Judge Final | `npm run test:core` 175 suites/636 testes; typecheck Core/Validation; check direcionado sem erros novos |
| F2 | verified | accepted pelo Judge Final | migration aplicada; assinatura, grants, join de usuário/avatar e cascatas confirmados no Supabase Dev; Server typecheck e adapter check passaram |
| F3 | verified | accepted pelo Judge Final | testes de controllers/queue e Server typecheck passaram; teste de cascata não depende de banco local |
| F4 | verified | accepted pelo Judge Final | ReportingService, deep link e safe nextRoute; Web typecheck passou |
| F5 | verified | accepted pelo Judge Final | widget tests, upload inicial por captura/arquivo com chave UUID, integração Web, auditoria estrutural e comparação dos três nodes Pencil/Web registradas |
| F6 | verified | accepted pelo Judge Final | browser autenticado confirmou histórico, detalhe, leitura e resposta; sensores e builds finais passaram; upload R2 real fica registrado como warning externo quando aplicável |

**Judge Implementation Final — 2026-08-11:** `accepted`, Spec revisão 3,
nenhum finding bloqueante; integração direcionada 6/6, sensores e builds finais
passaram. O Plan fica `completed` e pronto para handoff.

## Histórico de julgamento do Plan

| Tentativa | Veredito | Evidência | Findings |
| --- | --- | --- | --- |
| 1 | failed | paths, dependências, ownership documental e fixture manual insuficientes | JP-01–JP-05 |
| 2 | accepted | paths reais confirmados, paralelismo disjunto, `evaluation.md` criado e fixture Supabase Dev definido | nenhum bloqueante |
