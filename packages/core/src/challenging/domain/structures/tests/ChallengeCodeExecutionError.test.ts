import { ChallengeCodeExecutionError } from '../ChallengeCodeExecutionError'

describe('ChallengeCodeExecutionError', () => {
  it('should be created with a numeric line', () => {
    const error = ChallengeCodeExecutionError.create({
      message: 'Unexpected token',
      line: 3,
      isInternal: false,
    })

    expect(error.message.value).toBe('Unexpected token')
    expect(error.line?.value).toBe(3)
    expect(error.isInternal.isFalse).toBe(true)
  })

  it('should be created with a null line', () => {
    const error = ChallengeCodeExecutionError.create({
      message: 'Platform unavailable',
      line: null,
      isInternal: true,
    })

    expect(error.line).toBeNull()
    expect(error.isInternal.isTrue).toBe(true)
  })

  it('should serialize to dto', () => {
    const dto = {
      message: 'Reference error',
      line: 10,
      isInternal: false,
    }

    const error = ChallengeCodeExecutionError.create(dto)

    expect(error.dto).toEqual(dto)
  })
})
