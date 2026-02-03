import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatFaker } from '@stardust/core/conversation/entities/fakers'
import type { DialogRef } from '@/ui/global/widgets/components/Dialog/types'
import type { RefObject } from 'react'

jest.mock('@/ui/global/widgets/components/Dialog', () => ({
  Container: ({ children }: any) => <div>{children}</div>,
  Trigger: ({ children }: any) => <>{children}</>,
  Content: ({ children }: any) => <div>{children}</div>,
  Header: ({ children }: any) => <h2>{children}</h2>,
}))

jest.mock('@/ui/global/widgets/components/Loading', () => ({
  Loading: () => <div data-testid='loading' />,
}))

jest.mock('@/ui/global/widgets/components/InfiniteList', () => ({
  InfiniteList: ({ children, isReachedEnd }: any) => (
    <div data-testid='infinite-list' data-is-reached-end={String(Boolean(isReachedEnd))}>
      {children}
    </div>
  ),
}))

jest.mock('../ChatNameEditionDialog', () => ({
  ChatNameEditionDialog: ({ children, chatId, onEditChatName }: any) => (
    <div data-testid='chat-name-edition-dialog' data-chat-id={chatId}>
      {children}
      <button type='button' onClick={() => onEditChatName(chatId, 'Updated Name')}>
        Edit Name
      </button>
    </div>
  ),
}))

import { AssistantChatsHistoryView, type Props } from '../AssistantChatsHistoryView'

describe('AssistantChatsHistoryView', () => {
  const View = (props?: Partial<Props>) => {
    render(
      <AssistantChatsHistoryView
        chats={[]}
        dialogRef={{ current: null } as RefObject<DialogRef | null>}
        isLoading={false}
        isReachedEnd={true}
        onOpenChange={jest.fn()}
        onSelectChat={jest.fn()}
        onShowMore={jest.fn()}
        {...props}
      >
        <button type='button' data-testid='trigger'>
          Open Dialog
        </button>
      </AssistantChatsHistoryView>,
    )
  }

  it('should render trigger button', () => {
    View()

    expect(screen.getByTestId('trigger')).toBeInTheDocument()
  })

  it('should render empty state when no chats and not loading', () => {
    View()

    expect(screen.getByText('Nenhuma conversa encontrada.')).toBeInTheDocument()
  })

  it('should render loading state when chats is empty and loading', () => {
    View({ isLoading: true })

    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('should render chat list with chats', () => {
    const chats = ChatFaker.fakeMany(3)
    View({ chats })

    chats.forEach((chat) => {
      expect(screen.getByText(chat.name.value)).toBeInTheDocument()
    })
  })

  it('should call onSelectChat when chat button is clicked', async () => {
    const user = userEvent.setup()
    const chats = ChatFaker.fakeMany(1)
    const onSelectChat = jest.fn()

    View({ chats, onSelectChat })

    await user.click(screen.getByText(chats[0].name.value))

    expect(onSelectChat).toHaveBeenCalledWith(chats[0].dto)
  })

  it('should call onDeleteChat when delete button is clicked', async () => {
    const user = userEvent.setup()
    const chats = ChatFaker.fakeMany(1)
    const onDeleteChat = jest.fn()

    View({ chats, onDeleteChat })

    const chatRow = screen.getByText(chats[0].name.value).closest('.group')
    if (!chatRow) throw new Error('Chat row not found')
    const buttons = within(chatRow as HTMLElement).getAllByRole('button')
    const deleteButton = buttons.at(-1)
    if (!deleteButton) throw new Error('Delete button not found')

    await user.click(deleteButton)

    expect(onDeleteChat).toHaveBeenCalledWith(chats[0].id.value)
  })

  it('should render edit button when onEditChatName is provided', () => {
    const chats = ChatFaker.fakeMany(1)
    const onEditChatName = jest.fn()

    View({ chats, onEditChatName })

    expect(screen.getByTestId('chat-name-edition-dialog')).toBeInTheDocument()
  })

  it('should not render edit button when onEditChatName is not provided', () => {
    const chats = ChatFaker.fakeMany(1)

    View({ chats })

    expect(screen.queryByTestId('chat-name-edition-dialog')).not.toBeInTheDocument()
  })

  it('should render InfiniteList reached-end indicator', () => {
    const onShowMore = jest.fn()
    const chats = ChatFaker.fakeMany(1)

    View({ chats, onShowMore })

    const infiniteList = screen.getByTestId('infinite-list')
    expect(infiniteList.dataset.isReachedEnd).toBe('true')
  })

  it('should show relative time for chat creation', () => {
    const chats = ChatFaker.fakeMany(1)

    View({ chats })

    expect(screen.getAllByText(/horas atrás/i).length).toBeGreaterThan(0)
  })

  it('should render edit and delete buttons on hover', () => {
    const chats = ChatFaker.fakeMany(1)
    const onEditChatName = jest.fn()
    const onDeleteChat = jest.fn()

    View({ chats, onEditChatName, onDeleteChat })

    const chatRow = screen.getByText(chats[0].name.value).closest('.group')
    if (!chatRow) throw new Error('Chat row not found')
    const chatRowElement = chatRow as HTMLElement
    expect(
      within(chatRowElement).getByTestId('chat-name-edition-dialog'),
    ).toBeInTheDocument()
    const buttons = within(chatRowElement).getAllByRole('button')
    expect(buttons.at(-1)).toBeDefined()
  })
})
