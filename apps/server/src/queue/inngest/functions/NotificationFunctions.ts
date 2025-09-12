import { PlanetCompletedEvent, SpaceCompletedEvent } from '@stardust/core/space/events'

import { ENV } from '@/constants'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import {
  SendPlanetCompletedNotificationJob,
  SendSpaceCompletedNotificationJob,
} from '@/queue/jobs/notification'
import { DiscordNotificationService } from '@/rest/services'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'

export class NotificationFunctions extends InngestFunctions {
  private createCreateUserFunction() {
    return this.inngest.createFunction(
      { id: SendPlanetCompletedNotificationJob.KEY },
      { event: PlanetCompletedEvent._NAME },
      async (context) => {
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const repository = new DiscordNotificationService(restClient)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new SendPlanetCompletedNotificationJob(repository)
        return await job.handle(amqp)
      },
    )
  }

  private createSendSpaceCompletedNotificationFunction() {
    return this.inngest.createFunction(
      { id: SendSpaceCompletedNotificationJob.KEY },
      { event: SpaceCompletedEvent._NAME },
      async (context) => {
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const repository = new DiscordNotificationService(restClient)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new SendSpaceCompletedNotificationJob(repository)
        return await job.handle(amqp)
      },
    )
  }

  getFunctions() {
    return [
      this.createCreateUserFunction(),
      this.createSendSpaceCompletedNotificationFunction(),
    ]
  }
}
