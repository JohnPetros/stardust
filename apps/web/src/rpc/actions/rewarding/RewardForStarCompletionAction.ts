import type { Action } from '@stardust/core/global/interfaces'
import type { ProfileService, ISpaceService } from '@stardust/core/global/interfaces'
import type { Call } from '@stardust/core/global/interfaces'
import type { StarRewardingPayload } from '@stardust/core/space/types'
import type { WeekStatusValue } from '@stardust/core/profile/types'
import { RewardUserUseCase } from '@stardust/core/profile/use-cases'
import {
  CalculateRewardForStarCompletionUseCase,
  UnlockNextStarUseCase,
} from '@stardust/core/space/use-cases'

import { ROUTES } from '@/constants'

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

export const RewardForStarCompletionAction = (
  profileService: ProfileService,
  spaceService: ISpaceService,
): Action<StarRewardingPayload, Response> => {
  return {
    async handle(call: Call<StarRewardingPayload>) {
      const { incorrectAnswersCount, questionsCount, secondsCount, starId } =
        call.getRequest()
      const userDto = await call.getUser()

      const calculateRewardForStarCompletionUseCase =
        new CalculateRewardForStarCompletionUseCase(spaceService)
      const unlockNextStarUseCase = new UnlockNextStarUseCase(spaceService)

      const [{ newXp, newCoins, accuracyPercentage }] = await Promise.all([
        calculateRewardForStarCompletionUseCase.do({
          userDto,
          incorrectAnswersCount,
          questionsCount,
          starId,
        }),
        unlockNextStarUseCase.do({ starId, userDto }),
      ])

      const rewardUserUseCase = new RewardUserUseCase(profileService)
      const { newLevel, newStreak, newWeekStatus } = await rewardUserUseCase.do({
        userDto,
        newCoins,
        newXp,
      })
      console.log({ newLevel })
      console.log(newXp, newCoins, accuracyPercentage, newStreak)

      return {
        newCoins,
        newXp,
        newLevel,
        newStreak,
        newWeekStatus,
        accuracyPercentage,
        secondsCount,
        nextRoute: ROUTES.space,
      }
    },
  }
}
