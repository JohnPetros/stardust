---
title: Acompanhamento conversacional de feedbacks no Studio
status: open
revision: 4
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/issues/518
  - type: prd
    ref: documentation/features/reporting/feedback-reports-management/prd.md
scope:
  - packages/core/src/reporting
  - packages/core/src/storage
  - packages/core/src/global/interfaces/Broker.ts
  - packages/core/src/notification
  - packages/validation/src/modules/reporting
  - packages/validation/src/modules/storage
  - apps/server/supabase/migrations
  - apps/server/supabase/schemas
  - apps/server/src/database/supabase
  - apps/server/src/constants
  - apps/server/src/app/hono/routers/reporting
  - apps/server/src/rest/controllers/reporting
  - apps/server/src/provision
  - apps/server/src/queue
  - apps/server/src/rest/services
  - apps/server/src/tests
  - apps/server/.env.example
  - packages/email
  - apps/studio/src/rest/services/ReportingService.ts
  - apps/studio/src/ui/reporting
  - apps/studio/src/ui/global/widgets/layouts/App/Sidebar
  - apps/studio/src/app/routes
  - apps/studio/src/constants/routes.ts
  - design/stardust.pen
last_updated_at: 2026-08-03
---

## Amendment — revisão 4

Por decisão explícita de implementação, esta revisão remove RLS/grants como
requisito da entrega e retira o benchmark de desempenho autenticado do
contrato. A proteção permanece na autenticação/autorização da API e na
composição server-only dos adapters de reporting. Os critérios CA-26 e CA-33
relativos a RLS/benchmark deixam de ser gates desta revisão; testes funcionais
de migration, transação, idempotência e concorrência continuam obrigatórios.

# Acompanhamento conversacional de feedbacks no Studio

## Contexto e objetivo

A área administrativa de feedbacks já lista, abre e exclui relatos, porém trata
cada item como um registro isolado. A entrega transforma essa área em uma fila
conversacional: administradores localizam reportes, priorizam respostas novas do
usuário, consultam o histórico, respondem com imagens e controlam o ciclo
`Aberto`/`Fechado` sem apagar dados.

A Spec também cria a fundação compartilhada de domínio, persistência e API para
conversas de feedback. A experiência de histórico e resposta do participante
usuário na Web continua pertencendo à demanda posterior documentada em
`documentation/issues/user-feedback-history-conversations.md`.

Esta é uma Spec completa. O escopo atravessa Core, Validation, Database, Server,
Queue, Email, REST e Studio, inclui migration e integração externa assíncrona e
deve ser implementado por um Plan faseado.

## Fontes, precedência e decisões de interpretação

- A issue #518 e o PRD local são fontes complementares. A issue delimita a
  entrega administrativa; o PRD detalha UX, confiabilidade e métricas.
- Os specs históricos em
  `documentation/features/reporting/feedback-reports-management/specs/` descrevem
  a implementação atual. O fluxo de exclusão neles documentado é legado e fica
  explicitamente supersedido por esta revisão.
- Os frames Pencil `MVWsz`, `nbV72` e `aHFPL` são a referência visual da lista e
  dos dialogs aberto/fechado. A cópia `Resposta enviada por e-mail` do frame
  `nbV72` conflita com as fontes de produto, que proíbem afirmar entrega externa.
  Prevalece `Resposta enviada`; o Pencil deve ser alinhado durante a implementação.
- O título automático segue a fundação compartilhada já delimitada para a
  contraparte Web: até 60 caracteres, derivado do relato original no limite de
  palavra sempre que possível. Ele não é editável nesta entrega.

## Referências de design e Pencil

A fonte visual canônica do frontend desta entrega é
`design/stardust.pen`. As referências devem ser inspecionadas diretamente no
Pencil e preservadas pelo Plan e pela implementação:

| Node ID | Nome no Pencil | Estado/viewport representado | Contract relacionado |
|---|---|---|---|
| `MVWsz` | `Studio — Relatórios de Feedback` | lista administrativa desktop (`1600x920`), incluindo cabeçalho, resumo, filtros, tabela e paginação | RF-07 e RF-09; CA-19, CA-20 e CA-23 |
| `nbV72` | `Studio — Feedback Report Dialog` | dialog desktop aberto (`1100x800`), conversa, compositor, anexos e mutações | RF-04, RF-07 e RF-08; CA-11 e CA-21 |
| `aHFPL` | `Studio — Feedback Report Dialog — Closed` | dialog desktop fechado (`1100x800`), histórico somente leitura e reabertura | RF-05 e RF-08; CA-22 |

Os nodes canônicos não representam isoladamente loading, error, empty, busca
sem resultado nem os viewports responsivos. Esses estados continuam obrigatórios
pelos RF/CA e pelas Rules de UI; devem ser derivados do mesmo sistema visual e
validados no navegador, sem inventar novos Node IDs nesta Spec.

### Divergências e precedência visual

| Referência | Divergência | Precedência e decisão | Alinhamento esperado |
|---|---|---|---|
| `nbV72` | usa a cópia `Resposta enviada por e-mail`, que afirma entrega externa antes da confirmação do provider | PRD, RF-04 e fronteira assíncrona prevalecem | alterar o node para `Resposta enviada` durante a implementação |
| Nodes desktop | não cobrem todos os estados operacionais e responsivos exigidos | RF-07, RF-08, CA aplicáveis e Rules de UI complementam o design | implementar e validar loading/error/empty/content, acessibilidade e responsividade sem contrariar a composição canônica |

Qualquer nova divergência material ou troca de arquivo/Node ID exige amendment
da Spec antes da implementação afetada.

## Pesquisa e síntese

| Seção | Evidência consolidada |
|---|---|
| Mapeamento | O fluxo atual atravessa `FeedbackRouter`, controllers REST, use cases e repositories de reporting, `ReportingService` e widgets do Studio. `FeedbackReport`, `FeedbackReportsRepository`, `ReportingService`, `FileStorageProvider` e `Broker` são contratos existentes; mensagens, outbox e provider de e-mail são novos. |
| Fluxo de dados | Hoje o Web envia o relato ao Server, que persiste em `feedback_reports` e publica diretamente no Inngest; o Studio lista e exclui via REST. A mudança persiste conversa e outbox atomicamente, publica efeitos após commit e faz Studio/consumidores consultarem o estado canônico pela API. |
| Atenção | Os pontos críticos são ownership derivado da sessão, autorização god na borda, concorrência de leitura/status, claim concorrente da outbox, validação do objeto armazenado, limites de idempotência dos providers e composição server-only. |
| Lacunas resolvidas | Não existe provider de e-mail, adapter Resend nem modelo conversacional. Esses elementos são `novo arquivo` ou alterações explicitadas no inventário técnico; nenhum SDK externo atravessa para o Core. RLS e benchmark foram retirados pela revisão 4. |

### Fluxo multi-app e fronteiras

| Produtor | Consumidor | Transporte | Contrato e ownership |
|---|---|---|---|
| Studio | Server | REST JSON sobre `/reporting/feedback/**` | sessão fornece `accountId` e god account; body nunca fornece autor ou papel |
| Web/backend compartilhado | Server | mesmo POST de mensagens | sessão fornece o autor; Server valida que o reporte pertence à conta e está aberto |
| Use case de mensagem/status | PostgreSQL | repository/transaction port | mensagem, anexos, status e outbox compartilham a mesma transação |
| Dispatcher de outbox | Inngest | `Broker.publish(event, eventId)` | `eventId` determinístico por tipo + fato; aceite resolve a Promise e permite marcar a outbox publicada |
| Job de e-mail de `notification` | Resend | `EmailProvider.sendFeedbackReportReplyEmail` implementado por HTTP | request tipado do Core; segredo, headers e resposta do vendor ficam no adapter |
| Job de Discord/analytics | adapters existentes | service/provider via `amqp.run` | conteúdo mínimo, IDs estáveis e falha externa sem rollback do negócio |

Evidência oficial confirma que Resend e Inngest deduplicam por chave/event ID por
24 horas. Portanto, essa janela não é tratada como garantia permanente: resultado
de envio desconhecido que ultrapasse 23 horas vai para reconciliação e não é
reenviado automaticamente. A decisão evita prometer exactly-once além do que os
providers oferecem.

## Escopo

### Incluído

- Evolução do agregado `FeedbackReport`, criação de `FeedbackMessage` e contratos
  de anexos, status, leitura, listagem, detalhe, resposta e transição.
- Migration aditiva e backfill dos reportes existentes, novas tabelas de
  mensagens/anexos e índices da fila administrativa.
- Endpoints administrativos autenticados e autorizados para god account.
- Resposta administrativa com texto obrigatório, anexos, proteção contra retry e
  fechamento opcional na mesma operação.
- E-mail assíncrono ao usuário depois da persistência da resposta.
- Endpoint compartilhado de mensagens e notificação resumida no Discord quando
  o autor do reporte responde, sem implementar a interface Web.
- Nova lista e dialogs do Studio conforme Pencil, incluindo deep link, estados
  de carregamento/erro/vazio e acessibilidade.
- Remoção do contrato de exclusão da borda administrativa e da interface.
- Eventos analíticos agregáveis para resposta administrativa, fechamento e
  reabertura.

### Fora do escopo

