import { Email, Text } from '@stardust/core/global/structures'
import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { EmailProvider } from '@stardust/core/notification/interfaces'
import {
  feedbackReportReplyText,
  renderFeedbackReportReplyEmail,
  type FeedbackReportReplyTemplateProps,
} from '@stardust/email/templates'

export type FeedbackReplyEmailEventPayload = FeedbackReportReplyTemplateProps & {
  recipientEmail: string
  subject?: string
  idempotencyKey: string
}

export class SendFeedbackReportReplyEmailJob
  implements Job<FeedbackReplyEmailEventPayload>
{
  static readonly KEY = 'notification/send.feedback.report.reply.email.job'

  constructor(private readonly provider: EmailProvider) {}

  async handle(amqp: Amqp<FeedbackReplyEmailEventPayload>): Promise<void> {
    const payload = amqp.getPayload()
    const templateProps: FeedbackReportReplyTemplateProps = {
      preview: payload.preview,
      reply: payload.reply,
      conversationUrl: payload.conversationUrl,
      isClosed: payload.isClosed,
    }
    const html = await renderFeedbackReportReplyEmail(templateProps)
    await amqp.run(
      async () =>
        this.provider.sendFeedbackReportReplyEmail({
          recipientEmail: Email.create(payload.recipientEmail),
          subject: Text.create(payload.subject ?? 'Resposta enviada — StarDust'),
          html: Text.create(html),
          text: Text.create(feedbackReportReplyText(templateProps)),
          idempotencyKey: Text.create(payload.idempotencyKey),
        }),
      SendFeedbackReportReplyEmailJob.name,
    )
  }
}
