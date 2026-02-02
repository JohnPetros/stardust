import type { RefObject } from 'react'

import type { ConversationService } from '@stardust/core/conversation/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import type { ChatDto } from '@stardust/core/conversation/entities/dtos'
import { Chat } from '@stardust/core/conversation/entities'
import { Id, OrdinalNumber, Text } from '@stardust/core/global/structures'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import type { DialogRef } from '@/ui/global/widgets/components/Dialog/types'

const CHATS_PER_PAGE = OrdinalNumber.create(10)

export type Params = {
  service: ConversationService
  toastProvider: ToastProvider
  dialogRef: RefObject<DialogRef | null>
  onSelectChat: (chatDto: ChatDto) => void
  onDeleteChat: (chatId: string) => void
  onEditChatName?: (chatId: string, chatName: string) => void
}

export function useAssistantChatsHistory({
  service,
  toastProvider,
  dialogRef,
  onSelectChat,
  onDeleteChat,
  onEditChatName,
}: Params) {
  async function fetchChats(page: number) {
    const response = await service.fetchChats({
      itemsPerPage: CHATS_PER_PAGE,
      page: OrdinalNumber.create(page),
      search: Text.create(''),
    })
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, isLoading, refetch, nextPage, isReachedEnd } = usePaginatedCache<ChatDto>(
    {
      key: CACHE.keys.assistantChats,
      fetcher: fetchChats,
      itemsPerPage: CHATS_PER_PAGE.value,
      isInfinity: true,
    },
  )

  async function handleDeleteChat(chatId: string) {
    const response = await service.deleteChat(Id.create(chatId))
    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }
    refetch()
    onDeleteChat(chatId)
  }

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) {
      refetch()
    }
  }

  function handleChatSelect(chatDto: ChatDto) {
    onSelectChat(chatDto)
    dialogRef.current?.close()
  }

  async function handleEditChatName(chatId: string, chatName: string) {
    if (chatName.length < 2) {
      toastProvider.showError('O nome deve ter pelo menos 2 caracteres')
      return
    }

    const response = await service.editChatName(Id.create(chatId), Text.create(chatName))
    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    toastProvider.showSuccess('Nome do chat atualizado')
    refetch()
  }

  return {
    chats: data.map(Chat.create),
    isLoading,
    isReachedEnd,
    nextPage,
    handleOpenChange,
    handleDeleteChat,
    handleChatSelect,
    handleEditChatName,
  }
}