- Histórico, badge, detalhe, resposta e deep link do usuário na aplicação Web.
- Listagem, badge, detalhe, leitura, compositor e deep link do participante
  usuário na Web; esta entrega expõe apenas o contrato de backend necessário
  para persistir sua resposta.
- Edição ou exclusão de mensagens e anexos.
- Exclusão ou arquivamento de reportes.
- Atribuição, prioridade, tags, SLA, notas internas ou log de auditoria separado.
- Estados além de `Aberto` e `Fechado`.
- Painel analítico novo e tela de acompanhamento da entrega de e-mail.
- Realtime; a atualização do MVP ocorre por consulta e invalidação de cache.

## Contract

### Requisitos funcionais

#### RF-01 — Modelo conversacional e persistência

`FeedbackReport` deve preservar o relato original e passar a expor título
automático, status, datas de criação/atividade, instante da última resposta do
usuário e instante da última leitura pelo Studio. O próprio domínio deve aplicar
as regras de fechamento e reabertura.

`FeedbackMessage` deve representar uma resposta vinculada ao reporte, com ID,
papel do autor (`user` ou `admin`), ID do autor, texto, data e até três anexos. O
relato inicial continua em `feedback_reports`; não deve ser duplicado como
mensagem.

A migration deve:

- adicionar a `feedback_reports` título de até 60 caracteres, status com default
  `open`, `last_activity_at`, `last_user_message_at` e `studio_read_at`;
- derivar o título e a atividade dos registros existentes sem perder conteúdo,
  screenshot, autor, intent ou data;
- criar `feedback_messages` com PK UUID fornecida pelo client, FK
  `report_id -> feedback_reports.id ON DELETE CASCADE`, papel `user|admin`,
  `author_id`, texto entre 1 e 2.000 caracteres depois de `trim` e `created_at`;
- criar `feedback_message_attachments` com PK UUID, FK
  `message_id -> feedback_messages.id ON DELETE CASCADE`, storage key única,
  nome, MIME `image/png|image/jpeg`, tamanho entre 1 byte e 10 MB e posição entre
  zero e dois, única por mensagem;
- criar `feedback_outbox_events` com PK UUID, `event_key` única por tipo + fato,
  `report_id -> feedback_reports.id ON DELETE CASCADE`, payload versionado,
  estados `pending|claimed|published|reconciliation_required`, `attempts_count`,
  `available_at`, lease (`claimed_at`, `claim_expires_at`), `published_at`,
  `last_error_code` sanitizado e timestamps;
- manter a semântica existente de exclusão de conta:
  `feedback_reports.user_id -> users.id ON DELETE CASCADE`; mensagens, anexos e
  eventos de outbox vinculados ao reporte também usam `ON DELETE CASCADE`, para
  que o novo grafo não bloqueie o lifecycle atual. A preservação de histórico
  vale enquanto a conta/reporte existem; nenhum endpoint de reporting pode
  iniciar essa exclusão. Anonimização ou retenção após exclusão de conta exige
  demanda própria do domínio de Profile;
- manter a autorização na borda da API e usar um client server-only para os
  adapters de reporting; nenhum segredo chega ao Core, Studio ou Web;
- criar a função agregada de listagem como `SECURITY INVOKER`, chamada somente
  pelos adapters do Server;
- criar índices compostos para `(status, last_activity_at desc, id desc)`,
  `(last_user_message_at, studio_read_at)`, `user_id`,
  `(report_id, created_at, id)`, `(message_id, position)` e
  `(status, available_at, claim_expires_at)` da outbox;
- atualizar tipos gerados, tipos locais, mappers, DTOs, fakers e repositories
  sem expor shapes do Supabase ao Core.

O estado `Não lido` do Studio é derivado quando `last_user_message_at` existe e é
posterior a `studio_read_at`. Várias mensagens novas no mesmo reporte continuam
representando uma única pendência.

#### RF-02 — Listagem administrativa

`ListFeedbackReportsUseCase.execute(params)` deve retornar uma paginação de itens
leves acompanhada de `summary: { total, open, closed, unread }`. Cada item contém
ID, autor (avatar e e-mail), intent, status, `lastActivityAt`, preview, número de
respostas e `isUnread`; o corpo completo da conversa não faz parte da consulta.

A listagem aceita busca case-insensitive por ID completo/parcial ou e-mail,
filtros combináveis de intent, status e período de criação, página e itens por
página. A ordem canônica é `isUnread DESC`, `last_activity_at DESC`, `id DESC`.
Os quatro contadores são globais à fila e não mudam com os filtros da tabela.

O endpoint permanece `GET /reporting/feedback`, exige autenticação e god account
e valida todos os query params na borda.

#### RF-03 — Detalhe e leitura administrativa

`GetFeedbackReportUseCase.execute(feedbackReportId)` deve retornar
`FeedbackReportDetailsDto` com metadados, relato original, screenshot, conversa e
anexos em ordem cronológica crescente. Um ID inexistente retorna erro de domínio
mapeado para `404`.

O detalhe retorna `latestUserMessageId`. O Studio envia esse snapshot no body de
`PUT /reporting/feedback/:feedbackReportId/read` como
`lastSeenUserMessageId`. `MarkFeedbackReportAsReadUseCase` valida que a mensagem
existe, pertence ao reporte e foi escrita pelo usuário, então avança
`studio_read_at` monotonicamente até o `createdAt` dessa mensagem — nunca até o
estado mais recente do banco. Repetir o mesmo alvo é no-op e uma mensagem criada
depois do snapshot permanece não lida. Uma falha de leitura não torna o detalhe
indisponível e mantém `isUnread: true` até nova tentativa.

#### RF-04 — Resposta administrativa e anexos

`POST /reporting/feedback/:feedbackReportId/messages` exige autenticação e
recebe:

- `messageId` UUID criado uma vez pelo cliente e reutilizado em retries;
- `content` com 1 a 2.000 caracteres depois de `trim`, sem aceitar apenas espaços;
- zero a três descritores de anexos já enviados;
- `targetStatus: closed` opcional para responder e fechar atomicamente.

A borda deriva `authorId` e o papel do ator da sessão. God account produz uma
resposta administrativa; uma conta comum só pode responder ao próprio reporte
aberto e produz resposta de usuário. O client nunca envia papel nem autor.

Cada anexo deve ser PNG ou JPG, possuir no máximo 10 MB e registrar storage key,
nome original, MIME type e tamanho. O Studio valida antes do upload; o Server
repete quantidade, extensão, MIME, tamanho e ownership do prefixo e consulta os
metadados reais do objeto antes de persistir a mensagem. Todos os uploads devem
terminar antes do POST. Falha em upload ou validação não cria mensagem parcial e
preserva o rascunho no cliente.

O fluxo de URL assinada usa
`POST /reporting/feedback/:feedbackReportId/messages/:messageId/attachments/signed-upload-url`,
reservando a pasta
`images/feedback-messages/<feedbackReportId>/<messageId>/`. A borda deriva a
conta da sessão, valida god account ou ownership do reporte, aceita somente nome
final UUID com `.png`/`.jpg` e não reutiliza o endpoint genérico sem contexto de
reporting. Uma tentativa repetida com o mesmo `messageId` retorna a mensagem já
persistida sem duplicar mensagem, anexos, atividade, analytics ou notificação.

Tanto usuário quanto administrador só podem criar mensagem enquanto o reporte
estiver `open`. Um administrador deve reabrir antes de responder a um reporte
fechado; o Server revalida o status dentro da transação e retorna `409` sem
persistir mensagem, anexo ou outbox se houver fechamento concorrente.

Antes de aceitar uma resposta administrativa, o Server valida o e-mail canônico
do autor do reporte com `Email`. E-mail ausente ou inválido rejeita a operação
antes da persistência com erro operacional explícito; o Studio preserva o
rascunho.

Mensagem, anexos, `targetStatus` e registros da outbox devem ser persistidos na
mesma transação. A resposta HTTP só confirma persistência e retorna mensagem e
estado canônico atualizados; o Studio exibe `Resposta enviada`, nunca confirmação
de entrega do e-mail.

#### RF-05 — Ciclo Aberto/Fechado

Todo reporte novo ou migrado inicia `open`. Apenas god account pode alterar o
status. `FeedbackReport.close()` só é válido quando já existia ao menos uma
resposta administrativa antes da operação corrente. A primeira resposta não pode
fechar o reporte na mesma transação; `FeedbackReport.reopen()` preserva todo o
histórico.

`PATCH /reporting/feedback/:feedbackReportId/status` recebe `status` e
`expectedStatus`. Em concorrência, uma divergência retorna `409` com o estado
canônico para a UI restaurar e solicitar revisão. Mudança isolada de status não
envia e-mail. Reabertura é imediata e não exige dialog de confirmação.

#### RF-06 — E-mail assíncrono da resposta

Na mesma transação da mensagem administrativa, o caso de uso grava um evento de
outbox estável contendo IDs do reporte e da mensagem, destinatário, preview
curto, URL da conversa e indicação de fechamento. A outbox é a fronteira durável:
o commit não depende do broker e um crash entre commit e publicação não perde o
efeito.

`packages/email` deve expor um template transacional com assunto identificável,
preview curto e CTA `Ver conversa` para a rota reservada da Web. O texto orienta
o usuário a continuar no StarDust e não a responder ao e-mail.

