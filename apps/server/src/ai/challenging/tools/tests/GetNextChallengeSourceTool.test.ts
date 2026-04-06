import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengeSourcesFaker } from '@stardust/core/challenging/entities/fakers'
import type { ChallengeSourcesRepository } from '@stardust/core/challenging/interfaces'
import { GetNextChallengeSourceUseCase } from '@stardust/core/challenging/use-cases'
import type { Mcp } from '@stardust/core/global/interfaces'

import { GetNextChallengeSourceTool } from '../GetNextChallengeSourceTool'

describe('Get Next Challenge Source Tool', () => {
  let repository: Mock<ChallengeSourcesRepository>
  let mcp: Mock<Mcp<void>>
  let tool: GetNextChallengeSourceTool

  beforeEach(() => {
    jest.restoreAllMocks()
    repository = mock()
    mcp = mock()
    tool = new GetNextChallengeSourceTool(repository)
  })

  it('should return the next challenge source dto with additional instructions', async () => {
    const challengeSource = ChallengeSourcesFaker.fakeDto({
      additionalInstructions: 'Explique a adaptacao em passos curtos.',
    })

    const executeSpy = jest
      .spyOn(GetNextChallengeSourceUseCase.prototype, 'execute')
      .mockResolvedValue(challengeSource)

    const response = await tool.handle(mcp)

    expect(executeSpy).toHaveBeenCalled()
    expect(response).toEqual(challengeSource)
    expect(response.additionalInstructions).toBe(challengeSource.additionalInstructions)
  })
})
