---
title: Histórico e conversas no diálogo de feedback
status: completed
revision: 3
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/issues/519
  - type: prd
    ref: https://github.com/JohnPetros/stardust/milestone/41
  - type: issue
    ref: https://github.com/JohnPetros/stardust/issues/518
scope:
  - packages/core/src/reporting
  - packages/validation/src/modules/reporting
  - apps/server/supabase/migrations
  - apps/server/supabase/schemas/schema.sql
  - apps/server/src/database/supabase
  - apps/server/src/app/hono/routers/reporting
  - apps/server/src/rest/controllers/reporting
  - apps/server/src/queue
  - apps/web/src/rest/services/ReportingService.ts
  - apps/web/src/constants/routes.ts
  - apps/web/src/middleware.ts
  - apps/web/src/app
  - apps/web/src/ui/reporting
  - apps/web/src/ui/auth/widgets/pages/SignIn
  - apps/web/src/ui/global/widgets/layouts/Root
  - design/stardust.pen
last_updated_at: 2026-08-11
---

# Histórico e conversas no diálogo de feedback

## Contexto e objetivo

A Issue #519 transforma o diálogo de feedback da Web em um canal privado e
contínuo entre a conta autenticada e a Equipe StarDust. A entrega preserva o
envio atual, acrescenta histórico, badge de novidades, conversa, anexos,
respostas do usuário, mobile e deep link vindo do e-mail.

A Issue #518, já concluída, é a fundação compartilhada: criou o modelo
conversacional, migrations, adapters Supabase, rotas administrativas, upload
contextual de anexos de mensagens, eventos, jobs de e-mail/Discord e a
contraparte no Studio. Esta Spec estende esses contratos para o participante
usuário sem duplicar o domínio nem enfraquecer a autorização administrativa.

O link de PRD citado pela Issue e pela milestone
(`documentation/features/reporting/feedback-dialog/prd.md`) não existe no
checkout nem na branch `main` consultada no GitHub. A descrição da milestone 41
é tratada como fonte de produto equivalente, e a ausência do arquivo é
registrada em Alinhamento documental.

## Classificação

- **Origem:** Issue com PRD representado pela milestone 41 e dependência da
  Issue #518.
- **Modo:** completo. A entrega cruza core, validation, database, server, queue,
  REST, autenticação e UI, exige migration e possui ownership/deep link.
- **Roteamento após `open`:** `create-plan`, seguido de `implement-plan`.

## Escopo

### Incluído

- Tornar o trigger disponível em áreas autenticadas no desktop e mobile e
  ocultá-lo para visitante, autenticação e páginas públicas.
- Evoluir o relato inicial para 10–1.000 caracteres, título derivado de até 60
  caracteres e uma imagem PNG/JPEG de até 10 MB.
- Listar apenas reportes da conta autenticada em lotes de 10, com filtros
  `Todos`, `Abertos` e `Fechados`, priorizando novidades e atividade recente.
- Contar reportes com ao menos uma resposta administrativa não lida.
- Exibir detalhe cronológico e marcar respostas administrativas como lidas de
  maneira idempotente.
- Permitir resposta do usuário em reporte aberto, com texto de 1–2.000
  caracteres e até três imagens PNG/JPEG de 10 MB cada.
- Preservar rascunhos em memória enquanto a página permanecer aberta.
- Abrir `/feedback/:feedbackReportId` diretamente no detalhe e preservar esse
  destino através da autenticação.
- Reutilizar o evento e o job de Discord já criados pela Issue #518.
- Cobrir desktop e mobile, acessibilidade e validação real no browser.

### Fora de escopo

- Feedback de visitante não autenticado.
- Realtime, polling contínuo ou push; as atualizações são por consulta nos
  momentos definidos no Contract.
- Alteração de status, exclusão, edição ou arquivamento pelo usuário.
- Responder pelo e-mail ou Discord; esses canais apenas notificam.
- Persistência de rascunho entre reloads, abas ou sessões.
- PDF, WEBP, GIF, áudio, vídeo ou mais de uma imagem no relato inicial.
- Painel administrativo do Studio, SLA, prioridade, tags, votação ou roadmap.
- Alteração visual dos frames canônicos além do ajuste já exigido no node
  `r6xBJD`.

## Contract

### Requisitos funcionais

- **RF-01 — Disponibilidade autenticada:** montar uma única instância do
  `FeedbackLayout` na árvore global da Web; renderizar trigger, badge e diálogo
  somente quando a conta estiver autenticada. Não renderizar o recurso em
  login, cadastro ou navegação pública de visitante.
- **RF-02 — Trigger responsivo:** remover `hidden md:flex`, manter o trigger
  alcançável por teclado e toque e posicioná-lo sem encobrir ações essenciais,
  safe areas ou teclado virtual.
- **RF-03 — Criação:** aceitar `Problema`, `Ideia` ou `Outro` e relato original
  entre 10 e 1.000 caracteres; derivar no servidor um título de até 60
  caracteres no último limite de palavra disponível, sem alterar o conteúdo
  persistido.
- **RF-04 — Imagem inicial:** permitir zero ou uma imagem PNG/JPEG de até 10 MB
  por captura/recorte no desktop ou seleção de arquivo no desktop/mobile. O
  servidor deve validar extensão, MIME, tamanho, storage key e metadados reais
  do objeto antes de persistir o reporte. A extensão do nome original é apenas
  metadata de exibição; a chave gerada e o MIME são a fonte de verdade do tipo.
- **RF-05 — Atomicidade de criação:** concluir o upload antes da criação,
  bloquear submits concorrentes e só limpar o rascunho após `201`. Falha no
  upload mantém texto/tipo e oferece remover a imagem e enviar novamente.
- **RF-06 — Badge:** consultar e exibir a quantidade de reportes próprios com
  resposta administrativa não lida, contando cada reporte no máximo uma vez.
- **RF-07 — Histórico privado:** listar somente reportes cujo `user_id` seja a
  conta da sessão, em lotes de 10, com filtros `all|open|closed`; ordenar por
  novidade desc, `last_activity_at` desc e `id` desc.
- **RF-08 — Histórico na UI:** oferecer `Ver meus reportes`, filtros, loading,
  erro recuperável, vazio, conteúdo e `Carregar mais`; o item usa o rótulo
  `Nova resposta`, nunca contador de mensagens.
- **RF-09 — Detalhe privado:** retornar metadados, relato inicial, imagem,
  mensagens e anexos em ordem cronológica apenas quando o autor for a conta da
  sessão. ID inexistente e ID de outra conta devem produzir a mesma resposta
  segura `404`.
- **RF-10 — Leitura do autor:** ao abrir com sucesso o detalhe, marcar como lida
  a última mensagem administrativa observada. A operação é monotônica e
  idempotente e não pode ocultar uma mensagem administrativa concorrente mais
  recente.
