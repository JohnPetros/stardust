import type { Action, IChallengingService } from '@stardust/core/global/interfaces'
import type { ProfileService, ISpaceService } from '@stardust/core/global/interfaces'
import type { Call } from '@stardust/core/global/interfaces'
import type { WeekStatusValue } from '@stardust/core/profile/types'
import type { StarChallengeRewardingPayload } from '@stardust/core/challenging/types'
import { RewardUserUseCase } from '@stardust/core/profile/use-cases'
import { UnlockNextStarUseCase } from '@stardust/core/space/use-cases'
import { CalculateRewardForChallengeCompletionUseCase } from '@stardust/core/challenging/use-cases'

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

export const RewardForStarChallengeCompletionAction = (
  profileService: ProfileService,
  spaceService: ISpaceService,
  challengingService: IChallengingService,
): Action<StarChallengeRewardingPayload, Response> => {
  return {
    async handle(call: Call<StarChallengeRewardingPayload>) {
      const { starId, challengeId, incorrectAnswersCount, secondsCount } =
        call.getRequest()
      const userDto = await call.getUser()

      const calculateRewardForChallengeCompletionUseCase =
        new CalculateRewardForChallengeCompletionUseCase(challengingService)
      const unlockNextStarUseCase = new UnlockNextStarUseCase(spaceService)

      const [{ newXp, newCoins, accuracyPercentage }] = await Promise.all([
        calculateRewardForChallengeCompletionUseCase.do({
          userDto,
          challengeId,
          incorrectAnswersCount,
        }),
        unlockNextStarUseCase.do({ starId, userDto }),
      ])

      const rewardUserUseCase = new RewardUserUseCase(profileService)
      const { newLevel, newStreak, newWeekStatus } = await rewardUserUseCase.do({
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
