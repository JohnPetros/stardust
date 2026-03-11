import type { RestResponse } from '@stardust/core/global/responses'
import type { EventPayload } from '@stardust/core/global/types'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import type { UserCreatedEvent } from '@stardust/core/profile/events'

import type { InngestAmqp } from '@/queue/inngest/InngestAmqp'

type Payload = EventPayload<typeof UserCreatedEvent>

export class SendUserCreatedNotificationJob {
  static readonly KEY = 'notification/send.user.created.notification.job'
  static readonly SERVICE_NAME = 'Notification Service'

  constructor(private readonly service: NotificationService) {}

  async handle(amqp: InngestAmqp<Payload>) {
    const payload = amqp.getPayload()

    const response = await amqp.run<RestResponse>(
      async () => await this.service.sendUserCreatedNotification(payload),
      SendUserCreatedNotificationJob.SERVICE_NAME,
    )

    if (response.isFailure) response.throwError()
  }
}
