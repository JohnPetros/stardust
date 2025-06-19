import type { CommentsRepository } from '@stardust/core/forum/interfaces'
import { ListSolutionCommentsUseCase } from '@stardust/core/forum/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    solutionId: string
  }
  queryParams: {
    sorter: string
    order: string
    page: number
    itemsPerPage: number
  }
}

export class FetchSolutionCommentsListController implements Controller<Schema> {
  constructor(private readonly repository: CommentsRepository) {}

  async handle(http: Http<Schema>) {
    const { solutionId } = http.getRouteParams()
    const { sorter, order, page, itemsPerPage } = http.getQueryParams()
    const useCase = new ListSolutionCommentsUseCase(this.repository)
    const response = await useCase.execute({
      solutionId,
      sorter,
      order,
      page,
      itemsPerPage,
    })
    return http.sendPagination(response)
  }
}
