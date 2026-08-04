import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { SendFeedbackMessageUseCase } from '@stardust/core/reporting/use-cases'
import { ENV } from '@/constants'

export class SendFeedbackMessageController implements Controller {
  constructor(private readonly useCase: SendFeedbackMessageUseCase) {}

  async handle(http: Http): Promise<RestResponse> {
    const { feedbackReportId } = http.getRouteParams() as { feedbackReportId: string }

    const body = (await http.getBody()) as {
      messageId: string
      content: string
      attachments: any[]
      targetStatus?: string
    }

    const accountId = await http.getAccountId()
    const response = await this.useCase.execute({
      feedbackReportId,
      actor: {
        accountId,
        role: ENV.godAccountIds.includes(accountId) ? 'admin' : 'user',
      },
      messageId: body.messageId,
      content: body.content,
      attachments: body.attachments ?? [],
      targetStatus: body.targetStatus,
    })

    return http.send(
      {
        report: response.report.dto,
        message: response.message.dto,
        isDuplicate: response.isDuplicate.isTrue,
      },
      response.isDuplicate.isTrue ? 200 : 201,
    )
  }
}
