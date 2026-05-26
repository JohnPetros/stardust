# Spec: Widget de Dialog de Feedback

### Application: web
### Ultima atualização: 14/02/2026
### Status: concluído

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

*   **Localização:** `apps/web/src/rest/services/StorageService.ts`
*   **Dependências:** `RestClient` injetado via factory.
*   **Métodos:**
    *   `uploadFile(folder: FileStorageFolderPath, file: File): Promise<RestResponse<{ filename: string }>>`: Realiza upload de arquivos.

#### Camada UI (Widgets)

##### FeedbackDialog (Widget interno de FeedbackLayout)
*   **Localização:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog`
*   **Index:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/index.tsx`
    *   Consome o hook `useFeedbackDialog`.
    *   Integra a `FeedbackDialogView` com os dados e handlers do hook.
*   **Hook:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/useFeedbackDialog.ts`
    *   Gerencia o estado do formulário (content, intent, screenshot).
    *   **Lógica de Screenshot:**
        - Utiliza biblioteca `html-to-image` (`toPng`) para capturar o `document.body`.
        - Executa um warmup do motor de captura ao abrir o dialog/selecionar intenção para reduzir delay na primeira captura.
        - Oculta temporariamente o botão de feedback durante a captura e aplica filtro para ignorar nós com `data-feedback-ignore-capture='true'`.
        - Estado `rawScreenshot`: Armazena a captura bruta para edição.
        - Estado `screenshotPreview`: Armazena a imagem recortada final.
        - Estado `isCapturing` e `isCropping`: Controlam a visibilidade do modal e do cropper.
    *   **Lógica de Upload:**
        - No `handleSubmit`, converte o base64 do crop em `File`.
        - Realiza upload via `storageService` para a pasta `feedback-reports`.
        - Anexa a URL retornada ao `FeedbackReport`.
    *   Consome `reportingService` e `storageService` do `useRest`.
*   **Recurso:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/ScreenCropper`
    - Componente dedicado para recorte da captura usando `react-advanced-cropper`.
*   **View:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/FeedbackDialogView.tsx`
    *   Utiliza os componentes do `Dialog` global.
    *   Renderiza:
        - Seleção de intenção (Bug [Verde], Ideia [Amarelo], Outro [Azul]).
        - Área de texto para o conteúdo.
        - Botão de captura com ícone de câmera.
        - Preview da screenshot.
        - Link para Discord.

##### FeedbackLayout (Widget de Layout)
*   **Localização:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout.tsx`
*   **Props:** `children: ReactNode`.
*   **Responsabilidade:** Envolve a aplicação para prover o contexto do Dialog fixo. Configurado no layout da aplicação.

### 4. O que deve ser modificado?

*   **Arquivo:** `apps/web/src/rest/services/index.ts`
    *   **Mudança:** Exportar `ReportingService` e `StorageService`.
*   **Arquivo:** `apps/web/src/ui/global/hooks/useRest.ts`
    *   **Mudança:** Adicionar `reportingService` e `storageService` ao hook.
*   **Arquivo:** `packages/core/src/storage/domain/structures/FileFileStorageFolderPath.ts`
    *   **Mudança:** Adicionar suporte a pasta `feedback-reports`.

### 5. O que deve ser removido?
Nenhum código será removido nesta tarefa.

### 6. Diagramas e Referências

#### Fluxo de Dados
```ascii
[FeedbackDialogView] --(submit)--> [useFeedbackDialog] --(1. upload)--> [StorageService]
                                          |
                                          +--(2. send)----> [ReportingService]
                                                                  |
                                                                  v
                                                            [Backend API]
```

#### Referências
*   `apps/web/src/ui/playground/widgets/components/ShareSnippetDialog` - *Exemplo de widget de dialog com lógica de formulário e serviço.*
*   `apps/web/src/rest/services/ProfileService.ts` - *Referência para implementação de um serviço REST.*
