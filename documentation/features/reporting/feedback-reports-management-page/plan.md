---
spec: ./spec.md
spec_revision: 5
status: completed
judge_plan: accepted
implementation_judgment_mode: final
last_updated_at: 2026-08-03
---

# Plan — Acompanhamento conversacional de feedbacks no Studio

## Objetivo

Transformar o gerenciamento administrativo de feedbacks em uma fila
conversacional completa: preservar e ordenar reportes, mostrar pendências de
leitura, abrir o histórico, responder com anexos, controlar `open`/`closed` e
persistir os efeitos assíncronos com segurança. A entrega inclui a fundação
  compartilhada de domínio, banco, API, e-mail, Discord, analytics e a
  experiência administrativa no Studio, conforme a Spec revisão 5.

## Escopo do Plan

- Core, Validation, storage, notification e contratos de broker.
- Migration aditiva com backfill, novas tabelas, índices e tipos
  gerados.
- Use cases, repositories, transação, controllers, rotas, autorização e testes
  de integração do Server.
- Outbox transacional, dispatcher, jobs de e-mail/Discord/analytics e adapter
  HTTP do Resend.
- ReportingService, rota/deep link, lista, summary, filtros, conversa,
  compositor, anexos, status, badge e estados operacionais do Studio.
- Alinhamento do Pencil, testes automatizados e validação autenticada
  no navegador e preflight final.

## Fora do escopo

- Interface de histórico, badge, detalhe, resposta ou deep link do usuário na
  Web; o backend compartilhado para a resposta do autor permanece incluído.
- Edição/exclusão de mensagens ou anexos, exclusão/arquivamento de reportes,
  atribuição, prioridade, tags, SLA, notas internas, auditoria separada,
  realtime e painel analítico novo.
- Estados diferentes de `open` e `closed`.
- Alteração da cascata de exclusão de conta para retenção/anonymização.

## Contratos e referências canônicas

Os IDs de requisitos e critérios abaixo são os da Spec revisão 3. Qualquer
alteração de assinatura, path, regra de negócio, garantia de retry ou contrato
visual exige amendment da Spec antes da tarefa afetada.

| Contrato | Referência | Evidência obrigatória |
| --- | --- | --- |
| Domínio, mensagens, anexos, leitura, status e outbox | RF-01, RF-04, RF-05, RF-10, RF-12 | testes de domínio, transação, repository e concorrência |
| Lista/detalhe/admin e resposta compartilhada | RF-02, RF-03, RF-04, RF-12 | testes de use case, rota e integração com Supabase local |
| Efeitos externos assíncronos | RF-06, RF-11, RF-12 | dispatcher, leases, idempotência, provider fake, jobs e Inngest |
| Studio e remoção da exclusão | RF-07, RF-08, RF-09 | testes de widget, busca estática, Pencil e Playwright autenticado |
| Segurança | RF-10 | auth/authz na borda e composição server-only |

## Referências de design e Pencil

Fonte visual canônica: `design/stardust.pen`.

| Node ID | Nome | Estado/viewport | Uso no Plan |
| --- | --- | --- | --- |
| `MVWsz` | `Studio — Relatórios de Feedback` | lista administrativa desktop (`1600x920`), com cabeçalho, resumo, filtros, tabela e paginação | F5-T3; RF-07, RF-09; CA-19, CA-20, CA-23 |
| `nbV72` | `Studio — Feedback Report Dialog` | dialog desktop aberto (`1100x800`), conversa, compositor, anexos e mutações | F5-T1/F5-T3; RF-04, RF-07, RF-08; CA-11, CA-21 |
| `aHFPL` | `Studio — Feedback Report Dialog — Closed` | dialog desktop fechado (`1100x800`), histórico somente leitura e reabertura | F5-T3; RF-05, RF-08; CA-22 |

`nbV72` deve ser alinhado de `Resposta enviada por e-mail` para `Resposta
enviada`. Os Node IDs, nomes, estados e viewports acima são preservados; não
criar novos Node IDs para loading, error, empty, busca sem resultado ou
responsividade. Esses estados serão derivados do mesmo sistema visual e
validados no navegador.

## Dependências e ordem das fases

**Modo de julgamento:** `Final`, por decisão explícita do usuário. Todas as
fases serão implementadas e integradas primeiro; somente depois será criado um
Judge Implementation Final read-only. RLS e benchmark foram retirados pela
Spec revisão 4 e não são gates da entrega.

| Fase | Objetivo | Depende de | Paralelizável |
| --- | --- | --- | --- |
| F1 | Fixar domínio, ports, DTOs e schemas compartilhados | — | Parcial: Validation pode avançar após os shapes do Core serem congelados |
| F2 | Implementar persistência, migration, mappers e storage | F1 | Não; schema, repositories e transação compartilham tabelas e tipos |
| F3 | Implementar use cases e superfície REST segura | F1, F2 | Não; rotas dependem da transação e da composição server-only |
| F4 | Publicar outbox e entregar e-mail, Discord e analytics | F3 | Parcial: template pode avançar após o port, mas jobs dependem dos eventos reais |
| F5 | Alinhar Pencil e implementar o Studio | F3, F4 | Parcial internamente, mas a fase só é aceita após F3 e F4; UI depende da API e do contrato assíncrono estabilizados |
| F6 | Testar integração, desempenho e fluxos reais | F2–F5 | Não; a evidência depende do diff integrado |
| F7 | Executar sensores, preflight e encerramento do Plan | F1–F6 | Não; exige evidência consolidada e o Judge Final |

Cada fase passa por `implementing` → `validating`; o aceite formal fica adiado
para o único Judge Implementation Final após F1–F7. Fases são implementadas
sequencialmente para preservar os contratos, sem Judges intermediários.

## F1 — Domínio, contratos compartilhados e validação

**Estado:** `validating`  
**Dependências:** nenhuma  
**Veredito do Judge Implementation:** `pending` (aceite formal adiado ao Judge Final)

### Tarefas