Um dispatcher tenta publicar a outbox logo após o commit e um job agendado drena
registros pendentes ou com lease expirado. O claim deve ser atômico com
`FOR UPDATE SKIP LOCKED`, possuir expiração e impedir que dois dispatchers
processem simultaneamente o mesmo registro. O broker recebe um event ID derivado
da chave única da outbox; só depois de a Promise de publicação resolver o registro
é marcado como publicado. Falha antes da publicação mantém o registro disponível;
falha depois da aceitação e antes da marcação pode republicar o mesmo event ID,
deduplicado pelo Inngest dentro da janela oficial de 24 horas.

O job de e-mail permanece agnóstico do Inngest, executa a entrega dentro de
`amqp.run`, usa a mensagem como chave de idempotência e propaga falha para retry.
O provider fica atrás de um port do Core e de um adapter REST do Server. Falha ou
atraso do provider não desfaz mensagem/status e não altera o sucesso comunicado
pelo Studio. O consumidor repassa a mesma chave ao provider de e-mail. O adapter
usa o header `Idempotency-Key`; como o Resend retém a chave por 24 horas, retries
automáticos terminam em até 23 horas desde a primeira tentativa. Um resultado
desconhecido que exceda esse limite muda para `reconciliation_required`, gera
telemetria sem conteúdo sensível e não é reenviado automaticamente. O port
retorna `void`; identificadores e respostas específicos do Resend não atravessam
para o Core.

#### RF-07 — Lista no Studio

A rota `Feedbacks` deve reproduzir a composição do frame `MVWsz`: cabeçalho,
resumo, busca, filtros, tabela e paginação. A tabela mostra ID, avatar/e-mail,
intent, status, atividade, preview, quantidade de respostas, indicador textual
de não lido e ação `Ver`; não oferece excluir ou arquivar.

O item `Feedbacks` da Sidebar mostra o total de reportes não lidos e oculta o
badge em zero. Busca/filtros/paginação ficam na URL, combinações inválidas usam
fallback seguro e uma nova consulta mantém os critérios em falha. A página
distingue carregamento, erro, `Nenhum feedback recebido` e `Nenhum resultado para
estes filtros`, com ação para limpar filtros no último estado.

Em largura reduzida, a tabela pode rolar horizontalmente, mantendo ID, autor,
status, não lido e ação acessíveis. Cabeçalhos, filtros, badges e mudanças
assíncronas possuem nomes/announcements acessíveis e não dependem só de cor.

#### RF-08 — Dialog, deep link e mutações no Studio

`/reporting/feedback/:feedbackReportId` é o deep link administrativo canônico.
Depois de autenticação, o retorno preserva esse destino. Abrir pela tabela ou URL
carrega o detalhe antes de marcar leitura e move o foco para o título do dialog.

O estado aberto segue `nbV72`: conversa rolável, relato original diferenciado,
autor/data/anexos por mensagem, compositor, anexos selecionados e seletor de
status. O estado fechado segue `aHFPL`: histórico preservado, compositor
substituído por aviso somente leitura e orientação de reabertura.

O dialog suporta Escape, retorno de foco, navegação por teclado, erro localizado
de anexo, fallback de avatar e estados independentes de carregamento, envio,
upload, leitura e status. Falhas preservam texto/anexos e desabilitam somente a
ação afetada. Após sucesso, queries da lista, resumo, badge e detalhe são
atualizadas sem reload integral.

#### RF-09 — Remoção da exclusão administrativa

Devem ser removidos `DeleteFeedbackReportUseCase`, `remove` do repository,
controller/rota DELETE, método do `ReportingService`, dialogs, botões, handlers e
testes cujo único contrato seja excluir. `DELETE /reporting/feedback/:id` deixa
de existir e nenhuma nova borda permite arquivamento ou deleção.

#### RF-10 — Segurança, confiabilidade e desempenho

Somente god accounts podem listar todos os reportes, consultar detalhe
administrativo, marcar leitura, enviar resposta administrativa e mudar status. O
autor autenticado pode apenas responder ao próprio reporte aberto conforme
RF-12. Identidade/papel do autor são derivados da sessão na borda e nunca aceitos
do body. Texto é tratado como não confiável e renderizado como texto, sem HTML
executável.

IDs e storage keys devem ser validados contra o reporte e a conta autorizada.
Mutações são idempotentes ou protegidas por precondição. Respostas e status
persistidos sobrevivem a falhas de e-mail. Logs não contêm conteúdo integral,
credenciais, URLs assinadas nem dados sensíveis de anexos.

Com volume representativo do MVP e índices aplicados, listagem e detalhe devem
entregar resposta útil em até 2 segundos no percentil 95; e-mail fica fora desse
tempo por ser assíncrono.

#### RF-11 — Eventos de produto

Os fatos `feedback admin message sent`, `feedback report closed` e `feedback
report reopened` devem ser publicados somente depois da persistência e rastreados
pela infraestrutura existente de analytics. Cada fato usa ID estável como
idempotency/`$insert_id`; falha do PostHog nunca bloqueia a ação principal.

Os dados persistidos e eventos devem permitir calcular tempo até a primeira
resposta administrativa e reportes fechados após interação sem criar uma tabela
de auditoria administrativa.

#### RF-12 — Resposta do usuário e Discord

Uma conta autenticada autora do reporte pode usar o endpoint compartilhado de
mensagens para responder somente enquanto o status for `open`, com as mesmas
regras de texto, anexos, storage, idempotência e atomicidade de RF-04. Essa
operação atualiza `last_user_message_at`/`last_activity_at`, torna o reporte não
lido para o Studio e grava o evento de Discord na outbox. `targetStatus` é
proibido para o autor do reporte. Nenhuma UI Web é criada.

O job de Discord é agnóstico do Inngest e executa IO dentro de `amqp.run`. A
notificação contém ID do reporte, identificação do usuário, preview curto,
indicação de anexos e deep link do Studio; não contém conteúdo integral nem os
arquivos. O event ID usa a mensagem como referência e reduz ingestões duplicadas
na janela do Inngest, mas o webhook do Discord não oferece idempotency key. A
entrega é explicitamente `at-least-once`: falha ou resposta HTTP desconhecida é
recuperada pela outbox/retry e pode produzir aviso duplicado. Todo aviso carrega
o mesmo ID de reporte/mensagem para reconhecimento operacional; duplicação nunca
duplica mensagem, atividade ou estado não lido.

### Critérios de aceitação

