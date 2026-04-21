'use client'

import { ChatInputView } from './ChatInputView'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'

type Props = {
  isDisabled: boolean
  isAssistantGenerating: boolean
  onSendMessage: (message: string) => void
  onPauseAssistantResponse: () => void
}

export const ChatInput = ({
  isDisabled,
  isAssistantGenerating,
  onSendMessage,
  onPauseAssistantResponse,
}: Props) => {
  const { assistantSelections, clearTextSelection, clearCodeSelection } =
    useChallengeStore().getAssistantSelectionsSlice()

  function handleSendMessage(message: string) {
    onSendMessage(message)
  }

  return (
    <ChatInputView
      isDisabled={isDisabled}
      isAssistantGenerating={isAssistantGenerating}
      textSelection={assistantSelections.textSelection}
      codeSelection={assistantSelections.codeSelection}
      onSendMessage={handleSendMessage}
      onPauseAssistantResponse={onPauseAssistantResponse}
      onRemoveTextSelection={clearTextSelection}
      onRemoveCodeSelection={clearCodeSelection}
    />
  )
}
