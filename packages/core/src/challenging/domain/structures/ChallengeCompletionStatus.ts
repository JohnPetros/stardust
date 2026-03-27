import { StringValidation } from '../../../global/libs'

type Value = 'completed' | 'not-completed' | 'all'

export class ChallengeCompletionStatus {
  private constructor(readonly value: Value) {}

  static create(value: string) {
    if (!ChallengeCompletionStatus.isValid(value)) throw new Error()

    return new ChallengeCompletionStatus(value)
  }

  static isValid(value: string): value is Value {
    new StringValidation(value, 'Challenge completition status').oneOf([
      'completed',
      'not-completed',
      'all',
    ])

    return true
  }
}
