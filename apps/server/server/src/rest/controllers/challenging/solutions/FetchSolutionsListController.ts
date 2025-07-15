import { ListSolutionsUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { SolutionsRepository } from '@stardust/core/challenging/interfaces'

type Schema = {
  queryParams: {
    page: number
    itemsPerPage: number
    title: string
    sorter: string
    challengeId?: string
    userId?: string
  }
}

export class FetchSolutionsListController implements Controller<Schema> {
  constructor(private readonly solutionsRepository: SolutionsRepository) {}

  async handle(http: Http<Schema>) {
    const { page, itemsPerPage, sorter, userId, title } = http.getQueryParams()
    const useCase = new ListSolutionsUseCase(this.solutionsRepository)
    const response = await useCase.execute({
      page,
      itemsPerPage,
      title,
      sorter,
      userId,
    })
    return http.sendPagination(response)
  }
}
