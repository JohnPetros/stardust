# Widget Testing Rules (UI layer)

When testing React components (widgets), we follow the separation between logic (hook)
and interface (view). However, there are exceptions for complex form
components.

## 1. Standard: Separation of Responsibilities

In most cases, we must test the **Hook** and the **View** separately.

### Testing the Hook

Use `renderHook` from `@testing-library/react` to test the isolated logic.

#### Basic Pattern (Helper Function)

To make it easier to write multiple tests with different states, create a
`Hook` helper function that accepts a `Partial` of the parameters. This lets you
override only what is needed in each test case, keeping sensible
default values.

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

  // Helper function with Partial to make overriding easier
  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useAssistantChatsHistory({
        service,
        onSelectChat,
        // ... other dependencies with default mocks
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

    const { result } = Hook(); // Uses the default mocks

    await waitFor(() => expect(result.current.chats).toHaveLength(1));
    expect(result.current.chats[0].dto).toEqual(chat.dto);
  });

  it("should call onSelectChat when handleChatSelect is called", async () => {
    const { result } = Hook(); // Uses the default mocks

    act(() => {
      result.current.handleChatSelect(ChatFaker.fake().dto);
    });

    expect(onSelectChat).toHaveBeenCalled();
  });
});
```

#### Hooks with SWR

For hooks that use SWR for caching, a wrapper must be provided:

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

// In the test:
const { result } = renderHook(() => useHook(), { wrapper: swrWrapper });
```

#### Testing Callbacks and Effects

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

### Testing the View

Use `render` and `screen` to test rendering and simple interactions,
mocking the handlers.

#### Basic Pattern (Helper Function)

As with hooks, use a `View` helper function with `Partial<Props>`
to centralize rendering and make it easier to override specific
properties.

```tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  AssistantChatsHistoryView,
  type Props,
} from "../AssistantChatsHistoryView";
import { ChatFaker } from "@stardust/core/conversation/entities/fakers";

describe("AssistantChatsHistoryView", () => {
  // Helper function with Partial to make overriding easier
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
    View(); // Uses the default values
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
  });

  it("should render chat list with chats", () => {
    const chats = ChatFaker.fakeMany(3);
    View({ chats }); // Overrides only the chats

    chats.forEach((chat) => {
      expect(screen.getByText(chat.name.value)).toBeInTheDocument();
    });
  });
});
```

#### Mocking Child Components

To avoid testing complex child components, use `jest.mock`:

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

#### Scoped Queries with `within`

Use `within` to look up elements inside a specific component:

```tsx
import { within } from "@testing-library/react";

it("should call onDeleteChat when delete button is clicked", async () => {
  const user = userEvent.setup();
  const chats = ChatFaker.fakeMany(1);
  const onDeleteChat = jest.fn();

  View({ chats, onDeleteChat });

  // Find the chat row by name
  const chatRow = screen.getByText(chats[0].name.value).closest(".group");
  if (!chatRow) throw new Error("Chat row not found");

  // Look up buttons only inside that row
  const buttons = within(chatRow as HTMLElement).getAllByRole("button");
  const deleteButton = buttons.at(-1);

  await user.click(deleteButton!);

  expect(onDeleteChat).toHaveBeenCalledWith(chats[0].id.value);
});
```

#### Testing States and Conditional Rendering

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

(`"Nenhuma conversa encontrada."` means "No conversations found."; UI strings asserted in tests stay in PT-BR.)

#### User Interactions

Use `userEvent.setup()` to create an interaction session:

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

> The widget's index.tsx file must never be tested.

#### Global hooks do not receive dedicated tests

Hooks in `apps/web/src/ui/global/hooks/` (for example `useProfileSocket`) do not
receive dedicated test files. Cover the behavior through the consumers:
widget hooks, context hooks (`ui/**/contexts/**/tests`) or Playwright
journeys. `usePaginatedCache.test.ts` is legacy and is not a precedent.

## 2. Exception: Form Widgets (React Hook Form)

Widgets that rely heavily on complex local state management libraries,
such as `react-hook-form`, become hard to test separately (the
hook would return many internal methods of the lib, and the view would need
complex mocks of the form context).

In these cases, we test the **Widget as a whole** (the component exported in
`index.tsx`), performing an interface integration test.

**What to test:**

- Field validation (error messages).
- Submission behavior (whether the `onSubmit` function is called with the correct
  data).
- Visual states dependent on inputs.

### Example: Form Test

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "../"; // Imports the main widget (index)

describe("SignInForm", () => {
  const onSubmitMock = jest.fn();
  const fakeEmail = "user@example.com";

  const Widget = () => <SignInForm onSubmit={onSubmitMock} />;

  it("should render error when email is invalid", async () => {
    render(Widget());

    // Tries to submit without filling in
    const submitButton = screen.getByTestId("submit-button");
    await userEvent.click(submitButton);

    // Checks the error message (awaiting the async rendering of the hook form)
    await waitFor(() => {
      expect(screen.getByText("Email inválido")).toBeVisible();
    });
  });

  it("should call onSubmit with correct data when valid", async () => {
    render(Widget());

    const emailInput = screen.getByTestId("email-input");
    const submitButton = screen.getByTestId("submit-button");

    // Fills in the form
    await userEvent.type(emailInput, fakeEmail);
    await userEvent.click(submitButton);

    // Checks whether the prop function was called
    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        email: fakeEmail,
      });
    });
  });
});
```

(`"Email inválido"` means "Invalid email"; it is a PT-BR validation message and stays in Portuguese.)

**Tips for Form Tests:**

- Use `screen.getByTestId` for stable selectors.
- Use `userEvent` (not `fireEvent`) to simulate real user interactions
  (typing, clicking).
- Use `waitFor` for assertions that depend on asynchronous state changes of
  React Hook Form.

## Tooling

- Test runner: Jest.
- Test libraries (UI): `@testing-library/react`, `@testing-library/user-event`.
- Commands:
  - Web: `pnpm --filter @stardust/web run test:unit` / `pnpm --filter @stardust/web run test:unit:watch`.
  - Backoffice: `pnpm --filter @stardust/backoffice run test:unit` / `pnpm --filter @stardust/backoffice run test:unit:watch`.
- General reference: `documentation/tooling.md`.
