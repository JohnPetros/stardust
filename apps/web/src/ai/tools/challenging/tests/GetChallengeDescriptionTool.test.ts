import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { Mcp } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'

import { GetChallengeDescriptionTool } from '../GetChallengeDescriptionTool'

describe('Get Challenge Description Tool', () => {
  let service: Mock<ChallengingService>
  let mcp: Mock<Mcp<{ challengeId: string }>>
  let tool: ReturnType<typeof GetChallengeDescriptionTool>

  beforeEach(() => {
    service = mock<ChallengingService>()
    mcp = mock<Mcp<{ challengeId: string }>>()
    tool = GetChallengeDescriptionTool(service)
  })

  it('should fetch challenge and return formatted description', async () => {
    const challengeDto = ChallengesFaker.fakeDto({
      title: 'FizzBuzz',
      description: 'Implemente o algoritmo de FizzBuzz.',
    })

    mcp.getInput.mockReturnValue({ challengeId: challengeDto.id })
    service.fetchChallengeById.mockResolvedValue(new RestResponse({ body: challengeDto }))

    const result = await tool.handle(mcp)

    expect(mcp.getInput).toHaveBeenCalled()
    expect(service.fetchChallengeById).toHaveBeenCalledWith(
      expect.objectContaining({ value: challengeDto.id }),
    )
    expect(result).toBe(
      'Título: FizzBuzz \nDescrição: \nImplemente o algoritmo de FizzBuzz.',
    )
  })

  it('should throw when challenge lookup fails', async () => {
    mcp.getInput.mockReturnValue({ challengeId: '00000000-0000-0000-0000-000000000000' })
    service.fetchChallengeById.mockResolvedValue(
      new RestResponse({ statusCode: 404, errorMessage: 'Challenge not found' }),
    )

    await expect(tool.handle(mcp)).rejects.toThrow('Challenge not found')
  })
})