| CA | RF | Dado | Quando | Então | Evidência esperada |
|---|---|---|---|---|---|
| CA-01 | RF-01 | banco com reportes legados | a migration é aplicada | conteúdo, screenshot, autor, intent e data são preservados; título/status/atividade recebem backfill válido | teste de migration e integração de repository |
| CA-34 | RF-01 | conta com reporte, mensagens, anexos e outbox vinculados | o lifecycle existente exclui a conta | o grafo de reporting é removido por cascata sem violação de FK; nenhuma rota de reporting oferece essa exclusão | teste de migration/FKs integrado ao fluxo de exclusão de conta |
| CA-02 | RF-01 | reporte com três respostas novas do usuário | leitura administrativa está ausente ou anterior | o reporte é não lido uma única vez e a cronologia contém as três mensagens | testes de domínio, repository e rota |
| CA-03 | RF-02 | fila com lidos, não lidos e atividades distintas | a listagem é consultada | não lidos vêm primeiro e cada grupo usa atividade/ID decrescentes | teste unitário e integração de rota |
| CA-04 | RF-02 | busca parcial por ID ou e-mail e filtros combinados | a consulta é executada | somente itens compatíveis são retornados, com paginação e summary global corretos | teste de rota com Supabase local |
| CA-05 | RF-02 | listagem com conversas extensas | a primeira página é carregada | itens trazem preview e contagem, sem corpos/anexos completos das mensagens | teste de contrato e inspeção da query |
| CA-06 | RF-03 | god account e reporte existente | o detalhe é aberto | relato e mensagens/anexos aparecem em ordem cronológica com metadados completos | teste de use case, rota e browser |
| CA-07 | RF-03 | detalhe retornou `latestUserMessageId` e outra mensagem chega depois | o Studio marca `lastSeenUserMessageId` como lido duas vezes | só o snapshot conhecido avança `studio_read_at`; a mensagem posterior continua não lida e a repetição é no-op | teste unitário e integração concorrente |
| CA-08 | RF-03 | detalhe disponível e falha na marcação | o Studio abre o dialog | a conversa permanece utilizável e o indicador continua não lido com retry possível | teste de hook/view e browser |
| CA-09 | RF-04 | texto vazio, acima de 2.000 ou apenas espaços | o admin tenta enviar | client e server rejeitam sem apagar o rascunho | testes de schema, use case e widget |
| CA-10 | RF-04 | quarto anexo, formato diferente, MIME divergente ou arquivo acima de 10 MB | upload/finalização é tentado | a ação é rejeitada, identifica o arquivo e nenhuma mensagem parcial é criada | testes de schema, storage e rota |
| CA-11 | RF-04 | mensagem válida com até três imagens | uploads e persistência concluem | uma mensagem/anexos são criados e conversa/atividade/lista são atualizadas | integração de rota e browser autenticado |
| CA-12 | RF-04 | mesmo `messageId` reenviado por timeout/duplo clique | o POST é repetido | a resposta canônica é retornada sem duplicar dados, evento ou e-mail | teste de integração e job |
| CA-13 | RF-04 | reporte já possui resposta administrativa anterior e uma nova resposta usa `targetStatus: closed` | a operação conclui | mensagem e fechamento são atômicos e o evento de e-mail informa o fechamento | teste transacional de use case/rota |
| CA-35 | RF-04 | reporte fechado e god account tenta enviar mensagem diretamente pela API | o POST é executado sem reabertura | a rota retorna `409` e não persiste mensagem, anexo, atividade ou outbox | teste de domínio, transação e rota sem depender da UI |
| CA-14 | RF-05 | reporte sem resposta administrativa anterior | fechamento isolado ou junto da primeira resposta é solicitado | domínio e rota rejeitam atomicamente; UI desabilita a opção e explica o motivo | testes de domínio, rota e view |
| CA-15 | RF-05 | reporte respondido e aberto | god account fecha e depois reabre | status, contadores e lista mudam sem perder histórico/anexos e sem dialog extra | testes de integração e browser |
| CA-16 | RF-05 | status alterado por outra sessão | uma mutação usa `expectedStatus` obsoleto | a rota retorna `409` com estado canônico e a UI o restaura | teste de rota e hook |
| CA-17 | RF-06 | mensagem administrativa persistida | o provider de e-mail falha | resposta/status permanecem salvos e o job entra em retry sem sucesso enganoso no Studio | teste de job e integração |
| CA-18 | RF-06 | resposta e fechamento atômicos | o template é renderizado | assunto, preview, CTA e indicação de fechamento aparecem uma vez, sem incentivar reply | snapshot/teste do template e job |
| CA-32 | RF-06 | commit da mensagem ocorre e a publicação falha antes/depois da aceitação do broker ou o resultado do provider é desconhecido | dispatcher imediato, drenagem agendada e consumidor executam | lease evita processamento concorrente; event ID e idempotency key deduplicam retries dentro de 24 horas; após 23 horas de resultado desconhecido o efeito vai para reconciliação sem reenvio automático | teste transacional concorrente, relógio fake, dispatcher, consumidor, provider fake e integração Inngest |
| CA-19 | RF-07 | lista sem dados ou filtros sem resultado | a consulta termina | os dois estados vazios são distintos e limpar filtros só aparece no segundo | teste de view e browser |
| CA-20 | RF-07 | total não lido muda de um para zero | leitura é confirmada | linha, summary e Sidebar atualizam e o badge é ocultado | teste de hook e browser |
| CA-21 | RF-08 | deep link protegido válido | login é concluído | o Studio retorna ao mesmo reporte, abre o dialog e posiciona foco no título | Playwright autenticado |
| CA-22 | RF-08 | reporte fechado | o dialog é aberto | histórico fica legível, compositor está bloqueado e reabertura permanece disponível | teste de view e Playwright |
| CA-23 | RF-09 | cliente tenta a rota DELETE e administrador usa a página | os fluxos são exercitados | API não expõe deleção e UI não contém excluir/arquivar | teste de rota, busca estática e browser |
| CA-24 | RF-10 | conta comum autenticada | consulta ou mutação administrativa é tentada | a borda rejeita sem revelar dados da conversa | testes de rota para todos os endpoints |
| CA-33 | RF-10 | usuário não autorizado tenta acessar ou alterar reporting pela API | autenticação, autorização god, ownership e rotas são exercitados | acesso é rejeitado na borda; adapters server-only não vazam para Core/Studio/Web | testes de rotas autenticadas e autorização |
| CA-25 | RF-10 | mensagem contendo markup/script | o dialog renderiza | conteúdo aparece como texto e nenhum script é executado | teste de view e browser |
| CA-26 | — | critério retirado pela revisão 4 | não aplicável | não é gate desta entrega | amendment da Spec revisão 4 |
| CA-27 | RF-11 | retry de evento analítico | o mesmo fato é processado novamente | o ID estável impede duplicação e falha de analytics não afeta o negócio | teste do job de analytics |
| CA-28 | RF-04 | autor do reporte não possui e-mail canônico válido | god account tenta responder | a operação falha antes de persistir, explica o bloqueio e preserva o rascunho | testes de use case, rota e hook |
| CA-29 | RF-12 | autor autenticado responde ao próprio reporte aberto | a mensagem é persistida | atividade/não lido são atualizados e a outbox produz uma notificação resumida do Discord | teste de ownership, rota, outbox e job |
| CA-30 | RF-12 | conta não autora ou reporte fechado | resposta de usuário é tentada | o Server rejeita sem persistir mensagem, anexos ou evento | testes de rota e persistência |
| CA-31 | RF-12 | Discord falha, aceita com resposta perdida ou o job é repetido | retry/outbox processam a mensagem | resposta e não lido permanecem únicos; a entrega `at-least-once` pode repetir o aviso com o mesmo ID de reporte/mensagem, sem duplicar dados de negócio | teste de job com resposta desconhecida e integração da outbox |

## Estado atual

- `FeedbackReport` contém apenas conteúdo, screenshot, intent, autor e `sentAt`;
  não há status, título ou comportamento conversacional.
- `FeedbackReportsRepository` oferece `add`, `findById`, `findMany` e `remove`.
- `GET /reporting/feedback` filtra por nome do autor, intent e período, mas não
  busca ID/e-mail, não retorna summary/não lido e ordena apenas por criação.
- `DELETE /reporting/feedback/:feedbackId` está ativo para god account.
- A tabela `feedback_reports` não possui mensagens, anexos ou leitura. O mapper
  atual ainda registra rows em `console.log`, o que deve ser removido.
- `feedback_reports` usa autorização na API e composição server-only nos
  adapters de reporting; RLS não faz parte da revisão 4.
- O Studio usa `usePaginatedFetch`, abre um dialog somente com relato/screenshot
  e oferece exclusão na tabela e no dialog.
- O storage assinado já suporta screenshots, mas a pasta aceita formatos além do
  Contract e não verifica tamanho/MIME real para anexos de mensagem.
- O job existente envia o relato inicial ao Discord. Não há template nem adapter
  de e-mail transacional para respostas administrativas.
- Analytics já possui o pipeline evento → Inngest → PostHog com `$insert_id`, que
  deve ser reutilizado.

## Solução técnica

### Inventário técnico por camada

Todo path abaixo existe, salvo quando marcado como `novo arquivo`. Nomes de
arquivos novos fazem parte da solução; ajustes exigem amendment antes do Builder.

