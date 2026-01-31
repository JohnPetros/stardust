# Spec: Endpoint de Deleção de Feedback Reports

> application: server

### 1. Objetivo
Implementar o endpoint REST `DELETE /feedback/:feedbackId` para permitir que administradores (God Account) excluam relatórios de feedback. A operação deve remover permanentemente o registro da base de dados.

### 2. O que já existe?
*   **`DeleteFeedbackReportUseCase`** (`packages/core/src/reporting/use-cases/DeleteFeedbackReportUseCase.ts`) - Caso de uso já implementado no core.
*   **`FeedbackReportsRepository`** (`packages/core/src/reporting/interfaces/FeedbackReportsRepository.ts`) - Interface do repositório já definida.

### 3. O que deve ser criado?

#### Camada REST (Controllers)
*   **Localização:** `apps/server/src/rest/controllers/reporting/DeleteFeedbackReportController.ts`
*   **Dependências:** `DeleteFeedbackReportUseCase`
*   **Dados de request:**
    *   `feedbackId` (parâmetro de rota)
*   **Dados de response:** `204 No Content`
*   **Métodos:** `handle(http: Http): Promise<RestResponse>`

### 4. O que deve ser modificado?

*   **Arquivo:** `apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackReportsRepository.ts`
*   **Mudança:** Implementar os métodos `findById` e `remove` que estão faltando na implementação concreta para satisfazer a interface `FeedbackReportsRepository`.
    *   `findById(feedbackId: Id): Promise<FeedbackReport | null>`
    *   `remove(feedbackId: Id): Promise<void>`

*   **Arquivo:** `apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts`
*   **Mudança:**
    *   **Adicionar Middlewares de Admin:** As rotas de listagem (`GET /`) e deleção (`DELETE /:feedbackId`) devem ser restritas a administradores. Utilize `this.authMiddleware.verifyGodAccount` logo após `verifyAuthentication`.
    *   **Atualizar `registerListFeedbackReportsRoute()`:** Inserir `this.authMiddleware.verifyGodAccount`.
    *   **Criar `registerDeleteFeedbackRoute()`:**
        *   Rota: `DELETE /:feedbackId`.
        *   Middlewares: `verifyAuthentication`, `verifyGodAccount`.
        *   **Validação:** Utilizar `this.validationMiddleware.validate('param', z.object({ feedbackId: idSchema }))`.
        *   Instanciar `SupabaseFeedbackReportsRepository`, `DeleteFeedbackReportUseCase` e `DeleteFeedbackReportController`.

*   **Arquivo:** `apps/server/src/rest/controllers/reporting/index.ts`
*   **Mudança:** Exportar `DeleteFeedbackReportController`.

### 5. O que deve ser removido?
N/A

### 6. Diagramas e Referências

*   **Fluxo de Dados:**
```ascii
[Client] -> (DELETE /feedback/:id) -> [FeedbackRouter]
                                            |
                                            v
                                  [DeleteFeedbackReportController]
                                            |
                                            v
                                  [DeleteFeedbackReportUseCase]
                                            |
                                            v
                                 [SupabaseFeedbackReportsRepository] -> (Supabase DB)
```

