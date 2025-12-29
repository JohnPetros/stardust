import { Entity } from '#global/domain/abstracts/index'
import { Text } from '#global/domain/structures/Text'
import { ChatMessageSender } from './ChatMessageSender'
import type { ChatMessageDto } from './dtos'

type ChatMessageProps = {
  content: Text
  sender: ChatMessageSender
  sentAt: Date
}

export class ChatMessage extends Entity<ChatMessageProps> {
  static create(dto: ChatMessageDto) {
    return new ChatMessage(
      {
        content: Text.create(dto.content),
        sender: ChatMessageSender.create(dto.sender),
        sentAt: dto.sentAt ? new Date(dto.sentAt) : new Date(),
      },
      dto.id,
    )
  }

  get content(): Text {
    return this.props.content
  }

  get sender(): ChatMessageSender {
    return this.props.sender
  }

  get sentAt(): Date {
    return this.props.sentAt
  }

  get dto(): ChatMessageDto {
    return {
      id: this.id.value,
      content: this.content.value,
      sender: this.sender.value,
      sentAt: this.sentAt.toISOString(),
    }
  }
}
