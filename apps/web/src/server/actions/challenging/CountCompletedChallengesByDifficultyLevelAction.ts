import type {
  IAction,
  IActionServer,
  IChallengingService,
} from '@stardust/core/interfaces'
import { CountCompletedChallengesByDifficultyLevelUseCase } from '@stardust/core/profile/use-cases'
import type { CompletedChallengesCountByDifficultyLevel } from '@stardust/core/challenging/types'

export const CountCompletedChallengesByDifficultyLevelAction = (
  challengingService: IChallengingService,
): IAction<void, CompletedChallengesCountByDifficultyLevel> => {
  return {
    async handle(actionServer: IActionServer) {
      const userDto = await actionServer.getUser()
      const useCase = new CountCompletedChallengesByDifficultyLevelUseCase(
        challengingService,
      )
      return await useCase.do(userDto)
    },
  }
}
