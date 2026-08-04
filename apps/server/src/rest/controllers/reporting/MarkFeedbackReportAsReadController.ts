import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { MarkFeedbackReportAsReadUseCase } from '@stardust/core/reporting/use-cases'

export class MarkFeedbackReportAsReadController implements Controller {
  constructor(private readonly useCase: MarkFeedbackReportAsReadUseCase) {}

  async handle(http: Http): Promise<RestResponse> {
    const { feedbackReportId } = http.getRouteParams() as { feedbackReportId: string }

    const { lastSeenUserMessageId } = (await http.getBody()) as {
      lastSeenUserMessageId: string
    }

    await this.useCase.execute({ feedbackReportId, lastSeenUserMessageId })

    return http.statusNoContent().send()
  }
}
