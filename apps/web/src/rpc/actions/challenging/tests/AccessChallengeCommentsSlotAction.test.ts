import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import type { Call } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { Slug } from '@stardust/core/global/structures'

import { AccessChallengeCommentsSlotAction } from '../AccessChallengeCommentsSlotAction'

describe('Access Challenge Comments Slot Action', () => {
  let call: Mock<Call<{ challengeSlug: string }>>
  let challengingService: Mock<ChallengingService>

  const challengeSlug = 'binary-search'

  beforeEach(() => {
    call = mock<Call<{ challengeSlug: string }>>()
    challengingService = mock<ChallengingService>()

    call.getRequest.mockReturnValue({ challengeSlug })
  })

  it('should return the challenge id when the challenge exists', async () => {
    const challengeDto = ChallengesFaker.fakeDto({ slug: challengeSlug })

    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )

    const action = AccessChallengeCommentsSlotAction(challengingService)
    const response = await action.handle(call)

    expect(challengingService.fetchChallengeBySlug).toHaveBeenCalledWith(
      Slug.create(challengeSlug),
    )
    expect(response).toEqual({ challengeId: challengeDto.id })
  })

  it('should throw when challenge lookup fails', async () => {
    const action = AccessChallengeCommentsSlotAction(challengingService)

    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ statusCode: 404, errorMessage: 'Challenge not found' }),
    )

    await expect(action.handle(call)).rejects.toThrow('Challenge not found')
  })
})
