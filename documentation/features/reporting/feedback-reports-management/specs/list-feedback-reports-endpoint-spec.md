# Spec: Endpoint de Listagem de Feedback Reports

> application: server

### 1. Objetivo
Implementar o endpoint REST `GET /feedback` para listar os relatórios de feedback enviados pelos usuários. O endpoint deve suportar filtros por autor, tipo (intent) e data, além de paginação, conforme requisitos do PRD. Também inclui a implementação dos métodos necessários no repositório e ajustes no use case.

### 2. O que já existe?
*   **`ListFeedbackReportsUseCase`** (`packages/core/src/reporting/use-cases/ListFeedbackReportsUseCase.ts`) - *Caso de uso base para listagem (necessita update).*
*   **`FeedbackRouter`** (`apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts`) - *Router onde o novo endpoint será registrado.*
*   **`SupabaseFeedbackReportsRepository`** (`apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackReportsRepository.ts`) - *Repositório existente (falta implementação do `findMany`).*
*   **`FeedbackReportsListingParams`** (`packages/core/src/reporting/domain/types/FeedbackReportsListingParams.ts`) - *Tipo de parâmetros para o repositório.*

### 3. O que deve ser criado?

#### Camada REST (Controllers)
*   **Localização:** `apps/server/src/rest/controllers/reporting/ListFeedbackReportsController.ts`
*   **Dependências:** `ListFeedbackReportsUseCase`.
*   **Dados de request:** Query Params:
    *   `page`: number (default 1)
    *   `itemsPerPage`: number (default 10)
    *   `authorName`: string (opcional)
    *   `intent`: string ('bug' | 'idea' | 'other', opcional)
    *   `startDate`: ISO Date string (opcional)
    *   `endDate`: ISO Date string (opcional)
*   **Dados de response:** `PaginationResponse<FeedbackReportDto>` contendo a lista de feedbacks e metadados de paginação.
*   **Métodos:** `handle(http: Http): Promise<PaginatedResponse<FeedbackReportDto>>` - Extrai os query params, instancia os Value Objects (Text, Period) se necessário (ou deixa o UseCase fazer) e chama o usecase.

### 4. O que deve ser modificado?

*   **Arquivo:** `packages/core/src/reporting/domain/types/FeedbackReportsListingParams.ts`
    *   **Mudança:** Adicionar propriedades `page?: OrdinalNumber` e `itemsPerPage?: OrdinalNumber`.

*   **Arquivo:** `packages/core/src/reporting/use-cases/ListFeedbackReportsUseCase.ts`
    *   **Mudança:** Atualizar a interface `Request` para incluir `page` e `itemsPerPage`.
    *   **Mudança:** No método `execute`, repassar `page` e `itemsPerPage` para `this.repository.findMany` convertendo para `OrdinalNumber`.

*   **Arquivo:** `apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackReportsRepository.ts`
    *   **Mudança:** Implementar o método `findMany(params: FeedbackReportsListingParams): Promise<ManyItems<FeedbackReport>>`.
    *   **Detalhes de Implementação:**
        *   Construir query no Supabase (`this.supabase.from('feedback_reports').select('*, users(...)', { count: 'exact' })`).
        *   Aplicar filtros e paginação (`calculateQueryRange`).
        *   Converter resultados para entidades `FeedbackReport` usando `SupabaseFeedbackReportMapper`.

*   **Arquivo:** `apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts`
    *   **Mudança:** Utilizar schemas do pacote de validação:
        *   `page`: `pageSchema` (do global)
        *   `itemsPerPage`: `itemsPerPageSchema` (do global)
        *   `authorName`: z.string().optional()
        *   `intent`: `feedbackReportIntentSchema` (do reporting)
        *   `startDate`: `dateSchema` (do global)
        *   `endDate`: `dateSchema` (do global)
    *   **Mudança:** Adicionar método `registerListFeedbackReportsRoute`.
    *   **Mudança:** Validar `query` com o schema composto.
    *   **Mudança:** Configurar `GET /` ligando Controller.

### 5. O que deve ser removido?
N/A

### 6. Diagramas e Referências

*   **Fluxo de Dados:**
    ```
    Request (GET /feedback?page=1&intent=bug)
      v
    ValidationMiddleware
      v
    Controller (Parse params)
      v
    UseCase (Map to Domain Types)
      v
    Repository (Supabase Query with Filters & Pagination)
      v
    Map DB Row -> Entity -> DTO
      v
    Response (PaginationResponse)
    ```

*   **Estrutura da Resposta (PaginationResponse):**
    ```
    Response:
    +-------------------------------------------------+
    | items: FeedbackReportDto[]                      |
    | +---------------------------------------------+ |
    | | id: string (uuid)                           | |
    | | intent: 'bug' | 'idea' | 'other'            | |
    | | content: string                             | |
    | | author: AuthorAggregateDto                  | |
    | | sentAt: Date                                | |
    | +---------------------------------------------+ |
    | totalItemsCount: number                         |
    | itemsPerPage: number                            |
    | totalPagesCount: number                         |
    +-------------------------------------------------+
    ```

### 7. Resumo Técnico Final
A implementação do endpoint `GET /feedback` foi concluída abrangendo todas as camadas necessárias:

1.  **Core Domain:**
    *   Atualização de tipos de domínio e parâmetros para suportar paginação (`OrdinalNumber`) e items por página.
    *   Adaptação do UseCase `ListFeedbackReportsUseCase` para processar e encaminhar os novos critérios de filtro e paginação.

2.  **Infraestrutura (Server):**
    *   Implementação robusta no repositório `SupabaseFeedbackReportsRepository` com `findMany`, utilizando `calculateQueryRange` para paginação eficiente e mappers dedicados (`SupabaseFeedbackReportMapper`) para transformar dados relacionais (Feedback + User + Avatar).
    *   Criação de tipos específicos do Supabase para garantir tipagem correta das respostas do banco.

3.  **Interface REST (Controller/Router):**
    *   Implementação do `ListFeedbackReportsController` com defaults seguros para paginação.
    *   Setup do `FeedbackRouter` utilizando middlewares de validação Zod com schemas modulares e reutilizáveis (`validation` package), garantindo a integridade dos dados de entrada antes mesmo de atingir o controller.

4.  **Qualidade:**
    *   Cobertura de testes unitários para Controller e UseCase.
    *   Verificação completa de tipos e linting sem erros.
