import type { IController, IHttp, IChallengingService } from '@stardust/core/interfaces'
import { CountCompletedChallengesByDifficultyLevelUseCase } from '@stardust/core/challenging/use-cases'

export const CountCompletedChallengesByDifficultyLevelController = (
  challengingService: IChallengingService,
): IController => {
  return {
    async handle(http: IHttp) {
      const userDto = await http.getUser()
      const useCase = new CountCompletedChallengesByDifficultyLevelUseCase(
        challengingService,
      )
      const data = await useCase.do(userDto)
      return http.send(data)
    },
  }
}
