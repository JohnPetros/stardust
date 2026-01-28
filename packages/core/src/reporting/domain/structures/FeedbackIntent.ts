import { Logical } from "#global/domain/structures/Logical"

export type FeedbackIntentValue = 'bug' | 'idea' | 'other'

export class FeedbackIntent {
  private constructor(readonly value: FeedbackIntentValue) {}

  static create(value: string): FeedbackIntent {
    if (!FeedbackIntent.isValid(value)) {
      throw new Error(`Invalid feedback intent: ${value}`)
    }

    return new FeedbackIntent(value as FeedbackIntentValue)
  }

  static isValid(value: string): value is FeedbackIntentValue {
    const validValues: FeedbackIntentValue[] = ['bug', 'idea', 'other']
    return validValues.includes(value as FeedbackIntentValue)
  }

  get isBug(): Logical {
    return Logical.create(this.value === 'bug')
  }

  get isIdea(): Logical {
    return Logical.create(this.value === 'idea')
  }

  get isOther(): Logical {
    return Logical.create(this.value === 'other')
  }
}
