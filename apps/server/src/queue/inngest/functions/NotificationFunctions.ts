import { PlanetCompletedEvent, SpaceCompletedEvent } from '@stardust/core/space/events'
import { FeedbackReportSentEvent } from '@stardust/core/reporting/events'
import { ChallengePostedEvent } from '@stardust/core/challenging/events'

import { ENV } from '@/constants'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import {
  SendFeedbackNotificationJob,
  SendPlanetCompletedNotificationJob,
  SendSpaceCompletedNotificationJob,
  SendChallengePostedNotificationJob,
} from '@/queue/jobs/notification'
import { DiscordNotificationService } from '@/rest/services'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'

export class NotificationFunctions extends InngestFunctions {
  private createCreateUserFunction() {
    return this.inngest.createFunction(
      {
        id: SendPlanetCompletedNotificationJob.KEY,
        onFailure: (context) =>
          this.handleFailure(context, SendPlanetCompletedNotificationJob.name),
      },
      { event: PlanetCompletedEvent._NAME },
      async (context) => {
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const service = new DiscordNotificationService(restClient)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new SendPlanetCompletedNotificationJob(service)
        return await job.handle(amqp)
      },
    )
  }

  private createSendSpaceCompletedNotificationFunction() {
    return this.inngest.createFunction(
      {
        id: SendSpaceCompletedNotificationJob.KEY,
        onFailure: (context) =>
          this.handleFailure(context, SendSpaceCompletedNotificationJob.name),
      },
      { event: SpaceCompletedEvent._NAME },
      async (context) => {
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const service = new DiscordNotificationService(restClient)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new SendSpaceCompletedNotificationJob(service)
        return await job.handle(amqp)
      },
    )
  }

  private createSendFeedbackNotificationFunction() {
    return this.inngest.createFunction(
      {
        id: SendFeedbackNotificationJob.KEY,
        onFailure: (context) =>
          this.handleFailure(context, SendFeedbackNotificationJob.name),
      },
      { event: FeedbackReportSentEvent._NAME },
      async (context) => {
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const service = new DiscordNotificationService(restClient)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new SendFeedbackNotificationJob(service)
        return await job.handle(amqp)
      },
    )
  }

  private createSendChallengePostedNotificationFunction() {
    return this.inngest.createFunction(
      {
        id: SendChallengePostedNotificationJob.KEY,
        onFailure: (context) =>
          this.handleFailure(context, SendChallengePostedNotificationJob.name),
      },
      { event: ChallengePostedEvent._NAME },
      async (context) => {
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const service = new DiscordNotificationService(restClient)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new SendChallengePostedNotificationJob(service)
        return await job.handle(amqp)
      },
    )
  }

  getFunctions() {
    return [
      this.createCreateUserFunction(),
      this.createSendSpaceCompletedNotificationFunction(),
      this.createSendFeedbackNotificationFunction(),
      this.createSendChallengePostedNotificationFunction(),
    ]
  }
}
