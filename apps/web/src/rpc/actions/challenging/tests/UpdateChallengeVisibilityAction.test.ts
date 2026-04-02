import { mock, type Mock } from 'ts-jest-mocker'

import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { Call } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { CACHE_KEYS } from '@/constants/server-cache-keys'

import { UpdateChallengeVisibilityAction } from '../UpdateChallengeVisibilityAction'

describe('Update Challenge Visibility Action', () => {
  let call: Mock<Call<{ challengeId: string; isPublic: boolean }>>
  let challengingService: Mock<ChallengingService>

  const challengeId = '550e8400-e29b-41d4-a716-446655440000'

  beforeEach(() => {
    call = mock<Call<{ challengeId: string; isPublic: boolean }>>()
    challengingService = mock<ChallengingService>()
    call.resetCache.mockImplementation(jest.fn())
  })

  it('should fetch the challenge, update its visibility and reset cache on success', async () => {
    const challengeDto = ChallengesFaker.fakeDto({
      id: challengeId,
      isPublic: false,
    })

    call.getRequest.mockReturnValue({ challengeId, isPublic: true })
    challengingService.fetchChallengeById.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.updateChallenge.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )

    const response =
      await UpdateChallengeVisibilityAction(challengingService).handle(call)

    expect(challengingService.fetchChallengeById).toHaveBeenCalledWith(
      expect.objectContaining({ value: challengeId }),
    )
    expect(challengingService.updateChallenge).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.objectContaining({ value: challengeId }),
        isPublic: expect.objectContaining({ isTrue: true }),
      }),
    )
    expect(call.resetCache).toHaveBeenCalledWith(CACHE_KEYS.challenging.challenge)
    expect(response).toEqual({ isPublic: true })
  })

  it('should propagate the fetch error without updating or resetting cache', async () => {
    call.getRequest.mockReturnValue({ challengeId, isPublic: true })
    challengingService.fetchChallengeById.mockResolvedValue(
      new RestResponse({
        statusCode: 404,
        errorMessage: 'Challenge not found',
      }),
    )

    await expect(
      UpdateChallengeVisibilityAction(challengingService).handle(call),
    ).rejects.toThrow('Challenge not found')

    expect(challengingService.updateChallenge).not.toHaveBeenCalled()
    expect(call.resetCache).not.toHaveBeenCalled()
  })

  it('should propagate the update error without resetting cache', async () => {
    const challengeDto = ChallengesFaker.fakeDto({
      id: challengeId,
      isPublic: false,
    })

    call.getRequest.mockReturnValue({ challengeId, isPublic: true })
    challengingService.fetchChallengeById.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.updateChallenge.mockResolvedValue(
      new RestResponse({
        statusCode: 500,
        errorMessage: 'Failed to update challenge visibility',
      }),
    )

    await expect(
      UpdateChallengeVisibilityAction(challengingService).handle(call),
    ).rejects.toThrow('Failed to update challenge visibility')

    expect(call.resetCache).not.toHaveBeenCalled()
  })
})
