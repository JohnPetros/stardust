import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import { RestResponse as RestResponseClass } from '@stardust/core/global/responses'

export type FeedbackReplyDiscordEventPayload = {
  reportId: string
  messageId: string
  userName?: string
  preview?: string
  hasAttachments?: boolean
  conversationUrl?: string
}

export class SendFeedbackReplyDiscordJob
  implements Job<FeedbackReplyDiscordEventPayload>
{
  static readonly KEY = 'reporting/send.feedback.reply.discord.job'

  constructor(private readonly service: NotificationService) {}

  async handle(amqp: Amqp<FeedbackReplyDiscordEventPayload>): Promise<void> {
    const payload = amqp.getPayload()
    const response = await amqp.run<RestResponse>(
      async () =>
        this.service.sendFeedbackReplyNotification
          ? this.service.sendFeedbackReplyNotification(payload)
          : new RestResponseClass(),
      SendFeedbackReplyDiscordJob.name,
    )
    if (response.isFailure) response.throwError()
  }
}
