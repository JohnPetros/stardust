import type { RestResponse } from '@stardust/core/global/responses'
import type { EventPayload } from '@stardust/core/global/types'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import type { FeedbackReportSentEvent } from '@stardust/core/reporting/events'

import type { InngestAmqp } from '@/queue/inngest/InngestAmqp'
import { ENV } from '@/constants'

type Payload = EventPayload<typeof FeedbackReportSentEvent>

export class SendFeedbackNotificationJob {
  static readonly KEY = 'notification/send.feedback.job'
  static readonly SERVICE_NAME = 'Notification Service'

  constructor(private readonly service: NotificationService) {}

  async handle(amqp: InngestAmqp<Payload>) {
    const {
      feedbackReportId,
      feedbackReportContent,
      feedbackReportIntent,
      feedbackReportSentAt,
      author,
    } = amqp.getPayload()

    if (ENV.mode === 'development') return

    const response = await amqp.run<RestResponse>(
      async () =>
        await this.service.sendFeedbackReportNotification({
          feedbackReportId,
          feedbackReportContent,
          feedbackReportIntent,
          feedbackReportSentAt,
          author,
        }),
      SendFeedbackNotificationJob.SERVICE_NAME,
    )

    if (response.isFailure) response.throwError()
  }
}
