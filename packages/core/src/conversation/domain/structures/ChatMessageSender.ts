import { ValidationError } from '#global/domain/errors/ValidationError'
import { Logical } from '#global/domain/structures/Logical'

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

  get isUser(): Logical {
    return Logical.create(this.value === 'user')
  }

  get isAssistant(): Logical {
    return Logical.create(this.value === 'assistant')
  }
}
