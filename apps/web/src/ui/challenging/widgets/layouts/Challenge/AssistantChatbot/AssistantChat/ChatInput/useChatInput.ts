import {
  useState,
  useRef,
  useLayoutEffect,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react'

import type { AssistantSelections } from '@/ui/challenging/stores/ChallengeStore/types'

type Params = {
  assistantSelections: AssistantSelections
  onSendMessage: (message: string, selections: AssistantSelections) => void
}

export const useChatInput = ({ assistantSelections, onSendMessage }: Params) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message, assistantSelections)
      setMessage('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  useLayoutEffect(() => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`
  }, [message])

  return {
    textareaRef,
    message,
    handleMessageChange,
    handleKeyDown,
    handleSendMessage,
  }
}
