# Spec: Atualizacao do Nome do Chat

### Application: web
### Ultima atualização: 02/02/2026
### Status: concluído

### 1. Objetivo
Adicionar a edicao do nome do chat no historico do Assistente, via um dialog dedicado para cada conversa. A solucao deve integrar o endpoint existente no backend com o `ConversationService` do frontend, fornecer feedback com toast de sucesso/erro e fechar o dialog em qualquer desfecho (sucesso ou falha). Alem disso, o nome editado deve refletir no historico e, se for o chat selecionado, atualizar o titulo exibido no topo do chat.

### 2. O que ja existe?
*   **`EditChatNameUseCase`** (`packages/core/src/conversation/use-cases/EditChatNameUseCase.ts`) - *Regra de negocio e validacao do nome via `Name.create`.*
*   **`ConversationService`** (`packages/core/src/conversation/interfaces/ConversationService.ts`) - *Interface com `editChatName` definida.*
*   **`ChatsRouter`** (`apps/server/src/app/hono/routers/conversation/ChatsRouter.ts`) - *Rota `PATCH /conversation/chats/:chatId/name` ja existente.*
*   **`EditChatNameController`** (`apps/server/src/rest/controllers/conversation/EditChatNameController.ts`) - *Controller do endpoint de edicao.*
*   **`AssistantChatsHistory`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory`) - *Lista paginada de chats e handlers de selecao/exclusao.*
*   **`Dialog`** (`apps/web/src/ui/global/widgets/components/Dialog`) - *Componente base para dialogs.*
*   **`ToastContext`** (`apps/web/src/ui/global/contexts/ToastContext`) - *Feedback de sucesso/erro.*

### 3. O que deve ser criado?

#### Camada UI (Widgets)

##### ChatNameEditionDialog (widget interno de AssistantChatsHistory)
*   **Localizacao:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/ChatNameEditionDialog`
*   **Index:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/ChatNameEditionDialog/index.tsx`
    *   Componente client que integra hook e view.
    *   Dispara `onEditChatName` e fecha o dialog em sucesso ou falha.
*   **Hook:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/ChatNameEditionDialog/useChatNameEditionDialog.ts`
    *   Estado: `chatName`, `isSubmitting`.
    *   Funcoes:
        - `handleChatNameChange(name: string)`
        - `handleSubmit()` -> `try/finally` chamando `onEditChatName` e fechando o dialog.
        - `handleCancel()` -> fecha dialog sem alterar.
    *   Usa `dialogRef` para `close()` apos submit ou cancel.
*   **View:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/ChatNameEditionDialog/ChatNameEditionDialogView.tsx`
    *   Componente puro, renderiza input e botoes de acao.
    *   Usa `Dialog.Content` e `Dialog.Header` para titulo e layout.
*   **Props:**
    *   `chatId: string`
    *   `initialChatName: string`
    *   `onEditChatName: (chatId: string, chatName: string) => Promise<void>`
    *   `children: ReactNode` (trigger para abrir o dialog)
*   **Estados (Client Component):**
    *   **Loading:** `isSubmitting` desabilita input e botoes.
    *   **Error:** exibido via toast (fora do widget), dialog fecha.
    *   **Content:** input de texto com nome atual e botoes "Salvar" e "Cancelar".
*   **Estrutura de pastas:**
```text
AssistantChatsHistory/
└── ChatNameEditionDialog/
    ├── index.tsx
    ├── ChatNameEditionDialogView.tsx
    └── useChatNameEditionDialog.ts
```

### 4. O que deve ser modificado?

*   **Arquivo:** `apps/web/src/rest/services/ConversationService.ts`
    *   **Mudanca:** Implementar `editChatName(chatId: Id, chatName: Text)` com `PATCH /conversation/chats/:chatId/name` e body `{ chatName: chatName.value }`.

*   **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts`
    *   **Mudanca:**
        - Adicionar `handleEditChatName(chatId: string, chatName: string)`.
        - Validar minimo de 2 caracteres no frontend antes de chamar o service.
        - Chamar `service.editChatName(Id.create(chatId), Text.create(chatName))`.
        - Em falha: `toastProvider.showError(response.errorMessage)`.
        - Em sucesso: `toastProvider.showSuccess('Nome do chat atualizado')`.
        - Sempre `refetch()` para atualizar a lista.

*   **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/AssistantChatsHistoryView.tsx`
    *   **Mudanca:** Renderizar botao de edicao (icone) por item e envolver em `ChatNameEditionDialog`.
    *   **Mudanca:** Manter botao de deletar, evitando conflitos de clique.

*   **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/index.tsx`
    *   **Mudanca:** Passar `handleEditChatName` para a view e injetar `ChatNameEditionDialog` como widget interno.

*   **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/useAssistantChatbot.ts`
    *   **Mudanca:** Adicionar handler `handleEditChatName` para atualizar `selectedChat` quando o chat editado for o chat ativo.

*   **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatbotView.tsx`
    *   **Mudanca:** Encaminhar `onEditChatName` para `AssistantChatsHistory`.

### 5. O que deve ser removido?
Nenhum codigo sera removido nesta tarefa.

### 6. Diagramas e Referencias

#### Fluxo de Dados
```ascii
[ChatNameEditionDialog] --(submit)--> [useAssistantChatsHistory]
        |                                    |
        |                                    +--> [ConversationService.editChatName]
        |                                             |
        |                                             v
        |                                      [PATCH /conversation/chats/:id/name]
        |                                             |
        |                                             v
        +--(toast + close + refetch) <--------- [EditChatNameUseCase]
```

#### Layout
```ascii
Historico de conversas
  - Chat A [editar] [excluir]
  - Chat B [editar] [excluir]
```

#### Referencias
*   `apps/web/src/ui/global/widgets/components/Dialog` - *Base do dialog usado no widget.*
*   `apps/web/src/ui/global/widgets/components/EditableTitle` - *Referencia de edicao de titulo em UI.*
*   `apps/web/src/rest/services/ConversationService.ts` - *Padrao de service REST no frontend.*

### 7. Atualizações aplicadas
*   `apps/web/src/rest/services/ConversationService.ts`: implementado `editChatName` via `PATCH /conversation/chats/:chatId/name` utilizando os objetos de domínio `Id` e `Text` e expondo o método ao hook do histórico.
*   `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory`: adição do widget `ChatNameEditionDialog` (hook + view + index) que usa o `Prompt` global, renderiza triggers com ícones de editar/excluir e propaga `onEditChatName` para o hook principal com validação e feedbacks.
*   `useAssistantChatsHistory`: novo handler `handleEditChatName` com validação de longo mínimo, toasts para erro e sucesso, chamada a `service.editChatName`, `refetch()` constante e fechamento do dialog. O hook também propaga o handler à view para ativação do `ChatNameEditionDialog`.
*   `useAssistantChatbot`: `handleEditChatName` atualiza o estado do chat selecionado quando o chat ativo é renomeado.
*   `ConversationService` + `ToastContext`: garante feedbacks visuais (erro/sucesso) e atualização do histórico via `refetch()` mesmo em casos de falha, enquanto o `Prompt` reimplementado aceita `initialTitle` para reutilização com títulos dinâmicos.
*   Testes (`AssistantChatsHistoryView.test.tsx`, `useAssistantChatsHistory.test.ts`): cobrem renderização condicional dos botões, interação com o prompt e todos os fluxos de edição e exclusão do chat.

### 8. Verificações executadas
*   `npm run codecheck`
*   `npm run test`