| Camada | Path e estado | Responsabilidade / shape | Dependências e referência |
|---|---|---|---|
| Core/domain | `packages/core/src/reporting/domain/entities/FeedbackReport.ts` — existente, modificar | adicionar título, status, atividade/leitura e métodos `close`, `reopen`, `markStudioRead`, `registerMessage` | abstracts/structures globais; entidade atual |
| Core/domain | `packages/core/src/reporting/domain/entities/FeedbackMessage.ts` — novo arquivo | entidade com ID, reporte, papel/ID do autor, texto, data e anexos | padrão de entity do Core; `FeedbackReport.ts` |
| Core/domain | `packages/core/src/reporting/domain/structures/FeedbackReportStatus.ts` e `packages/core/src/reporting/domain/structures/FeedbackMessageAuthorRole.ts` — novos arquivos | encapsular enums `open|closed` e `user|admin` | `packages/core/src/reporting/domain/structures/FeedbackIntent.ts` — existente |
| Core/DTOs | `packages/core/src/reporting/domain/entities/dtos/FeedbackReportDto.ts` — existente, modificar; `packages/core/src/reporting/domain/entities/dtos/FeedbackMessageDto.ts`, `packages/core/src/reporting/domain/entities/dtos/FeedbackReportDetailsDto.ts`, `packages/core/src/reporting/domain/entities/dtos/FeedbackReportsPageDto.ts` — novos arquivos | shapes primitivos de lista, detalhe, mensagem, summary e anexos | DTOs/fakers de reporting existentes |
| Core/types | `packages/core/src/reporting/domain/types/FeedbackReportsListingParams.ts` — existente, modificar; `packages/core/src/reporting/domain/types/FeedbackConversationRequests.ts` e `packages/core/src/reporting/domain/types/FeedbackOutboxEvent.ts` — novos arquivos | requests/responses tipados dos contratos abaixo, sem shapes de HTTP/Supabase | structures globais `Id`, `Text`, `OrdinalNumber`, `Period` |
| Core/repositories | `packages/core/src/reporting/interfaces/FeedbackReportsRepository.ts` — existente, modificar; `packages/core/src/reporting/interfaces/FeedbackMessagesRepository.ts`, `packages/core/src/reporting/interfaces/FeedbackOutboxRepository.ts`, `packages/core/src/reporting/interfaces/FeedbackConversationTransaction.ts` — novos arquivos | consultas canônicas, persistência da cronologia, claim da outbox e transação atômica | repositories de reporting/conversation existentes |
| Core/notification provider | `packages/core/src/notification/interfaces/EmailProvider.ts` — novo arquivo; `packages/core/src/notification/interfaces/index.ts` — existente, modificar | port de notificação por e-mail com `sendFeedbackReportReplyEmail(request): Promise<void>` | `packages/core/src/notification/interfaces/NotificationService.ts` — existente — demonstra ownership de notificações e precedente de dependência em evento de reporting; adapter Resend somente no Server |
| Core/service | `packages/core/src/reporting/interfaces/ReportingService.ts` — existente, modificar | manter envio inicial; substituir lista/deleção pelos métodos administrativos e compartilhados abaixo | `RestClient`/`RestResponse`; factory atual do Studio |
| Core/use cases | `packages/core/src/reporting/use-cases/SendFeedbackReportUseCase.ts` e `packages/core/src/reporting/use-cases/ListFeedbackReportsUseCase.ts` — existentes, modificar; `packages/core/src/reporting/use-cases/GetFeedbackReportUseCase.ts`, `packages/core/src/reporting/use-cases/MarkFeedbackReportAsReadUseCase.ts`, `packages/core/src/reporting/use-cases/CreateFeedbackAttachmentUploadUrlUseCase.ts`, `packages/core/src/reporting/use-cases/SendFeedbackMessageUseCase.ts`, `packages/core/src/reporting/use-cases/ChangeFeedbackReportStatusUseCase.ts`, `packages/core/src/reporting/use-cases/DispatchFeedbackOutboxUseCase.ts` — novos arquivos | executar criação inicial transacional, lista, detalhe, snapshot de leitura, signed upload com ownership, mensagem, transição e publicação pós-commit | use cases atuais; regras permanecem no domínio quando dependem só do agregado |
| Core/storage | `packages/core/src/storage/interfaces/FileStorageProvider.ts`, `packages/core/src/storage/domain/structures/FileStorageFolderPath.ts` e `packages/core/src/storage/types/FileStorageFolderPathValue.ts` — existentes, modificar | acrescentar metadata real e pasta tipada `images/feedback-messages/<reportId>/<messageId>` sem remover métodos existentes | `S3FileStorageProvider` e fluxo de screenshot existentes |
| Core/queue | `packages/core/src/global/interfaces/Broker.ts` — existente, modificar | aceitar event ID opcional sem expor Inngest | `InngestBroker.ts` existente |
| Validation | `packages/validation/src/modules/reporting/schemas/feedbackReportsQuerySchema.ts`, `packages/validation/src/modules/reporting/schemas/feedbackMessageSchema.ts`, `packages/validation/src/modules/reporting/schemas/feedbackAttachmentUploadSchema.ts`, `packages/validation/src/modules/reporting/schemas/feedbackReadSchema.ts`, `packages/validation/src/modules/reporting/schemas/feedbackStatusSchema.ts` — novos arquivos; `packages/validation/src/modules/reporting/schemas/index.ts` e `packages/validation/src/modules/reporting/index.ts` — existentes, modificar | queries, UUID, texto/anexos, signed upload contextual, snapshot e status/expectedStatus | schemas globais e schemas atuais de reporting/storage |
| Database/migration | `apps/server/supabase/migrations/<timestamp>_create_feedback_conversations.sql` — novo arquivo | backfill, tabelas, checks, FKs, índices, função de listagem e outbox | migration `20260716121000_create_challenge_code_executions.sql`; schema vigente |
| Database/schema | `apps/server/supabase/schemas/schema.sql` e `apps/server/src/database/supabase/types/Database.ts` — existentes, modificar | refletir schema e tipos regenerados | fluxo `db:types` do Server |
| Database/types/mappers | `apps/server/src/database/supabase/types/SupabaseFeedbackReport.ts` e `apps/server/src/database/supabase/mappers/reporting/SupabaseFeedbackReportMapper.ts` — existentes, modificar; `apps/server/src/database/supabase/types/SupabaseFeedbackMessage.ts`, `apps/server/src/database/supabase/types/SupabaseFeedbackOutboxEvent.ts`, `apps/server/src/database/supabase/mappers/reporting/SupabaseFeedbackMessageMapper.ts`, `apps/server/src/database/supabase/mappers/reporting/SupabaseFeedbackOutboxMapper.ts` — novos arquivos | mapear DB ↔ domínio e remover `console.log` | mapper atual de reporting e mappers de conversation |
| Database/repositories | `apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackReportsRepository.ts` — existente, modificar; `apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackMessagesRepository.ts`, `apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackOutboxRepository.ts`, `apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackConversationTransaction.ts` — novos arquivos | implementar contratos, RPC agregada, cronologia, claim e transação | `apps/server/src/database/supabase/repositories/SupabaseRepository.ts` — existente; repositories atuais de reporting/conversation |
| Database/composição | `apps/server/src/database/supabase/reportingSupabase.ts` — novo arquivo; `apps/server/src/constants/env.ts` e `apps/server/.env.example` — existentes, modificar | adapter server-only sobre o client Supabase compartilhado com anon key | criação de client em `apps/server/src/app/hono/HonoApp.ts` — existente |
| Server/routes | `apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts` — existente, modificar | registrar GET lista/detalhe, PUT read, signed upload contextual, POST message e PATCH status; remover DELETE | auth/god/validation/storage composition atuais |
| Server/controllers | `apps/server/src/rest/controllers/reporting/SendFeedbackReportController.ts` e `apps/server/src/rest/controllers/reporting/ListFeedbackReportsController.ts` — existentes, modificar; `apps/server/src/rest/controllers/reporting/GetFeedbackReportController.ts`, `apps/server/src/rest/controllers/reporting/MarkFeedbackReportAsReadController.ts`, `apps/server/src/rest/controllers/reporting/CreateFeedbackAttachmentUploadUrlController.ts`, `apps/server/src/rest/controllers/reporting/SendFeedbackMessageController.ts`, `apps/server/src/rest/controllers/reporting/ChangeFeedbackReportStatusController.ts` — novos arquivos; `apps/server/src/rest/controllers/reporting/DeleteFeedbackReportController.ts` — existente, remover | traduzir HTTP ↔ requests dos use cases e status `200|201|204|400|403|404|409` | controllers atuais e `HonoHttp` |
| Server/integration tests | `apps/server/src/tests/fixtures/ReportingFixture.ts` — existente, modificar; `apps/server/src/tests/routes/reporting/DeleteFeedbackReportRoute.test.ts` — existente, remover; arquivos de lista, detalhe, leitura, signed upload, mensagem, status e lifecycle sob `apps/server/src/tests/routes/reporting/` — novos arquivos | proteger rotas reais, auth/authz, migration/FKs, transações e concorrência com Supabase local | `HonoFixture`, `SupabaseFixture`, `AuthFixture` e padrão atual de route tests |
| Server/storage | `apps/server/src/provision/storage/S3FileStorageProvider.ts` — existente, modificar | implementar leitura de metadata do R2/S3 sem expor SDK | provider atual e `FileStorageProvider` |
| Server/e-mail | `apps/server/src/provision/email/resend/ResendEmailProvider.ts` — novo arquivo | implementar `EmailProvider` de `@stardust/core/notification/interfaces` via `RestClient`, mapear erro para `AppError`, enviar `Idempotency-Key` e manter segredo/resposta do vendor internos | providers existentes; `AxiosRestClient`; documentação oficial Resend |
| Queue/outbox | `apps/server/src/queue/jobs/reporting/DispatchFeedbackOutboxJob.ts` e `apps/server/src/queue/jobs/reporting/SendFeedbackReplyDiscordJob.ts` — novos arquivos; `apps/server/src/queue/jobs/notification/SendFeedbackReportReplyEmailJob.ts` — novo arquivo; barrel de notification — existente, modificar | dispatcher/Discord permanecem em reporting; entrega de e-mail pertence a notification; jobs agnósticos com IO dentro de `amqp.run`, retry/reconciliação | jobs existentes de notification/analytics |
| Queue/Inngest | `apps/server/src/queue/inngest/InngestBroker.ts`, `apps/server/src/queue/inngest/inngest.ts`, `apps/server/src/queue/inngest/functions/NotificationFunctions.ts` e `apps/server/src/queue/inngest/functions/InngestFunctions.ts` — existentes, modificar; `apps/server/src/queue/inngest/functions/ReportingFunctions.ts` — novo arquivo | transportar `event.id`; ReportingFunctions compõe dispatcher/Discord; NotificationFunctions compõe `SendFeedbackReportReplyEmailJob` e `ResendEmailProvider`; registrar funções/cron nos barrels | `apps/server/src/queue/inngest/functions/AnalyticsFunctions.ts` — existente |
| Email/template | `packages/email/emails/FeedbackReportReplyTemplate.tsx` e `packages/email/emails/index.tsx` — novos arquivos; `packages/email/package.json` — existente, modificar | assunto/preview/HTML/texto, CTA e export público sem confirmação de entrega | templates `ConfirmSignUpTemplate.tsx` e componentes existentes |
| Studio/REST | `apps/studio/src/rest/services/ReportingService.ts` — existente, modificar | implementar integralmente `ReportingService`, serializando structures na chamada HTTP | factory atual; regras REST |
| Studio/route | `apps/studio/src/app/routes/FeedbackReportsRoute.tsx`, `apps/studio/src/app/routes.ts` e `apps/studio/src/constants/routes.ts` — existentes, modificar | suportar lista e deep link `/reporting/feedback/:feedbackReportId` | rota atual e React Router v7 |
| Studio/page | `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/index.tsx`, `FeedbackReportsPageView.tsx`, `useFeedbackReportsPage.tsx` — existentes, modificar | Entry Point resolve services/cache; Hook controla URL/queries/mutações; View compõe estados | Widget Pattern e página atual |
| Studio/widgets existentes | `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/FeedbackReportsTable/` e `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/FeedbackReportDialog/` — existentes, modificar | evoluir tabela e dialog sem concentrar estado/renderização | widgets atuais de reporting e Shadcn/Radix |
| Studio/widgets novos | `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/FeedbackReportsSummary/`, `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/FeedbackReportsFilters/`, `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/FeedbackConversation/`, `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/FeedbackMessageComposer/`, `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/FeedbackAttachments/`, `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/FeedbackStatusSelector/`, `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/FeedbackReportsEmptyState/` — novos arquivos (`index.tsx` + `*View.tsx`, Hook quando houver estado) | dividir summary, filtros, cronologia, compositor, anexos, status e vazios; hooks recebem dependências | Widget Pattern e Rules da UI |
| Studio/remoção | `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/DeleteFeedbackReportDialog/` e testes dedicados — existentes, remover; tabela/dialog atuais — existentes, modificar | eliminar ação/estado de exclusão sem remover testes úteis de outros comportamentos | fluxo legado atual |
| Studio/sidebar | `apps/studio/src/ui/global/widgets/layouts/App/Sidebar/index.tsx`, `apps/studio/src/ui/global/widgets/layouts/App/Sidebar/SidebarView.tsx` e `apps/studio/src/ui/global/widgets/layouts/App/Sidebar/NavigationTitle/` — existentes, modificar | consultar/exibir badge não lido e ocultar zero, mantendo View pura | Sidebar atual e TanStack Query |
| Design | `design/stardust.pen` — existente, modificar | alinhar `nbV72` para `Resposta enviada`; preservar `MVWsz`, `nbV72`, `aHFPL` como referência | frames Pencil citados pelo PRD/Issue |

