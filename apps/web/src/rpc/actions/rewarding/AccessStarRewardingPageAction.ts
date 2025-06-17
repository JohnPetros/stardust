import type { Action } from '@stardust/core/global/interfaces'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import type { Call } from '@stardust/core/global/interfaces'
import type { StarRewardingPayload } from '@stardust/core/profile/types'
import type { WeekStatusValue } from '@stardust/core/profile/types'
import { Id } from '@stardust/core/global/structures'

import { COOKIES, ROUTES } from '@/constants'

type Response = {
  newLevel: number | null
  newStreak: number | null
  newWeekStatus: WeekStatusValue | null
  newCoins: number
  newXp: number
  accuracyPercentage: number
  secondsCount: number
  nextRoute: string
}

export const AccessStarRewardingPageAction = (
  service: ProfileService,
): Action<StarRewardingPayload, Response> => {
  return {
    async handle(call: Call<StarRewardingPayload>) {
      const rewardingPayloadCookie = await call.getCookie(COOKIES.keys.rewardingPayload)
      if (!rewardingPayloadCookie) call.notFound()

      const user = await call.getUser()
      const rewardingPayload = JSON.parse(rewardingPayloadCookie)
      const response = await service.rewardUserForStarCompletion(
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
