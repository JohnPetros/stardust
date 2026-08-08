import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { GetUserFeedbackReportUseCase } from '@stardust/core/reporting/use-cases'

export class GetUserFeedbackReportController implements Controller {
  constructor(private readonly useCase: GetUserFeedbackReportUseCase) {}

  async handle(http: Http): Promise<RestResponse> {
    const { feedbackReportId } = http.getRouteParams() as { feedbackReportId: string }
    const response = await this.useCase.execute({
      feedbackReportId,
      authorId: await http.getAccountId(),
    })

    return http.send(response)
  }
}
