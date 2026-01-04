import { useRef, type ReactNode } from 'react'

import type { ChatDto } from '@stardust/core/conversation/entities/dtos'

import { useRest } from '@/ui/global/hooks/useRest'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { DialogRef } from '@/ui/global/widgets/components/Dialog/types'

import { AssistantChatsHistoryView } from './AssistantChatsHistoryView'
import { useAssistantChatsHistory } from './useAssistantChatsHistory'

type Props = {
  children: ReactNode
  onDeleteChat: (chatId: string) => void
  onSelectChat: (chatDto: ChatDto) => void
}

export const AssistantChatsHistory = ({
  children,
  onSelectChat,
  onDeleteChat,
}: Props) => {
  const dialogRef = useRef<DialogRef | null>(null)
  const { conversationService } = useRest()
  const toastProvider = useToastContext()
  const {
    chats,
    isLoading,
    isReachedEnd,
    nextPage,
    handleOpenChange,
    handleChatSelect,
    handleDeleteChat,
  } = useAssistantChatsHistory({
    service: conversationService,
    toastProvider,
    dialogRef,
    onSelectChat,
    onDeleteChat,
  })

  return (
    <AssistantChatsHistoryView
      chats={chats}
      isLoading={isLoading}
      isReachedEnd={isReachedEnd}
      dialogRef={dialogRef}
      onShowMore={nextPage}
      onOpenChange={handleOpenChange}
      onSelectChat={handleChatSelect}
      onDeleteChat={handleDeleteChat}
    >
      {children}
    </AssistantChatsHistoryView>
  )
}
