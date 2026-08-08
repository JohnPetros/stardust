import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { CreateFeedbackReportAttachmentUploadUrlUseCase } from '@stardust/core/reporting/use-cases'
import { Integer, Text } from '@stardust/core/global/structures'

export class CreateFeedbackReportAttachmentUploadUrlController implements Controller {
  constructor(private readonly useCase: CreateFeedbackReportAttachmentUploadUrlUseCase) {}

  async handle(http: Http): Promise<RestResponse> {
    const body = (await http.getBody()) as {
      fileName: string
      mimeType: string
      size: number
    }

    const response = await this.useCase.execute({
      actorId: await http.getAccountId(),
      fileName: Text.create(body.fileName),
      mimeType: Text.create(body.mimeType),
      size: Integer.create(body.size),
    })

    return http.statusCreated().send(response)
  }
}