Os diretórios de widgets na tabela não autorizam renderização concentrada: cada
widget criado deve possuir Entry Point `index.tsx`, View `*View.tsx` e Hook quando
houver estado, seguindo as Rules da UI.

### Domínio e contratos

- Evoluir `FeedbackReport` com estruturas tipadas para status/título e métodos de
  negócio `close`, `reopen`, `markStudioRead` e atualização de atividade.
- Criar `FeedbackMessage`, DTOs de item/detalhe/anexo, fakers e erros de domínio
  para não encontrado, fechamento inválido, reporte fechado e conflito.
- Separar `FeedbackReportsRepository` e `FeedbackMessagesRepository`; operações
  atômicas de resposta/fechamento devem passar por um port transacional explícito
  em vez de acoplar o Core ao Supabase.
- Criar port/repository de outbox e fazer mensagens, anexos, status e eventos
  duráveis compartilharem a mesma transação.
- Ampliar `ReportingService` com lista, detalhe, leitura, mensagem e status e
  remover deleção. Services recebem objetos de domínio e serializam apenas na
  chamada HTTP.

As assinaturas abaixo são parte obrigatória da solução. Alterar nome, entrada,
retorno ou responsabilidade exige atualização técnica da Spec antes do Builder:

```ts
export interface FeedbackReportsRepository {
  add(report: FeedbackReport): Promise<void>
  findById(feedbackReportId: Id): Promise<FeedbackReport | null>
  findAuthorEmail(feedbackReportId: Id): Promise<Email | null>
  list(params: FeedbackReportsListingParams): Promise<FeedbackReportsPage>
  save(report: FeedbackReport): Promise<void>
}

export interface FeedbackMessagesRepository {
  add(message: FeedbackMessage): Promise<FeedbackMessage>
  findById(messageId: Id): Promise<FeedbackMessage | null>
  listByReport(feedbackReportId: Id): Promise<FeedbackMessage[]>
}

export interface FeedbackOutboxRepository {
  add(event: FeedbackOutboxEvent): Promise<void>
  claimPending(
    request: ClaimFeedbackOutboxEventsRequest,
  ): Promise<FeedbackOutboxEvent[]>
  markAsPublished(eventId: Id, publishedAt: Date): Promise<void>
  scheduleRetry(eventId: Id, nextAttemptAt: Date): Promise<void>
  markForReconciliation(eventId: Id, errorCode: Text): Promise<void>
}

export interface FeedbackConversationTransaction {
  createReport(
    request: PersistFeedbackReportRequest,
  ): Promise<FeedbackReport>
  sendMessage(
    request: PersistFeedbackMessageRequest,
  ): Promise<PersistFeedbackMessageResponse>
  changeStatus(
    request: PersistFeedbackStatusChangeRequest,
  ): Promise<FeedbackReport>
}

export interface ReportingService {
  sendFeedbackReport(
    feedbackReport: FeedbackReport,
  ): Promise<RestResponse<void>>
  listFeedbackReports(
    params: FeedbackReportsListingParams,
  ): Promise<RestResponse<FeedbackReportsPageDto>>
  getFeedbackReport(
    feedbackReportId: Id,
  ): Promise<RestResponse<FeedbackReportDetailsDto>>
  markFeedbackReportAsRead(
    feedbackReportId: Id,
    lastSeenUserMessageId: Id,
  ): Promise<RestResponse<void>>
  createFeedbackAttachmentUploadUrl(
    feedbackReportId: Id,
    messageId: Id,
    request: CreateFeedbackAttachmentUploadRequest,
  ): Promise<RestResponse<SignedUploadUrlDto>>
  sendFeedbackMessage(
    feedbackReportId: Id,
    request: SendFeedbackMessageRequest,
  ): Promise<RestResponse<SendFeedbackMessageResponse>>
  changeFeedbackReportStatus(
    feedbackReportId: Id,
    request: ChangeFeedbackReportStatusRequest,
  ): Promise<RestResponse<FeedbackReportDto>>
}
```

`FeedbackConversationTransaction` é o único writer dos fatos que também geram
outbox: criação inicial + Discord, mensagem + anexos + eventual status + efeitos,
e transição isolada + analytics. Ele não substitui consultas dos repositories
nem publica no broker dentro da transação. `add`/`save` dos repositories ficam
restritos à implementação transacional e a fixtures de persistência, não à
orquestração dos use cases.

Os métodos principais dos use cases e jobs também ficam congelados nesta
revisão:

```ts
export class SendFeedbackReportUseCase {
  execute(request: FeedbackReportDto): Promise<FeedbackReportDto>
}

export class ListFeedbackReportsUseCase {
  execute(
    request: ListFeedbackReportsRequest,
  ): Promise<FeedbackReportsPageDto>
}

export class GetFeedbackReportUseCase {
  execute(
    request: GetFeedbackReportRequest,
  ): Promise<FeedbackReportDetailsDto>
}

export class MarkFeedbackReportAsReadUseCase {
  execute(request: MarkFeedbackReportAsReadRequest): Promise<void>
}

export class CreateFeedbackAttachmentUploadUrlUseCase {
  execute(
    request: CreateFeedbackAttachmentUploadUrlRequest,
  ): Promise<SignedUploadUrlDto>
}

export class SendFeedbackMessageUseCase {
  execute(
    request: SendFeedbackMessageUseCaseRequest,
  ): Promise<SendFeedbackMessageResponse>
}

export class ChangeFeedbackReportStatusUseCase {
  execute(
    request: ChangeFeedbackReportStatusUseCaseRequest,
  ): Promise<FeedbackReportDto>
}

export class DispatchFeedbackOutboxUseCase {
  execute(request: DispatchFeedbackOutboxRequest): Promise<void>
}

export class DispatchFeedbackOutboxJob {
  handle(amqp: Amqp<DispatchFeedbackOutboxPayload>): Promise<void>
}

export class SendFeedbackReportReplyEmailJob {
  handle(amqp: Amqp<FeedbackReportReplyEmailEventPayload>): Promise<void>
}

export class SendFeedbackReplyDiscordJob {
  handle(amqp: Amqp<FeedbackReplyDiscordEventPayload>): Promise<void>
}
```

`SendFeedbackMessageUseCaseRequest.actor` possui `{ accountId: string; role:
'user' | 'admin' }`, sempre derivado pelo controller. Os demais campos são
`feedbackReportId`, `messageId`, `content`, descritores de anexos e
`targetStatus?`. Requests dos use cases carregam apenas DTOs/primitivos; os use
cases criam `Id`, `Text`, `Email` e demais objetos de domínio antes de chamar
repositories/providers.

Os shapes compartilhados que atravessam contracts são:

```ts
export type FeedbackReportsListingParams = {
  search?: Text
  intent?: FeedbackIntent
  status?: FeedbackReportStatus
  createdAtPeriod?: Period
  page?: OrdinalNumber
  itemsPerPage?: OrdinalNumber
}

export type FeedbackMessageAttachmentRequest = {
  id: Id
  storageKey: Text
  originalName: Text
  mimeType: Text
  size: Integer
}

export type CreateFeedbackAttachmentUploadRequest = {
  fileName: Text
  mimeType: Text
  size: Integer
}

export type SendFeedbackMessageRequest = {
  messageId: Id
  content: Text
  attachments: FeedbackMessageAttachmentRequest[]
  targetStatus?: FeedbackReportStatus
}

export type ChangeFeedbackReportStatusRequest = {
  status: FeedbackReportStatus
  expectedStatus: FeedbackReportStatus
}

export type ClaimFeedbackOutboxEventsRequest = {
  limit: OrdinalNumber
  claimedAt: Date
  claimExpiresAt: Date
}

export type PersistFeedbackMessageRequest = {
  report: FeedbackReport
  message: FeedbackMessage
  attachments: FeedbackMessageAttachmentRequest[]
  targetStatus?: FeedbackReportStatus
  outboxEvents: FeedbackOutboxEvent[]
}

export type PersistFeedbackReportRequest = {
  report: FeedbackReport
  outboxEvents: FeedbackOutboxEvent[]
}

export type PersistFeedbackStatusChangeRequest = {
  report: FeedbackReport
  expectedStatus: FeedbackReportStatus
  outboxEvents: FeedbackOutboxEvent[]
}

export type PersistFeedbackMessageResponse = {
  report: FeedbackReport
  message: FeedbackMessage
  isDuplicate: Logical
}
```

