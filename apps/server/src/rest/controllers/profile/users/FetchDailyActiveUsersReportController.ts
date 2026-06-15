import type { AnalyticsReportingProvider } from '@stardust/core/analytics/interfaces'
import { GetDailyActiveUsersReportUseCase } from '@stardust/core/profile/use-cases'
import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

type Schema = {
  queryParams: {
    days: number
  }
}

export class FetchDailyActiveUsersReportController implements Controller<Schema> {
  constructor(private readonly analyticsReportingProvider: AnalyticsReportingProvider) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { days } = http.getQueryParams()
    const useCase = new GetDailyActiveUsersReportUseCase(this.analyticsReportingProvider)
    const response = await useCase.execute({ days })
    return http.send(response)
  }
}