- **RF-11 — Conversa:** distinguir visualmente o usuário e a Equipe StarDust,
  exibir avatar, timestamps e anexos acessíveis, manter ordem cronológica e
  oferecer retorno ao histórico.
- **RF-12 — Resposta do usuário:** em reporte aberto, aceitar texto obrigatório
  de 1–2.000 caracteres e até três PNG/JPEG de 10 MB; concluir todos os uploads
  antes de persistir uma única mensagem e impedir submit duplicado por
  `messageId`.
- **RF-13 — Efeito assíncrono:** depois de persistir resposta do usuário,
  atualizar atividade/leitura do Studio e publicar o evento idempotente
  `feedback.user.message.created`; o job existente envia o resumo ao Discord
  com IO dentro de `amqp.run`, sem rollback da mensagem em falha externa.
- **RF-14 — Fechado:** manter reporte fechado consultável e substituir o
  compositor por aviso somente leitura. API e Core rejeitam resposta ou upload
  de anexo em reporte fechado; usuário nunca envia `targetStatus`.
- **RF-15 — Rascunhos:** preservar em memória o rascunho de criação e um
  rascunho de resposta por reporte enquanto a página não for recarregada;
  fechar, alternar lista/detalhe ou trocar de reporte não apaga rascunho.
- **RF-16 — Atualização sem realtime:** consultar badge ao autenticar/carregar
  área autenticada, ao abrir o diálogo e após criação, leitura ou resposta;
  reconsultar lista/detalhe após ações próprias. Não abrir canal realtime.
- **RF-17 — Deep link:** `/feedback/:feedbackReportId` abre o diálogo diretamente
  no detalhe. Sessão expirada redireciona para
  `/auth/sign-in?nextRoute=<rota-interna-codificada>` e retorna ao mesmo destino
  após login; `nextRoute` deve ser somente path interno permitido.
- **RF-18 — Falha segura:** detalhe inexistente/sem ownership mostra mensagem
  genérica e ações para voltar ao início ou ao histórico, sem revelar autor,
  existência, status ou anexos.
- **RF-19 — Responsividade e acessibilidade:** dialog central no desktop e painel
  de tela inteira no mobile, com foco contido/restaurado, Escape, labels,
  mensagens anunciadas, contraste AA, alvos de toque, rolagem interna, safe
  areas e estados não dependentes apenas de cor.

### Critérios de aceitação

| CA | RF | Dado | Quando | Então | Evidência esperada |
|---|---|---|---|---|---|
| CA-01 | RF-01, RF-02 | visitante em rota pública ou de autenticação | a página carrega | trigger, badge e diálogo não são renderizados | integração Web + Playwright |
| CA-02 | RF-01, RF-02 | conta autenticada em rota suportada | a página carrega em desktop e mobile | existe um único trigger utilizável e sem sobrepor ação essencial | Playwright + comparação Pencil |
| CA-03 | RF-03 | relato com 10 ou 1.000 caracteres | usuário envia | API cria reporte, preserva conteúdo e retorna título de até 60 caracteres no limite de palavra | unit Core/validation + rota |
| CA-04 | RF-03 | relato com menos de 10 ou mais de 1.000 caracteres | usuário tenta enviar | client e API recusam com mensagem acessível | unit + integração Web |
| CA-05 | RF-04, RF-05 | PNG/JPEG de até 10 MB | upload conclui e reporte é enviado | storage metadata é validado e uma única imagem fica vinculada | unit + integração server/storage |
| CA-06 | RF-04, RF-05 | formato, MIME, tamanho ou storage key inválido | usuário tenta anexar | client/API recusam; nenhum reporte é persistido | unit validation/Core + integração server |
| CA-07 | RF-05, RF-15 | upload/criação falha | usuário permanece no diálogo | rascunho é mantido, submit é reabilitado e envio sem imagem é possível | widget + Playwright |
| CA-08 | RF-06, RF-16 | um reporte tem duas respostas admin não lidas e outro tem uma | badge é consultado | valor retornado é `2`, não `3` | repository/use case + rota |
| CA-09 | RF-07 | conta autenticada possui reportes misturados com outra conta | lista `mine` é consultada | somente itens próprios são retornados em ordem canônica | repository + rota integrada |
| CA-10 | RF-07, RF-08 | mais de 10 reportes próprios | usuário carrega histórico e mais uma página | lotes de 10 não duplicam itens e respeitam filtro/ordem | unit hook + integração Web/API |
| CA-11 | RF-08 | lista vazia, falha ou carregamento | diálogo mostra histórico | cada estado possui feedback e ação adequada | widget + Playwright + Pencil |
| CA-12 | RF-09, RF-18 | ID de outra conta ou inexistente | detalhe é solicitado | ambos retornam `404` seguro e UI não revela dados | use case + rota + Playwright |
| CA-13 | RF-09, RF-11 | reporte próprio com relato, imagem e mensagens | detalhe abre | conteúdo aparece cronologicamente com identidades e anexos acessíveis | integração Web + Playwright + Pencil |
| CA-14 | RF-10, RF-16 | detalhe possui mensagens admin até `M2` | usuário abre o detalhe | leitura avança até `M2`, badge/lista atualizam e repetição não altera o resultado | unit + repository + rota + Playwright |
| CA-15 | RF-10 | `M3` chega depois do detalhe retornado com `M2` | leitura de `M2` é persistida | `M3` continua não lida | repository/use case concorrência |
| CA-16 | RF-12, RF-13 | reporte aberto, texto válido e até três anexos válidos | usuário responde | uma mensagem é persistida, atividade é atualizada e evento Discord idempotente é publicado | use case + integração server/queue |
| CA-17 | RF-12 | um dos uploads falha | resposta é tentada | nenhuma mensagem parcial é criada e rascunho/anexos permanecem recuperáveis | widget + integração server |
| CA-18 | RF-12 | mesmo `messageId` e mesmo payload são reenviados | API processa retry | retorna a mensagem canônica sem duplicar; payload divergente retorna conflito | unit + rota integrada |
| CA-19 | RF-14 | reporte fechado | detalhe abre ou API recebe resposta/upload | conversa permanece visível, compositor fica desabilitado e servidor rejeita mutação | unit + rota + Playwright |
| CA-20 | RF-15 | usuário alterna entre criação, lista e dois reportes | retorna aos compositores sem reload | cada rascunho em memória é restaurado e só o enviado com sucesso é limpo | unit hook + Playwright |
| CA-21 | RF-16 | login, abertura e ações próprias | fluxo ocorre | consultas acontecem nos gatilhos definidos e nenhum canal realtime é criado | integração Web + Playwright/network |
| CA-22 | RF-17 | sessão expirada em deep link próprio | usuário autentica | `nextRoute` interno é preservado e detalhe abre após login | integração Web + Playwright |
| CA-23 | RF-17 | `nextRoute` externo ou malformado | login conclui | app ignora o destino e navega para rota segura padrão | unit auth + integração Web |
| CA-24 | RF-19 | teclado, leitor de tela e viewport mobile | diálogo é operado | foco, labels, anúncios, rolagem, safe areas e retorno funcionam | accessibility assertions + Playwright + Pencil |
| CA-25 | RF-06, RF-07, RF-09 | client envia `userId` alheio ou omite identidade | API processa pedido | identidade vem exclusivamente da sessão e não do payload/query | controller/use case + rota integrada |
| CA-26 | RF-13 | Discord falha após persistência | job executa/retry | mensagem continua canônica e falha é observável sem rollback | unit job + integração queue |
| CA-27 | RF-11, RF-19 | nodes `bTYzS`, `r6xBJD` e `hi2Ot` no estado/viewport canônico | implementação é comparada com o Pencil | estrutura, dimensões, tipografia, espaçamento, cores, avatars, badges, composer e conteúdo visual estão alinhados; divergências são registradas | comparação Pencil/Web com screenshots identificados por node, viewport, estado, rota e HEAD; passa somente quando os anchors estruturais e o contêiner principal diferem no máximo 4 px, não há clipping/overflow e divergências de dados dinâmicos ficam explicitamente separadas de divergências de layout |
| CA-28 | RF-11, RF-19 | widget UI alterado | auditoria estrutural é executada | cada widget possui `index.tsx`, `*View.tsx` e Hook quando houver lógica; Entry Point compõe, View renderiza e Hook concentra estado/efeitos/handlers | UI Layer Audit com path e linhas + diff + `ui-layer-rules.md` |

