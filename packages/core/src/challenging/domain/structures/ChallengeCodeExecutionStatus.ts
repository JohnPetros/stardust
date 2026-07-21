import { ValidationError } from '#global/domain/errors/ValidationError'
import { StringValidation } from '#global/libs/index'

export type ChallengeCodeExecutionStatusValue =
  | 'accepted'
  | 'wrong_answer'
  | 'syntax_error'
  | 'runtime_error'
  | 'internal_error'

export class ChallengeCodeExecutionStatus {
  private constructor(readonly value: ChallengeCodeExecutionStatusValue) {}

  static create(value?: string): ChallengeCodeExecutionStatus {
    if (!value) return ChallengeCodeExecutionStatus.createAsInternalError()

    if (!ChallengeCodeExecutionStatus.isChallengeCodeExecutionStatusValue(value))
      throw new ValidationError([
        { name: 'challenge code execution status value', messages: ['Invalid value'] },
      ])

    return new ChallengeCodeExecutionStatus(value)
  }

  static createAsAccepted(): ChallengeCodeExecutionStatus {
    return new ChallengeCodeExecutionStatus('accepted')
  }

  static createAsWrongAnswer(): ChallengeCodeExecutionStatus {
    return new ChallengeCodeExecutionStatus('wrong_answer')
  }

  static createAsSyntaxError(): ChallengeCodeExecutionStatus {
    return new ChallengeCodeExecutionStatus('syntax_error')
  }

  static createAsRuntimeError(): ChallengeCodeExecutionStatus {
    return new ChallengeCodeExecutionStatus('runtime_error')
  }

  static createAsInternalError(): ChallengeCodeExecutionStatus {
    return new ChallengeCodeExecutionStatus('internal_error')
  }

  get isAccepted(): boolean {
    return this.value === 'accepted'
  }

  get isWrongAnswer(): boolean {
    return this.value === 'wrong_answer'
  }

  get isSyntaxError(): boolean {
    return this.value === 'syntax_error'
  }

  get isRuntimeError(): boolean {
    return this.value === 'runtime_error'
  }

  get isInternalError(): boolean {
    return this.value === 'internal_error'
  }

  get isUserMistake(): boolean {
    return this.isWrongAnswer || this.isSyntaxError || this.isRuntimeError
  }

  private static isChallengeCodeExecutionStatusValue(
    value: string,
  ): value is ChallengeCodeExecutionStatusValue {
    new StringValidation(value, 'Challenge code execution status value')
      .oneOf([
        'accepted',
        'wrong_answer',
        'syntax_error',
        'runtime_error',
        'internal_error',
      ])
      .validate()
    return true
  }
}
