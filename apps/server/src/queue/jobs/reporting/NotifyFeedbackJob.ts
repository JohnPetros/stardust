import type { InngestAmqp } from '@/queue/inngest/InngestAmqp'
import type { RestResponse } from '@stardust/core/global/responses'
import type { EventPayload } from '@stardust/core/global/types'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import type { FeedbackReportSentEvent } from '@stardust/core/reporting/events'

type Payload = EventPayload<typeof FeedbackReportSentEvent>

export class NotifyFeedbackJob {
  static readonly KEY = 'reporting/notify.feedback.job'
  static readonly SERVICE_NAME = 'Discord Notification Service'

  constructor(private readonly service: NotificationService) {}

  async handle(amqp: InngestAmqp<Payload>) {
    const {
      feedbackReportId,
      feedbackReportContent,
      feedbackReportIntent,
      feedbackReportSentAt,
      author,
    } = amqp.getPayload()

    const response = await amqp.run<RestResponse>(
      async () =>
        await this.service.sendFeedbackReportNotification({
          feedbackReportId,
          feedbackReportContent,
          feedbackReportIntent,
          feedbackReportSentAt,
          author,
        }),
      NotifyFeedbackJob.SERVICE_NAME,
    )

    if (response.isFailure) response.throwError()
  }
}
