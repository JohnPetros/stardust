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

    lspProviderMock.getFunctionName.mockReturnValue(null)
    lspProviderMock.getInputsCount.mockReturnValue(0)
    lspProviderMock.getInput.mockReturnValue(null)
    lspProviderMock.addInputs.mockImplementation(async (_, code) => code)
    lspProviderMock.translateToLsp.mockImplementation(async (value) => String(value))
    lspProviderMock.run
      .mockResolvedValueOnce(new LspResponse({ outputs: ['first line', 'second line'] }))
      .mockResolvedValueOnce(new LspResponse({ outputs: ['third line'] }))

    const code = Code.create(lspProviderMock, challenge.code)

    const executionOutputs = await challenge.runCode(code)

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

    lspProviderMock.getFunctionName.mockReturnValue(null)
    lspProviderMock.getInputsCount.mockReturnValue(0)
    lspProviderMock.getInput.mockReturnValue(null)
    lspProviderMock.addInputs.mockImplementation(async (_, code) => code)
    lspProviderMock.translateToLsp.mockImplementation(async (value) => String(value))
    lspProviderMock.run.mockResolvedValue(
      new LspResponse({ outputs: ['current output', 'extra output'] }),
    )

    const code = Code.create(lspProviderMock, challenge.code)

    const executionOutputs = await challenge.runCode(code)

    expect(executionOutputs.items).toStrictEqual(['current output', 'extra output'])
    expect(challenge.results.items).toStrictEqual([true])
    expect(challenge.userOutputs.items).toStrictEqual(['current output'])
  })
})
