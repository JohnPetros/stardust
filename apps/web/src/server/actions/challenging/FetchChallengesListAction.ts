import type {
  IAction,
  IActionServer,
  IChallengingService,
} from '@stardust/core/interfaces'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import type {
  ChallengeCompletionStatus,
  ChallengeDifficultyLevel,
} from '@stardust/core/challenging/types'
import { ListChallengesUseCase } from '@stardust/core/challenging/use-cases'
import type { PaginationResponse } from '@stardust/core/responses'
import type { ListingOrder } from '@stardust/core/global/types'

type Request = {
  page: number
  itemsPerPage: number
  title: string
  difficultyLevel: ChallengeDifficultyLevel | 'all'
  completionStatus: ChallengeCompletionStatus | 'all'
  categoriesIds: string
  postOrder: ListingOrder | 'all'
  upvotesOrder: ListingOrder | 'all'
}

export const FetchChallengesListAction = (
  challengingService: IChallengingService,
): IAction<Request, PaginationResponse<ChallengeDto>> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const userDto = await actionServer.getUser()
      const {
        page,
        itemsPerPage,
        title,
        categoriesIds,
        completionStatus,
        difficultyLevel,
        postOrder,
        upvotesOrder,
      } = actionServer.getRequest()

      const useCase = new ListChallengesUseCase(challengingService)
      const pagination = await useCase.do({
        userDto,
        completionStatus,
        listParams: {
          page,
          itemsPerPage,
          title,
          difficultyLevel,
          postOrder,
          upvotesOrder,
          categoriesIds: categoriesIds ? categoriesIds.split(',') : [],
        },
      })

      return { items: pagination.items, count: pagination.count }
    },
  }
}