### Contrato HTTP

| Método e rota | Autorização | Entrada | Sucesso | Erros previstos |
|---|---|---|---|---|
| `POST /reporting/feedback` | autenticado | schema de relato existente; autor derivado | `201`, reporte persistido | `400`, `401` |
| `GET /reporting/feedback` | god account | busca, intent, status, período, page/itemsPerPage | `200`, `FeedbackReportsPageDto` | `400`, `401`, `403` |
| `GET /reporting/feedback/:feedbackReportId` | god account | UUID no path | `200`, `FeedbackReportDetailsDto` | `400`, `401`, `403`, `404` |
| `PUT /reporting/feedback/:feedbackReportId/read` | god account | `{ lastSeenUserMessageId }` | `204` | `400`, `401`, `403`, `404` |
| `POST /reporting/feedback/:feedbackReportId/messages/:messageId/attachments/signed-upload-url` | autor ou god account | `{ fileName, mimeType, size }`; IDs no path | `201`, `SignedUploadUrlDto` | `400`, `401`, `403`, `404`, `409` |
| `POST /reporting/feedback/:feedbackReportId/messages` | autor ou god account | `{ messageId, content, attachments, targetStatus? }`; ator derivado | `201` na primeira criação, `200` no retry idempotente | `400`, `401`, `403`, `404`, `409` |
| `PATCH /reporting/feedback/:feedbackReportId/status` | god account | `{ status, expectedStatus }` | `200`, estado canônico | `400`, `401`, `403`, `404`, `409` |

No POST de mensagens, `409` inclui reporte fechado ou status alterado entre a
leitura e a transação; a resposta traz o status canônico e exige reabertura antes
de novo envio administrativo.

### Persistência e Server

- Implementar migration aditiva/backfill e regenerar `Database.ts`.
- Fazer a listagem em consulta agregada/RPC SQL única, com contagens e índices,
  evitando carregar a conversa e evitando N+1.
- Instanciar repositories/transação/outbox de reporting com o adapter Supabase
  server-only baseado na anon key compartilhada. A autenticação/autorização da
  API continua ocorrendo nos middlewares; nenhuma credencial privilegiada entra
  em `Http`, payload, log ou pacote compartilhado.
- Carregar detalhe em queries delimitadas por reporte e cronologia, mapeando DB
  para domínio em mappers explícitos.
- Criar schemas Zod compartilhados e um arquivo de teste de integração por rota,
  usando `HonoFixture`, `SupabaseFixture`, `AuthFixture` e uma fixture de reporting.
- Derivar god account e autor do `Http`; nenhum controller aceita role/authorId do
  body.
- Estender o provider de storage com leitura de metadados do objeto antes da
  finalização da mensagem.

```ts
export interface FileStorageProvider {
  upload(folder: FileStorageFolderPath, file: File): Promise<File>
  uploadMany(folder: FileStorageFolderPath, files: File[]): Promise<File[]>
  createSignedUploadUrl(
    folderPath: FileStorageFolderPath,
    fileName: Text,
  ): Promise<SignedUploadUrl>
  findFile(
    folder: FileStorageFolderPath,
    fileName: Text,
  ): Promise<File | null>
  listFiles(params: FilesListingParams): Promise<ManyItems<File>>
  removeFile(
    folder: FileStorageFolderPath,
    fileName: Text,
  ): Promise<void>
  getFileMetadata(
    folderPath: FileStorageFolderPath,
    fileName: Text,
  ): Promise<StoredFileMetadata | null>
}
```

`getFileMetadata` complementa os métodos existentes; o bloco acima é o contrato
completo esperado depois da alteração.

### Queue, e-mail e analytics

- Persistir eventos na outbox junto do fato de negócio, publicar somente após
  commit e usar IDs de mensagem/transição como chave estável.
- Criar dispatcher imediato e dreno agendado da outbox; ampliar o adapter do
  broker para enviar event ID determinístico e marcar publicação quando a
  Promise resolver, sem apagar o histórico do evento.
- Criar template no `@stardust/email`, port `EmailProvider` no módulo
  `notification` do Core, adapter REST no Server e job de notification agnóstico
  do Inngest com IO em `amqp.run`.
- O primeiro adapter transacional será configurável por ambiente e implementado
  sobre a API HTTP do Resend, com remetente e chave somente em variáveis de
  ambiente. A ausência de configuração deve falhar no job, nunca na persistência.
- Reutilizar `AnalyticsFunctions` e `TrackAnalyticsEventJob` para os novos fatos.

```ts
export type SendFeedbackReportReplyEmailRequest = {
  recipientEmail: Email
  subject: Text
  html: Text
  text: Text
  idempotencyKey: Text
}

export interface EmailProvider {
  sendFeedbackReportReplyEmail(
    request: SendFeedbackReportReplyEmailRequest,
  ): Promise<void>
}

export interface Broker {
  publish(event: Event, eventId?: Text): Promise<void>
}
```

`EmailProvider.sendFeedbackReportReplyEmail` retorna `void`: sucesso encerra a
chamada e qualquer falha deve ser lançada para o job aplicar retry. IDs
específicos do Resend permanecem internos ao adapter/log técnico e não atravessam
o port. `NotificationService` continua responsável pelos contratos de webhook;
o provider de e-mail permanece uma interface separada dentro do mesmo módulo.

### Studio

- Manter Widget Pattern: entry points resolvem contexts/services, hooks recebem
  dependências e Views apenas renderizam.
- Dividir página, summary, filtros, tabela, estados vazios, dialog, conversa,
  compositor, anexos e seletor em widgets com `index.tsx` e `*View.tsx`.
- Usar TanStack Query/cache existente para lista, detalhe e badge; mutações
  invalidam chaves relacionadas após confirmação canônica.
- Sincronizar a seleção com o parâmetro de rota e preservar return URL no fluxo
  de autenticação.
- Reutilizar Shadcn/Radix e tokens do Studio conforme os frames Pencil; nenhuma
  cor isolada comunica intent, status ou não lido.

## Decisões técnicas

