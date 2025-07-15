import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { SnippetsRepository } from '@stardust/core/playground/interfaces'
import { ListSnippetsUseCase } from '@stardust/core/playground/use-cases'

type Schema = {
  queryParams: {
    page: number
    itemsPerPage: number
  }
}

export class FetchSnippetsListController implements Controller<Schema> {
  constructor(private readonly repository: SnippetsRepository) {}

  async handle(http: Http<Schema>) {
    const { page, itemsPerPage } = http.getQueryParams()
    const accountId = await http.getAccountId()
    const useCase = new ListSnippetsUseCase(this.repository)
    const response = await useCase.execute({
      page,
      itemsPerPage,
      authorId: accountId,
    })
    return http.statusOk().sendPagination(response)
  }
}
