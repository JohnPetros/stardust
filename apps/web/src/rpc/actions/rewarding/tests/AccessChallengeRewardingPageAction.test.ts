import { mock, type Mock } from 'ts-jest-mocker'

import type { Call } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'

import { COOKIES } from '@/constants'
import { AccessChallengeRewardingPageAction } from '../AccessChallengeRewardingPageAction'

describe('AccessChallengeRewardingPageAction', () => {
  let service: Mock<ProfileService>
  let call: Mock<Call<any>>

  beforeEach(() => {
    service = mock()
    call = mock()
    call.getUser.mockResolvedValue(
      UsersFaker.fakeDto({ id: '99968fac-8a67-46c6-90e5-63ae175961b5' }),
    )
    service.rewardUserForChallengeCompletion.mockResolvedValue(
      new RestResponse({
        body: {
          newCoins: 100,
          newXp: 200,
          newLevel: null,
          newStreak: null,
          newWeekStatus: null,
          accuracyPercentage: 80,
        },
      }),
    )
  })

  it('should call the profile service with the reward payload without legacy counters', async () => {
    call.getCookie.mockResolvedValue(
      JSON.stringify({
        challengeId: '4ca6b6d0-8708-4037-a3e2-6234cba06413',
        secondsCount: 42,
        incorrectAnswersCount: 99,
        maximumIncorrectAnswersCount: 99,
      }),
    )
    const action = AccessChallengeRewardingPageAction(service)

    await action.handle(call)

    expect(call.getCookie).toHaveBeenCalledWith(COOKIES.keys.rewardingPayload)
    expect(service.rewardUserForChallengeCompletion).toHaveBeenCalledWith(
      expect.any(Object),
      {
        challengeId: '4ca6b6d0-8708-4037-a3e2-6234cba06413',
        secondsCount: 42,
      },
    )
  })
})
