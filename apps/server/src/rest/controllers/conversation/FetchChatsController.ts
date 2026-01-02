import type { ChatsRepository } from '@stardust/core/conversation/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { ListChatsUseCase } from '@stardust/core/conversation/use-cases'

type Schema = {
  queryParams: {
    search: string
    page: number
    itemsPerPage: number
  }
}

export class FetchChatsController implements Controller<Schema> {
  constructor(private readonly repository: ChatsRepository) {}

  async handle(http: Http<Schema>) {
    const accountId = await http.getAccountId()
    const { search, page, itemsPerPage } = http.getQueryParams()
    const useCase = new ListChatsUseCase(this.repository)
    const response = await useCase.execute({
      userId: accountId,
      search,
      page,
      itemsPerPage,
    })
    return http.statusOk().sendPagination(response)
  }
}
