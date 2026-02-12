# Diretrizes de Teste de Widgets (camada UI)

Ao testar componentes React (widgets), seguimos a separação entre lógica (hook)
e interface (view). No entanto, existem exceções para componentes complexos de
formulário.

## 1. Padrão: Separação de Responsabilidades

Na maioria dos casos, devemos testar o **Hook** e a **View** separadamente.

### Testando o Hook

Utilize `renderHook` da `@testing-library/react` para testar a lógica isolada.

#### Padrão Básico (Helper Function)

Para facilitar a escrita de múltiplos testes com diferentes estados, crie uma
função auxiliar `Hook` que aceite um `Partial` dos parâmetros. Isso permite
sobrescrever apenas o necessário em cada caso de teste, mantendo valores padrão
sensatos.

```ts
import { act, renderHook, waitFor } from "@testing-library/react";
import { type Mock, mock } from "ts-jest-mocker";
import {
  type Params,
  useAssistantChatsHistory,
} from "../useAssistantChatsHistory";
import type { ConversationService } from "@stardust/core/conversation/interfaces";
import { ChatFaker } from "@stardust/core/conversation/entities/fakers";

describe("useAssistantChatsHistory", () => {
  let service: Mock<ConversationService>;
  let onSelectChat: jest.Mock;

  // Função auxiliar com Partial para facilitar a sobrescrita
  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useAssistantChatsHistory({
        service,
        onSelectChat,
        // ... outras dependências com mocks padrão
        ...params,
      })
    );

  beforeEach(() => {
    service = mock<ConversationService>();
    onSelectChat = jest.fn();

    service.fetchChats.mockResolvedValue({
      body: { items: [], total: 0 },
      statusCode: 200,
    });
  });

  it("should fetch chats on mount", async () => {
    const chat = ChatFaker.fake();
    service.fetchChats.mockResolvedValueOnce({
      body: { items: [chat.dto], total: 1 },
      statusCode: 200,
    });

    const { result } = Hook(); // Usa os mocks padrão

    await waitFor(() => expect(result.current.chats).toHaveLength(1));
    expect(result.current.chats[0].dto).toEqual(chat.dto);
  });

  it("should call onSelectChat when handleChatSelect is called", async () => {
    const { result } = Hook(); // Usa os mocks padrão

    act(() => {
      result.current.handleChatSelect(ChatFaker.fake().dto);
    });

    expect(onSelectChat).toHaveBeenCalled();
  });
});
```

#### Hooks com SWR

Para hooks que utilizam SWR para cache, é necessário fornecer um wrapper:

```ts
import { SWRConfig } from "swr";
import React, { type PropsWithChildren } from "react";

const swrWrapper = ({ children }: PropsWithChildren) =>
  React.createElement(SWRConfig, {
    value: {
      provider: () => new Map(),
      dedupingInterval: 0,
    },
    children,
  });

// No teste:
const { result } = renderHook(() => useHook(), { wrapper: swrWrapper });
```

#### Testando Callbacks e Efeitos

```ts
it("should show error toast when delete chat fails", async () => {
  const chat = ChatFaker.fake();
  const errorMessage = "Failed to delete chat";

  service.fetchChats.mockResolvedValueOnce({
    body: { items: [chat.dto], total: 1 },
    statusCode: 200,
  });
  service.deleteChat.mockResolvedValueOnce({
    statusCode: 400,
    errorMessage,
  });

  const { result } = renderHook(() => useHook({ service, toastProvider }));

  await waitFor(() => expect(result.current.chats).toHaveLength(1));

  await act(async () => {
    await result.current.handleDeleteChat(chat.id.value);
  });

  expect(service.deleteChat).toHaveBeenCalled();
  expect(toastProvider.showError).toHaveBeenCalledWith(errorMessage);
});
```

### Testando a View

Utilize `render` e `screen` para testar a renderização e interações simples,
mockando os handlers.

#### Padrão Básico (Helper Function)

Assim como nos hooks, utilize uma função auxiliar `View` com `Partial<Props>`
para centralizar a renderização e facilitar a sobrescrita de propriedades
específicas.

```tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  AssistantChatsHistoryView,
  type Props,
} from "../AssistantChatsHistoryView";
import { ChatFaker } from "@stardust/core/conversation/entities/fakers";

describe("AssistantChatsHistoryView", () => {
  // Função auxiliar com Partial para facilitar a sobrescrita
  const View = (props?: Partial<Props>) => {
    render(
      <AssistantChatsHistoryView
        chats={[]}
        isLoading={false}
        isReachedEnd={true}
        onOpenChange={jest.fn()}
        onSelectChat={jest.fn()}
        onShowMore={jest.fn()}
        {...props}
      >
        <button data-testid="trigger">Open Dialog</button>
      </AssistantChatsHistoryView>,
    );
  };

  it("should render trigger button", () => {
    View(); // Usa os valores padrão
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
  });

  it("should render chat list with chats", () => {
    const chats = ChatFaker.fakeMany(3);
    View({ chats }); // Sobrescreve apenas os chats

    chats.forEach((chat) => {
      expect(screen.getByText(chat.name.value)).toBeInTheDocument();
    });
  });
});
```

