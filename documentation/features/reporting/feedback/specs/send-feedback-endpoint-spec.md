# Spec: Endpoint de Envio de Feedback

### Application `server`
### Ultima atualização: 28/01/2026
### Status: em desenvolvimento

### 1. Objetivo
Implementar o endpoint REST e todo o fluxo de backend necessário para receber, persistir e notificar feedbacks enviados pelos usuários. O fluxo deve garantir que o feedback seja salvo no banco de dados e, de forma assíncrona, enviado para o canal do Discord via Webhook.

### 2. O que já existe?
Recursos da codebase que serão utilizados ou impactados:
*   **`SendFeedbackReportUseCase`** (`packages/core/src/reporting/use-cases/SendFeedbackReportUseCase.ts`) - Use Case responsável por criar a entidade, persistir e disparar o evento.
*   **`FeedbackReport`** (`packages/core/src/reporting/domain/entities/FeedbackReport.ts`) - Entidade de domínio representando o feedback.
*   **`FeedbackReportSentEvent`** (`packages/core/src/reporting/domain/events/FeedbackReportSentEvent.ts`) - Evento disparado após o sucesso do feedback.
*   **`FeedbackReportsRepository`** (`packages/core/src/reporting/interfaces/FeedbackReportsRepository.ts`) - Interface de repositório.
*   **`DiscordNotificationService`** (`apps/server/src/rest/services/DiscordNotificationService.ts`) - Serviço existente de notificação para Discord (será estendido).

### 3. O que deve ser criado?

#### Camada REST (Controllers)
*   **Localização:** `apps/server/src/rest/controllers/reporting/SendFeedbackReportController.ts`
*   **Dependências:** `SendFeedbackReportUseCase`
*   **Dados de request:** `content` (string), `intent` (idea, bug, IDEA), `screenshot` (string base64, opcional).
*   **Dados de response:** `FeedbackReportDto` (id, content, intent, etc).
*   **Métodos:** `handle(http: Http<Schema>): Promise<RestResponse>`

#### Pacote Validation (Schemas)
*   **Localização:** `packages/validation/src/modules/reporting/schemas/SendFeedbackReportSchema.ts`
*   **Atributos:**
    *   `content`: string, min(10), max(1000).
    *   `intent`: enum(['idea', 'bug', 'IDEA']).
    *   `screenshot`: string, optional.

#### Camada Queue (Jobs)
*   **Localização:** `apps/server/src/queue/jobs/reporting/NotifyFeedbackOnDiscordJob.ts`
*   **Dependências:** `DiscordNotificationService`
*   **Evento Gatilho:** `FeedbackReportSentEvent`
*   **Lógica:** Deve escutar o evento `FeedbackReportSentEvent` e chamar o método `sendFeedbackReportNotification` do serviço de Discord para enviar o feedback formatado (com screenshot se houver).

#### Camada Hono App (Routes)
*   **Localização:** `apps/server/src/app/hono/routers/reporting/ReportingRouter.ts`
*   **Middlewares:** `EnsureAuthenticatedMiddleware` (assumindo que apenas usuários logados enviam feedback).
*   **Caminho da rota:** `/reporting/feedback` (POST)
*   **Dados de schema:** `SendFeedbackReportSchema`

### 4. O que deve ser modificado?

*   **Arquivo:** `apps/server/src/rest/services/DiscordNotificationService.ts`
*   **Mudança:** Adicionar método `sendFeedbackReportNotification(report: FeedbackReportDto)`. Este método deve formatar a mensagem para o Discord, incluindo embeds para a screenshot e cores diferentes baseadas no `intent` (ex: Vermelho para bug, Verde para idea).

*   **Arquivo:** `apps/server/src/app/hono/routers/index.ts` (ou arquivo principal de registro de rotas)
*   **Mudança:** Registrar o novo router `ReportingRouter`.

### 5. O que deve ser removido?
N/A

### 6. Diagramas e Referências
#### Fluxo de Dados
```ascii
[Client] 
   | POST /reporting/feedback
   v
[Hono Route] -> [SendFeedbackReportController]
                       |
                       v
               [SendFeedbackReportUseCase]
                       |
        +--------------+--------------+
        |                             |
        v                             v
[FeedbackReportsRepository]     [Broker (Event Dispatch)]
(Persiste no DB)                      |
                                      v
                                (FeedbackReportSentEvent)
                                      |
                                      v
                            [NotifyFeedbackOnDiscordJob]
                                      |
                                      v
                            [DiscordNotificationService]
                                      |
                                      v
                                [Discord Webhook]
```
