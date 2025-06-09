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
    postingOrder: string
    completionStatus: string
    userId?: string
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
      postingOrder,
      userId,
      userCompletedChallengesIds = [],
      title,
      completionStatus,
    } = http.getQueryParams()
    const useCase = new ListChallengesUseCase(this.challengesRepository)
    const response = await useCase.execute({
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
    })
    console.log(categoriesIds)
    return http.sendPagination(response)
  }
}
