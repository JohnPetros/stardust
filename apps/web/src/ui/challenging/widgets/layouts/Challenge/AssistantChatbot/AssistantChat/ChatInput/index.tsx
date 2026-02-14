'use client'

import { ChatInputView } from './ChatInputView'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'

type Props = {
  isDisabled: boolean
  onSendMessage: (message: string) => void
}

export const ChatInput = ({ isDisabled, onSendMessage }: Props) => {
  const { assistantSelections, clearTextSelection, clearCodeSelection } =
    useChallengeStore().getAssistantSelectionsSlice()

  function handleSendMessage(message: string) {
    onSendMessage(message)
  }

  return (
    <ChatInputView
      isDisabled={isDisabled}
      textSelection={assistantSelections.textSelection}
      codeSelection={assistantSelections.codeSelection}
      onSendMessage={handleSendMessage}
      onRemoveTextSelection={clearTextSelection}
      onRemoveCodeSelection={clearCodeSelection}
    />
  )
}