## Estado atual e pesquisa

### Mapeamento

| Área | Evidência atual | Consequência |
|---|---|---|
| Core | `FeedbackReport`, `FeedbackMessage`, DTOs, use cases e repositories conversacionais já existem | estender a fundação, sem novo domínio paralelo |
| Leitura | `FeedbackReport` só possui `lastUserMessageAt` e `studioReadAt` | criar marcador simétrico para respostas admin vistas pelo autor |
| Persistência | migrations `2026080412*`–`150000` criaram reports/messages/attachments e RPC administrativa | migration aditiva para leitura/lista do autor; sem recriar tabelas |
| API | `/reporting/feedback` cria; list/detail/read administrativos exigem god account; message/upload já derivam actor da sessão | criar rotas `mine` e generalizar leitura com ownership explícito |
| Queue | `FeedbackUserMessageCreatedEvent` → `SendFeedbackReplyDiscordJob` já está composto | reutilizar; não criar novo job/evento |
| REST Web | `ReportingService` implementa contratos administrativos genéricos | adicionar métodos próprios tipados sem enviar `userId` |
| UI | `FeedbackDialog` só tem `initial|form|success`, trigger `hidden md:flex` e layouts repetidos por grupos | evoluir para máquina de views e montagem global única |
| Auth | sign-in aceita `nextRoute`, mas middleware de fallback redireciona sem preservá-lo | preservar e validar path interno no middleware/login |
| Design | Issue aponta `design/stardust.pen` nodes `bTYzS`, `r6xBJD`, `hi2Ot` | inspeção Pencil obrigatória antes de `open` |

### Fluxo de dados atual e mudança

1. Hoje a Web envia o reporte para `POST /reporting/feedback`, opcionalmente
   após upload genérico em `/storage/signed-upload-url`.
2. A fundação persiste respostas em `feedback_messages`, anexos em
   `feedback_message_attachments` e atividade no reporte.
3. A listagem/detalhe/leitura existentes são administrativos e a leitura mede
   mensagens do usuário ainda não vistas pelo Studio.
4. Esta entrega adiciona a perspectiva do autor: sessão HTTP → controller → use
   case com `authorId` derivado → repository filtrado por `user_id` → DTO sem
   dados de outra conta → REST Web → diálogo.
5. Resposta do usuário continua no fluxo existente: uploads contextuais →
   `SendFeedbackMessageUseCase` → persistência → evento idempotente → Inngest →
   job agnóstico → Discord.

### Pontos de atenção

- Ownership deve existir no use case e na consulta; esconder itens apenas na UI
  não é autorização.
- `isUnread` atual representa a perspectiva do Studio e não pode ser reutilizado
  ambiguamente para o autor.
- Marcação de leitura deve usar a mensagem administrativa vista, não `now()`,
  para não engolir resposta concorrente.
- Upload inicial genérico não valida tamanho/MIME no contrato de reporting; a
  nova borda contextual deve validar antes de assinar e novamente antes de criar.
- A publicação no broker ocorre depois da persistência e não oferece garantia
  transacional/outbox; esta limitação já foi aceita na revisão 5 da Spec da
  Issue #518 e permanece explícita.
- Montagem global precisa evitar múltiplas instâncias nos layouts atuais.
- `nextRoute` não pode aceitar URL absoluta ou `//host`, evitando open redirect.

### Lacunas e pendências

- **Pencil validado — resolvido:** em 2026-08-06, os nodes `bTYzS`, `r6xBJD` e
  `hi2Ot` foram inspecionados estrutural e visualmente no arquivo canônico. A
  divergência de `r6xBJD` foi confirmada: o primeiro item ainda usa o contador
  numérico `2` e deve passar a usar `Nova resposta`. Os frames não possuem
  variantes mobile/loading/error/empty/closed; essa ausência é tratada pela
  precedência de produto declarada em Referências de design, sem IDs inventados.
- **Supabase Dev validado — resolvido:** em 2026-08-06, o MCP Supabase Dev
  confirmou as tabelas, colunas, função administrativa, índices, grants e
  migrations descritos no estado atual. Não existem ainda
  `last_admin_message_at`, `author_read_at`, `list_user_feedback_reports` ou
  `count_unread_user_feedback_reports`; portanto a migration proposta é aditiva
  e não conflita com contratos remotos homônimos.
- **Lacuna documental não bloqueante:** o PRD referenciado não existe; a
  milestone 41 contém o Contract de produto necessário e foi declarada como
  fonte.

## Solução técnica

### Contratos de domínio e aplicação

#### `packages/core/src/reporting/domain/entities/FeedbackReport.ts` — existente

- Adicionar `lastAdminMessageAt?: Date` e `authorReadAt?: Date`.
- Expor `hasUnreadAdminReply: boolean`, derivado quando
  `lastAdminMessageAt > authorReadAt` ou `authorReadAt` é nulo.
- `registerActivity(createdAt, 'admin')` também avança
  `lastAdminMessageAt`; `registerActivity(..., 'user')` preserva a regra atual
  de `lastUserMessageAt`.
- Adicionar `markAuthorRead(lastSeenAdminMessageAt: Date): void`, monotônico e
  limitado à última mensagem administrativa conhecida.
