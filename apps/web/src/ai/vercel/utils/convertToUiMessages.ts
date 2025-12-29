import type { UIMessage } from 'ai'

import type { ChatMessage } from '@stardust/core/conversation/structures'

export function convertToUiMessages(chatMessages: ChatMessage[]): UIMessage[] {
  return chatMessages.map((chatMessage) => ({
    id: chatMessage.id.value,
    role: chatMessage.sender.isUser.isTrue ? 'user' : 'assistant',
    parts: [{ type: 'text', text: chatMessage.content.value }],
  }))
}
