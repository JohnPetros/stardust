# Spec: Página de Gerenciamento de Relatórios de Feedback

> application: studio

### 1. Objetivo
Implementar a página de gerenciamento de relatórios de feedback na aplicação StarDust Studio. A funcionalidade permitirá aos administradores visualizar uma listagem paginada de feedbacks, aplicar filtros (por autor, data, tipo), visualizar os detalhes completos de um relatório e realizar a exclusão de relatórios indesejados.

### 2. O que já existe?
*   **`FeedbackRouter`** (`apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts`) - Expõe as rotas GET `/feedback` e DELETE `/feedback/:feedbackId`.
*   **`FeedbackReport`** (`packages/core/src/reporting/domain/entities`) - Entidade de domínio.
*   **`useRestContext`** (`apps/studio/src/ui/global/hooks/useRestContext.ts`) - Hook para acesso ao RestContext.
*   **`usePaginatedFetch`** (`apps/studio/src/ui/global/hooks/usePaginatedFetch.ts`) - Hook para fetch de dados paginados.

### 3. O que deve ser criado?

#### Camada REST (Services)
*   **Localização:** `apps/studio/src/rest/services/ReportingService.ts`
*   **Dependências:** `RestClient` (interno do axios/fetch wrapper).
*   **Métodos:**
    *   `listFeedbackReports(params: FeedbackReportsListingParams): Promise<RestResponse<FeedbackReport[]>>` - Realiza GET em `/feedback`.
    *   `deleteFeedbackReport(feedbackId: string): Promise<RestResponse<void>>` - Realiza DELETE em `/feedback/:feedbackId`.

#### Camada UI (Widgets - Page)
*   **Localização:** `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage`
*   **Props:** Nenhuma (Página principal).
*   **Estados (Hook `useFeedbackReportsPage`):**
    *   `isLoading`: boolean
    *   `reports`: FeedbackReport[]
    *   `filters`: Objeto com estados dos filtros (page, authorName, intent, dates).
    *   `selectedReport`: FeedbackReport | null (para dialog de detalhes).
    *   `reportToDelete`: FeedbackReport | null (para dialog de exclusão).
*   **View:** `FeedbackReportsPageView.tsx`
*   **Widgets internos:**
    *   `FeedbackReportsTable`
    *   `FeedbackReportDialog`
    *   `DeleteFeedbackReportDialog`

#### Camada UI (Widgets - Components)
*   **Localização:** `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/FeedbackReportsTable`
*   **Props:**
    *   `reports`: FeedbackReport[]
    *   `isLoading`: boolean
    *   `onView`: (report: FeedbackReport) => void
    *   `onDelete`: (report: FeedbackReport) => void
*   **View:** Tabela usando componentes do `shadcn/ui`.
    *   **Colunas:**
        *   **Autor:** Avatar + Nome.
        *   **Tipo (Intent):** `Badge` (Bug=Destructive/Orange, Idea=Green/Blue, Other=Secondary).
        *   **Data:** Formatada (`dd/MM/yyyy HH:mm`) use o Datetime (packages/core/src/global/interfaces/libs/Datetime.ts).
        *   **Preview:** Miniatura do screenshot (lazy loaded) ou texto.
        *   **Ações:** Botões View (ícone olho) e Delete (ícone lixeira).

*   **Localização:** `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/FeedbackReportDialog`
*   **Props:**
    *   `report`: FeedbackReport | null
    *   `isOpen`: boolean
    *   `onClose`: () => void
    *   `onDelete`: (report: FeedbackReport) => void
*   **View:** `Dialog` do `shadcn/ui`.
    *   Exibir detalhes completos, incluindo screenshot com opção de zoom/expandir.
    *   **Footer:** Botão "Fechar" e Botão "Deletar" (Destructive).

*   **Localização:** `apps/studio/src/ui/reporting/widgets/pages/FeedbackReportsPage/DeleteFeedbackReportDialog`
*   **Props:**
    *   `report`: FeedbackReport | null
    *   `isOpen`: boolean
    *   `isDeleting`: boolean
    *   `onClose`: () => void
    *   `onConfirm`: () => void
*   **View:** `AlertDialog` do `shadcn/ui` para confirmação.

#### Camada React Router App (Routes)
*   **Localização:** `apps/studio/src/app/routes.ts` (ou arquivo de definição de rotas equivalente).
*   **Caminho da rota:** `/reporting/feedback` (mapeado para `ROUTES.reporting.feedback`).
*   **Widget:** `FeedbackReportsPage`.

### 4. O que deve ser modificado?

*   **Arquivo:** `apps/studio/src/constants/routes.ts`
    *   **Mudança:** Adicionar a rota de reporting.
    ```typescript
    reporting: {
      feedback: '/reporting/feedback',
    },
    ```

*   **Arquivo:** `apps/studio/src/ui/global/pages/layouts/App/Sidebar` (dentro da estrutura do sidebar)
    *   **Mudança:** Adicionar o link para "Feedback Reports" na navegação lateral, visível apenas para usuários com permissão adequada (se aplicável, ou geral para admins do studio).

### 5. O que deve ser removido?
N/A

### 6. Diagramas e Referências

#### Fluxo de Dados UI -> API
```ascii
[FeedbackReportsPage (Hook)]
       |
       v (useEffect / onFilterChange)
[ReportingService.listFeedbackReports]
       |
       v (HTTP GET /feedback)
[API Server (FeedbackRouter)]
       |
       v
[ListFeedbackReportsController] -> [UseCase] -> [Repo]
```

#### Estrutura Visual (Esboço)
```ascii
+-------------------------------------------------------+
|  Sidebar  |  Feedback Reports                             |
|           |                                               |
|  [Menu]   |  [Filters: Date, Author, Intent]   [Search]   |
|           |                                               |
|           |  +-----------------------------------------+  |
|           |  | Date  | Author | Type | Desc | Actions  |  |
|           |  |-------|--------|------|------|----------|  |
|           |  | 10/10 | Petros | Bug  | Err..| [O] [X]  |  |
|           |  +-----------------------------------------+  |
|           |                                               |
|           |                 <  1 2 3  >                   |
+-------------------------------------------------------+
```

**ChallengesTable**: `apps/studio/src/ui/global/widgets/components/ChallengesTable`