- [ ] **F1-T1 — Evoluir o agregado e criar o modelo conversacional**
  - **Estado:** `verified`
  - **Paths:** `packages/core/src/reporting/domain/entities/FeedbackReport.ts`,
    `packages/core/src/reporting/domain/entities/FeedbackMessage.ts` (novo),
    `packages/core/src/reporting/domain/structures/FeedbackReportStatus.ts`
    (novo), `packages/core/src/reporting/domain/structures/FeedbackMessageAuthorRole.ts`
    (novo).
  - **Refs:** RF-01, RF-04, RF-05, RF-10, RF-12; CA-01, CA-02, CA-09,
    CA-14, CA-15, CA-25, CA-29, CA-30, CA-34, CA-35.
  - **Resultado observável:** `FeedbackReport` preserva dados legados, título,
    status, atividade, leitura e métodos `close`, `reopen`, `markStudioRead` e
    registro de atividade; `FeedbackMessage` representa autor, texto, data e
    até três anexos; fechamento sem resposta administrativa anterior, resposta
    em reporte fechado e autoria inválida são rejeitados no domínio.
  - **Parallelizable:** `false`; os DTOs, requests e ports seguintes dependem
    das estruturas e invariantes deste agregado.

- [ ] **F1-T2 — Criar DTOs, requests e ports de reporting/notification**
  - **Estado:** `verified`
  - **Paths:** `packages/core/src/reporting/domain/entities/dtos/FeedbackReportDto.ts`,
    `packages/core/src/reporting/domain/entities/dtos/FeedbackMessageDto.ts`
    (novo), `FeedbackReportDetailsDto.ts` (novo), `FeedbackReportsPageDto.ts`
    (novo), `packages/core/src/reporting/domain/types/FeedbackReportsListingParams.ts`,
    `FeedbackConversationRequests.ts` (novo), `FeedbackOutboxEvent.ts` (novo),
    `packages/core/src/reporting/interfaces/FeedbackReportsRepository.ts`,
    `FeedbackMessagesRepository.ts` (novo), `FeedbackOutboxRepository.ts`
    (novo), `FeedbackConversationTransaction.ts` (novo),
    `packages/core/src/notification/interfaces/EmailProvider.ts` (novo),
    `packages/core/src/notification/interfaces/index.ts`,
    `packages/core/src/reporting/interfaces/ReportingService.ts`.
  - **Refs:** RF-01 a RF-06, RF-11 e RF-12; CA-03 a CA-07, CA-11 a CA-13,
    CA-17, CA-18, CA-27, CA-29, CA-31, CA-32.
  - **Resultado observável:** as assinaturas congeladas na Spec existem sem
    shapes de HTTP/Supabase no Core: repositories de reportes/mensagens/outbox,
    `FeedbackConversationTransaction`, `ReportingService`, `EmailProvider` e
    requests de lista, upload, mensagem, status, claim e persistência atômica.
    O contrato não mantém `remove` nem deleção administrativa.
  - **Parallelizable:** `true` após F1-T1; DTOs/types e interfaces não editam o
    mesmo conjunto lógico de arquivos, mas devem compartilhar a revisão das
    assinaturas antes de integração.

- [ ] **F1-T3 — Ampliar storage e broker sem vazar infraestrutura**
  - **Estado:** `verified`
  - **Paths:** `packages/core/src/storage/interfaces/FileStorageProvider.ts`,
    `packages/core/src/storage/domain/structures/FileStorageFolderPath.ts`,
    `packages/core/src/storage/types/FileStorageFolderPathValue.ts`,
    `packages/core/src/global/interfaces/Broker.ts`.
  - **Refs:** RF-04, RF-06, RF-10, RF-12; CA-10, CA-12, CA-17, CA-28,
    CA-32, CA-33.
  - **Resultado observável:** `getFileMetadata` e a pasta tipada de mensagens
    são adicionados sem remover o fluxo de screenshot; `Broker.publish` aceita
    event ID opcional; nenhum SDK, segredo ou shape de Resend/Inngest entra no
    Core.
  - **Parallelizable:** `true` com F1-T2 depois de definidos os types de anexo
    e outbox.

- [ ] **F1-T4 — Criar schemas compartilhados e fakers do domínio**
  - **Estado:** `verified`
  - **Paths:** `packages/validation/src/modules/reporting/schemas/feedbackReportsQuerySchema.ts`,
    `feedbackMessageSchema.ts`, `feedbackAttachmentUploadSchema.ts`,
    `feedbackReadSchema.ts`, `feedbackStatusSchema.ts`, os barrels de
    `packages/validation/src/modules/reporting/schemas/index.ts` e
    `packages/validation/src/modules/reporting/index.ts`, além dos fakers de
    reporting no Core.
  - **Refs:** RF-02, RF-03, RF-04, RF-05, RF-10, RF-12; CA-04, CA-07,
    CA-09, CA-10, CA-14, CA-16, CA-24, CA-28, CA-30, CA-35.
  - **Resultado observável:** query params, UUIDs, texto trimado de 1–2.000
    caracteres, anexos PNG/JPG de 1 byte–10 MB, snapshot de leitura e
    `status/expectedStatus` são rejeitados na borda com mensagens estáveis.
  - **Parallelizable:** `true` após F1-T2; depende apenas dos shapes públicos,
    não do banco.

### Evidências esperadas

- Testes unitários do agregado cobrindo status, snapshot monotônico, autoria,
  idempotência conceitual e anexos.
- Testes dos schemas para limites, trim, MIME/extensão, IDs e combinações de
  status.
- Verificação de que interfaces do Core não importam Server, Supabase, Resend ou
  Inngest.

### Riscos e próxima ação

- **Risco:** divergência entre shapes de Core, Validation e a revisão 3 da Spec.
  **Mitigação:** congelar as assinaturas da Spec antes de iniciar F2 e registrar
  qualquer alteração como finding/amendment.
- **Próxima ação:** integrar F1 ao restante da implementação; aceite formal será
  decidido somente pelo Judge Final.

## F2 — Migration, persistência, mappers e storage

**Estado:** `validating`  
**Dependências:** F1 aceita  
**Veredito do Judge Implementation:** `pending` (aceite formal adiado ao Judge Final)

### Tarefas

