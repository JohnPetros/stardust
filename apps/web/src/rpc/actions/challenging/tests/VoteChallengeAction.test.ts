import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { Call } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { CACHE_KEYS } from '@/constants/cache-keys'

import { VoteChallengeAction } from '../VoteChallengeAction'

describe('Vote Challenge Action', () => {
  let call: Mock<Call<{ challengeId: string; challengeVote: string }>>
  let challengingService: Mock<ChallengingService>

  const challengeId = '550e8400-e29b-41d4-a716-446655440000'
  const challengeVote = 'upvote'

  beforeEach(() => {
    call = mock<Call<{ challengeId: string; challengeVote: string }>>()
    challengingService = mock<ChallengingService>()

    call.getRequest.mockReturnValue({ challengeId, challengeVote })
    call.resetCache.mockImplementation(jest.fn())
  })

  it('should vote on the challenge and reset the challenging cache on success', async () => {
    const responseBody = { userChallengeVote: challengeVote }

    challengingService.voteChallenge.mockResolvedValue(
      new RestResponse({ body: responseBody }),
    )

    const response = await VoteChallengeAction(challengingService).handle(call)

    expect(challengingService.voteChallenge).toHaveBeenCalledWith(
      expect.objectContaining({ value: challengeId }),
      expect.objectContaining({ value: challengeVote }),
    )
    expect(call.resetCache).toHaveBeenCalledWith(CACHE_KEYS.challenging.challenge)
    expect(response).toEqual(responseBody)
  })

  it('should propagate the error without resetting the cache when voting fails', async () => {
    challengingService.voteChallenge.mockResolvedValue(
      new RestResponse({
        statusCode: 500,
        errorMessage: 'Failed to vote on challenge',
      }),
    )

    await expect(VoteChallengeAction(challengingService).handle(call)).rejects.toThrow(
      'Failed to vote on challenge',
    )

    expect(call.resetCache).not.toHaveBeenCalled()
  })
})
