import type { IAction, IChallengingService } from '@stardust/core/interfaces'
import type { IProfileService } from '@stardust/core/interfaces'
import type { IActionServer } from '@stardust/core/interfaces'
import { RewardUserUseCase } from '@stardust/core/profile/use-cases'
import type { ChallengeRewardingPayload } from '@stardust/core/challenging/types'
import { CalculateRewardForChallengeCompletionUseCase } from '@stardust/core/challenging/use-cases'

import { ROUTES } from '@/constants'

type Response = {
  nextRoute: string
  newLevel: number | null
  newCoins: number
  newXp: number
  accuracyPercentage: number
  secondsCount: number
}

export const RewardForChallengeCompletionAction = (
  profileService: IProfileService,
  challengingService: IChallengingService,
): IAction<ChallengeRewardingPayload, Response> => {
  return {
    async handle(actionServer: IActionServer<ChallengeRewardingPayload>) {
      const { challengeId, incorrectAnswersCount, secondsCount } =
        actionServer.getRequest()
      const userDto = await actionServer.getUser()

      const calculateRewardForChallengeCompletionUseCase =
        new CalculateRewardForChallengeCompletionUseCase(challengingService)

      const { newXp, newCoins, accuracyPercentage } =
        await calculateRewardForChallengeCompletionUseCase.do({
          userDto,
          challengeId,
          incorrectAnswersCount,
        })

      const rewardUserUseCase = new RewardUserUseCase(profileService)
      const { newLevel } = await rewardUserUseCase.do({
        userDto,
        newCoins,
        newXp,
      })

      return {
        newCoins,
        newXp,
        newLevel,
        accuracyPercentage,
        secondsCount,
        nextRoute: ROUTES.space,
      }
    },
  }
}