- [ ] **F2-T1 — Criar migration aditiva, backfill e índices**
  - **Estado:** `validating`
  - **Paths:** `apps/server/supabase/migrations/<timestamp>_create_feedback_conversations.sql` (novo),
    `apps/server/supabase/schemas/schema.sql`.
  - **Refs:** RF-01, RF-02, RF-03, RF-04, RF-06, RF-10, RF-12; CA-01,
    CA-02, CA-03, CA-04, CA-05, CA-07, CA-26, CA-33, CA-34.
  - **Resultado observável:** reportes legados recebem título/status/atividade
    sem perda; tabelas de mensagens, anexos e outbox têm checks, FKs `CASCADE`,
    índices da fila e função agregada `SECURITY INVOKER`; a cascata existente de
    exclusão de conta segue funcionando.
  - **Parallelizable:** `false`; todos os repositories e testes de F2 dependem
    do schema aplicado.

- [ ] **F2-T2 — Regenerar tipos e mappers explícitos**
  - **Estado:** `validating`
  - **Paths:** `apps/server/src/database/supabase/types/Database.ts`,
    `SupabaseFeedbackReport.ts`, `SupabaseFeedbackMessage.ts` (novo),
    `SupabaseFeedbackOutboxEvent.ts` (novo),
    `apps/server/src/database/supabase/mappers/reporting/SupabaseFeedbackReportMapper.ts`,
    `SupabaseFeedbackMessageMapper.ts` (novo), `SupabaseFeedbackOutboxMapper.ts`
    (novo).
  - **Refs:** RF-01, RF-02, RF-03, RF-04, RF-06; CA-01, CA-02, CA-05,
    CA-06, CA-12, CA-32, CA-34.
  - **Resultado observável:** DB rows são convertidos para domínio/DTOs sem
    shapes do Supabase no Core; o `console.log` do mapper legado é removido;
    os tipos refletem checks, estados, payload versionado e leases.
  - **Parallelizable:** `true` com F2-T3 depois de F2-T1, mas deve ser validado
    junto da migration e dos tipos gerados.

- [ ] **F2-T3 — Implementar repositories, RPC agregada e transação**
  - **Estado:** `validating`
  - **Paths:** `apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackReportsRepository.ts`,
    `SupabaseFeedbackMessagesRepository.ts` (novo),
    `SupabaseFeedbackOutboxRepository.ts` (novo),
    `SupabaseFeedbackConversationTransaction.ts` (novo),
    `apps/server/src/database/supabase/reportingSupabase.ts` (novo).
  - **Refs:** RF-01 a RF-06, RF-10 e RF-12; CA-02 a CA-07, CA-10 a CA-13,
    CA-15, CA-16, CA-26, CA-28 a CA-35.
  - **Resultado observável:** listagem agregada retorna itens leves, summary
    global e ordenação canônica sem N+1; detalhe retorna cronologia e snapshot;
    leitura avança somente até a mensagem conhecida; a transação grava
    mensagem/anexos/status/outbox atomicamente; claim usa lease e
    `FOR UPDATE SKIP LOCKED`; o acesso usa o adapter Supabase compartilhado com
    anon key.
  - **Parallelizable:** `false`; repositories, função SQL e transação precisam
    compartilhar a mesma semântica de concorrência e idempotência.

- [ ] **F2-T4 — Implementar metadata real e upload contextual**
  - **Estado:** `validating`
  - **Paths:** `apps/server/src/provision/storage/S3FileStorageProvider.ts`.
  - **Refs:** RF-04, RF-10, RF-12; CA-10, CA-11, CA-28, CA-30, CA-33.
  - **Resultado observável:** o provider consulta MIME/tamanho reais, valida
    ownership da pasta `images/feedback-messages/<reportId>/<messageId>` e não
    expõe SDK ou URLs assinadas fora do Server.
  - **Parallelizable:** `true` após F1-T3; integra com F3 antes de ser aceito.

- [ ] **F2-T5 — Criar fixtures e testes de migration/repository**
  - **Estado:** `validating`
  - **Paths:** `apps/server/src/tests/fixtures/ReportingFixture.ts`, novos
    testes em `apps/server/src/tests/routes/reporting/` para migration/FKs,
    listagem, detalhe, leitura, transação, concorrência e lifecycle de
    conta.
  - **Refs:** RF-01 a RF-04, RF-10, RF-12; CA-01 a CA-07, CA-10, CA-12,
    CA-26, CA-33, CA-34, CA-35.
  - **Resultado observável:** Supabase local prova backfill, cascatas e
    invariantes monotônicos/atômicos.
  - **Parallelizable:** `false`; os testes devem consumir a migration e os
    repositories reais, não mocks que escondam SQL/RLS.

### Evidências esperadas

- Migration aplicada em Supabase local, tipos regenerados e integração de
  repository passando.
- Testes de migration, repositories, transação e exclusão de conta sem violação
  de FK.

### Riscos e próxima ação

- **Risco:** uso acidental do client anon/JWT para reporting ou vazamento de
  credencial privilegiada. **Mitigação:** composição isolada em
  `reportingSupabase.ts`, auth/authz antes do adapter e teste de acesso direto.
  - **Risco:** duplicação ou perda entre persistência e Broker. **Mitigação:**
  publicação pós-save, chaves estáveis e jobs idempotentes básicos; a janela de
  perda é aceita porque a garantia transacional não é requisito.
- **Próxima ação:** aplicar F2-T1 e fazer o preflight do schema antes de iniciar
  a implementação REST.

## F3 — Use cases, controllers e API REST

**Estado:** `validating`  
**Dependências:** F1 e F2 aceitas  
**Veredito do Judge Implementation:** `pending`

### Tarefas

- [ ] **F3-T1 — Implementar use cases conversacionais e alterar o envio inicial**
  - **Estado:** `implementing`
  - **Paths:** `packages/core/src/reporting/use-cases/SendFeedbackReportUseCase.ts`,
    `ListFeedbackReportsUseCase.ts`, novos `GetFeedbackReportUseCase.ts`,
    `MarkFeedbackReportAsReadUseCase.ts`,
    `CreateFeedbackAttachmentUploadUrlUseCase.ts`,
    `SendFeedbackMessageUseCase.ts`, `ChangeFeedbackReportStatusUseCase.ts`,
    `DispatchFeedbackOutboxUseCase.ts`.
  - **Refs:** RF-01 a RF-06, RF-10 a RF-12; CA-01 a CA-18, CA-27 a CA-35.
  - **Resultado observável:** use cases criam value objects a partir de requests,
    derivam ator da sessão recebida pelo controller, aplicam ownership/status,
    bloqueiam e-mail canônico inválido antes da persistência, retornam
    resposta idempotente e não publicam broker dentro da transação.
  - **Parallelizable:** `false`; a orquestração é o ponto comum entre REST,
    transação e jobs.

