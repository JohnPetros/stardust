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
      throw new AppError('O provider de e-mail Resend não está configurado')
    }

    this.restClient.setBaseUrl('https://api.resend.com')
    this.restClient.setHeader('Authorization', `Bearer ${ENV.resendApiKey}`)
    this.restClient.setHeader('Idempotency-Key', request.idempotencyKey.value)

    const response = await this.restClient.post('/emails', {
      from: ENV.resendFromEmail,
      to: [request.recipientEmail.value],
      subject: request.subject.value,
      html: request.html.value,
      text: request.text.value,
    })

    if (response.isFailure)
      throw new AppError(
        `A requisição ao Resend falhou com status ${response.statusCode}`,
      )
  }
}