- Preservar `isUnread` atual apenas como compatibilidade administrativa até os
  consumidores migrarem para nomes explícitos `isUnreadForStudio` e
  `hasUnreadAdminReply`.
- Corrigir a derivação de `title`: normalizar whitespace somente na cópia usada
  pelo título; até 60 caracteres, preferindo cortar no último espaço; conteúdo
  original permanece intacto.

#### DTOs e types — existentes

Paths: `packages/core/src/reporting/domain/entities/dtos/FeedbackReportDto.ts`,
`FeedbackReportDetailsDto.ts`, `FeedbackReportsPageDto.ts` e
`packages/core/src/reporting/domain/types/*`.

- `FeedbackReportDto` adiciona `lastAdminMessageAt?`, `authorReadAt?` e
  `hasUnreadAdminReply?`.
- `FeedbackReportDetailsDto` adiciona `latestAdminMessageId?`; mantém
  `latestUserMessageId?` para o Studio.
- Criar `UserFeedbackReportsPageDto` (novo arquivo) com
  `{ items: FeedbackReportDto[]; page: number; itemsPerPage: number; total: number }`;
  resumo administrativo não atravessa a rota `mine`.
- Criar `FeedbackInitialAttachmentRequest` com
  `{ storageKey: string; originalName: string; mimeType: 'image/png'|'image/jpeg'; size: number }`.
- Criar `CreateFeedbackReportRequest` para o adapter Web com
  `{ content: Text; intent: FeedbackIntent; initialAttachment?: FeedbackInitialAttachmentRequest }`.
- Criar `SendFeedbackReportRequest` com
  `{ content: string; intent: 'bug'|'idea'|'other'; author: AuthorAggregateDto; initialAttachment?: FeedbackInitialAttachmentRequest }`;
  `author` é composição server-side e não pertence ao payload HTTP do client.
- `ListUserFeedbackReportsRequest`:
  `{ authorId: string; status?: 'open'|'closed'; page?: number; itemsPerPage?: number }`.
- `GetUserFeedbackReportRequest`:
  `{ feedbackReportId: string; authorId: string }`.
- `CountUnreadFeedbackReportsRequest`: `{ authorId: string }`.
- `MarkFeedbackReportAsReadRequest` passa a
  `{ feedbackReportId: string; actor: { accountId: string; role: 'user'|'admin' }; lastSeenMessageId: string }`.

#### Use cases

- `SendFeedbackReportUseCase.ts` — existente:
  `execute(input: SendFeedbackReportRequest): Promise<FeedbackReportDto>`.
  Recebe autor derivado no controller; valida título/conteúdo e, quando houver
  imagem, confirma via `FileStorageProvider` que `storageKey` está diretamente
  em `images/feedback-reports`, que o nome é UUID PNG/JPG e que MIME/tamanho
  reais coincidem com `initialAttachment`; então cria `FeedbackReport` com
  `screenshot = initialAttachment.storageKey`. O repository continua
  persistindo essa storage key na coluna `feedback_reports.screenshot`, e o DTO
  de retorno continua expondo `screenshot?: string` como referência canônica da
  imagem inicial.
- `ListUserFeedbackReportsUseCase.ts` — novo arquivo:
  `execute(input: ListUserFeedbackReportsRequest): Promise<UserFeedbackReportsPageDto>`.
  Converte paginação/status em objetos do Core e chama `listByAuthor`.
- `GetUserFeedbackReportUseCase.ts` — novo arquivo:
  `execute(input: GetUserFeedbackReportRequest): Promise<FeedbackReportDetailsDto>`.
  Usa busca por ID+autor, carrega mensagens cronológicas e retorna `404`
  equivalente para ausente ou sem ownership.
- `CountUnreadFeedbackReportsUseCase.ts` — novo arquivo:
  `execute(input: CountUnreadFeedbackReportsRequest): Promise<OrdinalNumber>`.
- `MarkFeedbackReportAsReadUseCase.ts` — existente:
  `execute(input: MarkFeedbackReportAsReadRequest): Promise<void>`.
  Para `user`, exige ownership e mensagem `admin`; para `admin`, preserva god
  account na borda e exige mensagem `user`; usa timestamp da mensagem.
- `SendFeedbackMessageUseCase.ts` — existente:
  `execute(input: SendFeedbackMessageUseCaseRequest): Promise<SendFeedbackMessageResponse>`.
  Preserva idempotência/ownership, rejeita fechado/`targetStatus` do usuário e
  publica o evento existente somente após persistir.
- `CreateFeedbackReportAttachmentUploadUrlUseCase.ts` — novo arquivo:
  `execute(input: { actorId: string; fileName: Text; mimeType: Text; size: Integer }): Promise<SignedUploadUrlDto>`.
  Valida UUID/extensão/MIME/tamanho e assina exclusivamente em
  `images/feedback-reports`; `actorId` prova autenticação, não integra o path.
- `CreateFeedbackAttachmentUploadUrlUseCase.ts` — existente: mantém assinatura
  e ownership contextual para anexos de mensagens.

#### Ports

`packages/core/src/reporting/interfaces/FeedbackReportsRepository.ts` — existente:

- `findByIdAndAuthor(feedbackReportId: Id, authorId: Id): Promise<FeedbackReport | null>`.
- `listByAuthor(input: { authorId: Id; status?: FeedbackReportStatus; page: OrdinalNumber; itemsPerPage: OrdinalNumber }): Promise<{ items: FeedbackReport[]; total: number }>`.
- `countUnreadByAuthor(authorId: Id): Promise<OrdinalNumber>`.
- Alterar `markAsRead` para
  `markAsRead(input: { feedbackReportId: Id; participant: 'author'|'studio'; lastSeenMessageAt: Date }): Promise<void>`.
- Preservar `list`, `findMany`, `findById`, `findAuthorEmail`, `add`, `save` e
  `changeStatus` para os fluxos administrativos.

`packages/core/src/reporting/interfaces/FeedbackMessagesRepository.ts` permanece
com `add`, `addAttachments`, `findById` e `listByReport`; nenhuma nova port.

`packages/core/src/reporting/interfaces/ReportingService.ts` — existente:

- Alterar `sendFeedbackReport` para
  `sendFeedbackReport(request: CreateFeedbackReportRequest): Promise<RestResponse<FeedbackReportDto>>`.
  O adapter Web serializa somente `{ content: request.content.value, intent:
  request.intent.value, initialAttachment }`; não instancia `FeedbackReport` nem
  envia `author`, `title`, `status` ou `userId`.
