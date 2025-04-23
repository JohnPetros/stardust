import { StringValidation } from '../../../global/libs'
import type { ChallengeCompletionStatus } from '../types'

export class ChallengeCompletion {
  private constructor(readonly status: ChallengeCompletionStatus) {}

  static create(status: string) {
    if (!ChallengeCompletion.isStatus(status)) throw new Error()

    return new ChallengeCompletion(status)
  }

  static isStatus(status: string): status is ChallengeCompletionStatus {
    new StringValidation(status, 'Challenge completition status').oneOf([
      'completed',
      'not-completed',
    ])

    return true
  }
}
