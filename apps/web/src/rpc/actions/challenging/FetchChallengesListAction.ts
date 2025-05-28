import type { Action, Call } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type {
  ChallengeCompletionStatus,
  ChallengeDifficultyLevel,
} from '@stardust/core/challenging/types'
import { ListChallengesUseCase } from '@stardust/core/challenging/use-cases'
import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'
import { PaginationResponse } from '@stardust/core/global/responses'
import { OrdinalNumber } from '@stardust/core/global/structures'

type Request = {
  page: number
  itemsPerPage: number
  title: string
  difficultyLevel: ChallengeDifficultyLevel | 'all'
  completionStatus: ChallengeCompletionStatus | 'all'
  categoriesIds: string
}

export const FetchChallengesListAction = (
  challengingService: ChallengingService,
): Action<Request, PaginationResponse<ChallengeDto>> => {
  return {
    async handle(call: Call<Request>) {
      const userDto = await call.getUser()
      const {
        page,
        itemsPerPage,
        title,
        categoriesIds,
        completionStatus,
        difficultyLevel,
      } = call.getRequest()

      const useCase = new ListChallengesUseCase(challengingService)
      const pagination = await useCase.execute({
        userDto,
        completionStatus,
        listParams: {
          page: OrdinalNumber.create(page),
          itemsPerPage: OrdinalNumber.create(itemsPerPage),
          title,
          difficultyLevel,
          categoriesIds: categoriesIds ? categoriesIds.split(',') : [],
        },
      })

      return new PaginationResponse(pagination.items, pagination.totalItemsCount)
    },
  }
}
