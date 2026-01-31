import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { ListFeedbackReportsUseCase } from '@stardust/core/reporting/use-cases'

type Schema = {
  queryParams: {
    page?: number
    itemsPerPage?: number
    authorName?: string
    intent?: 'bug' | 'idea' | 'other'
    startDate?: string
    endDate?: string
  }
}

export class ListFeedbackReportsController implements Controller<Schema> {
  constructor(private readonly useCase: ListFeedbackReportsUseCase) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const {
      page = 1,
      itemsPerPage = 10,
      authorName,
      intent,
      startDate,
      endDate,
    } = http.getQueryParams()

    const response = await this.useCase.execute({
      page,
      itemsPerPage,
      authorName,
      intent,
      sentAtStartDate: startDate,
      sentAtEndDate: endDate,
    })

    return http.sendPagination(response)
  }
}
