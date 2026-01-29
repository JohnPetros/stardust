# Spec: Widget de Dialog de Feedback

### Application: web
### Ultima atualização: 29/01/2026
### Status: em desenvolvimento

### 1. Objetivo
Implementar o widget `FeedbackDialog` para coletar feedbacks dos usuários. O widget permitirá que o usuário descreva sua experiência, selecione uma intenção (ex: bug, sugestão, elogio) e opcionalmente anexe uma captura de tela. Tecnicamente, a solução envolve a criação de um novo widget seguindo o padrão View-Hook-Index e a implementação da camada de serviço REST para integração com o backend.

### 2. O que já existe?
*   **`FeedbackReport`** (`packages/core/src/reporting/domain/entities/FeedbackReport.ts`) - *Entidade de domínio para feedback.*
*   **`FeedbackReportDto`** (`packages/core/src/reporting/domain/entities/dtos/FeedbackReportDto.ts`) - *DTO para transferência de dados de feedback.*
*   **`Dialog`** (`apps/web/src/ui/global/widgets/components/Dialog`) - *Componente base de dialog reutilizável.*
*   **`useRest`** (`apps/web/src/ui/global/hooks/useRest.ts`) - *Hook para acessar os serviços REST da aplicação.*

### 3. O que deve ser criado?

#### Camada REST (Services)
*   **Localização:** `apps/web/src/rest/services/ReportingService.ts`
*   **Dependências:** `RestClient` injetado via factory.
*   **Métodos:** 
    *   `sendFeedbackReport(dto: FeedbackReportDto): Promise<RestResponse<void>>`: Envia o feedback para o endpoint `POST /reporting/feedback`.

#### Camada UI (Widgets)

##### FeedbackDialog (Widget interno de FeedbackLayout)
*   **Localização:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog`
*   **Index:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/index.tsx`
    *   Consome o hook `useFeedbackDialog`.
    *   Integra a `FeedbackDialogView` com os dados e handlers do hook.
*   **Hook:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/useFeedbackDialog.ts`
    *   Gerencia o estado do formulário (content, intent, screenshot).
    *   **Lógica de Screenshot:**
        - Estado `screenshotPreview`: Armazena a URL base64 da imagem capturada.
        - Estado `isCapturing`: Controla o fechamento temporário do modal para a captura.
        - Handler `handleCapture`:
            1. Seta `isCapturing` como true (o que deve fechar o modal via prop no componente).
            2. Utiliza `navigator.mediaDevices.getDisplayMedia` para obter o stream de vídeo da tela.
            3. Captura o frame atual em um `HTMLCanvasElement`.
            4. Converte o canvas para base64 e salva em `screenshotPreview`.
            5. Para todos os tracks do stream e seta `isCapturing` como false (reabrindo o modal).
    *   Consome `reportingService` do `useRest`.
    *   Handler `handleSubmit`: Valida os dados, cria o DTO (incluindo a screenshot em base64 se houver) e chama `reportingService.sendFeedbackReport`.
    *   Gerencia estados de `isLoading` e `isSuccess`.
*   **View:** `apps/web/src/ui/reporting/widgets/FeedbackDialog/FeedbackDialogView.tsx`
    *   Utiliza os componentes do `Dialog` global.
    *   A prop `open` do `Dialog` deve ser controlada pelo `!isCapturing && isOpen`.
    *   Renderiza:
        - Seleção de intenção (Bug, Ideia, Outro).
        - Área de texto para o conteúdo.
        - Botão de captura com ícone de câmera.
        - Preview da screenshot (se houver) com botão de exclusão.
    *   Exibe feedback visual de envio (loading/sucesso).

##### FeedbackLayout (Widget de Layout)
*   **Localização:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout.tsx`
*   **Props:** `children: ReactNode`.
*   **Responsabilidade:** Define a estrutura visual externa do dialog, em que o children vai ser colocado ao lado do dialog de forma que o dialog fique fixo no canto superior direito da tela. Além disso, envolva o layout em apps/web/src/app/(home)/layout.tsx

### 4. O que deve ser modificado?

*   **Arquivo:** `apps/web/src/rest/services/index.ts`
    *   **Mudança:** Exportar a nova factory function `ReportingService`.
*   **Arquivo:** `apps/web/src/ui/global/hooks/useRest.ts`
    *   **Mudança:** Adicionar o `reportingService` ao retorno do hook, instanciando-o com o `restClient`.

### 5. O que deve ser removido?
Nenhum código será removido nesta tarefa.

### 6. Diagramas e Referências

#### Fluxo de Dados
```ascii
[FeedbackDialogView] --(evento: submit)--> [useFeedbackDialog]
                                                 |
                                                 v
[ReportingService] <--(sendFeedbackReport)-- [useRest]
       |
       +--(POST /reporting/feedback)--> [Backend API]
```

#### Referências
*   `apps/web/src/ui/playground/widgets/components/ShareSnippetDialog` - *Exemplo de widget de dialog com lógica de formulário e serviço.*
*   `apps/web/src/rest/services/ProfileService.ts` - *Referência para implementação de um serviço REST.*