import { mock, type Mock } from 'ts-jest-mocker'

jest.mock('@/constants', () => ({
  ENV: {
    mode: 'test',
  },
}))

import type {
  ChallengesRepository,
  ChallengeSourcesRepository,
} from '@stardust/core/challenging/interfaces'
import { PostChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { Broker, Mcp } from '@stardust/core/global/interfaces'

import { PostChallengeTool } from '../PostChallengeTool'

describe('Post Challenge Tool', () => {
  let repository: Mock<ChallengesRepository>
  let challengeSourcesRepository: Mock<ChallengeSourcesRepository>
  let broker: Mock<Broker>
  let mcp: Mock<Mcp<any>>
  let tool: PostChallengeTool

  beforeEach(() => {
    jest.restoreAllMocks()
    repository = mock()
    challengeSourcesRepository = mock()
    broker = mock()
    mcp = mock()
    tool = new PostChallengeTool(repository, challengeSourcesRepository, broker)
  })

  it('should post a challenge and forward challengeSourceId when provided', async () => {
    const input = {
      title: 'Binary search',
      description: 'Implemente a busca binaria.',
      code: 'function binarySearch() {}',
      difficultyLevel: 'easy',
      testCases: [],
      categories: [{ name: 'algorithms' }],
      challengeSourceId: '550e8400-e29b-41d4-a716-446655440015',
    }

    mcp.getInput.mockReturnValue(input)

    const executeSpy = jest
      .spyOn(PostChallengeUseCase.prototype, 'execute')
      .mockResolvedValue(undefined as never)

    await tool.handle(mcp)

    expect(executeSpy).toHaveBeenCalledWith({
      challengeDto: expect.objectContaining({
        title: input.title,
        description: input.description,
        code: input.code,
        difficultyLevel: input.difficultyLevel,
        testCases: input.testCases,
        categories: input.categories,
        author: expect.objectContaining({
          id: '99968fac-8a67-46c6-90e5-63ae175961b5',
        }),
      }),
      challengeSourceId: input.challengeSourceId,
    })
  })

  it('should send null challengeSourceId when it is omitted', async () => {
    const input = {
      title: 'Two sum',
      description: 'Resolva o problema two sum.',
      code: 'function twoSum() {}',
      difficultyLevel: 'easy',
      testCases: [],
      categories: [{ name: 'arrays' }],
    }

    mcp.getInput.mockReturnValue(input)

    const executeSpy = jest
      .spyOn(PostChallengeUseCase.prototype, 'execute')
      .mockResolvedValue(undefined as never)

    await tool.handle(mcp)

    expect(executeSpy).toHaveBeenCalledWith(
      expect.objectContaining({ challengeSourceId: null }),
    )
  })
})
