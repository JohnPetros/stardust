---
title: Seleção de Código e Texto
application: web
status: concluído
last_updated: 03/02/2026
---

# 1. Objetivo
Implementar seleção de texto da descrição do desafio e seleção de linhas do editor de código para enriquecer o contexto enviado ao assistente. A interface deve permitir adicionar/remover uma seleção de cada tipo no campo de pergunta do chat, exibindo blocos com preview e tooltip, e garantir que esses trechos sejam enviados junto com a pergunta para a rota do assistente.

# 2. O que já existe?

## Camada UI (Widgets)
- **`ChatInputView`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChat/ChatInput/ChatInputView.tsx`) - _Campo de texto do chat e botão de envio._
- **`AssistantChat`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChat/index.tsx`) - _Envio da pergunta via `useChat`, monta body com `question` e `challengeId`._
- **`ChallengeDescriptionSlotView`** (`apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeDescriptionSlotView.tsx`) - _Renderiza o MDX com a descrição do desafio._
- **`ChallengeCodeEditorSlotView`** (`apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/ChallengeCodeEditorSlotView.tsx`) - _Renderiza o editor de código (Monaco) e toolbar._
- **`CodeEditor` / `useCodeEditor`** (`apps/web/src/ui/global/widgets/components/CodeEditor/useCodeEditor.ts`) - _Exposição de seleção por linhas via `getSelectedLinesRange()`._
- **`Tooltip`** (`apps/web/src/ui/global/widgets/components/Tooltip/index.tsx`) - _Tooltip baseado em Radix, reutilizável para preview dos trechos._

## Camada UI (Stores)
- **`ChallengeStore`** (`apps/web/src/ui/challenging/stores/ChallengeStore/index.ts`) - _Facade do Zustand para estado global de desafio e UI._
- **`ChallengeStoreState`** (`apps/web/src/ui/challenging/stores/ChallengeStore/types/ChallengeStoreState.ts`) - _Define a estrutura do estado atual._
- **`initial-challenge-store-state`** (`apps/web/src/ui/challenging/stores/ChallengeStore/constants/initial-challenge-store-state.ts`) - _Estado inicial do store._

## Camada REST (Controllers)
- **`AskAssistantController`** (`apps/web/src/rest/controllers/conversation/AskAssistantController.ts`) - _Monta mensagem de contexto e envia para o workflow do assistente._

## Camada Next.js App (Routes)
- **`POST /api/conversation/chats/[chatId]/assistant`** (`apps/web/src/app/api/conversation/chats/[chatId]/assistant/route.ts`) - _Validação do body e execução do controller._

## Pacote Core (Estruturas/Interfaces)
- **`ChatMessage`** (`packages/core/src/conversation/domain/structures/ChatMessage.ts`) - _Estrutura usada no fluxo de mensagens._
- **`ConversationService`** (`packages/core/src/conversation/interfaces/ConversationService.ts`) - _Contrato de serviços de conversa._

## Camada AI (Workflows)
- **`VercelManualWorkflow`** (`apps/web/src/ai/vercel/workflows/VercelManualWorkflow.ts`) - _Converte mensagens e stream de resposta._
- **`assistantAgent`** (`apps/web/src/ai/vercel/agents/manualAgents.ts`) - _Agente que responde no chat._

# 3. O que deve ser criado?