- `listMyFeedbackReports(params: { status?: FeedbackReportStatus; page: OrdinalNumber; itemsPerPage: OrdinalNumber }): Promise<RestResponse<UserFeedbackReportsPageDto>>`.
- `countMyUnreadFeedbackReports(): Promise<RestResponse<{ count: number }>>`.
- `getMyFeedbackReport(feedbackReportId: Id): Promise<RestResponse<FeedbackReportDetailsDto>>`.
- `markMyFeedbackReportAsRead(feedbackReportId: Id, lastSeenAdminMessageId: Id): Promise<RestResponse<void>>`.
- `createFeedbackReportAttachmentUploadUrl(request: CreateFeedbackAttachmentUploadRequest): Promise<RestResponse<SignedUploadUrlDto>>`.
- Preservar os métodos administrativos existentes para o Studio e os métodos de
  mensagem/upload contextual compartilhados.

### Validation

- `feedbackReportSchema.ts` — existente: validar `content` pelo comprimento do
  texto original com regra de não-whitespace entre 10 e 1.000; aceitar imagem
  inicial somente pelo shape tipado, sem `userId`, `author` ou `title` do client.
- `feedbackMessageSchema.ts` — existente: manter 1–2.000, até três anexos e
  `targetStatus` no schema compartilhado; controller rejeita `targetStatus` para
  ator user.
- `feedbackReadSchema.ts` — existente: substituir o nome administrativo por
  `lastSeenMessageId`; controllers mapeiam o papel esperado.
- `feedbackReportsQuerySchema.ts` — existente: criar/exportar variante
  `userFeedbackReportsQuerySchema` limitada a `status`, `page` e
  `itemsPerPage`; não aceitar search/intent/período/userId na rota `mine`.
- `feedbackAttachmentUploadSchema.ts` — existente: reutilizar para imagem
  inicial e mensagens, garantindo `.png|.jpg`, MIME correspondente e 1–10 MB.
- Cobrir limites, whitespace, MIME/extensão divergentes e quantidade.

### Database e adapters Supabase

#### Migration — novo arquivo

Criar
`apps/server/supabase/migrations/20260806120000_add_user_feedback_history.sql`
(novo arquivo), posterior a
`20260804150000_grant_feedback_reporting_permissions.sql`:

- Adicionar `feedback_reports.last_admin_message_at timestamptz null` e
  `feedback_reports.author_read_at timestamptz null`.
- Backfill de `last_admin_message_at` com `max(feedback_messages.created_at)` por
  `report_id` onde `author_role='admin'`.
- Manter `author_read_at = null` no backfill: como o histórico Web não existia,
  respostas administrativas históricas ainda não foram observadas nesse canal
  e devem aparecer como novidade. Trade-off: o primeiro badge pode incluir
  reportes antigos.
- Criar índice parcial composto para a consulta do autor:
  `(user_id, last_activity_at desc, id desc)` e índice parcial de novidade sobre
  `(user_id, last_admin_message_at, author_read_at)` onde
  `last_admin_message_at is not null`.
- Criar funções `list_user_feedback_reports(p_author_id varchar, p_status text,
  p_page integer, p_items_per_page integer)` e
  `count_unread_user_feedback_reports(p_author_id varchar)`, ambas `security
  invoker`, filtrando `user_id` antes de ordenar/agregar.
- A listagem retorna somente os campos do DTO do usuário, `total_count` e
  `has_unread_admin_reply`, ordenada por novidade/atividade/id.
- Criar função ou update condicional para leitura do autor usando
  `greatest/coalesce` sem avançar além do timestamp da mensagem informada.
- Sem nova tabela, FK ou comportamento de deleção; mensagens/anexos continuam
  com `on delete cascade` da fundação, embora exclusão não seja exposta.
- Conceder apenas `execute` das novas funções e `select/update` já necessários
  aos papéis usados pelo adapter, seguindo a decisão vigente da Spec #518; não
  ampliar grants para `delete`.
- Atualizar `apps/server/supabase/schemas/schema.sql`, tipos gerados,
  `SupabaseFeedbackReport` e mappers.

#### Repository e mapper — existentes

- `SupabaseFeedbackReportsRepository` implementa os quatro métodos novos/alterados.
  `findByIdAndAuthor` usa `.eq('id', ...).eq('user_id', ...)`; list/count usam as
  funções acima; leitura aplica participante e timestamp monotônico.
- `SupabaseFeedbackReportMapper` mapeia/persiste os novos timestamps e nomes
  explícitos de unread sem expor tipos Supabase ao Core.
- `SupabaseFeedbackMessagesRepository` e mapper permanecem, salvo tipos gerados.
- O schema remoto do Supabase Dev deve ser conferido antes da implementação e a
  migration deve ser aplicada/validada via MCP Supabase Dev, incluindo
  assinatura das funções e grants. Banco local não substitui essa evidência.

### Server HTTP

#### Rotas em `FeedbackRouter.ts` — existente

Registrar rotas estáticas antes de `/:feedbackReportId`:

| Método e rota | Auth/validation | Controller/use case | Resposta |
|---|---|---|---|
| `POST /reporting/feedback/attachments/signed-upload-url` | autenticado + attachment schema | `CreateFeedbackReportAttachmentUploadUrlController` / use case novo | `201 SignedUploadUrlDto` |
| `GET /reporting/feedback/mine` | autenticado + user query | `ListUserFeedbackReportsController` / use case novo | `200 UserFeedbackReportsPageDto` |
| `GET /reporting/feedback/mine/unread-count` | autenticado | `CountUnreadFeedbackReportsController` / use case novo | `200 { count }` |
| `GET /reporting/feedback/mine/:feedbackReportId` | autenticado + id | `GetUserFeedbackReportController` / use case novo | `200` ou `404` seguro |
| `PUT /reporting/feedback/mine/:feedbackReportId/read` | autenticado + id/read schema | `MarkUserFeedbackReportAsReadController` / use case generalizado | `204` ou `404` seguro |

- `POST /reporting/feedback` continua autenticado; controller deriva `accountId`
  e perfil, recebe o payload HTTP validado
  `{ content: string; intent: 'bug'|'idea'|'other'; initialAttachment?: { storageKey: string; originalName: string; mimeType: 'image/png'|'image/jpeg'; size: number } }`,
  compõe `SendFeedbackReportRequest`, ignora identidade/título/status do client e
  retorna `201 FeedbackReportDto`. O use case converte a storage key validada em
  `FeedbackReport.screenshot`; mapper/repository persistem a mesma referência.
- `POST /:feedbackReportId/messages` e upload contextual continuam
  compartilhados; actor vem da sessão/`ENV.godAccountIds`. Usuário só atua no
  próprio reporte aberto.
- Rotas administrativas existentes mantêm `verifyGodAccount`.
- Mapear ownership ausente e ID inexistente para a mesma resposta `404`; fechado
  e idempotency conflict usam `409`; validation usa `400`; auth usa `401/403`.
- Testes de rota cobrem auth, ownership, paginação, leitura concorrente,
  validação de upload e ausência de `userId` confiável no client.

### Queue

- Reutilizar `FeedbackUserMessageCreatedEvent` e
  `SendFeedbackReplyDiscordJob`; não criar novo evento/job.