#### Mock de Componentes Filhos

Para evitar testar componentes filhos complexos, utilize `jest.mock`:

```tsx
jest.mock("@/ui/global/widgets/components/Dialog", () => ({
  Container: ({ children }: any) => <div>{children}</div>,
  Trigger: ({ children }: any) => <>{children}</>,
  Content: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/ui/global/widgets/components/Loading", () => ({
  Loading: () => <div data-testid="loading" />,
}));
```

#### Consultas Escopadas com `within`

Use `within` para buscar elementos dentro de um componente específico:

```tsx
import { within } from "@testing-library/react";

it("should call onDeleteChat when delete button is clicked", async () => {
  const user = userEvent.setup();
  const chats = ChatFaker.fakeMany(1);
  const onDeleteChat = jest.fn();

  View({ chats, onDeleteChat });

  // Encontrar a linha do chat pelo nome
  const chatRow = screen.getByText(chats[0].name.value).closest(".group");
  if (!chatRow) throw new Error("Chat row not found");

  // Buscar botões apenas dentro dessa linha
  const buttons = within(chatRow as HTMLElement).getAllByRole("button");
  const deleteButton = buttons.at(-1);

  await user.click(deleteButton!);

  expect(onDeleteChat).toHaveBeenCalledWith(chats[0].id.value);
});
```

#### Testando Estados e Renderização Condicional

```tsx
it("should render empty state when no chats and not loading", () => {
  View();
  expect(screen.getByText("Nenhuma conversa encontrada.")).toBeInTheDocument();
});

it("should render loading state when chats is empty and loading", () => {
  View({ isLoading: true });
  expect(screen.getByTestId("loading")).toBeInTheDocument();
});

it("should render edit button when onEditChatName is provided", () => {
  const chats = ChatFaker.fakeMany(1);
  View({ chats, onEditChatName: jest.fn() });

  expect(screen.getByTestId("chat-name-edition-dialog")).toBeInTheDocument();
});

it("should not render edit button when onEditChatName is not provided", () => {
  const chats = ChatFaker.fakeMany(1);
  View({ chats });

  expect(screen.queryByTestId("chat-name-edition-dialog")).not
    .toBeInTheDocument();
});
```

#### Interações de Usuário

Use `userEvent.setup()` para criar uma sessão de interação:

```tsx
it("should call onSelectChat when chat button is clicked", async () => {
  const user = userEvent.setup();
  const chats = ChatFaker.fakeMany(1);
  const onSelectChat = jest.fn();

  View({ chats, onSelectChat });

  await user.click(screen.getByText(chats[0].name.value));

  expect(onSelectChat).toHaveBeenCalledWith(chats[0].dto);
});
```

> O arquivo index.tsx do widget nunca deve ser testada.

## 2. Exceção: Widgets de Formulário (React Hook Form)

Widgets que dependem fortemente de bibliotecas de gerenciamento de estado local
complexo, como `react-hook-form`, tornam-se difíceis de testar separadamente (o
hook retornaria muitos métodos internos da lib, e a view precisaria de mocks
complexos do contexto do formulário).

Nesses casos, testamos o **Widget como um todo** (o componente exportado no
`index.tsx`), realizando um teste de integração de interface.

**O que testar:**

- Validação de campos (mensagens de erro).
- Comportamento de submissão (se a função `onSubmit` é chamada com os dados
  corretos).
- Estados visuais dependentes de inputs.

### Exemplo: Teste de Formulário

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "../"; // Importa o widget principal (index)

describe("SignInForm", () => {
  const onSubmitMock = jest.fn();
  const fakeEmail = "user@example.com";

  const Widget = () => <SignInForm onSubmit={onSubmitMock} />;

  it("should render error when email is invalid", async () => {
    render(Widget());

    // Tenta submeter sem preencher
    const submitButton = screen.getByTestId("submit-button");
    await userEvent.click(submitButton);

    // Verifica a mensagem de erro (aguardando a renderização assíncrona do hook form)
    await waitFor(() => {
      expect(screen.getByText("Email inválido")).toBeVisible();
    });
  });

  it("should call onSubmit with correct data when valid", async () => {
    render(Widget());

    const emailInput = screen.getByTestId("email-input");
    const submitButton = screen.getByTestId("submit-button");

    // Preenche o formulário
    await userEvent.type(emailInput, fakeEmail);
    await userEvent.click(submitButton);

    // Verifica se a função de prop foi chamada
    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        email: fakeEmail,
      });
    });
  });
});
```

**Dicas para Testes de Formulário:**

- Use `screen.getByTestId` para seletores estáveis.
- Use `userEvent` (e não `fireEvent`) para simular interações reais de usuário
  (digitação, clique).
- Use `waitFor` para asserções que dependem de mudanças de estado assíncronas do
  React Hook Form.

## Tooling

- Runner de testes: Jest.
- Bibliotecas de teste (UI): `@testing-library/react`, `@testing-library/user-event`.
- Comandos:
  - Web: `npm run test -w @stardust/web` / `npm run test:watch -w @stardust/web`.
  - Studio: `npm run test -w @stardust/studio` / `npm run test:watch -w @stardust/studio`.
- Referencia geral: `documentation/tooling.md`.
