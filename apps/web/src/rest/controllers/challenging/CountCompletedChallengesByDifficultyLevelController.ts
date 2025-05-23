import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { CountCompletedChallengesByDifficultyLevelUseCase } from '@stardust/core/challenging/use-cases'

export const CountCompletedChallengesByDifficultyLevelController = (
  challengingService: ChallengingService,
): Controller => {
  return {
    async handle(http: Http) {
      const userDto = await http.getUser()
      const useCase = new CountCompletedChallengesByDifficultyLevelUseCase(
        challengingService,
      )
      const data = await useCase.execute(userDto)
      return http.send(data)
    },
  }
}