- Manter chave `feedback-user-message:<messageId>` na publicação e
  `SendFeedbackReplyDiscordJob.KEY` na função Inngest.
- `NotificationFunctions` permanece composition root de
  `DiscordNotificationService`; IO continua dentro de `amqp.run`.
- Falha do broker entre persistência e publicação é uma limitação conhecida da
  fundação sem outbox; deve ser registrada na avaliação, não compensada apagando
  mensagem.

### REST Web

`apps/web/src/rest/services/ReportingService.ts` implementa os novos métodos de
`ReportingService` com `RestClient` injetado, paths relativos e
`RestResponse<T>`. Limpar query params antes da lista, serializar estruturas do
Core apenas na borda e nunca enviar `userId`. `sendFeedbackReport` recebe
`CreateFeedbackReportRequest`, envia o payload HTTP declarado acima e retorna
`RestResponse<FeedbackReportDto>`. Preservar métodos administrativos para
compatibilidade do Studio.

### UI Web

#### Composição global

- `apps/web/src/ui/global/widgets/layouts/Root/RootLayoutView.tsx` — existente:
  montar `FeedbackLayout` uma única vez dentro dos providers client-side.
- `apps/web/src/app/(home)/layout.tsx`, `challenging/layout.tsx`,
  `lesson/layout.tsx`, `rewarding/layout.tsx`, `playground/snippets/layout.tsx`
  e layout de challenge — existentes: remover wrappers duplicados.
- `FeedbackLayout` — existente: Entry Point resolve autenticação/pathname e
  services; View só envolve children e renderiza o diálogo quando autorizado.

#### Diálogo e widgets

Evoluir `FeedbackDialog` mantendo Widget Pattern. O hook recebe services,
usuário, toast e navegação por parâmetros; não busca context diretamente.

- Estado de navegação:
  `home | create | createSuccess | history | detail(reportId)`.
- Estado de dados independente por view:
  `idle | loading | error | empty | content`.
- `useFeedbackDialog` mantém criação, drafts por report ID, paginação/filtros,
  badge, abertura por pathname, invalidação após ações e proteção de submit.
- Extrair widgets novos (cada um com `index.tsx`, `*View.tsx` e hook quando
  houver lógica): `FeedbackReportsHistory`, `FeedbackReportConversation`,
  `FeedbackMessageComposer`, `FeedbackAttachmentsInput` e
  `FeedbackUnreadBadge`.
- Reutilizar `ScreenCropper` apenas no desktop; `FeedbackAttachmentsInput`
  oferece `<input type=file accept="image/png,image/jpeg">` em todos os
  viewports e valida quantidade/tamanho antes do upload.
- O relato inicial e anexos de mensagens usam IDs UUID gerados antes do upload;
  uploads concluem em conjunto antes de enviar o payload canônico.
- Fechar o diálogo preserva drafts; sucesso limpa apenas o draft enviado.
- Erro de leitura não impede renderizar conversa já carregada; badge pode ser
  reconsultado/reparado ao reabrir.

#### Deep link e autenticação

- `apps/web/src/app/feedback/[feedbackReportId]/page.tsx` — novo arquivo:
  Entry Point endereçável que permite ao layout global abrir o detalhe e fornece
  fallback acessível enquanto o diálogo inicializa.
- `apps/web/src/constants/routes.ts` — existente: adicionar
  `feedback.report(id)`.
- `apps/web/src/middleware.ts` — existente: ao redirecionar rota privada,
  construir `nextRoute` com pathname+query internos codificados.
- `SignIn` — existente: validar `nextRoute` antes de `router.goTo`; rejeitar
  absoluto, protocol-relative e rotas de autenticação recursivas. Preservar o
  destino também no fluxo social, carregando-o até a confirmação social.

## Referências de design

Fonte visual canônica: `design/stardust.pen`.

| Node ID | Nome/finalidade informada | Estado/viewport | RF/CA |
|---|---|---|---|
| `bTYzS` | `Feedback Reporting Dialog` | desktop `720×450`; entrada inicial com `Problema`, `Ideia`, `Outro`, CTA `Ver meus reportes`, badge `2` e link Discord | RF-02–RF-05, RF-19 / CA-02–CA-07, CA-24 |
| `r6xBJD` | `My Feedback Reports Modal` | desktop `720×680`; conteúdo com três itens, filtro `Todos`, status aberto/fechado e footer; primeiro item ainda exibe unread `2` | RF-06–RF-08, RF-19 / CA-08–CA-11, CA-24 |
| `hi2Ot` | `Feedback Report Detail View` | desktop `720×680`; detalhe aberto com relato, anexo PNG, resposta da Equipe StarDust e compositor | RF-09–RF-15, RF-18–RF-19 / CA-12–CA-20, CA-24 |

Mudança visual exigida e confirmada: no node `r6xBJD`, substituir o texto
`Problema Report Unread Count` (`zSm9F`, conteúdo atual `2`) por `Nova resposta`;
o contador numérico permanece no acesso principal de `bTYzS`. O arquivo `.pen`
integra o escopo porque essa alteração precisa ser aplicada e validada.

Os três frames são referências desktop de conteúdo e não possuem nodes
canônicos para mobile, loading, error, empty, detalhe fechado ou sucesso de
criação. Para essa divergência, Issue #519/milestone 41 e RF-08/RF-14/RF-19 têm
precedência: o Builder deve preservar a linguagem visual dos frames existentes,
usar painel de tela inteira no mobile e implementar os estados comportamentais
declarados, sem inventar um novo design visual fora do sistema atual. Não é
necessário criar novos frames `.pen` além da alteração explícita em `r6xBJD`;
Pencil valida os três estados desktop existentes e Playwright valida os estados
e viewports sem referência visual canônica. Nenhum problema de layout foi
reportado pelo Pencil nos três nodes durante a inspeção.

Para esta revisão, `bTYzS`, `r6xBJD` e `hi2Ot` são referências visuais
obrigatórias e devem ser comparados com a Web nos seus viewports desktop
canônicos (`720×450`, `720×680` e `720×680`, respectivamente). A comparação
deve ser independente da inspeção de runtime e registrar screenshot ou diff por
node, com a matriz contendo node, viewport, estado, rota, commit/HEAD e
artefato. O resultado é aprovado quando o contêiner do diálogo e cada anchor
estrutural comparável (header, conteúdo, cards/linhas, footer/composer) ficam
em uma tolerância máxima de 4 px, não existe clipping ou overflow horizontal,
e a hierarquia tipográfica e os tokens visuais permanecem equivalentes. A
quantidade, texto e avatar dos registros reais podem divergir do fixture do
Pencil, mas cada divergência deve ser classificada como conteúdo/estado e não
usada para mascarar diferença de layout. Cada widget alterado também deve
possuir uma entrada na auditoria de `ui-layer-rules.md`, com Entry Point, View,
Hook, linhas avaliadas e resultado.

