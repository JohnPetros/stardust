'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import type { Id } from '@stardust/core/global/structures'
import { ChatMessage } from '@stardust/core/conversation/structures'

import { ROUTES } from '@/constants'
import { AssistantChatView } from './AssistantChatView'
import { useRest } from '@/ui/global/hooks/useRest'
import { useAssistantChatError } from './useAssistantChatError'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type Props = {
  initialMessages: ChatMessage[]
  chatId: Id
  challengeId: Id
  firstQuestion: string | null
  onSendFirstQuestion: () => void
}

export const AssistantChat = ({
  chatId,
  challengeId,
  initialMessages,
  firstQuestion,
  onSendFirstQuestion,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const lastAssistanteMessage = useRef<ChatMessage | null>(null)
  const toastProvider = useToastContext()
  const { conversationService, notificationService } = useRest()
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages)
  const [assistantMessageContentParts, setAssistantMessageContentParts] = useState<
    string[]
  >([])
  const { messages, status, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: ROUTES.api.conversation.chats.assistant(chatId.value),
    }),
    messages: initialMessages.map((message) => {
      return {
        id: message.id.value,
        role: message.sender.isUser.isTrue ? 'user' : 'assistant',
        parts: [{ type: 'text', text: message.content.value }],
      }
    }),
    async onFinish({ message }) {
      const lastPart = message.parts.at(-1)
      if (!lastPart || !lastPart.text) return
      lastAssistanteMessage.current = ChatMessage.create({
        sender: 'assistant',
        content: lastPart.text,
      })
    },
  })

  const { errorType, setErrorType } = useAssistantChatError({
    error,
    service: notificationService,
    toastProvider,
  })

  const scrollToBottom = useCallback(() => {
    containerRef.current?.scrollTo(0, containerRef.current?.scrollHeight)
  }, [])

  const sendChatMessage = useCallback(
    async (messageContent: string) => {
      const response = await conversationService.incrementAssistantChatMessageCount()
      if (response.isFailure) setErrorType('chat-messages-exceeded')

      if (response.isSuccessful) {
        if (lastAssistanteMessage.current !== null) {
          const assistant = lastAssistanteMessage.current
          setChatMessages((chatMessages) => [...chatMessages, assistant])
        }

        setChatMessages((chatMessages) => [
          ...chatMessages,
          ChatMessage.create({ sender: 'user', content: messageContent }),
        ])

        sendMessage(
          { text: messageContent },
          { body: { question: messageContent, challengeId: challengeId.value } },
        )
      }

      setAssistantMessageContentParts([])
      setTimeout(() => scrollToBottom(), 100)
    },
    [challengeId],
  )

  useEffect(() => {
    const lastMessage = messages.at(-1)

    if (status === 'streaming' && lastMessage?.role === 'assistant') {
      setAssistantMessageContentParts(
        lastMessage.parts
          .filter((part) => part.type === 'text' && part.text)
          .map((part) => part.text),
      )
    }

    if (!containerRef.current) return

    const threshold = 200
    const isAtBottom =
      containerRef.current.scrollHeight - containerRef.current.scrollTop <=
      containerRef.current.clientHeight + threshold

    if (isAtBottom) {
      scrollToBottom()
    }
  }, [messages, status, scrollToBottom])

  useEffect(() => {
    if (firstQuestion) {
      sendChatMessage(firstQuestion)
      onSendFirstQuestion()
    }
  }, [firstQuestion, sendChatMessage, onSendFirstQuestion])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  return (
    <AssistantChatView
      containerRef={containerRef}
      messages={chatMessages}
      isAssistantThinking={
        status === 'submitted' ||
        (status === 'streaming' && assistantMessageContentParts.length === 0)
      }
      isAssistantAnswering={status === 'streaming'}
      chatErrorType={errorType}
      assistantMessageContentParts={assistantMessageContentParts}
      isChatEmpty={chatMessages.length === 0}
      onSendMessageButtonClick={sendChatMessage}
    />
  )
}