- [ ] **F3-T2 — Expor e proteger os endpoints da Spec**
  - **Estado:** `implementing`
  - **Paths:** `apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts`,
    controllers existentes de `SendFeedbackReport` e `ListFeedbackReports`,
    novos `GetFeedbackReportController.ts`,
    `MarkFeedbackReportAsReadController.ts`,
    `CreateFeedbackAttachmentUploadUrlController.ts`,
    `SendFeedbackMessageController.ts`, `ChangeFeedbackReportStatusController.ts`,
    `DeleteFeedbackReportController.ts` (remover), o barrel de controllers, a
    composição de reporting no Server, `packages/core/src/reporting/use-cases/DeleteFeedbackReportUseCase.ts`
    (remover) e `apps/server/src/tests/routes/reporting/DeleteFeedbackReportRoute.test.ts`
    (remover).
  - **Refs:** RF-02 a RF-05, RF-09, RF-10, RF-12; CA-03 a CA-16,
    CA-23, CA-24, CA-28 a CA-30, CA-35.
  - **Resultado observável:** existem somente as rotas `POST`, `GET` lista,
    `GET` detalhe, `PUT` read, signed upload, `POST` message e `PATCH` status;
    `DELETE /reporting/feedback/:id` e seu controller/use case/repository
    desaparecem; god account, autor e status são validados na borda e erros
    `400/401/403/404/409` retornam contratos canônicos.
  - **Parallelizable:** `false`; todas as rotas precisam do mesmo middleware de
    auth, client server-only e mapeamento de erros.

  - **Inventário explícito da remoção legada:**
    `packages/core/src/reporting/use-cases/DeleteFeedbackReportUseCase.ts`,
    `packages/core/src/reporting/use-cases/tests/DeleteFeedbackReportUseCase.test.ts`,
    `packages/core/src/reporting/use-cases/index.ts`,
    `packages/core/src/reporting/interfaces/FeedbackReportsRepository.ts`
    (método `remove`), `packages/core/src/reporting/interfaces/ReportingService.ts`
    (método `deleteFeedbackReport`),
    `apps/server/src/rest/controllers/reporting/DeleteFeedbackReportController.ts`,
    `apps/server/src/rest/controllers/reporting/tests/DeleteFeedbackReportController.test.ts`,
    `apps/server/src/rest/controllers/reporting/index.ts`,
    `apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts`
    (registro `DELETE`),
    `apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackReportsRepository.ts`
    (método `remove`),
    `apps/studio/src/rest/services/ReportingService.ts`
    (método `deleteFeedbackReport`),
    `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/useFeedbackReportsPage.tsx`,
    `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/FeedbackReportsPageView.tsx`,
    `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/DeleteFeedbackReportDialog/index.tsx`,
    `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/DeleteFeedbackReportDialog/DeleteFeedbackReportDialogView.tsx`,
    `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/tests/DeleteFeedbackReportDialogView.test.tsx`,
    `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/tests/FeedbackReportsPageView.test.tsx`,
    `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/tests/useFeedbackReportsPage.test.ts`,
    `apps/server/rest-client/reporting/feedback-reports.rest`.
    A busca estática final deve cobrir esses paths e os símbolos
    `DeleteFeedbackReport`, `deleteFeedbackReport`, `reportToDelete` e
    `DELETE /reporting/feedback`.

- [ ] **F3-T3 — Cobrir auth/authz, rotas, idempotência e conflitos**
  - **Estado:** `implementing`
  - **Paths:** testes novos sob `apps/server/src/tests/routes/reporting/`,
    incluindo listagem, detalhe, read, signed upload, message, status, conta
    comum, god account, reporte fechado, retry e a busca estática de DELETE;
    atualizar `ReportingFixture.ts`.
  - **Refs:** RF-02 a RF-05, RF-09, RF-10, RF-12; CA-03 a CA-16,
    CA-23, CA-24, CA-28 a CA-30, CA-35.
  - **Resultado observável:** conta comum não enumera nem altera conversas
    administrativas; autor só responde ao próprio reporte aberto; retries não
    duplicam mensagem/anexos/outbox; conflito retorna estado canônico; nenhum
    contrato DELETE permanece.
  - **Parallelizable:** `false`; os testes compartilham o diretório de rotas,
    fixtures e a remoção legada inventariada em F3-T2. Só iniciam depois que
    F3-T2 estiver integrado, para que a aceitação da fase dependa do conjunto
    completo sem overlap entre Builders.

### Evidências esperadas

- Testes de rota reais sobre Supabase local, com respostas `2xx`/`4xx`/`409`
  verificadas por endpoint.
- Testes que provem ausência de deleção e preservação do rascunho em falha de
  upload/e-mail.
- Cobertura dos casos `CA-12`, `CA-13`, `CA-14`, `CA-16`, `CA-28` e `CA-35` sem
  depender apenas da UI.

### Riscos e próxima ação

- **Risco:** a primeira resposta administrativa fechar o reporte ou aceitar
  body com `authorId/role`. **Mitigação:** invariantes no domínio + controller
  derivando actor + testes de bypass direto.
- **Próxima ação:** finalizar F3-T1/T2 e executar a suíte de rotas antes de
  integrar os consumidores da outbox.

## F4 — Outbox, e-mail, Discord e analytics

**Estado:** `validating`  
**Dependências:** F3 aceita  
**Veredito do Judge Implementation:** `pending`

### Tarefas

