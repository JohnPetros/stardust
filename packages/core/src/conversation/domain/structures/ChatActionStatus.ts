import { ValidationError } from '#global/domain/errors/ValidationError'

type ChatActionStatusValue = 'pending' | 'accepted' | 'rejected'

export class ChatActionStatus {
  private constructor(readonly value: ChatActionStatusValue) {}

  static create(value: string) {
    if (!ChatActionStatus.isValid(value)) {
      throw new ValidationError([
        {
          name: 'chat-action-status',
          messages: ['Status deve ser "pending", "accepted" ou "rejected"'],
        },
      ])
    }
    return new ChatActionStatus(value)
  }

  static isValid(value: string): value is ChatActionStatusValue {
    return value === 'pending' || value === 'accepted' || value === 'rejected'
  }
}
