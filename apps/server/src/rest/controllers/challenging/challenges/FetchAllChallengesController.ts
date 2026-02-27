import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { ListChallengesUseCase } from '@stardust/core/challenging/use-cases'

type Schema = {
  queryParams: {
    page: number
    itemsPerPage: number
    title: string
    categoriesIds: string[]
    difficulty: string
    upvotesCountOrder: string
    downvoteCountOrder: string
    completionCountOrder: string
    postingOrder: string
    completionStatus: string
    isNewStatus: string
    userId?: string
    userCompletedChallengesIds?: string[]
  }
  body: {
    userCompletedChallengesIds?: string[]
  }
}

export class FetchAllChallengesController implements Controller<Schema> {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async handle(http: Http<Schema>) {
    const {
      page,
      itemsPerPage,
      categoriesIds,
      difficulty,
      upvotesCountOrder,
      downvoteCountOrder,
      completionCountOrder,
      postingOrder,
      userId,
      title,
      completionStatus,
      isNewStatus,
    } = http.getQueryParams()
    const { userCompletedChallengesIds = [] } = await http.getBody()
    const accountId = await http.getAccountId()
    const useCase = new ListChallengesUseCase(this.challengesRepository)
    const response = await useCase.execute({
      accountId,
      page,
      itemsPerPage,
      categoriesIds,
      difficulty,
      upvotesCountOrder,
      postingOrder,
      userId,
      userCompletedChallengesIds,
      title,
      completionStatus,
      isNewStatus,
      shouldIncludePrivateChallenges: true,
      shouldIncludeStarChallenges: false,
      shouldIncludeOnlyAuthorChallenges: false,
      completionCountOrder,
      downvoteCountOrder,
    })
    return http.sendPagination(response)
  }
}
