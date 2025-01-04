import type { IAction, IChallengingService } from '@stardust/core/interfaces'
import type { IProfileService, ISpaceService } from '@stardust/core/interfaces'
import type { IActionServer } from '@stardust/core/interfaces'
import { RewardUserUseCase } from '@stardust/core/profile/use-cases'
import { UnlockNextStarUseCase } from '@stardust/core/space/use-cases'
import type { StarChallengeRewardingPayload } from '@stardust/core/challenging/types'
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

export const RewardForStarChallengeCompletionAction = (
  profileService: IProfileService,
  spaceService: ISpaceService,
  challengingService: IChallengingService,
): IAction<StarChallengeRewardingPayload, Response> => {
  return {
    async handle(actionServer: IActionServer<StarChallengeRewardingPayload>) {
      const { starId, challengeId, incorrectAnswersCount, secondsCount } =
        actionServer.getRequest()
      const userDto = await actionServer.getUser()

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
