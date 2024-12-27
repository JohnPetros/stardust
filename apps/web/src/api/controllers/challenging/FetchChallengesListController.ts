import type { IController, IHttp, IChallengingService } from '@stardust/core/interfaces'
import { ListChallengesUseCase } from '@stardust/core/challenging/use-cases'
import type {
  ChallengeCompletionStatus,
  ChallengeDifficultyLevel,
} from '@stardust/core/challenging/types'

type Schema = {
  queryParams: {
    title: string
    difficultyLevel: ChallengeDifficultyLevel | 'all'
    completionStatus: ChallengeCompletionStatus | 'all'
    categoriesIds: string
  }
}

export const FetchChallengesListController = (
  challengingService: IChallengingService,
): IController<Schema> => {
  return {
    async handle(http: IHttp<Schema>) {
      const userDto = await http.getUser()
      const { title, categoriesIds, completionStatus, difficultyLevel } =
        http.getQueryParams()

      const useCase = new ListChallengesUseCase(challengingService)
      const challengesDto = await useCase.do({
        userDto,
        completionStatus,
        listParams: {
          title,
          difficultyLevel,
          categoriesIds: categoriesIds ? categoriesIds.split(',') : [],
        },
      })

      return http.send(challengesDto)
    },
  }
}
