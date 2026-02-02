import { useState } from 'react'

import { Chat } from '@stardust/core/conversation/entities'
import type { ConversationService } from '@stardust/core/conversation/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import type { Id } from '@stardust/core/global/structures'
import type { ChatDto } from '@stardust/core/conversation/entities/dtos'
import { ChatMessage } from '@stardust/core/conversation/structures'

type Params = {
  service: ConversationService
  toastProvider: ToastProvider
}

export function useAssistantChatbot({ service, toastProvider }: Params) {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [firstQuestion, setFirstQuestion] = useState<string | null>(null)

  async function fetchChatMessages(chatId: Id) {
    setIsLoading(true)
    const response = await service.fetchChatMessages(chatId)
    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
    }
    if (response.isSuccessful) {
      setChatMessages(response.body.map(ChatMessage.create))
    }
    setIsLoading(false)
  }

  async function handleCreateChatButtonClick(question?: string) {
    setIsLoading(true)
    if (question) setFirstQuestion(question)
    const response = await service.createChat()
    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
    }
    if (response.isSuccessful) {
      setSelectedChat(Chat.create(response.body))
      setChatMessages([])
    }
    setIsLoading(false)
  }

  async function handleSelectChat(chatDto: ChatDto) {
    const chat = Chat.create(chatDto)
    setSelectedChat(chat)
    await fetchChatMessages(chat.id)
  }

  async function handleDeleteChat(chatId: string) {
    if (chatId === selectedChat?.id.value) {
      setSelectedChat(null)
      setChatMessages([])
    }
  }

  async function handleEditChatName(chatId: string, chatName: string) {
    if (selectedChat && chatId === selectedChat.id.value) {
      setSelectedChat(Chat.create({ ...selectedChat.dto, name: chatName }))
    }
  }

  async function handleSendFirstMessage() {
    setFirstQuestion(null)
  }

  return {
    selectedChat,
    chatMessages,
    isLoading,
    firstQuestion,
    handleCreateChatButtonClick,
    handleSelectChat,
    handleDeleteChat,
    handleEditChatName,
    handleSendFirstMessage,
  }
}
