# Spec: Widget de Feedback

### Application web
### Ultima atualização: 28/01/2026
### Status: em desenvolvimento

### 1. Objetivo
Implementar um widget de feedback robusto e interativo ("Deixe seu feedback") que permita aos usuários reportar problemas, sugerir melhorias ou enviar mensagens gerais diretamente da interface. O fluxo deve incluir um menu de seleção de tipo, formulários específicos e feedback de sucesso, integrado à API de Reporting.

### 2. O que já existe?
Recursos já mapeados na codebase que compõem a base desta feature.

*   **`FeedbackReport`** (`packages/core/src/reporting/domain/entities/FeedbackReport.ts`) - *Entidade de domínio que representa o feedback.*
*   **`ReportingService`** (`packages/core/src/reporting/interfaces/ReportingService.ts`) - *Interface do serviço de report.*
*   **`feedbackReportSchema`** (`packages/validation/src/modules/reporting/schemas/feedbackReportSchema.ts`) - *Schema Zod para validação dos dados.*
*   **`Dialog`** (`apps/web/src/ui/global/widgets/components/Dialog/Dialog.tsx`) - *Componente base de modal para exibir o widget.*
*   **`StorageService`** (`apps/web/src/rest/services/StorageService.ts`) - *Serviço para upload de arquivos.*
*   **`StorageFolder`** (`packages/core/src/storage/domain/structures/StorageFolder.ts`) - *Estrutura que define as pastas de armazenamento.*

### 3. O que deve ser criado?

#### Camada REST (Services)
Serviço responsável pela comunicação HTTP com o backend para envio do feedback.

*   **Localização:** `apps/web/src/rest/services/ReportingService.ts`
*   **Dependências:** `RestClient` (injetado).
*   **Métodos:**
    *   `sendFeedbackReport(feedbackReport: FeedbackReport): Promise<RestResponse>` - Envia o DTO do feedback para o endpoint POST `/reporting/feedback`.

#### Camada UI (Widgets)
O widget será composto por um fluxo de passos (Wizard simples) dentro de um Dialog.

*   **Localização:** `apps/web/src/ui/reporting/widgets/FeedbackDialog/index.tsx`
*   **Index:** Ponto de entrada. Instancia o `useFeedbackDialog` e renderiza o `FeedbackDialogView`.

*   **Localização:** `apps/web/src/ui/reporting/widgets/FeedbackDialog/FeedbackDialogView.tsx`
*   **View:** Renderiza o componente `Dialog`.
    *   **Estados visuais:**
        *   `initial`: Menu de seleção de tipo (Bug, Ideia, Outro).
        *   `form`: Formulário de input (Textarea + Screenshot opcional).
        *   `success`: Mensagem de agradecimento.
        *   `error`: Estado de erro no envio.
    *   **Props:** Recebe dados e handlers do hook (`step`, `setStep`, `onSubmit`, `isSubmitting`).

*   **Localização:** `apps/web/src/ui/reporting/widgets/FeedbackDialog/useFeedbackDialog.ts`
*   **Hook:** Gerencia a máquina de estados do widget e lógica de envio.
    *   **State:** `step`, `intent`, `isSubmitting`, `screenshotFile`.
    *   **Dependências:** `ReportingService`, `StorageService`.
    *   **Integração:**
        1.  No `handleSubmit`:
        2.  Se houver `screenshotFile`, chama `StorageService.uploadFile(StorageFolder.createAsFeedback(), screenshotFile)`.
        3.  Recebe a URL da imagem.
        4.  Cria a entidade `FeedbackReport` com a URL da imagem (se houver).
        5.  Chama `ReportingService.sendFeedbackReport`.

### 4. O que deve ser modificado?

*   **Arquivo:** `apps/web/src/ui/global/layout/GlobalLayout.tsx`
    *   **Mudança:** Importar e adicionar `<FeedbackDialog />`.

*   **Arquivo:** `packages/core/src/storage/domain/structures/StorageFolder.ts`
    *   **Mudança:** Adicionar folder `feedback` à lista de pastas válidas e método `createAsFeedback()`.

### 5. O que deve ser removido?
Nenhuma remoção prevista.

### 6. Diagramas e Referências

#### Fluxo de Dados

```ascii
[ User ] --(Clica Feedback)--> [ FeedbackDialog (UI) ]
                                      |
                               (Preenche Form + Screenshot)
                                      |
                               (Submit)
                                      v
                             [ useFeedbackDialog (Hook) ]
                                      |
                                      +---(Tem Screenshot?)---Yes--> [ StorageService.uploadFile ]
                                      |                                       |
                                      |                               (POST /storage/files/feedback)
                                      |                                       |
                                      |<-------(Image URL)--------------------+
                                      |
                               (Cria Entidade FeedbackReport)
                                      |
                                      v
                             [ ReportingService (REST) ]
                                      |
                               (POST /reporting/feedback)
                                      v
                             [ Backend API ]
```

#### Layout (FeedbackDialogView)

```ascii
+---------------------------------------+
|  Dialog                               |
| +-----------------------------------+ |
| |  [X]                              | |
| |                                   | |
| |  (Step 2: Form)                   | |
| |  Tipo: Bug                        | |
| |  [ Textarea descritiva...       ] | |
| |                                   | |
| |  [+] Anexar Screenshot            | |
| |  (Preview: [ img.png ])           | |
| |                                   | |
| |  [ Cancelar ]      [ Enviar > ]   | |
| +-----------------------------------+ |
+---------------------------------------+
```
