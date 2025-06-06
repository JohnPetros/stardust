import { StringValidation } from '../../../global/libs'
import type { ChallengeCompletionStatus } from '../types'

export class ChallengeCompletion {
  private constructor(readonly value: ChallengeCompletionStatus) {}

  static create(value: string) {
    if (!ChallengeCompletion.isStatus(value)) throw new Error()

    return new ChallengeCompletion(value)
  }

  static isStatus(value: string): value is ChallengeCompletionStatus {
    new StringValidation(value, 'Challenge completition status').oneOf([
      'completed',
      'not-completed',
      'any',
    ])

    return true
  }
}
