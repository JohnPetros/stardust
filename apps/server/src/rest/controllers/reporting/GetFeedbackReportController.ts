import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { GetFeedbackReportUseCase } from '@stardust/core/reporting/use-cases'

export class GetFeedbackReportController implements Controller {
  constructor(private readonly useCase: GetFeedbackReportUseCase) {}

  async handle(http: Http): Promise<RestResponse> {
    const { feedbackReportId } = http.getRouteParams() as { feedbackReportId: string }

    const response = await this.useCase.execute({ feedbackReportId })

    return http.send(response)
  }
}
