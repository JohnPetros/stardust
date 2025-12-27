import { ValidationError } from '#global/domain/errors/ValidationError'

type ChatMessageSenderValue = 'user' | 'assistant'

export class ChatMessageSender {
  private constructor(readonly value: ChatMessageSenderValue) {}

  static create(value: string) {
    if (!ChatMessageSender.isValid(value)) {
      throw new ValidationError([
        {
          name: 'chat-message-sender',
          messages: ['Sender deve ser "user" ou "assistant"'],
        },
      ])
    }
    return new ChatMessageSender(value)
  }

  static isValid(value: string): value is ChatMessageSenderValue {
    return value === 'user' || value === 'assistant'
  }
}