- [ ] **F4-T1 — Criar template e provider de e-mail**
  - **Estado:** `implementing`
  - **Paths:** `packages/email/emails/FeedbackReportReplyTemplate.tsx`,
    `packages/email/emails/index.tsx`, `packages/email/package.json`,
    `apps/server/src/provision/email/resend/ResendEmailProvider.ts` (novo),
    `apps/server/src/constants/env.ts`, `apps/server/.env.example`.
  - **Refs:** RF-06, RF-10; CA-17, CA-18, CA-28, CA-32.
  - **Resultado observável:** template apresenta assunto, preview, CTA `Ver
    conversa`, fechamento quando aplicável e instrução para continuar no
    StarDust; adapter usa `Idempotency-Key`, mantém segredo/resposta do Resend
    internos e falha sem alterar a persistência.
  - **Parallelizable:** `true` após o port de F1; template pode ser desenvolvido
    independentemente, mas a integração do provider depende dos shapes finais.

- [ ] **F4-T2 — Implementar dispatcher, jobs e funções Inngest**
  - **Estado:** `implementing`
  - **Paths:** `apps/server/src/queue/jobs/reporting/DispatchFeedbackOutboxJob.ts`,
    `SendFeedbackReplyDiscordJob.ts`,
    `apps/server/src/queue/jobs/notification/SendFeedbackReportReplyEmailJob.ts`,
    barrels de notification, `apps/server/src/queue/inngest/InngestBroker.ts`,
    `inngest.ts`, `functions/NotificationFunctions.ts`,
    `functions/InngestFunctions.ts`, `functions/ReportingFunctions.ts` (novo),
    `apps/server/src/queue/inngest/functions/index.ts` (novo ou atualizado),
    `apps/server/src/app/hono/HonoApp.ts`.
  - **Refs:** RF-06, RF-11, RF-12; CA-12, CA-13, CA-17, CA-18, CA-27,
    CA-31, CA-32.
  - **Resultado observável:** dispatcher publica após commit com event ID
    determinístico, marca publicado somente após Promise resolvida, drena
    pendentes/leases expirados, aplica retry até a janela declarada e marca
    reconciliação após 23 h de resultado desconhecido; IO dos jobs ocorre em
    `amqp.run`; Discord é `at-least-once` e não duplica estado de negócio.
    `functions/index.ts` e `HonoApp.ts` compõem e registram as funções de
    reporting/notification no endpoint Inngest; um teste de assembly confirma
    que os jobs aparecem no conjunto servido.
  - **Parallelizable:** `false`; dispatcher, broker, consumers e lease têm um
    único contrato de idempotência.

- [ ] **F4-T3 — Reutilizar analytics e testar falhas externas**
  - **Estado:** `implementing`
  - **Paths:** integração com `AnalyticsFunctions.ts` e
    `TrackAnalyticsEventJob`, testes de jobs/provider/outbox sob
    `apps/server/src/tests/`.
  - **Refs:** RF-06, RF-11, RF-12; CA-17, CA-18, CA-27, CA-31, CA-32.
  - **Resultado observável:** fatos de resposta/fechamento/reabertura usam ID
    estável; falhas do PostHog, Resend, broker ou Discord não desfazem negócio;
    retries e respostas desconhecidas têm evidência de deduplicação/reconciliação.
  - **Parallelizable:** `true` com F4-T1, depois que os payloads de outbox de
    F3 estiverem disponíveis.

### Evidências esperadas

- Testes com provider/broker fake, relógio controlado, claim concorrente e
  retries.
- Snapshot do template e verificação de conteúdo sem promessa de entrega
  externa.
- Evidência de que logs não contêm conteúdo integral, credenciais ou URLs
  assinadas.

### Riscos e próxima ação

- **Risco:** declarar exactly-once além da janela de 24 h dos providers.
  **Mitigação:** manter event ID/idempotency key e transição explícita para
  `reconciliation_required` após 23 h.
- **Próxima ação:** executar testes de job com falha antes de liberar a UI que
  comunica `Resposta enviada`.

## F5 — Pencil e experiência administrativa no Studio

**Estado:** `validating`  
**Dependências:** F3 e F4 aceitas  
**Veredito do Judge Implementation:** `pending`

### Tarefas

- [ ] **F5-T1 — Alinhar o Pencil à decisão visual da Spec**
  - **Estado:** `validating`
  - **Paths:** `design/stardust.pen`.
  - **Refs:** `nbV72`; RF-04, RF-07, RF-08; CA-11, CA-18, CA-21.
  - **Resultado observável:** o node `nbV72` usa exatamente `Resposta enviada`,
    preservando composição, estados, variantes, node IDs e viewport
    `1100x800`; `MVWsz` e `aHFPL` continuam referências canônicas.
  - **Parallelizable:** `false` antes de F5-T3; a implementação da UI deve
    consultar o design alinhado.

- [ ] **F5-T2 — Atualizar service, rotas e deep link do Studio**
  - **Estado:** `validating`
  - **Paths:** `apps/studio/src/rest/services/ReportingService.ts`,
    `apps/studio/src/app/routes/FeedbackReportsRoute.tsx`,
    `apps/studio/src/app/routes.ts`, `apps/studio/src/constants/routes.ts`.
  - **Refs:** RF-02, RF-03, RF-04, RF-05, RF-08, RF-09; CA-06 a CA-08,
    CA-12, CA-15, CA-16, CA-21 a CA-23.
  - **Resultado observável:** service serializa os structures e implementa lista,
    detalhe, leitura, signed upload, mensagem e status; remove deleção; rota
    suporta `/reporting/feedback` e `/reporting/feedback/:feedbackReportId`,
    preservando destino após autenticação.
  - **Parallelizable:** `false` para aceitação da fase; pode ser preparado após
    F3, mas só integra e fecha depois de F4, para respeitar o contrato final de
    outbox/status e os efeitos assíncronos consumidos pelo Studio.

- [ ] **F5-T3 — Implementar página, summary, filtros, tabela e vazios**
  - **Estado:** `validating`
  - **Paths:** `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/index.tsx`,
    `FeedbackReportsPageView.tsx`, `useFeedbackReportsPage.tsx`,
    `FeedbackReportsTable/`, `FeedbackReportsSummary/` (novo),
    `FeedbackReportsFilters/` (novo), `FeedbackReportsEmptyState/` (novo).
  - **Refs:** `MVWsz`; RF-02, RF-07, RF-09; CA-03 a CA-05, CA-19, CA-20,
    CA-23, CA-24, CA-25.
  - **Resultado observável:** lista reproduz a composição desktop, usa URL para
    busca/filtros/paginação, exibe summary global, loading/error/empty/content,
    badge textual de não lido e nenhuma ação de excluir/arquivar; widgets
    seguem `index.tsx` + `*View.tsx` e hooks recebem dependências.
  - **Parallelizable:** `false` dentro da UI; tabela, summary, filtros e cache
    compartilham query keys, URL e estados operacionais.

