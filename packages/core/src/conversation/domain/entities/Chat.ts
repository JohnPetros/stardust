import { Entity } from '#global/domain/abstracts/index'
import { Id, Text } from '#global/domain/structures/index'
import type { ChatDto } from './dtos/ChatDto'

type ChatProps = {
  title: Text
  userId: Id
  createdAt: Date
}

export class Chat extends Entity<ChatProps> {
  static create(dto: ChatDto) {
    return new Chat({
      title: Text.create(dto.title),
      userId: Id.create(dto.userId),
      createdAt: new Date(dto.createdAt),
    })
  }
}