## Decisões técnicas

### DT-01 — Leitura simétrica no reporte

- **Evidência:** a fundação guarda `last_user_message_at/studio_read_at`; o novo
  badge precisa da perspectiva inversa.
- **Alternativas:** tabela de receipts por mensagem; contador derivado por query;
  timestamps simétricos no reporte.
- **Decisão:** adicionar `last_admin_message_at/author_read_at` ao reporte.
- **Motivo:** o MVP possui dois participantes fixos e precisa contar reportes,
  não mensagens; timestamps mantêm leitura monotônica e consulta indexável.
- **Trade-off:** não modela múltiplos leitores por papel; isso está fora do MVP.
- **Impacto:** RF-06, RF-10; CA-08, CA-14, CA-15.

### DT-02 — Endpoints `mine` separados dos administrativos

- **Evidência:** rotas atuais exigem god account e DTO de página contém resumo
  administrativo.
- **Alternativas:** mesma rota com comportamento pelo papel; rotas próprias.
- **Decisão:** criar `/mine`, mantendo rotas administrativas intactas.
- **Motivo:** reduz ambiguidade de autorização e evita expor filtros/summary do
  Studio ao usuário.
- **Trade-off:** mais controllers/métodos REST, com reutilização do domínio.
- **Impacto:** RF-07, RF-09; CA-09, CA-12, CA-25.

### DT-03 — Leitura por mensagem observada

- **Evidência:** `now()` pode marcar como lida uma resposta que chegou depois do
  payload renderizado.
- **Decisão:** client envia o ID da última mensagem administrativa renderizada;
  servidor valida report/role e persiste o timestamp dela monotonicamente.
- **Trade-off:** uma leitura exige lookup adicional, em troca de correção em
  concorrência.
- **Impacto:** RF-10; CA-14, CA-15.

### DT-04 — Upload inicial contextual em reporting

- **Evidência:** endpoint genérico atual valida folder/extensão, mas não o
  contrato de tamanho/MIME da feature.
- **Alternativas:** ampliar globalmente Storage; validar só no browser; endpoint
  contextual.
- **Decisão:** endpoint contextual autenticado, com revalidação do objeto no
  use case de criação.
- **Trade-off:** uma rota adicional; evita alterar sem necessidade outros uploads.
- **Impacto:** RF-04, RF-05; CA-05, CA-06.

### DT-05 — Montagem global única e condicionada à autenticação

- **Evidência:** wrappers atuais estão repetidos e não cobrem toda a árvore;
  trigger é oculto apenas por breakpoint.
- **Decisão:** montar uma vez no Root e condicionar por conta/pathname.
- **Trade-off:** provider global executa a checagem em todas as rotas, mas não
  busca dados nem renderiza o diálogo para visitante.
- **Impacto:** RF-01, RF-02, RF-16; CA-01, CA-02, CA-21.

### DT-06 — Rascunhos somente em memória

- **Evidência:** milestone exclui persistência entre sessões.
- **Decisão:** estado do hook mantém criação e mapa por report ID; sem
  localStorage, cookie ou backend.
- **Trade-off:** reload perde rascunhos, comportamento explicitamente aceito.
- **Impacto:** RF-05, RF-15; CA-07, CA-20.

### DT-07 — Sem outbox nesta entrega

- **Evidência:** revisão 5 da Spec #518 removeu garantia transacional de entrega;
  repositories não publicam e broker ocorre após persistência.
- **Decisão:** preservar o evento/job existentes e não ampliar escopo para outbox.
- **Trade-off:** falha entre commit e publish pode exigir observabilidade/reparo
  operacional; a mensagem nunca é desfeita.
- **Impacto:** RF-13; CA-16, CA-26.

### DT-08 — Histórico anterior aparece como não lido

- **Evidência:** não havia UI Web onde o autor pudesse registrar leitura.
- **Alternativas:** marcar tudo lido no backfill; deixar `author_read_at` nulo.
- **Decisão:** backfill apenas `last_admin_message_at`, mantendo leitura nula.
- **Trade-off:** badge inicial pode conter conversas antigas, mas não perde
  respostas jamais vistas no canal canônico.
- **Impacto:** RF-06; CA-08.

## Plano de validação

### Testes automatizados

- **Core/domain/use cases:** título/limites, unread simétrico, ownership, closed,
  idempotência, leitura por papel/mensagem, evento após persistência.
- **Validation:** limites de texto/anexos, whitespace, UUID/extensão/MIME/tamanho,
  query `mine` e read payload.
- **Repository/mappers:** list/count por autor, ordenação/paginação, backfill,
  leitura monotônica e concorrência, novos timestamps.
- **Rotas server:** autenticação, god route preservada, endpoints `mine`, `404`
  indistinguível, status codes e payload sem `userId`.
- **Queue:** job existente continua agnóstico, idempotente e com IO em
  `amqp.run`; falha não altera persistência.
- **Widgets Web:** máquina de views, filtros/paginação, drafts, upload parcial,
  submit duplicado, invalidacão do badge, fechado e deep link.
- **Integração Web (Playwright):** ampliar ServerMock para endpoints próprios e
  cobrir criação, histórico, detalhe, resposta, fechado, ownership seguro,
  mobile e retorno de login.

### Sensores

- `npm run format` (aplicação de formatação, não gate).
- `npm run check:code`.
- `npm run check:types`.
- `npm run test:unit`.
- `npm run check:architecture` devido às mudanças cross-layer.
- `npm run test:integration`, incluindo
  `npm --workspace @stardust/web run test:integration`.
- Auditoria de `documentation/rules/ui-layer-rules.md` por widget alterado,
  separada de `check:architecture`.
- Quality Gate e build final permanecem no CI.

### Validação manual obrigatória

Após implementação e sensores:

1. Subir Server em uma porta alternativa (`3334`, preservando a `3333` do
   usuário) e Web em uma porta alternativa livre (por exemplo `3001`,
   preservando a `3000` do usuário), usando credenciais reais apenas via
   `WEB_APP_E2E_EMAIL/WEB_APP_E2E_PASSWORD` carregadas pelo script do projeto.
2. Registrar `console`, `pageerror`, `requestfailed` e respostas de
   `/auth/account`, endpoints `reporting/feedback` e storage.
3. Autenticar, validar uma rota protegida além do login e exercitar criação sem
   imagem, criação com arquivo/captura, falha recuperável, histórico vazio e com
   conteúdo, filtros, carregar mais, detalhe, leitura, resposta com anexos,
   reporte fechado e ID sem acesso.
4. Repetir em desktop e viewport mobile, incluindo teclado virtual/safe area,
   foco, Escape, rolagem e alvos de toque.
5. Abrir deep link sem sessão, confirmar `nextRoute`, autenticar e verificar
   retorno ao detalhe; tentar destino externo e confirmar fallback seguro.
