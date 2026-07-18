import { ValidationError } from '#global/domain/errors/ValidationError'

import { ChallengeCodeExecutionStatus } from '../ChallengeCodeExecutionStatus'

describe('ChallengeCodeExecutionStatus', () => {
  it('should default to internal error when no value is provided', () => {
    const status = ChallengeCodeExecutionStatus.create()

    expect(status.value).toBe('internal_error')
    expect(status.isInternalError).toBe(true)
  })

  it('should create all named statuses through factory helpers', () => {
    expect(ChallengeCodeExecutionStatus.createAsAccepted().isAccepted).toBe(true)
    expect(ChallengeCodeExecutionStatus.createAsWrongAnswer().isWrongAnswer).toBe(true)
    expect(ChallengeCodeExecutionStatus.createAsSyntaxError().isSyntaxError).toBe(true)
    expect(ChallengeCodeExecutionStatus.createAsRuntimeError().isRuntimeError).toBe(true)
    expect(ChallengeCodeExecutionStatus.createAsInternalError().isInternalError).toBe(
      true,
    )
  })

  it('should identify user mistake statuses', () => {
    expect(ChallengeCodeExecutionStatus.createAsWrongAnswer().isUserMistake).toBe(true)
    expect(ChallengeCodeExecutionStatus.createAsSyntaxError().isUserMistake).toBe(true)
    expect(ChallengeCodeExecutionStatus.createAsRuntimeError().isUserMistake).toBe(true)
    expect(ChallengeCodeExecutionStatus.createAsAccepted().isUserMistake).toBe(false)
    expect(ChallengeCodeExecutionStatus.createAsInternalError().isUserMistake).toBe(false)
  })

  it('should throw when value is invalid', () => {
    expect(() => ChallengeCodeExecutionStatus.create('invalid')).toThrow(ValidationError)
  })
})
