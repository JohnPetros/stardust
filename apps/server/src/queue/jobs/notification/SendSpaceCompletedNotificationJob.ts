import type { InngestAmqp } from '@/queue/inngest/InngestAmqp'
import type { RestResponse } from '@stardust/core/global/responses'
import type { EventPayload } from '@stardust/core/global/types'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import type { SpaceCompletedEvent } from '@stardust/core/space/events'

import { SendPlanetCompletedNotificationJob } from './SendPlanetCompletedNotificationJob'

type Payload = EventPayload<typeof SpaceCompletedEvent>

export class SendSpaceCompletedNotificationJob {
  static readonly KEY = 'notification/send.space.completed.notification.job'
  static readonly SERVICE_NAME = 'Notification Service'

  constructor(private readonly service: NotificationService) {}

  async handle(amqp: InngestAmqp<Payload>) {
    const { userSlug, userName } = amqp.getPayload()

    const response = await amqp.run<RestResponse>(
      async () => await this.service.sendSpaceCompletedNotification(userSlug, userName),
      SendPlanetCompletedNotificationJob.SERVICE_NAME,
    )

    if (response.isFailure) response.throwError()
  }
}