- [ ] **F5-T4 — Implementar conversa, compositor, anexos, status e dialog**
  - **Estado:** `validating`
  - **Paths:** `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/FeedbackReportDialog/`,
    `FeedbackConversation/` (novo), `FeedbackMessageComposer/` (novo),
    `FeedbackAttachments/` (novo), `FeedbackStatusSelector/` (novo).
  - **Refs:** `nbV72`, `aHFPL`; RF-03 a RF-08; CA-06 a CA-18, CA-21,
    CA-22, CA-25, CA-28, CA-35.
  - **Resultado observável:** detalhe marca leitura somente após carregar,
    mantém snapshot, mostra cronologia/anexos, preserva rascunho em falhas,
    suporta upload de até três imagens, envio idempotente, fechamento/reabertura,
    estado fechado somente leitura, foco no título, Escape, retorno de foco,
    teclado e anúncios acessíveis.
  - **Parallelizable:** `false`; composer, status, upload e dialog precisam
    compartilhar o estado de mutações e os estados independentes da página.

- [ ] **F5-T5 — Atualizar Sidebar e remover o legado de exclusão**
  - **Estado:** `validating`
  - **Paths:** `apps/studio/src/ui/global/widgets/layouts/App/Sidebar/index.tsx`,
    `SidebarView.tsx`, `NavigationTitle/`,
    `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/DeleteFeedbackReportDialog/`
    e testes dedicados; tabela/dialog/handlers existentes que ainda exponham
    delete.
  - **Refs:** RF-07, RF-08, RF-09; CA-20, CA-22, CA-23.
  - **Resultado observável:** Sidebar mostra/oculta o badge global de não lidos;
    a UI não contém excluir/arquivar nem estado morto de deleção; não são
    removidos testes úteis de lista/conversa.
  - **Parallelizable:** `false`; deve seguir F5-T3 e F5-T4 porque remove os
    handlers, tabela/dialog e testes que essas tarefas alteram, além de exigir
    a query key e a invalidação finais.

- [ ] **F5-T6 — Cobrir widgets, acessibilidade e estados operacionais**
  - **Estado:** `validating`
  - **Paths:** testes unitários de hooks/Views em cada widget de reporting e
    testes de rota do Studio sob `apps/studio/src/app/tests/`.
  - **Refs:** RF-03, RF-04, RF-05, RF-07, RF-08, RF-09, RF-10; CA-08,
    CA-09, CA-14, CA-16, CA-19 a CA-25, CA-28, CA-35.
  - **Resultado observável:** estados vazios distintos, filtros inválidos com
    fallback, falha de leitura sem bloquear conversa, conflito restaurando
    estado canônico, conteúdo sem HTML executável e remoção estática do DELETE.
  - **Parallelizable:** `true` com F5-T3/T4 depois das props públicas estarem
    congeladas; não substitui a validação real do F6.

### Evidências esperadas

- Comparação dos nodes `MVWsz`, `nbV72` e `aHFPL` no Pencil com os componentes
  finais; divergências materiais viram finding/amendment.
- Testes de View/Hook/rota com estados loading, error, empty, no-results,
  content, closed, failed upload, failed read e conflict.
- Verificação de que todas as pastas novas têm `index.tsx` e `*View.tsx` e que
  nenhuma View acessa service/context diretamente.

### Riscos e próxima ação

- **Risco:** implementar estados não representados nos frames com layout
  divergente ou reintroduzir cor como único indicador. **Mitigação:** tokens/
  componentes existentes, referências canônicas e validação desktop/responsiva.
- **Risco:** afirmar entrega de e-mail no Studio. **Mitigação:** cópia fixa
  `Resposta enviada` e responsabilidade assíncrona explicitada na API.
- **Próxima ação:** alinhar `nbV72`, estabilizar o service e implementar a UI em
  Widget Pattern.

## F6 — Integração e validação manual

**Estado:** `in_progress`  
**Dependências:** F2, F3, F4 e F5 aceitas  
**Veredito do Judge Implementation:** `pending`

### Tarefas

- [ ] **F6-T1 — Executar integração completa do Server e Supabase**
  - **Estado:** `verified`
  - **Paths:** toda a suíte nova em `apps/server/src/tests/routes/reporting/`,
    migration/schema/types e jobs de reporting/notification.
  - **Refs:** RF-01 a RF-06, RF-10 a RF-12; CA-01 a CA-18, CA-24,
    CA-26 a CA-35.
  - **Resultado observável:** fluxo inicial → lista → detalhe → leitura →
    upload → resposta → fechamento → reabertura funciona com respostas
    canônicas, efeitos assíncronos recuperáveis e sem deleção.
  - **Parallelizable:** `false`; é a validação integrada das fases de backend.

- [ ] **F6-T2 — Retirar benchmark do fluxo por amendment da Spec**
  - **Estado:** `verified`
  - **Paths:** `spec.md`, `plan.md`, `evaluation.md`.
  - **Refs:** amendment da Spec revisão 4; CA-26 retirado.
  - **Resultado observável:** nenhum benchmark, P95, EXPLAIN ou dataset é gate
    da entrega; a implementação funcional continua coberta pelos testes reais.
  - **Parallelizable:** `false`; decisão documental já registrada.

