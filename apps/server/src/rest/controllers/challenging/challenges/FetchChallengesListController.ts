import { ListChallengesUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'

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
    shouldIncludeOnlyAuthorChallenges: boolean
    shouldIncludePrivateChallenges: boolean
    userId?: string
    userCompletedChallengesIds?: string[]
  }
  body: {
    userCompletedChallengesIds?: string[]
  }
}

export class FetchChallengesListController implements Controller<Schema> {
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
      shouldIncludeOnlyAuthorChallenges,
      shouldIncludePrivateChallenges,
    } = http.getQueryParams()
    const { userCompletedChallengesIds = [] } = await http.getBody()
    const account = await http.getAccount()
    const useCase = new ListChallengesUseCase(this.challengesRepository)
    const response = await useCase.execute({
      accountId: account ? String(account.id) : undefined,
      page,
      itemsPerPage,
      categoriesIds,
      difficulty,
      upvotesCountOrder,
      downvoteCountOrder,
      completionCountOrder,
      postingOrder,
      userId,
      userCompletedChallengesIds,
      title,
      completionStatus,
      shouldIncludeOnlyAuthorChallenges,
      shouldIncludePrivateChallenges,
      shouldIncludeStarChallenges: false,
    })
    return http.sendPagination(response)
  }
}
