import { ChatMessage } from '@stardust/core/conversation/structures'
import type { SupabaseChatMessage } from '../../types'

export class SupabaseChatMessageMapper {
  static toEntity(supabaseChatMessage: SupabaseChatMessage): ChatMessage {
    return ChatMessage.create({
      id: supabaseChatMessage.id,
      content: supabaseChatMessage.content,
      sender: supabaseChatMessage.sender,
      sentAt: supabaseChatMessage.created_at,
    })
  }

  static toSupabase(chatId: string, message: ChatMessage): SupabaseChatMessage {
    return {
      id: message.id.value,
      chat_id: chatId,
      content: message.content.value,
      sender: message.sender.value as any,
      created_at: message.sentAt.toISOString(),
    }
  }
}
