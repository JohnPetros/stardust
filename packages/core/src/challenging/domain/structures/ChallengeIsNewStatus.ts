import { StringValidation } from '../../../global/libs'

type Value = 'new' | 'old' | 'all'

export class ChallengeIsNewStatus {
  private constructor(readonly value: Value) {}

  static create(value: string) {
    if (!ChallengeIsNewStatus.isValid(value)) throw new Error()

    return new ChallengeIsNewStatus(value)
  }

  static isValid(value: string): value is Value {
    try {
      new StringValidation(value, 'Challenge is new status')
        .oneOf(['new', 'old', 'all'])
        .validate()
      return true
    } catch {
      return false
    }
  }
}
