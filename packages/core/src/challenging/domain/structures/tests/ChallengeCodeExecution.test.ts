import { ChallengeCodeExecution } from '../ChallengeCodeExecution'

describe('ChallengeCodeExecution', () => {
  it('should be created as accepted', () => {
    const createdAt = new Date('2026-07-16T12:00:00.000Z')
    const execution = ChallengeCodeExecution.create({
      code: 'funcao soma(a, b) { retorna a + b }',
      status: 'accepted',
      testResults: [
        { position: 1, isCorrect: true, userOutput: 3, expectedOutput: 3 },
        { position: 2, isCorrect: true, userOutput: 5, expectedOutput: 5 },
      ],
      outputs: ['log 1', 'log 2'],
      error: null,
      createdAt,
    })

    expect(execution.isAccepted).toBe(true)
    expect(execution.passedTestsCount.value).toBe(2)
    expect(execution.failedTestsCount.value).toBe(0)
    expect(execution.outputs.items.map((output) => output.value)).toEqual([
      'log 1',
      'log 2',
    ])
    expect(execution.createdAt).toEqual(createdAt)
  })

  it('should count failed tests', () => {
    const execution = ChallengeCodeExecution.create({
      code: 'escreva("oi")',
      status: 'wrong_answer',
      testResults: [
        { position: 1, isCorrect: false, userOutput: 1, expectedOutput: 2 },
        { position: 2, isCorrect: true, userOutput: 4, expectedOutput: 4 },
        { position: 3, isCorrect: false, userOutput: 5, expectedOutput: 6 },
      ],
      outputs: [],
      error: null,
    })

    expect(execution.passedTestsCount.value).toBe(1)
    expect(execution.failedTestsCount.value).toBe(2)
  })

  it('should identify user mistake status', () => {
    const execution = ChallengeCodeExecution.create({
      code: 'codigo invalido',
      status: 'syntax_error',
      testResults: [],
      outputs: [],
      error: {
        message: 'Unexpected token',
        line: 1,
        isInternal: false,
      },
    })

    expect(execution.isUserMistake).toBe(true)
  })

  it('should parse created at from ISO string', () => {
    const execution = ChallengeCodeExecution.create({
      code: 'escreva("ok")',
      status: 'accepted',
      testResults: [],
      outputs: [],
      error: null,
      createdAt: '2026-07-16T14:00:00.000Z',
    })

    expect(execution.createdAt).toBeInstanceOf(Date)
    expect(execution.createdAt.toISOString()).toBe('2026-07-16T14:00:00.000Z')
  })

  it('should serialize to dto', () => {
    const dto = {
      code: 'escreva("ok")',
      status: 'runtime_error' as const,
      testResults: [
        {
          position: 1,
          isCorrect: false,
          userOutput: 'erro',
          expectedOutput: 'ok',
        },
      ],
      outputs: ['erro'],
      error: {
        message: 'Runtime error',
        line: null,
        isInternal: false,
      },
      createdAt: new Date('2026-07-16T13:00:00.000Z'),
    }

    const execution = ChallengeCodeExecution.create(dto)

    expect(execution.dto).toEqual(dto)
  })
})
