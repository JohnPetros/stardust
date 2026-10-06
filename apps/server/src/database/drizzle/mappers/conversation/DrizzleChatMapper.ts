import { Chat } from '@stardust/core/conversation/entities'
import type { Id } from '@stardust/core/global/structures'
import type { DrizzleChat, DrizzleInsertChat } from '../../types/entities/conversation'

export class DrizzleChatMapper {
  constructor(private readonly userId: Id) {}
  static toEntity(row: DrizzleChat): Chat {
    return Chat.create({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt.toISOString(),
    })
  }
  toPersistence(chat: Chat): DrizzleInsertChat {
    return {
      id: chat.id.value,
      name: chat.name.value,
      createdAt: chat.createdAt,
      userId: this.userId.value,
    }
  }
}
