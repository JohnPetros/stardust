import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
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
  challengingService: ChallengingService,
): Controller<Schema> => {
  return {
    async handle(http: Http<Schema>) {
      const userDto = await http.getUser()
      const {
        page,
        itemsPerPage,
        title,
        categoriesIds,
        completionStatus,
        difficultyLevel,
      } = await http.getQueryParams()

      const useCase = new ListChallengesUseCase(challengingService)
      const data = await useCase.execute({
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