## Camada UI (Widgets)
- **`ChatInputSelectionsView`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChat/ChatInput/ChatInputSelectionsView.tsx`)
  - **Props:** `codeSelection`, `textSelection`, `onRemoveCodeSelection`, `onRemoveTextSelection`.
  - **Estados:**
    - Loading: não aplicável.
    - Error: não aplicável.
    - Empty: não renderiza blocos quando não há seleção.
    - Content: renderiza até dois blocos (código e texto), cada um com tooltip e botão de remover.
  - **View:** Responsável por layout e estilo dos blocos acima do textarea.
  - **Widgets internos:** `Tooltip`, `Icon`.

- **`SelectionActionButtonView`** (`apps/web/src/ui/challenging/widgets/components/SelectionActionButton/SelectionActionButtonView.tsx`)
  - **Props:** `label`, `iconName`, `position` (`{ top: number; left: number }`), `onClick`.
  - **Responsabilidade:** Botão flutuante exibido próximo à seleção, com estilo padrão para texto/código.

## Camada UI (Stores)
- **`AssistantSelection` types** (`apps/web/src/ui/challenging/stores/ChallengeStore/types/AssistantSelection.ts`)
  - **Tipos:**
    - `TextSelection`: `{ kind: 'text'; content: string; preview: string }`
    - `CodeSelection`: `{ kind: 'code'; content: string; startLine: number; endLine: number }`
    - `AssistantSelections`: `{ textSelection: TextSelection | null; codeSelection: CodeSelection | null }`
  - **Uso:** Base para renderização de blocos, tooltip e payload da pergunta.

## Camada UI (Hooks)
- **`useTextSelection`** (`apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/useTextSelection.ts`)
  - **Dependências:** `setTextSelection` vindo do entry point.
  - **Responsabilidade:** Capturar seleção do usuário no container de descrição, calcular bounding rect da seleção e controlar visibilidade/posição do `SelectionActionButtonView`.

- **`useCodeSelection`** (`apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/useCodeSelection.ts`)
  - **Dependências:** `codeEditorRef`, `setCodeSelection` vindo do entry point.
  - **Responsabilidade:** Capturar range selecionado no Monaco via `getSelectedLinesRange`, extrair linhas completas e controlar visibilidade/posição do botão flutuante.

# 4. O que deve ser modificado?

## Camada UI (Stores)
- **Arquivo:** `apps/web/src/ui/challenging/stores/ChallengeStore/types/ChallengeStoreState.ts`
  - **Mudança:** Adicionar `assistantSelections` no estado.
- **Arquivo:** `apps/web/src/ui/challenging/stores/ChallengeStore/types/ChallengeStoreActions.ts`
  - **Mudança:** Adicionar actions `setTextSelection`, `setCodeSelection`, `clearTextSelection`, `clearCodeSelection`, `clearAssistantSelections`.
- **Arquivo:** `apps/web/src/ui/challenging/stores/ChallengeStore/constants/initial-challenge-store-state.ts`
  - **Mudança:** Inicializar `assistantSelections` como `{ textSelection: null, codeSelection: null }`.
- **Arquivo:** `apps/web/src/ui/challenging/stores/ChallengeStore/index.ts`
  - **Mudança:** Expor slice `getAssistantSelectionsSlice()` com seleção e actions.

## Camada UI (Widgets)
- **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChat/ChatInput/ChatInputView.tsx`
  - **Mudança:** Renderizar `ChatInputSelectionsView` acima do textarea e permitir remover seleções. Ajustar layout para acomodar blocos.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChat/ChatInput/useChatInput.ts`
  - **Mudança:** Receber `assistantSelections` e incluir no `handleSendMessage` via callback `onSendMessage(message, selections)`.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChat/index.tsx`
  - **Mudança:** Injetar seleções no `sendMessage` body (`textSelection`, `codeSelection`) e limpar seleções após envio.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/ChallengeDescriptionSlotView.tsx`
  - **Mudança:** Envolver conteúdo com container referenciado para capturar seleção e renderizar `SelectionActionButtonView` quando houver seleção.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeDescription/index.tsx`
  - **Mudança:** Conectar `useTextSelection` com `ChallengeStore`.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/ChallengeCodeEditorSlotView.tsx`
  - **Mudança:** Exibir `SelectionActionButtonView` sobre o editor quando houver range selecionado.
- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/index.tsx`
  - **Mudança:** Conectar `useCodeSelection` com `ChallengeStore`.

## Camada Next.js App (Routes)
- **Arquivo:** `apps/web/src/app/api/conversation/chats/[chatId]/assistant/route.ts`
  - **Mudança:** Expandir schema para aceitar `textSelection` e `codeSelection` (opcionais).

## Camada REST (Controllers)
- **Arquivo:** `apps/web/src/rest/controllers/conversation/AskAssistantController.ts`
  - **Mudança:** Incluir seleções no contexto enviado ao assistente, concatenando com a pergunta e o `challengeId` em um formato claro.

# 5. O que deve ser removido?
Não há remoções.

# 6. Diagramas e Referências

## Fluxo de Dados
```ascii
[ChallengeDescriptionSlot] -- seleciona texto --> [ChallengeStore.assistantSelections.text]
[ChallengeCodeEditorSlot] -- seleciona linhas --> [ChallengeStore.assistantSelections.code]
            |                                      |
            +--> [ChatInputSelectionsView] <-------+
                         |
                         v
                [AssistantChat.sendMessage]
                         |
                         v
     POST /api/conversation/chats/{chatId}/assistant
                         |
                         v
              [AskAssistantController]
                         |
                         v
                 [VercelManualWorkflow]
                         |
                         v
                    [assistantAgent]
```

## Layout
```ascii
Assistant Chat Input
┌──────────────────────────────────────────────┐
│ [Texto selecionado]  [Código: Linha 3-8]     │
│                                              │
│ Pergunte algo sobre o desafio...             │
└──────────────────────────────────────────────┘

Challenge Description         Code Editor
┌───────────────┐             ┌─────────────────┐
│ texto ...     │  + Adicionar│ 1| codigo...     │
│ texto ...     │ <-----------│ 2| codigo...     │
└───────────────┘             └─────────────────┘
```

## Referências
- `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChat/index.tsx`
- `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChat/ChatInput/ChatInputView.tsx`
- `apps/web/src/ui/global/widgets/components/CodeEditor/useCodeEditor.ts`
- `apps/web/src/rest/controllers/conversation/AskAssistantController.ts`
- `apps/web/src/app/api/conversation/chats/[chatId]/assistant/route.ts`

# 7. Atualizações aplicadas
- `ChatInputSelections` implementado com hook que normaliza selecoes em `selectionItems` para a view, com rotulos `Linha - start-end`, tooltip e remocao.
- `SelectionActionButtonView`, `useTextSelection` e `useCodeSelection` adicionados com posicionamento do botao acima da selecao e captura de texto/linhas completas.
- Preview de texto limitado a 500 caracteres com reticencias; selecao de codigo usa linhas completas do editor.
- `assistantSelections` integrado ao `ChallengeStore` usando `TextSelection`/`CodeSelection` do core, com actions de set/clear e limpeza apos envio no `AssistantChat`.
- `AskAssistantController` e rota Next aceitaram `textSelection`/`codeSelection` opcionais (schema tolera `kind` opcional).
- Testes adicionados para o hook/view de selecoes e fakers de selecao no core.

# 8. Verificacoes executadas
- `npm run codecheck`
- `npm run test`
