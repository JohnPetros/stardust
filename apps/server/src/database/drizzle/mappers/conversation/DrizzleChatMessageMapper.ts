import { ChatMessage } from '@stardust/core/conversation/structures'
import type { Id } from '@stardust/core/global/structures'
import type {
  DrizzleChatMessage,
  DrizzleInsertChatMessage,
} from '../../types/entities/conversation'

export class DrizzleChatMessageMapper {
  constructor(private readonly chatId: Id) {}
  static toEntity(row: DrizzleChatMessage): ChatMessage {
    return ChatMessage.create({
      id: row.id,
      content: row.content,
      sender: row.sender,
      sentAt: row.createdAt.toISOString(),
    })
  }
  toPersistence(message: ChatMessage): DrizzleInsertChatMessage {
    return {
      id: message.id.value,
      chatId: this.chatId.value,
      ...DrizzleChatMessageMapper.payload(message),
      createdAt: message.sentAt,
    }
  }
  private static payload(
    message: ChatMessage,
  ): Pick<DrizzleInsertChatMessage, 'content' | 'sender'> {
    return { content: message.content.value, sender: message.sender.value }
  }
}
