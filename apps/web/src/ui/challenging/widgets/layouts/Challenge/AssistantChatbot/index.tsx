'use client'

import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { AssistantChatbotView } from './AssistantChatbotView'
import { useAssistantChatbot } from './useAssistantChatbot'

export const AssistantChatbot = () => {
  const { md: isMobile } = useBreakpoint()
  const { getChallengeSlice, getIsAssistantEnabledSlice, getTabHandlerSlice } =
    useChallengeStore()
  const { challenge } = getChallengeSlice()
  const { setIsAssistantEnabled } = getIsAssistantEnabledSlice()
  const { tabHandler } = getTabHandlerSlice()
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

  function handleClose() {
    if (isMobile) {
      tabHandler?.showCodeTab()
      return
    }

    setIsAssistantEnabled(false)
  }

  if (!challenge) return null

  return (
    <AssistantChatbotView
      challengeId={challenge.id}
      selectedChat={selectedChat}
      chatMessages={chatMessages}
      isLoading={isLoading}
      firstQuestion={firstQuestion}
      onClose={handleClose}
      onSelectChat={handleSelectChat}
      onDeleteChat={handleDeleteChat}
      onEditChatName={handleEditChatName}
      onCreateChat={handleCreateChatButtonClick}
      onSendFirstQuestion={handleSendFirstMessage}
    />
  )
}
