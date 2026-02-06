import type { RestResponse } from '@stardust/core/global/responses'
import type { EventPayload } from '@stardust/core/global/types'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import type { ChallengePostedEvent } from '@stardust/core/challenging/events'

import type { InngestAmqp } from '@/queue/inngest/InngestAmqp'

type Payload = EventPayload<typeof ChallengePostedEvent>

export class SendChallengePostedNotificationJob {
  static readonly KEY = 'notification/send.challenge.posted.job'
  static readonly SERVICE_NAME = 'Notification Service'

  constructor(private readonly service: NotificationService) {}

  async handle(amqp: InngestAmqp<Payload>) {
    const { challengeSlug, challengeTitle, challengeAuthor } = amqp.getPayload()

    const response = await amqp.run<RestResponse>(
      async () =>
        await this.service.sendChallengePostedNotification({
          challengeSlug,
          challengeTitle,
          challengeAuthor,
        }),
      SendChallengePostedNotificationJob.SERVICE_NAME,
    )

    if (response.isFailure) response.throwError()
  }
}
