import { mock, type Mock } from 'ts-jest-mocker'

jest.mock('@/constants', () => ({
  CACHE: {
    challenging: {
      challengeProblems: {
        key: 'challenge-problems',
      },
    },
  },
}))

import { ChallengeProblemNotFoundError } from '@stardust/core/challenging/errors'
import type { CacheProvider, Mcp } from '@stardust/core/global/interfaces'

import { GetChallengeProblemTool } from '../GetChallengeProblemTool'

describe('Get Challenge Problem Tool', () => {
  let cacheProvider: Mock<CacheProvider>
  let mcp: Mock<Mcp>
  let tool: GetChallengeProblemTool

  beforeEach(() => {
    cacheProvider = mock()
    mcp = mock()
    tool = new GetChallengeProblemTool(cacheProvider)
  })

  it('should return the cached challenge problem', async () => {
    cacheProvider.popListItem.mockResolvedValue('Explique o uso de hash map.')

    const response = await tool.handle(mcp)

    expect(cacheProvider.popListItem).toHaveBeenCalledWith('challenge-problems')
    expect(response).toEqual({
      problem: 'Explique o uso de hash map.',
    })
  })

  it('should throw when there is no cached challenge problem', async () => {
    cacheProvider.popListItem.mockResolvedValue(null)

    await expect(tool.handle(mcp)).rejects.toThrow(ChallengeProblemNotFoundError)
  })
})
