import {
  useState,
  useRef,
  useLayoutEffect,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react'

type Params = {
  onSendMessage: (message: string) => void
}

export const useChatInput = ({ onSendMessage }: Params) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
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
