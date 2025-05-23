import type { Action } from '@stardust/core/global/interfaces'
import type { SpaceService } from '@stardust/core/space/interfaces'
import type { ProfileService } from '@stardust/core/profile/interfaces'
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
  spaceService: SpaceService,
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
        calculateRewardForStarCompletionUseCase.execute({
          userDto,
          incorrectAnswersCount,
          questionsCount,
          starId,
        }),
        unlockNextStarUseCase.execute({ starId, userDto }),
      ])

      const rewardUserUseCase = new RewardUserUseCase(profileService)
      const { newLevel, newStreak, newWeekStatus } = await rewardUserUseCase.execute({
        userDto,
        newCoins,
        newXp,
      })

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
