import type { IAction } from '@stardust/core/global/interfaces'
import type { IProfileService, ISpaceService } from '@stardust/core/global/interfaces'
import type { IActionServer } from '@stardust/core/global/interfaces'
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
  profileService: IProfileService,
  spaceService: ISpaceService,
): IAction<StarRewardingPayload, Response> => {
  return {
    async handle(actionServer: IActionServer<StarRewardingPayload>) {
      const { incorrectAnswersCount, questionsCount, secondsCount, starId } =
        actionServer.getRequest()
      const userDto = await actionServer.getUser()

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
