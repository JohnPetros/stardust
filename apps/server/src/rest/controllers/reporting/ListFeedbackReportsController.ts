import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { ListFeedbackReportsUseCase } from '@stardust/core/reporting/use-cases'

type Schema = {
  queryParams: {
    page?: number
    itemsPerPage?: number
    search?: string
    status?: 'open' | 'closed'
    authorName?: string
    intent?: 'bug' | 'idea' | 'other'
    createdAtStartDate?: string
    createdAtEndDate?: string
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
      search,
      status,
      authorName,
      intent,
      createdAtStartDate,
      createdAtEndDate,
      startDate,
      endDate,
    } = http.getQueryParams()

    const response = await this.useCase.execute({
      page,
      itemsPerPage,
      search: search ?? authorName,
      intent,
      status,
      sentAtStartDate: createdAtStartDate ?? startDate,
      sentAtEndDate: createdAtEndDate ?? endDate,
    })

    return http.send(response)
  }
}
