import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { ChangeFeedbackReportStatusUseCase } from '@stardust/core/reporting/use-cases'

export class ChangeFeedbackReportStatusController implements Controller {
  constructor(private readonly useCase: ChangeFeedbackReportStatusUseCase) {}

  async handle(http: Http): Promise<RestResponse> {
    const { feedbackReportId } = http.getRouteParams() as { feedbackReportId: string }

    const body = (await http.getBody()) as { status: string; expectedStatus: string }

    const response = await this.useCase.execute({
      feedbackReportId,
      status: body.status,
      expectedStatus: body.expectedStatus,
    })

    return http.send(response)
  }
}
