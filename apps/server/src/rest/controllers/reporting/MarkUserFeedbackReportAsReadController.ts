import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { MarkFeedbackReportAsReadUseCase } from '@stardust/core/reporting/use-cases'

export class MarkUserFeedbackReportAsReadController implements Controller {
  constructor(private readonly useCase: MarkFeedbackReportAsReadUseCase) {}

  async handle(http: Http): Promise<RestResponse> {
    const { feedbackReportId } = http.getRouteParams() as { feedbackReportId: string }
    const { lastSeenMessageId } = (await http.getBody()) as {
      lastSeenMessageId: string
    }

    await this.useCase.execute({
      feedbackReportId,
      actor: {
        accountId: await http.getAccountId(),
        role: 'user',
      },
      lastSeenMessageId,
    })

    return http.statusNoContent().send()
  }
}