| Decisão | Evidência | Alternativas consideradas | Motivo e trade-offs | Impacto no Contract |
|---|---|---|---|---|
| Outbox transacional com claim/lease | PRD exige persistir antes de notificar; `SendFeedbackReportUseCase` atual publica diretamente após `add` | publicação direta; transação + chamada síncrona | remove janela de perda e suporta concorrência; adiciona tabela, dispatcher e reconciliação | mensagem/status/outbox atômicos; HTTP não confirma efeito externo |
| Reporting usa composição server-only somente no Server | client atual é criado com anon key + JWT | manter client geral em reporting; confiar apenas na UI | mantém auth/authz na borda e impede segredo no Core/Studio/Web, sem introduzir RLS nesta revisão | auth/authz permanece middleware/controller; adapters usam segredo somente no Server |
| Exclusão de conta mantém a cascata existente | FK vigente `feedback_reports.user_id -> users.id ON DELETE CASCADE`; PRD só exige histórico após fechamento e não redefine lifecycle de Profile | bloquear exclusão; anonimizar/preservar conversa | evita expansão cross-domain e mantém o comportamento atual; a conversa deixa de existir quando a conta é excluída | novas FKs de mensagem, anexo e outbox também usam `CASCADE`; CA-34 protege o lifecycle |
| `EmailProvider` em notification e `ResendEmailProvider` no Server | `NotificationService` já concentra contratos de notificação e importa `FeedbackReportSentEvent`; revisão humana escolheu esse ownership | manter port em reporting; chamar Resend diretamente no job | centraliza capacidades de notificação sem misturar e-mail com `NotificationService`; mantém provider específico e testável | `packages/core/src/notification/interfaces/EmailProvider.ts` fixa `sendFeedbackReportReplyEmail(request): Promise<void>` |
| Resend por HTTP com chave estável e reconciliação após 23h | [Resend Idempotency Keys](https://resend.com/docs/dashboard/emails/idempotency-keys) limita deduplicação a 24h | retry ilimitado; declarar exactly-once; não retry | torna a garantia honesta e evita duplicata após resultado desconhecido; pode exigir intervenção manual | retries automáticos têm horizonte; `reconciliation_required` é observável, sem reenvio automático |
| Event ID determinístico no `Broker` | [Inngest Events](https://www.inngest.com/docs/events#deduplication) documenta deduplicação por `id` por 24h | deixar idempotência só no consumer | reduz função duplicada sem acoplar Core ao Inngest; continua exigindo idempotência do efeito | `Broker.publish(event, eventId?)`; IDs incluem tipo + fato |
| Discord usa entrega `at-least-once` | webhook atual é POST sem idempotency key; Inngest não deduplica repetição do efeito após resposta desconhecida | at-most-once com possível perda; trocar integração | prioriza recuperar o aviso e declara possível duplicação, mantendo IDs reconhecíveis; não promete garantia inexistente | CA-31 permite aviso duplicado, mas exige unicidade de mensagem/estado/outbox de negócio |
| Leitura global por fila com snapshot | PRD conta reportes não lidos; não há requisito por administrador | tabela de leitura por god account; marcar `now()` | modelo menor e evita consumir mensagem concorrente; um admin limpa para todos | `lastSeenUserMessageId` obrigatório e avanço monotônico |
| Primeira resposta não fecha | PRD/Issue exigem resposta administrativa prévia | considerar a resposta corrente como prévia | leitura literal e fluxo explicável; exige segunda ação para fechar o primeiro contato | domínio rejeita fechamento sem resposta já persistida antes da operação |
| CTA Web é dependência de rollout | PRD exige CTA, mas UI/histórico Web estão fora desta entrega | remover CTA; criar UI Web nesta Spec | preserva escopo e evita link quebrado; requer feature flag/ordenação de deploy | resposta administrativa não habilita em produção antes da rota Web |

## Premissas aceitas com risco

- A leitura administrativa é global à fila do Studio, não individual por god
  account. O primeiro administrador que abre a conversa elimina a pendência para
  todos. Uma mudança para leitura por administrador altera Contract e migration.
- Os contadores do cabeçalho são globais e independentes dos filtros da tabela.
- O título é automático, não editável e limitado a 60 caracteres. A regra é
  necessária para a fundação compartilhada, embora o frame administrativo atual
  não exiba o título.
- Resend via HTTP é o adapter inicial de e-mail por não existir provider
  transacional no repositório. A troca de provider mantendo o port não altera o
  Contract; alteração de payload, garantia de idempotência ou política de retry
  exige revisão técnica.
- A rota Web do CTA é uma dependência de rollout da demanda posterior. A resposta
  administrativa não deve ser habilitada em produção antes de o deep link da Web
  estar disponível, ainda que template/job sejam entregues nesta feature.

## Questões pendentes

Nenhuma questão pendente bloqueia a abertura. Mudanças nas premissas acima após
`open` exigem amendment, incremento de revisão e novo Judge Spec quando alterarem
Contract ou escopo.

## Plano de validação

### Testes automatizados

- Domínio: entidade/status/leitura/idempotência/anexos e DTOs com fakers.
- Use cases: lista, detalhe, leitura, mensagem, status e eventos, com
  `ts-jest-mocker` e cenários de erro/concorrência.
- Validation: limites de texto/anexo, enums, UUIDs, query e datas.
- Database/Server: migration e um teste de integração por rota, incluindo auth,
  god account, validação, `404`, `409`, persistência e retry.
- Queue/Email: template, composição Inngest, `amqp.run`, falha/retry e
  idempotência.
- Studio: hooks e Views separadamente; rascunho, filtros, estados, cache,
  acessibilidade e ausência de exclusão.

### Sensores

- `npm run format` para aplicar formatação; não é gate.
- `npm run check:code`.
- `npm run check:types`.
- `npm run test:unit`.
- `npm run check:architecture` por alteração de fronteiras e novos ports.
- `npm run db:test -w @stardust/server` seguido de
  `npm run test:integration -w @stardust/server` para migration e rotas.
- `npm run test:integration` no preflight integrado quando todos os workspaces
  estiverem reunidos.
- Quality Gate e build final permanecem validações do CI.

### Validação manual obrigatória

Após qualquer implementação/correção de frontend:

1. iniciar Server em `http://localhost:3334` e Studio em
   `http://localhost:8000` (ou porta alternativa do Studio);
2. carregar as credenciais por `source ./scripts/export-studio-app-e2e-env.sh`;
3. autenticar com variáveis de ambiente, aguardar `/dashboard` e confirmar a
   sessão em `/profile/users`;
4. acessar `/reporting/feedback`, exercitar lista, busca, filtros, paginação,
   detalhe, leitura, resposta com/sem anexos, erro preservando rascunho,
   fechamento, reabertura e deep link;
5. inspecionar `design/stardust.pen` no Pencil e comparar a lista e os estados
   aberto/fechado com `MVWsz`, `nbV72` e `aHFPL`, registrando evidência visual;
6. no Playwright, validar o fluxo real e os estados loading, error, empty,
   content, aberto/fechado e comportamento responsivo aplicável; a inspeção no
   Pencil não substitui esta etapa;
7. registrar `console`, `pageerror`, `requestfailed` e respostas HTTP, exigindo
   `2xx` nos caminhos felizes e ausência de erros inesperados;
8. repetir a comparação no Pencil e o fluxo autenticado completo no Playwright
   após qualquer correção visual ou comportamental.

## Avaliações previstas

- Judge Spec antes de alterar o status para `open`.
- Judge Plan após criação do ledger faseado.
- Judge Implementation independente por fase de migration/domínio, APIs/jobs e
  Studio, além de julgamento final do diff integrado.
- Revisão especial de segurança para autorização, conteúdo não confiável,
  storage keys e anexos.
- Revisão de performance da consulta administrativa com dataset representativo.
- `evaluation.md` será criado após o primeiro julgamento/implementação relevante
  e antes do PR; não é criado vazio nesta etapa.

## Alinhamento documental

- Atualizar `documentation/architecture.md` ao final para registrar o fluxo
  conversa → evento → e-mail e o modelo de leitura administrativa.
- Atualizar `documentation/overview.md` quando a feature estiver disponível.
- Atualizar o frame `nbV72` para substituir a confirmação de entrega por
  `Resposta enviada`; demais diferenças descobertas durante implementação devem
  ser registradas como amendment se alterarem o Contract.
- Marcar os specs históricos de exclusão/página como supersedidos sem migrar
  incidentalmente os artefatos antigos.
- Não alterar Rules globais nesta etapa; findings reutilizáveis seguem o fluxo
  de `register-antipattern`/Rules durante a implementação.

## Amendments

- 2026-08-03 — esclarecimento técnico solicitado por revisão humana: todas as
  interfaces introduzidas pela solução passaram a declarar seus métodos e tipos;
  `EmailProvider.sendFeedbackReplyEmail(request): Promise<void>` foi fixado como
  assinatura obrigatória. Não houve mudança de comportamento, escopo ou Contract,
  portanto a revisão permanece 1 e o aceite do Judge Spec continua válido.
- 2026-08-03 — reaplicação do prompt de Spec revisado: adicionados pesquisa
  consolidada, fluxo multi-app, inventário por path/estado, contratos de use
  cases/jobs/HTTP, decisões com evidência e regras completas de migration. A
  revisão sobe para 2 por introduzir signed upload contextual, RLS/grants com
  adapter `service_role`, claim/lease da outbox e limite verificável de 24 horas
  para deduplicação externa, com reconciliação após 23 horas. O aceite da revisão
  1 não cobre essas mudanças; a revisão 2 retorna a `draft` até novo Judge Spec.
- 2026-08-03 — correções `JS-07` a `JS-10` do primeiro julgamento da revisão 2:
  scope formal ampliado aos paths obrigatórios; cascata de exclusão de conta
  preservada e coberta por CA-34; Discord definido como `at-least-once` com
  possível aviso duplicado; resposta de qualquer ator em reporte fechado
  bloqueada com `409` e coberta por CA-35. As correções esclarecem a mesma
  solução técnica e mantêm a revisão 2 em `draft` até reavaliação.
- 2026-08-03 — revisão humana moveu o ownership do port de e-mail de `reporting`
  para `notification` e renomeou o método para
  `EmailProvider.sendFeedbackReportReplyEmail(request): Promise<void>`. Request,
  job e template passaram a usar `FeedbackReportReply`, e o descritor de anexo
  enviado passou de `FeedbackMessageAttachmentInput` para
  `FeedbackMessageAttachmentRequest`; `NotificationService` permanece separado
  para webhooks. As mudanças alteram paths e nomes públicos, incrementam a Spec
  para revisão 3 e invalidam o aceite da revisão 2 até novo Judge Spec.
- 2026-08-03 — adicionada rastreabilidade visual explícita para
  `design/stardust.pen`: nomes, Node IDs, estados, viewports, RF/CA associados,
  divergências e precedência agora integram o Contract de implementação e
  validação. A validação separa comparação no Pencil de comportamento real no
  Playwright. Não houve mudança funcional; a revisão permanece 3.
- 2026-08-03 — corrigido o finding `JS-11` do julgamento visual: `MVWsz` passou
  a declarar RF-09 junto de CA-23, e `nbV72` deixou de apontar para o critério de
  analytics CA-27, usando CA-11 para o fluxo visual de resposta. A revisão
  permanece 3.
- 2026-08-04 — decisão explícita do usuário: RLS/grants e benchmark de
  desempenho foram removidos do Contract; auth/authz na API e composição
  server-only permanecem. CA-26 foi retirado como gate e CA-33 foi reduzido à
  autorização de rota. A revisão sobe para 4; o Judge final deve avaliar todas
  as fases integradas somente após a implementação completa.
- 2026-08-04 — simplificação explícita do usuário: a garantia transacional de
  entrega assíncrona não é requisito. `FeedbackConversationTransaction`, a
  outbox e o dispatcher foram removidos; repositories persistem diretamente e
  publicam eventos no Broker somente depois do sucesso do save. Jobs mantêm
  idempotência básica por chave estável. A migration
  `20260804130000_remove_feedback_outbox_events.sql` remove a tabela legada de
  bancos que já a possuíam. A revisão sobe para 5.
