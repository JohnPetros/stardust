import { mock } from 'ts-jest-mocker'

import { Challenge } from '../Challenge'
import { ChallengesFaker } from '../fakers/ChallengesFaker'
import { Code } from '#global/domain/structures/Code'
import type { LspProvider } from '#global/interfaces/index'
import { LspResponse } from '#global/responses/LspResponse'

describe('Challenge Entity', () => {
  it('should return execution outputs without changing challenge evaluation flow', async () => {
    const lspProviderMock = mock<LspProvider>()
    const challenge = ChallengesFaker.fake({
      testCases: [
        {
          position: 1,
          inputs: [],
          expectedOutput: 'first line',
          isLocked: false,
        },
        {
          position: 2,
          inputs: [],
          expectedOutput: 'third line',
          isLocked: false,
        },
      ],
    })

    lspProviderMock.getFunctionName.mockReturnValue('solution')
    lspProviderMock.getInputsCount.mockReturnValue(0)
    lspProviderMock.getInput.mockReturnValue(null)
    lspProviderMock.addInputs.mockImplementation(async (_, code) => code)
    lspProviderMock.addFunctionCall.mockImplementation(async (_, __, code) => code)
    lspProviderMock.translateToLsp.mockImplementation(async (value) => String(value))
    lspProviderMock.run
      .mockResolvedValueOnce(
        new LspResponse({
          result: 'first line',
          outputs: ['first line', 'second line'],
        }),
      )
      .mockResolvedValueOnce(
        new LspResponse({ result: 'third line', outputs: ['third line'] }),
      )

    const code = Code.create(lspProviderMock, challenge.initialCode.value)

    const executionOutputs = await challenge.runCode(code, code)

    expect(executionOutputs.items).toStrictEqual([
      'first line',
      'second line',
      'third line',
    ])
    expect(challenge.results.items).toStrictEqual([true, true])
    expect(challenge.userOutputs.items).toStrictEqual(['first line', 'third line'])
    expect(lspProviderMock.run).toHaveBeenCalledTimes(2)
  })

  it('should reset previous answers before storing outputs from a new execution', async () => {
    const lspProviderMock = mock<LspProvider>()
    const challenge = Challenge.create({
      ...ChallengesFaker.fakeDto({
        testCases: [
          {
            position: 1,
            inputs: [],
            expectedOutput: 'current output',
            isLocked: false,
          },
        ],
      }),
      results: [false, false],
      userOutputs: ['old output'],
    })

    lspProviderMock.getFunctionName.mockReturnValue('solution')
    lspProviderMock.getInputsCount.mockReturnValue(0)
    lspProviderMock.getInput.mockReturnValue(null)
    lspProviderMock.addInputs.mockImplementation(async (_, code) => code)
    lspProviderMock.addFunctionCall.mockImplementation(async (_, __, code) => code)
    lspProviderMock.translateToLsp.mockImplementation(async (value) => String(value))
    lspProviderMock.run.mockResolvedValue(
      new LspResponse({
        result: 'current output',
        outputs: ['current output', 'extra output'],
      }),
    )

    const code = Code.create(lspProviderMock, challenge.initialCode.value)

    const executionOutputs = await challenge.runCode(code, code)

    expect(executionOutputs.items).toStrictEqual(['current output', 'extra output'])
    expect(challenge.results.items).toStrictEqual([true])
    expect(challenge.userOutputs.items).toStrictEqual(['current output'])
  })

  it('should compare lsp result when evaluated by function', async () => {
    const lspProviderMock = mock<LspProvider>()
    const challenge = ChallengesFaker.fake({
      isEvaluatedByFunction: true,
      testCases: [
        {
          position: 1,
          inputs: [1, 2],
          expectedOutput: 3,
          isLocked: false,
        },
      ],
    })

    lspProviderMock.getFunctionName.mockReturnValue('solution')
    lspProviderMock.addFunctionCall.mockImplementation(async (_, __, code) => code)
    lspProviderMock.translateToLsp.mockImplementation(async (value) => String(value))
    lspProviderMock.run.mockResolvedValue(
      new LspResponse({
        result: 3,
        outputs: ['wrong console output'],
      }),
    )

    const code = Code.create(lspProviderMock, 'funcao solution() {}')

    await challenge.runCode(code, code)

    expect(challenge.results.items).toStrictEqual([true])
    expect(challenge.userOutputs.items).toStrictEqual([3])
  })

  it('should compare applicable output when not evaluated by function', async () => {
    const lspProviderMock = mock<LspProvider>()
    const challenge = ChallengesFaker.fake({
      isEvaluatedByFunction: false,
      testCases: [
        {
          position: 1,
          inputs: [1, 2],
          expectedOutput: 3,
          isLocked: false,
        },
      ],
    })

    lspProviderMock.getFunctionName.mockReturnValue('solution')
    lspProviderMock.addFunctionCall.mockImplementation(async (_, __, code) => code)
    lspProviderMock.translateToLsp.mockImplementation(async (value) => String(value))
    lspProviderMock.run.mockResolvedValue(
      new LspResponse({
        result: 'wrong function result',
        outputs: ['3'],
      }),
    )

    const code = Code.create(lspProviderMock, 'funcao solution() {}')

    const executionOutputs = await challenge.runCode(code, code)

    expect(challenge.results.items).toStrictEqual([true])
    expect(challenge.userOutputs.items).toStrictEqual(['3'])
    expect(executionOutputs.items).toStrictEqual(['3'])
    expect(lspProviderMock.addFunctionCall).toHaveBeenCalled()
  })
})
