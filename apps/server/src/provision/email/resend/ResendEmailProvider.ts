import type { EmailProvider } from '@stardust/core/notification/interfaces'
import type { SendFeedbackReportReplyEmailRequest } from '@stardust/core/reporting/types'
import type { RestClient } from '@stardust/core/global/interfaces'

import { ENV } from '@/constants'
import { AppError } from '@stardust/core/global/errors'

export class ResendEmailProvider implements EmailProvider {
  constructor(private readonly restClient: RestClient) {}

  async sendFeedbackReportReplyEmail(
    request: SendFeedbackReportReplyEmailRequest,
  ): Promise<void> {
    if (!ENV.resendApiKey || !ENV.resendFromEmail) {
      throw new AppError('Resend email provider is not configured')
    }

    this.restClient.setBaseUrl('https://api.resend.com')
    this.restClient.setHeader('Authorization', `Bearer ${ENV.resendApiKey}`)
    this.restClient.setHeader('Idempotency-Key', request.idempotencyKey.value)

    const response = await this.restClient.post('/emails', {
      from: ENV.resendFromEmail,
      to: [request.recipientEmail.value],
      subject: request.subject.value,
      html: request.html,
      text: request.text,
    })

    if (response.isFailure)
      throw new AppError(
        `Resend request failed with status ${response.statusCode}: ${response.errorMessage}`,
      )
  }
}
