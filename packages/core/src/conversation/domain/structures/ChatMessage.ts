import { Text } from '#global/domain/structures/Text'
import { ChatAction } from './ChatAction'
import { ChatMessageSender } from './ChatMessageSender'
import type { ChatMessageDto } from './dtos'

export class ChatMessage {
  private constructor(
    readonly content: Text | ChatAction,
    readonly sender: ChatMessageSender,
    readonly sentAt: Date,
  ) {}

  static create(dto: ChatMessageDto) {
    let content: Text | ChatAction

    if (typeof dto.content === 'string') {
      content = Text.create(dto.content)
    } else {
      content = ChatAction.create(dto.content)
    }

    return new ChatMessage(
      content,
      ChatMessageSender.create(dto.sender),
      new Date(dto.sentAt),
    )
  }
}
