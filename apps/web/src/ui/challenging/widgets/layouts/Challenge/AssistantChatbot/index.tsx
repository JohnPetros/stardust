'use client'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { AssistantChatbotView } from './AssistantChatbotView'
import { useAssistantChatbot } from './useAssistantChatbot'

export const AssistantChatbot = () => {
  const { getChallengeSlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()
  const { conversationService } = useRestContext()
  const toastProvider = useToastContext()
  const {
    firstQuestion,
    selectedChat,
    chatMessages,
    isLoading,
    handleCreateChatButtonClick,
    handleSelectChat,
    handleDeleteChat,
    handleEditChatName,
    handleSendFirstMessage,
  } = useAssistantChatbot({
    service: conversationService,
    toastProvider,
  })

  if (!challenge) return null

  return (
    <AssistantChatbotView
      challengeId={challenge.id}
      selectedChat={selectedChat}
      chatMessages={chatMessages}
      isLoading={isLoading}
      firstQuestion={firstQuestion}
      onSelectChat={handleSelectChat}
      onDeleteChat={handleDeleteChat}
      onEditChatName={handleEditChatName}
      onCreateChat={handleCreateChatButtonClick}
      onSendFirstQuestion={handleSendFirstMessage}
    />
  )
}