- [ ] **F6-T3 — Validar visualmente o Studio e os fluxos reais no Playwright**
  - **Estado:** `blocked`
  - **Paths:** `apps/studio/src/` e os comandos/fixtures de Playwright existentes
    do Studio; nenhuma credencial deve ser gravada no repositório.
  - **Refs:** `MVWsz`, `nbV72`, `aHFPL`; RF-07, RF-08, RF-10; CA-06, CA-08,
    CA-11, CA-15, CA-19 a CA-25, CA-35.
  - **Resultado observável:** iniciar Server em `http://localhost:3334` e Studio
    na porta configurada; autenticar por `STUDIO_APP_E2E_EMAIL`/
    `STUDIO_APP_E2E_PASSWORD`, aguardar `/dashboard`, acessar `/profile/users`
    para confirmar sessão protegida e depois validar `/reporting/feedback` e o
    deep link. Registrar `console`, `pageerror`, `requestfailed` e `response`,
    confirmar `2xx` no login, `/auth/account`, lista, detalhe, read, upload,
    mensagem e transições bem-sucedidas; confirmar `409` nos cenários de
    conflito/status fechado previstos em CA-16 e CA-35, sem classificá-los como
    falha de transporte. Exercitar loading, error, empty, content, closed,
    unread, resposta, anexo, conflito e navegação.
  - **Parallelizable:** `false`; exige a implementação integrada do Studio e
    backend reais.

- [ ] **F6-T4 — Separar evidências visuais, runtime e automatizadas**
  - **Estado:** `verified`
  - **Paths:** `plan.md` para estado operacional e `evaluation.md` para
    evidências, decisões e lições.
  - **Refs:** RF-07, RF-08, RF-10; CA-19 a CA-25, CA-35.
  - **Resultado observável:** `evaluation.md` registra screenshot/inspeção
    Pencil, observação Playwright por viewport/estado, requests/respostas e
    comandos automatizados separadamente; não usar uma evidência para substituir
    outra.
  - **Parallelizable:** `true` com a coleta das evidências, mas só fecha após
    F6-T1–T3.

### Evidências esperadas

- Fluxo autenticado completo no Studio, não apenas a tela de login.
- Evidência separada de Pencil, runtime Playwright e testes automatizados.
- Logs sanitizados e resposta dos endpoints.

### Riscos e próxima ação

- **Risco:** declarar sucesso com mocks ou login sem rota protegida. **Mitigação:**
  seguir o fluxo real exigido pelos `AGENTS.md`, incluindo `/dashboard` e
  `/profile/users`, e então testar a feature.
- **Risco:** credenciais/URLs assinadas aparecerem em logs. **Mitigação:** usar
  somente variáveis locais e redigir evidências sanitizadas.
- **Próxima ação:** preparar os serviços locais após F5 e executar o fluxo
  autenticado completo.

## F7 — Sensores, preflight e handoff

**Estado:** `in_progress`  
**Dependências:** F1–F6 aceitas  
**Veredito do Judge Implementation:** `pending`

### Tarefas

- [ ] **F7-T1 — Executar sensores obrigatórios e aplicáveis**
  - **Estado:** `verified`
  - **Paths:** repositório inteiro e artefatos da feature.
  - **Refs:** RF-01 a RF-12; CA-01 a CA-35.
  - **Resultado observável:** executar `npm run check:code`, `npm run check:types`,
    `npm run test:unit`, além de `npm run check:architecture`, integração,
    format e sensores específicos das Rules aplicáveis; registrar comando,
    commit/estado e saída resumida em `evaluation.md`.
  - **Parallelizable:** `false`; o preflight deve representar o mesmo diff
    avaliado.

- [ ] **F7-T2 — Consolidar evidências do diff integrado antes do Judge Final**
  - **Estado:** `verified`
  - **Paths:** `plan.md`, `evaluation.md` e o diff da fase julgada.
  - **Refs:** RF-01 a RF-12; CA-01 a CA-35.
  - **Resultado observável:** sensores, estado das fases, findings supersedidos
    e amendment da Spec ficam consolidados; nenhum Judge intermediário é criado.
  - **Parallelizable:** `false`; depende do diff integrado.

- [ ] **F7-T3 — Submeter o diff integrado ao Judge Implementation Final**
  - **Estado:** `verified_with_finding`
  - **Paths:** `plan.md`, `evaluation.md` e o diff integrado do HEAD avaliado.
  - **Refs:** RF-01 a RF-12; CA-01 a CA-25 e CA-27 a CA-35.
  - **Resultado observável:** o Judge Implementation Final read-only confirma
    coerência entre fases, sensores, preflight, Spec revisão 4 e ausência de
    findings bloqueantes; somente `accepted` libera o handoff.
  - **Parallelizable:** `false`; depende de F1–F7-T2 e do diff consolidado.

- [ ] **F7-T4 — Preparar handoff para conclusão da Spec**
  - **Estado:** `blocked`
  - **Paths:** `documentation/features/reporting/feedback-reports-management-page/plan.md`,
    `evaluation.md` e a Spec somente se amendment for necessário.
  - **Refs:** todos os RF/CA aplicáveis.
  - **Resultado observável:** Plan aceito, findings operacionais encerrados,
    evidências completas em `evaluation.md`, estado da Spec ainda `open` até o
    fluxo de conclusão e próxima ação claramente registrada para `conclude-spec`.
    Inclui o gate `RG-01`: a CTA `Ver conversa` permanece desabilitada no
    rollout até que o responsável de release registre em `evaluation.md` a URL
    canônica real da rota Web, a flag/controle de rollout
    `FEEDBACK_REPORT_REPLY_CTA_ENABLED` e uma navegação autenticada bem-sucedida
    nessa URL; sem esses três registros, nenhum ambiente de produção habilita
    a CTA.
  - **Parallelizable:** `false`; é o handoff oficial da execução.

### Evidências esperadas

- Sensores verdes no HEAD avaliado, findings supersedidos ou resolvidos e um
  único veredito final.
- `evaluation.md` atualizado com evidências reais, não apenas intenção.

## Riscos ativos e decisões operacionais

