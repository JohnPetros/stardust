import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { ListUserFeedbackReportsUseCase } from '@stardust/core/reporting/use-cases'

type Schema = {
  queryParams: {
    status?: 'open' | 'closed'
    page?: number
    itemsPerPage?: number
  }
}

export class ListUserFeedbackReportsController implements Controller<Schema> {
  constructor(private readonly useCase: ListUserFeedbackReportsUseCase) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { status, page, itemsPerPage } = http.getQueryParams()
    const response = await this.useCase.execute({
      authorId: await http.getAccountId(),
      status,
      page,
      itemsPerPage,
    })

    return http.send(response)
  }
}
