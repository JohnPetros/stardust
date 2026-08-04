import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { CreateFeedbackAttachmentUploadUrlUseCase } from '@stardust/core/reporting/use-cases'
import { Integer, Text } from '@stardust/core/global/structures'
import { ENV } from '@/constants'

export class CreateFeedbackAttachmentUploadUrlController implements Controller {
  constructor(private readonly useCase: CreateFeedbackAttachmentUploadUrlUseCase) {}

  async handle(http: Http): Promise<RestResponse> {
    const { feedbackReportId, messageId } = http.getRouteParams() as {
      feedbackReportId: string
      messageId: string
    }

    const body = (await http.getBody()) as {
      fileName: string
      mimeType: string
      size: number
    }

    const accountId = await http.getAccountId()
    const response = await this.useCase.execute({
      feedbackReportId,
      messageId,
      actor: {
        accountId,
        role: ENV.godAccountIds.includes(accountId) ? 'admin' : 'user',
      },
      fileName: Text.create(body.fileName),
      mimeType: Text.create(body.mimeType),
      size: Integer.create(body.size),
    })

    return http.statusCreated().send(response)
  }
}