| ID | Risco/decisão | Mitigação/ação | Estado |
| --- | --- | --- | --- |
| R-01 | acesso de reporting pode atravessar a borda | client isolado server-only; auth/authz antes da composição | ativo |
| R-02 | perda/duplicação entre commit e broker | publicação pós-save, chaves estáveis e jobs idempotentes básicos; janela de perda aceita | aceito |
| R-03 | leitura consumir mensagens concorrentes | `latestUserMessageId` + avanço monotônico até snapshot | resolvido na Spec; validar |
| R-04 | resposta inicial fechar o reporte | exigir resposta admin anterior à operação corrente | resolvido na Spec; validar |
| R-05 | upload parcial ou MIME forjado | signed upload contextual + metadata real antes da transação | ativo |
| R-06 | UI afirmar entrega externa | cópia `Resposta enviada` e e-mail assíncrono | resolvido na Spec; validar |
| R-07 | CTA de e-mail apontar para Web ainda não entregue | gate RG-01: URL canônica registrada, `FEEDBACK_REPORT_REPLY_CTA_ENABLED` controlada pelo release owner e navegação autenticada comprovada antes de habilitar produção | ativo |
| R-08 | benchmark removido da entrega | amendment da Spec revisão 4 | resolvido |

## Findings ativos

Nenhum finding bloqueante está ativo após o amendment da Spec revisão 4. Os
findings históricos
`JS-01`–`JS-10` e `RS-01`–`RS-04` estão registrados como resolvidos no
`evaluation.md`; qualquer divergência encontrada durante implementação deve ser
adicionada aqui imediatamente, com fase responsável, tentativa e próxima ação.

## Tentativas, estado e próxima ação

- **Tentativas de Judge Plan:** 3 (as duas primeiras falharam; JP-01 a JP-07 e
  JP-08 a JP-11 foram corrigidos nesta revisão).
- **Tentativas de implementação:** 1, retomada no estado parcial existente de
  F1.
- **Estado do Plan:** `blocked`, modo `Final` escolhido por decisão do usuário;
  os Judges foram chamados somente após as fases de implementação.
- **Estado das fases:** F1–F5 implementadas e em validação integrada; F6 em
  implementação; F7 `pending`.
- **Próxima ação:** formalizar o amendment do Contract sobre a remoção da
  outbox/transação, separar o diff pretendido em um HEAD limpo e repetir o
  Judge Implementation Final. A validação autenticada do Studio foi concluída
  em 2026-08-06 e está registrada em `evaluation.md`.

## Amendment corrente — revisão 5 e supersession do Plan histórico

A Spec revisão 5 removeu todos os requisitos de outbox, transação de conversa,
claim/lease, dispatcher e publicação pós-commit. As seções e tarefas históricas
abaixo que mencionam esses elementos são registros de planejamento das revisões
anteriores e não são requisitos ativos nem gates de conclusão.

Para a revisão 5, o Plan vigente é: persistir diretamente mensagem, anexos e
status pelos repositories/RPCs existentes; publicar os eventos no Broker após o
save; usar chaves estáveis para idempotência básica; validar auth/authz na borda
e manter composição server-only. Os critérios de aceitação e sensores correntes
devem ser lidos da Spec revisão 5 e da matriz corrente em `evaluation.md`.

### Ledger corrente da revisão 5

- F1–F6: `accepted` pelo Judge Final funcional da revisão 5.
- F7-T1/T2: `verified`; sensores e evidências correntes estão registrados em
  `evaluation.md`.
- F7-T3: `accepted` quanto aos critérios funcionais na revisão 5.
- F7-T4: `completed`; handoff encerrado conforme o fluxo vigente de conclusão.
- RG-01 permanece gate de rollout e não impede o fechamento técnico.

## Amendment histórico — simplificação de entrega assíncrona

- Persistência de mensagens e status usa repositories/RPCs diretos.
- O Broker recebe o evento somente após a persistência bem-sucedida.
- E-mail, Discord e analytics continuam assíncronos, com deduplicação básica
  por chaves estáveis nos jobs.
- A outbox, o dispatcher, o claim/lease e a transação de conversa foram
  retirados do escopo; a tabela legada é removida pela migration de cleanup.

## Judge Plan

- **Veredito:** `accepted` na terceira avaliação, após correção de JP-08 a
  JP-11.
- **Judge:** `judge-plan-agent`
- **Escopo do julgamento:** rastreabilidade RF/CA, dependências entre Core,
  Validation, Database, Server, Queue, Email e Studio; completude de paths,
  design/Pencil, sensores, Playwright autenticado, riscos e handoff.
- **Findings:**
  - `JP-01`: F5-T5 tinha overlap com F5-T3/F5-T4; corrigido para sequencial.
  - `JP-02`: dependência F5 e F5-T2 eram contraditórias; corrigidas para F3+F4.
  - `JP-03`: inventário DELETE incompleto; inventário explícito e busca estática adicionados.
  - `JP-04`: assembly Inngest incompleto; `functions/index.ts` e `HonoApp.ts` adicionados.
  - `JP-05`: benchmark indeterminado; path versionado, runner, dataset e SQL definidos.
  - `JP-06`: sucesso `2xx` confundido com conflitos `409`; expectativas separadas.
  - `JP-07`: gate de rollout da CTA Web sem critério; RG-01, URL, flag e evidência autenticada adicionados.
  - `JP-08`: Judge Implementation Final não estava explícito; F7-T3 foi criado
    para o diff integrado.
  - `JP-09`: F3-T3 sobrepunha o diretório de testes de F3-T2; tornou-se
    sequencial e dependente da integração de F3-T2.
  - `JP-10`: total divergente de tarefas; evaluation e Plan foram alinhados em
    29 tarefas.
  - `JP-11`: caminho canônico do artefato/rota foi explicitado no Plan e na
    Spec vigente.

## Histórico de Judges e avaliação final

As fases e decisões abaixo são históricas; não representam tarefas pendentes
da revisão 5 quando contradizem o ledger corrente acima.

| Fase | Veredito | Findings | Próxima ação |
| --- | --- | --- | --- |
| F1 | histórico accepted | — | reavaliar no Judge Final após amendment |
| F2 | em implementação integrada | JI-11..JI-13 supersedidos pela revisão 4 | concluir integração |
| F3 | pending | — | implementar após F2 |
| F4 | pending | — | implementar após F3 |
| F5 | pending | — | implementar após F3/F4 |
| F6 | pending | — | implementar após F2–F5 |
| F7 | pending | — | sensores e Judge Final |

## Conclusão do Plan

- Estado: `completed`.
- Revisão encerrada: Spec revisão 5.
- F1–F7 aceitas no Judge Final funcional; referências pendentes na tabela acima
  são somente histórico das revisões anteriores.
