import type { Action } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import type { Call } from '@stardust/core/global/interfaces'
import type { ChallengeRewardingPayload } from '@stardust/core/challenging/types'
import type { WeekStatusValue } from '@stardust/core/profile/types'
import { CalculateRewardForChallengeCompletionUseCase } from '@stardust/core/challenging/use-cases'
import { RewardUserUseCase } from '@stardust/core/profile/use-cases'

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

export const RewardForChallengeCompletionAction = (
  profileService: ProfileService,
  challengingService: ChallengingService,
): Action<ChallengeRewardingPayload, Response> => {
  return {
    async handle(call: Call<ChallengeRewardingPayload>) {
      const { challengeId, incorrectAnswersCount, secondsCount } = call.getRequest()
      const userDto = await call.getUser()

      const calculateRewardForChallengeCompletionUseCase =
        new CalculateRewardForChallengeCompletionUseCase(challengingService)

      const { newXp, newCoins, accuracyPercentage } =
        await calculateRewardForChallengeCompletionUseCase.execute({
          userDto,
          challengeId,
          incorrectAnswersCount,
        })

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
        nextRoute: ROUTES.challenging.challenges.list,
      }
    },
  }
}
