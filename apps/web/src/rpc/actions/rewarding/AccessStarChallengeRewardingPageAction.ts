import type { Action, Call } from '@stardust/core/global/interfaces'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import type { WeekStatusValue } from '@stardust/core/profile/types'
import type { StarChallengeRewardingPayload } from '@stardust/core/profile/types'
import { Id } from '@stardust/core/global/structures'

import { COOKIES, ROUTES } from '@/constants'

type Response = {
  nextRoute: string
  newLevel: number | null
  newStreak: number | null
  newWeekStatus: WeekStatusValue | null
  newCoins: number
  newXp: number
  accuracyPercentage: number
  secondsCount: number
}

export const AccessStarChallengeRewardingPageAction = (
  service: ProfileService,
): Action<StarChallengeRewardingPayload, Response> => {
  return {
    async handle(call: Call<StarChallengeRewardingPayload>) {
      const rewardingPayloadCookie = await call.getCookie(COOKIES.keys.rewardingPayload)
      if (!rewardingPayloadCookie) call.notFound()

      const user = await call.getUser()

      const rewardingPayload = JSON.parse(rewardingPayloadCookie)
      const response = await service.rewardUserForStarChallengeCompletion(
        Id.create(user.id),
        rewardingPayload,
      )
      if (response.isFailure) response.throwError()

      const { newCoins, newXp, newLevel, newStreak, newWeekStatus, accuracyPercentage } =
        response.body

      return {
        newCoins,
        newXp,
        newLevel,
        newStreak,
        newWeekStatus,
        accuracyPercentage,
        secondsCount: rewardingPayload.secondsCount,
        nextRoute: ROUTES.space,
      }
    },
  }
}
