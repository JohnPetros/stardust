import { ValidationError } from '#global/domain/errors/ValidationError'

type ChatActionIntentValue = 'code-suggestion'

export class ChatActionIntent {
  private constructor(readonly value: ChatActionIntentValue) {}

  static create(value: string) {
    if (!ChatActionIntent.isValid(value)) {
      throw new ValidationError([
        {
          name: 'chat-action-intent',
          messages: ['Intent deve ser "code-suggestion"'],
        },
      ])
    }
    return new ChatActionIntent(value)
  }

  static isValid(value: string): value is ChatActionIntentValue {
    return value === 'code-suggestion'
  }
}
