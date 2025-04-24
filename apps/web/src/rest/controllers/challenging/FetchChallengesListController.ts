import type {
  IController,
  IHttp,
  IChallengingService,
} from '@stardust/core/global/interfaces'
import { ListChallengesUseCase } from '@stardust/core/challenging/use-cases'
import type {
  ChallengeCompletionStatus,
  ChallengeDifficultyLevel,
} from '@stardust/core/challenging/types'

type Schema = {
  queryParams: {
    page: number
    itemsPerPage: number
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
      const {
        page,
        itemsPerPage,
        title,
        categoriesIds,
        completionStatus,
        difficultyLevel,
      } = http.getQueryParams()

      const useCase = new ListChallengesUseCase(challengingService)
      const data = await useCase.do({
        userDto,
        completionStatus,
        listParams: {
          page,
          itemsPerPage,
          title,
          difficultyLevel,
          categoriesIds: categoriesIds ? categoriesIds.split(',') : [],
        },
      })

      return http.send(data)
    },
  }
}
