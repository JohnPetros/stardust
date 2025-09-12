import type { InngestAmqp } from '@/queue/inngest/InngestAmqp'
import type { RestResponse } from '@stardust/core/global/responses'
import type { EventPayload } from '@stardust/core/global/types'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import type { PlanetCompletedEvent } from '@stardust/core/space/events'

type Payload = EventPayload<typeof PlanetCompletedEvent>

export class SendPlanetCompletedNotificationJob {
  static readonly KEY = 'notification/send.planet.completed.notification.job'
  static readonly SERVICE_NAME = 'Notification Service'

  constructor(private readonly service: NotificationService) {}

  async handle(amqp: InngestAmqp<Payload>) {
    const { userSlug, userName, planetName } = amqp.getPayload()

    const response = await amqp.run<RestResponse>(
      async () =>
        await this.service.sendPlanetCompletedNotification(
          userSlug,
          userName,
          planetName,
        ),
      SendPlanetCompletedNotificationJob.SERVICE_NAME,
    )

    if (response.isFailure) response.throwError()
  }
}
