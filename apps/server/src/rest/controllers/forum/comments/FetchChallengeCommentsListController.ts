import type { CommentsRepository } from '@stardust/core/forum/interfaces'
import { ListChallengeCommentsUseCase } from '@stardust/core/forum/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    challengeId: string
  }
  queryParams: {
    sorter: string
    order: string
    page: number
    itemsPerPage: number
  }
}

export class FetchChallengeCommentsListController implements Controller<Schema> {
  constructor(private readonly repository: CommentsRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    const { sorter, order, page, itemsPerPage } = http.getQueryParams()
    const useCase = new ListChallengeCommentsUseCase(this.repository)
    const response = await useCase.execute({
      challengeId,
      sorter,
      order,
      page,
      itemsPerPage,
    })
    return http.sendPagination(response)
  }
}
