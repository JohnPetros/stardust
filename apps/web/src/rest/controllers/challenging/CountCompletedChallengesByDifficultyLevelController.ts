import type {
  IController,
  IHttp,
  ChallengingService,
} from '@stardust/core/global/interfaces'
import { CountCompletedChallengesByDifficultyLevelUseCase } from '@stardust/core/challenging/use-cases'

export const CountCompletedChallengesByDifficultyLevelController = (
  challengingService: ChallengingService,
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