6. Confirmar `2xx/201/204` nos fluxos válidos, `404` seguro em ownership e
   ausência de erros de console/rede não esperados.
7. Inspecionar/atualizar `bTYzS`, `r6xBJD` e `hi2Ot` no Pencil e comparar os
   estados/viewports finais com a Web real, com screenshots nomeados por node,
   viewport, estado, rota e HEAD.
8. Executar a auditoria de `ui-layer-rules.md` para cada widget alterado e
   registrar os paths e linhas no `evaluation.md`.

### Banco remoto

- A consulta read-only de 2026-08-06 confirmou no Supabase Dev:
  - `feedback_reports` com `screenshot`, `title`, `status`,
    `last_activity_at`, `last_user_message_at` e `studio_read_at`, sem os dois
    timestamps do autor propostos nesta Spec;
  - `feedback_messages` e `feedback_message_attachments` com os shapes,
    constraints estruturais e relacionamentos esperados pela fundação;
  - somente `list_feedback_reports(...)` entre as funções consultadas, com
    `security invoker`, volatilidade `stable` e `execute` para `anon` e
    `authenticated`; as funções `mine` propostas ainda não existem;
  - índices `feedback_reports_queue_idx`, `feedback_reports_unread_idx`,
    `feedback_reports_user_idx`, `feedback_messages_report_idx` e
    `feedback_message_attachments_message_idx`;
  - grants `select`, `insert` e `update` para `anon` e `authenticated` nas três
    tabelas, sem grant de `delete`;
  - migrations remotas `grant_feedback_list_permissions` e
    `refresh_feedback_reports_listing_contract` como últimas migrations de
    reporting registradas.
- Aplicar a migration pelo MCP Supabase Dev.
- Validar assinatura/`security invoker`, grants, backfill, planos/índices,
  listagem por ownership, count e leitura monotônica no mesmo projeto remoto
  usado pelo Server.
- Não usar banco local como substituto da evidência Dev.

## Avaliações previstas

- **Judge Spec:** obrigatório após resolver Pencil e Supabase Dev; avaliar
  rastreabilidade, contracts, ownership, migration e validação.
- **Judge Plan:** obrigatório por ser entrega faseada e cross-workspace.
- **Modo de julgamento da implementação:** `Final`, por decisão explícita do
  usuário. Não criar Judges de implementação por fase; cada fase passa pelos
  sensores aplicáveis e fica aguardando a avaliação integrada.
- **Judge Implementation Final único:** após todas as fases, integração,
  sensores integrados e preflight, comparar revisão congelada, diff integrado,
  banco Dev, Pencil, Playwright e a auditoria da UI. Qualquer alteração após o
  veredito invalida o julgamento e exige nova avaliação final.
- Criar `evaluation.md` no primeiro julgamento/implementação relevante, nunca
  vazio, registrando revisão, commit-base, matriz CA e evidências reais.

## Alinhamento documental

- Atualizar `documentation/architecture.md` com o fluxo Web de histórico,
  ownership, leitura simétrica e deep link após implementação aceita.
- Atualizar `documentation/overview.md` se a feature alterar a lista/status de
  funcionalidades disponíveis ao usuário.
- Atualizar Rules apenas se a implementação revelar regra reutilizável; não
  registrar decisão específica desta feature como regra global.
- O PRD ausente deve ser restaurado em
  `documentation/features/reporting/feedback-dialog/prd.md` em demanda
  documental separada ou por amendment explícito; esta Spec não inventa seu
  conteúdo.

## Questões pendentes

- Nenhuma.

## Judge Spec — revisão 1

- **Primeiro veredito:** `failed`.
- **JS-01 — Referências Pencil não verificadas:** resolvido. Os nodes foram
  inspecionados estrutural e visualmente; dimensões, conteúdo, ausência de
  variantes e divergência do badge numérico foram registradas com precedência.
- **JS-02 — Schema remoto Dev não verificado:** resolvido. A consulta read-only
  no Supabase Dev confirmou colunas, função `security invoker`, índices, grants
  e migrations; as novas colunas/funções propostas não existem ainda.
- **JS-03 — Contrato de criação com anexo inicial incompleto:** corrigido na
  Spec ao declarar `CreateFeedbackReportRequest`, a nova assinatura de
  `ReportingService.sendFeedbackReport`, o payload HTTP, a composição server-side
  do autor e o mapeamento `initialAttachment.storageKey` →
  `FeedbackReport.screenshot` → coluna/DTO, além do tipo completo de
  `UserFeedbackReportsPageDto.items`.
- **Reavaliação após JS-01–JS-03:** `accepted`.
- **Findings bloqueantes na reavaliação:** nenhum.
- **Evidências determinantes:** inspeção estrutural/visual dos três nodes Pencil,
  confirmação read-only do schema/funções/índices/grants/migrations no Supabase
  Dev, fechamento do contrato do anexo inicial e `git diff --check` sem erros.
- **Roteamento aceito:** `create-plan`, pois a entrega atravessa múltiplos
  workspaces, migration remota, autorização, UI responsiva e validação browser.

## Amendments

- **Revisão 1 — 2026-08-06:** criação inicial a partir das Issues #519/#518,
  milestone 41, arquitetura, Rules, Spec/evidências da fundação e codebase atual.
  Mantida em `draft` porque Pencil e Supabase Dev estavam desconectados. O
  primeiro Judge falhou em JS-01/JS-02 por esses bloqueios e em JS-03 pelo
  contrato incompleto do anexo inicial; JS-02 foi resolvido com evidência do
  Supabase Dev, JS-01 foi resolvido pela inspeção Pencil e JS-03 foi corrigido
  antes do novo julgamento. A reavaliação aceitou a revisão 1 sem findings e a
  Spec foi promovida para `open`. Por decisão explícita posterior do usuário, o
  modo de julgamento da implementação foi fixado como `Final`, sem Judges por
  fase; essa decisão operacional não altera RF, CA, escopo ou Contract.
- **Revisão 2 — 2026-08-10:** Contract reforçado com CA-27/CA-28, comparação
  visual Pencil/Web obrigatória por node e viewport, auditoria estrutural de
  UI por widget, validade do Judge somente no HEAD avaliado e preservação das
  portas/processos do usuário durante a validação. A revisão exige novo Judge
  Spec antes de retomar a implementação e invalida o aceite de implementação
  anterior, pois houve alterações posteriores e as evidências visual/UI eram
  insuficientes.
- **Revisão 3 — 2026-08-11:** esclarece que `originalName` é metadata de
  exibição e não deve impor extensão nem validar o binário; a extensão da chave
  gerada, o MIME, o tamanho e os metadados reais permanecem obrigatórios. A
  revisão também registra a preservação do deep link `/feedback/:id` durante
  a autenticação e o uso explícito do client service-role para mutações de
  administradores.
