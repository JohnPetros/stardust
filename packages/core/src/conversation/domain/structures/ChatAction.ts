import { ChatActionStatus } from './ChatActionStatus'
import { ChatActionIntent } from './ChatActionIntent'
import type { ChatActionDto } from './dtos'

export class ChatAction {
  private constructor(
    readonly intent: ChatActionIntent,
    readonly status: ChatActionStatus,
    readonly createdAt: Date,
  ) {}

  static create(dto: ChatActionDto) {
    return new ChatAction(
      ChatActionIntent.create(dto.intent),
      ChatActionStatus.create(dto.status),
      new Date(dto.createdAt),
    )
  }
}
