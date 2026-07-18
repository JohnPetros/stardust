import { mock, type Mock } from 'ts-jest-mocker'

import { LspError } from '#global/domain/errors/index'
import type { LspProvider } from '#global/interfaces/index'
import { LspResponse } from '#global/responses/index'
import { ChallengeCodeExecution } from '#challenging/domain/structures/index'
import { ChallengesFaker } from '#challenging/domain/entities/fakers/index'
import type {
  ChallengeCodeExecutionsRepository,
  ChallengesRepository,
} from '#challenging/interfaces/index'
import { RunChallengeCodeUseCase } from '../RunChallengeCodeUseCase'

describe('RunChallengeCodeUseCase', () => {
  let challengesRepository: Mock<ChallengesRepository>
  let executionsRepository: Mock<ChallengeCodeExecutionsRepository>
  let lspProvider: Mock<LspProvider>
  let useCase: RunChallengeCodeUseCase

  beforeEach(() => {
    challengesRepository = mock<ChallengesRepository>()
    executionsRepository = mock<ChallengeCodeExecutionsRepository>()
    lspProvider = mock<LspProvider>()
    useCase = new RunChallengeCodeUseCase(
      challengesRepository,
      executionsRepository,
      lspProvider,
    )

    lspProvider.performSyntaxAnalysis.mockResolvedValue(new LspResponse({}))
    executionsRepository.add.mockImplementation()
    lspProvider.getFunctionName.mockReturnValue('solution')
    lspProvider.getInputsCount.mockReturnValue(0)
    lspProvider.addFunctionCall.mockImplementation(async (_, __, code) => code)
    lspProvider.addInputs.mockImplementation(async (_, code) => code)
    lspProvider.translateToLsp.mockImplementation(async (value) => String(value))
  })

  it('should persist an accepted execution', async () => {
    const challenge = ChallengesFaker.fake({
      testCases: [
        { position: 1, inputs: [1], expectedOutput: 2, isLocked: false },
        { position: 2, inputs: [2], expectedOutput: 4, isLocked: false },
      ],
    })
    challengesRepository.findById.mockResolvedValue(challenge)
    lspProvider.run
      .mockResolvedValueOnce(new LspResponse({ result: 2, outputs: ['first'] }))
      .mockResolvedValueOnce(new LspResponse({ result: 4, outputs: ['second'] }))

    const response = await useCase.execute({
      userId: challenge.author.id.value,
      challengeId: challenge.id.value,
      code: 'funcao solution() {}',
    })

    expect(response.status).toBe('accepted')
    expect(response.outputs).toEqual(['first', 'second'])
    expect(response.testResults).toEqual([
      { position: 1, isCorrect: true, userOutput: 2, expectedOutput: 2 },
      { position: 2, isCorrect: true, userOutput: 4, expectedOutput: 4 },
    ])
    expect(executionsRepository.add).toHaveBeenCalledWith(
      challenge.author.id,
      challenge.id,
      expect.any(ChallengeCodeExecution),
    )
  })

  it('should persist a wrong answer execution', async () => {
    const challenge = ChallengesFaker.fake({
      testCases: [{ position: 1, inputs: [], expectedOutput: 2, isLocked: false }],
    })
    challengesRepository.findById.mockResolvedValue(challenge)
    lspProvider.run.mockResolvedValue(new LspResponse({ result: 1 }))

    const response = await useCase.execute({
      userId: challenge.author.id.value,
      challengeId: challenge.id.value,
      code: 'funcao solution() {}',
    })

    expect(response.status).toBe('wrong_answer')
    expect(response.testResults[0]?.isCorrect).toBe(false)
  })

  it('should persist a syntax error execution', async () => {
    const challenge = ChallengesFaker.fake()
    challengesRepository.findById.mockResolvedValue(challenge)
    lspProvider.performSyntaxAnalysis.mockResolvedValue(
      new LspResponse({ errors: [new LspError('Unexpected token', 4)] }),
    )

    const response = await useCase.execute({
      userId: challenge.author.id.value,
      challengeId: challenge.id.value,
      code: 'codigo invalido',
    })

    expect(response.status).toBe('syntax_error')
    expect(response.error).toEqual({
      message: 'Unexpected token',
      line: 4,
      isInternal: false,
    })
    expect(lspProvider.run).not.toHaveBeenCalled()
  })

  it('should persist a runtime error execution from lsp error', async () => {
    const challenge = ChallengesFaker.fake()
    challengesRepository.findById.mockResolvedValue(challenge)
    lspProvider.run.mockResolvedValue(
      new LspResponse({ error: new LspError('Variable not found', 2) }),
    )

    const response = await useCase.execute({
      userId: challenge.author.id.value,
      challengeId: challenge.id.value,
      code: 'funcao solution() {}',
    })

    expect(response.status).toBe('runtime_error')
    expect(response.error).toEqual({
      message: 'Variable not found',
      line: 2,
      isInternal: false,
    })
  })

  it('should persist a user error when the challenge function is modified', async () => {
    const challenge = ChallengesFaker.fake({
      initialCode: 'funcao funcaoEsperada(valor) {}',
      isEvaluatedByFunction: true,
    })
    challengesRepository.findById.mockResolvedValue(challenge)
    lspProvider.getFunctionName.mockImplementation((code) =>
      code.includes('funcaoEsperada') ? 'funcaoEsperada' : 'funcaoRenomeada',
    )

    const response = await useCase.execute({
      userId: challenge.author.id.value,
      challengeId: challenge.id.value,
      code: 'funcao funcaoRenomeada(valor) {}',
    })

    expect(response.status).toBe('runtime_error')
    expect(response.error).toEqual({
      message: 'A função do desafio foi modificada',
      line: null,
      isInternal: false,
    })
    expect(lspProvider.run).not.toHaveBeenCalled()
    expect(executionsRepository.add).toHaveBeenCalledWith(
      challenge.author.id,
      challenge.id,
      expect.any(ChallengeCodeExecution),
    )
  })

  it('should persist a runtime error execution from insufficient inputs', async () => {
    const challenge = ChallengesFaker.fake({
      initialCode: 'leia(a)',
      testCases: [{ position: 1, inputs: [1], expectedOutput: 1, isLocked: false }],
    })
    challengesRepository.findById.mockResolvedValue(challenge)
    lspProvider.getFunctionName.mockReturnValue(null)
    lspProvider.getInputsCount.mockReturnValue(0)

    const response = await useCase.execute({
      userId: challenge.author.id.value,
      challengeId: challenge.id.value,
      code: 'escreva(a)',
    })

    expect(response.status).toBe('runtime_error')
    expect(response.error?.isInternal).toBe(false)
  })

  it('should persist an internal error execution from unexpected errors', async () => {
    const challenge = ChallengesFaker.fake()
    challengesRepository.findById.mockResolvedValue(challenge)
    lspProvider.run.mockRejectedValue(new Error('Platform unavailable'))

    const response = await useCase.execute({
      userId: challenge.author.id.value,
      challengeId: challenge.id.value,
      code: 'funcao solution() {}',
    })

    expect(response.status).toBe('internal_error')
    expect(response.error).toEqual({
      message: 'Platform unavailable',
      line: null,
      isInternal: true,
    })
  })

  it('should compare output when challenge is not evaluated by function', async () => {
    const challenge = ChallengesFaker.fake({
      isEvaluatedByFunction: false,
      testCases: [{ position: 1, inputs: [], expectedOutput: 3, isLocked: false }],
    })
    challengesRepository.findById.mockResolvedValue(challenge)
    lspProvider.run.mockResolvedValue(
      new LspResponse({ result: 'wrong result', outputs: ['3'] }),
    )

    const response = await useCase.execute({
      userId: challenge.author.id.value,
      challengeId: challenge.id.value,
      code: 'funcao solution() {}',
    })

    expect(response.status).toBe('accepted')
    expect(response.testResults[0]?.userOutput).toBe('3')
  })
})
