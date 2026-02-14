import { renderHook, act, waitFor } from '@testing-library/react'
import { type Mock, mock } from 'ts-jest-mocker'
import { SWRConfig } from 'swr'
import React, { type PropsWithChildren } from 'react'

import { ChatFaker } from '@stardust/core/conversation/entities/fakers'
import type { ConversationService } from '@stardust/core/conversation/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import type { ChatDto } from '@stardust/core/conversation/entities/dtos'

import type { DialogRef } from '@/ui/global/widgets/components/Dialog/types'
import { PaginationResponse, RestResponse } from '@stardust/core/global/responses'

import { type Params, useAssistantChatsHistory } from '../useAssistantChatsHistory'

type RestResponseProps<T> = { body?: T; statusCode?: number; errorMessage?: string }

function createRestResponse<T>(props: RestResponseProps<T>) {
  return new RestResponse<T>(props)
}

const swrWrapper = ({ children }: PropsWithChildren) =>
  React.createElement(SWRConfig, {
    value: { provider: () => new Map(), dedupingInterval: 0 },
    children,
  })

describe('useAssistantChatsHistory', () => {
  let service: Mock<ConversationService>
  let toastProvider: Mock<ToastProvider>
  let dialogRef: React.RefObject<DialogRef | null>
  let onSelectChat: jest.Mock
  let onDeleteChat: jest.Mock
  let onEditChatName: jest.Mock

  const Hook = (params?: Partial<Params>) =>
    renderHook(
      () =>
        useAssistantChatsHistory({
          service,
          toastProvider,
          dialogRef,
          onSelectChat,
          onDeleteChat,
          onEditChatName,
          ...params,
        }),
      { wrapper: swrWrapper },
    )

  beforeEach(() => {
    service = mock<ConversationService>()
    toastProvider = mock<ToastProvider>()
    dialogRef = { current: null }
    onSelectChat = jest.fn()
    onDeleteChat = jest.fn()
    onEditChatName = jest.fn()

    toastProvider.showError.mockImplementation()
    toastProvider.showSuccess.mockImplementation()

    service.fetchChats.mockResolvedValue(
      createRestResponse({
        body: new PaginationResponse<ChatDto>([], 0, 10),
        statusCode: 200,
      }),
    )

    service.editChatName.mockResolvedValue(
      createRestResponse({ body: ChatFaker.fake().dto, statusCode: 200 }),
    )

    service.deleteChat.mockResolvedValue(
      createRestResponse({ body: undefined, statusCode: 200 }),
    )
  })

  it('should fetch chats on mount', async () => {
    const chat = ChatFaker.fake()
    service.fetchChats.mockResolvedValueOnce(
      createRestResponse({
        body: new PaginationResponse([chat.dto], 1, 10),
        statusCode: 200,
      }),
    )

    const { result } = Hook()

    await waitFor(() => expect(result.current.chats).toHaveLength(1))

    expect(result.current.chats[0].dto).toEqual(chat.dto)
  })

  it('should close dialog and select chat when handleChatSelect is called', async () => {
    const chat = ChatFaker.fake()
    service.fetchChats.mockResolvedValueOnce(
      createRestResponse({
        body: new PaginationResponse([chat.dto], 1, 10),
        statusCode: 200,
      }),
    )

    const { result } = Hook()

    dialogRef.current = { close: jest.fn(), open: jest.fn() }

    await waitFor(() => expect(result.current.chats).toHaveLength(1))

    act(() => {
      result.current.handleChatSelect(chat.dto)
    })

    expect(onSelectChat).toHaveBeenCalledWith(chat.dto)
    expect(dialogRef.current?.close).toHaveBeenCalled()
  })

  it('should show error toast when delete chat fails', async () => {
    const chat = ChatFaker.fake()
    const errorMessage = 'Failed to delete chat'

    service.fetchChats.mockResolvedValueOnce(
      createRestResponse({
        body: new PaginationResponse([chat.dto], 1, 10),
        statusCode: 200,
      }),
    )
    service.deleteChat.mockResolvedValueOnce(
      createRestResponse({ statusCode: 400, errorMessage }),
    )

    const { result } = Hook()

    await waitFor(() => expect(result.current.chats).toHaveLength(1))

    await act(async () => {
      await result.current.handleDeleteChat(chat.id.value)
    })

    expect(service.deleteChat).toHaveBeenCalled()
    expect(toastProvider.showError).toHaveBeenCalledWith(errorMessage)
    expect(onDeleteChat).not.toHaveBeenCalled()
  })

  it('should call onDeleteChat when delete chat succeeds', async () => {
    const chat = ChatFaker.fake()

    service.fetchChats.mockResolvedValueOnce(
      createRestResponse({
        body: new PaginationResponse([chat.dto], 1, 10),
        statusCode: 200,
      }),
    )
    service.deleteChat.mockResolvedValueOnce(createRestResponse({ statusCode: 200 }))

    const { result } = Hook()

    await waitFor(() => expect(result.current.chats).toHaveLength(1))

    await act(async () => {
      await result.current.handleDeleteChat(chat.id.value)
    })

    expect(onDeleteChat).toHaveBeenCalledWith(chat.id.value)
  })

  it('should show error toast when chat name is too short', async () => {
    const chat = ChatFaker.fake()
    const { result } = Hook()

    await act(async () => {
      await result.current.handleEditChatName(chat.id.value, 'a')
    })

    expect(toastProvider.showError).toHaveBeenCalledWith(
      'O nome deve ter pelo menos 2 caracteres',
    )
    expect(service.editChatName).not.toHaveBeenCalled()
  })

  it('should show error toast when edit chat name fails', async () => {
    const chat = ChatFaker.fake()
    const errorMessage = 'Failed to edit name'

    service.editChatName.mockResolvedValueOnce(
      createRestResponse({ statusCode: 400, errorMessage, body: chat.dto }),
    )

    const { result } = Hook()

    await act(async () => {
      await result.current.handleEditChatName(chat.id.value, 'Valid Name')
    })

    expect(service.editChatName).toHaveBeenCalled()
    expect(toastProvider.showError).toHaveBeenCalledWith(errorMessage)
  })

  it('should show success toast when edit chat name succeeds', async () => {
    const chat = ChatFaker.fake()
    const newName = 'Updated Chat'

    service.editChatName.mockResolvedValueOnce(
      createRestResponse({ body: { ...chat.dto, name: newName }, statusCode: 200 }),
    )

    const { result } = Hook()

    await act(async () => {
      await result.current.handleEditChatName(chat.id.value, newName)
    })

    expect(service.editChatName).toHaveBeenCalled()
    expect(toastProvider.showSuccess).toHaveBeenCalledWith('Nome do chat atualizado')
  })

  it('should refetch when dialog opens', async () => {
    const chat = ChatFaker.fake()

    const firstResponse = createRestResponse({
      body: new PaginationResponse([chat.dto], 1, 10),
      statusCode: 200,
    })
    const secondResponse = createRestResponse({
      body: new PaginationResponse([], 0, 10),
      statusCode: 200,
    })

    service.fetchChats
      .mockResolvedValueOnce(firstResponse)
      .mockResolvedValueOnce(secondResponse)

    const { result } = Hook()

    await waitFor(() => expect(result.current.chats).toHaveLength(1))

    const initialCalls = service.fetchChats.mock.calls.length

    act(() => {
      result.current.handleOpenChange(true)
    })

    await waitFor(() =>
      expect(service.fetchChats).toHaveBeenCalledTimes(initialCalls + 1),
    )
  })

  it('should not refetch when dialog closes', async () => {
    const chat = ChatFaker.fake()

    const response = createRestResponse({
      body: new PaginationResponse([chat.dto], 1, 10),
      statusCode: 200,
    })

    service.fetchChats.mockResolvedValueOnce(response)

    const { result } = Hook()

    await waitFor(() => expect(result.current.chats).toHaveLength(1))

    const initialCalls = service.fetchChats.mock.calls.length

    act(() => {
      result.current.handleOpenChange(false)
    })

    expect(service.fetchChats).toHaveBeenCalledTimes(initialCalls)
  })

  it('should convert chat dtos to domain entities', async () => {
    const chat = ChatFaker.fake()

    service.fetchChats.mockResolvedValueOnce(
      createRestResponse({
        body: new PaginationResponse([chat.dto], 1, 10),
        statusCode: 200,
      }),
    )

    const { result } = Hook()

    await waitFor(() => expect(result.current.chats[0]?.name.value).toBe(chat.name.value))
  })
})
