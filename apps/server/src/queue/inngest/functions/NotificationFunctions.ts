import { PlanetCompletedEvent, SpaceCompletedEvent } from '@stardust/core/space/events'
import { FeedbackReportSentEvent } from '@stardust/core/reporting/events'
import { ChallengePostedEvent } from '@stardust/core/challenging/events'
import { UserCreatedEvent } from '@stardust/core/profile/events'
import type { EventPayload } from '@stardust/core/global/types'

import { ENV } from '@/constants'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import {
  SendFeedbackNotificationJob,
  SendPlanetCompletedNotificationJob,
  SendSpaceCompletedNotificationJob,
  SendChallengePostedNotificationJob,
  SendUserCreatedNotificationJob,
} from '@/queue/jobs/notification'
import { DiscordNotificationService } from '@/rest/services'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'
import { eventType } from 'inngest'
import z from 'zod'
import {
  emailSchema,
  idSchema,
  nameSchema,
  stringSchema,
  authorAggregateSchema,
} from '@stardust/validation/global/schemas'

type PlanetCompletedPayload = EventPayload<typeof PlanetCompletedEvent>
type SpaceCompletedPayload = EventPayload<typeof SpaceCompletedEvent>
type FeedbackReportSentPayload = EventPayload<typeof FeedbackReportSentEvent>
type ChallengePostedPayload = EventPayload<typeof ChallengePostedEvent>
type UserCreatedPayload = EventPayload<typeof UserCreatedEvent>

export class NotificationFunctions extends InngestFunctions {
  private createCreateUserFunction() {
    return this.inngest.createFunction(
      {
        id: SendPlanetCompletedNotificationJob.KEY,
        onFailure: (context) =>
          this.handleFailure(context, SendPlanetCompletedNotificationJob.name),
        triggers: {
          event: eventType(PlanetCompletedEvent._NAME, {
            schema: z.object({
              userSlug: stringSchema,
              userName: nameSchema,
              planetName: nameSchema,
            }),
          }),
        },
      },
      async (context) => {
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const service = new DiscordNotificationService(restClient)
        const amqp = new InngestAmqp<PlanetCompletedPayload>(context)
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
        triggers: {
          event: eventType(SpaceCompletedEvent._NAME, {
            schema: z.object({
              userSlug: stringSchema,
              userName: nameSchema,
            }),
          }),
        },
      },
      async (context) => {
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const service = new DiscordNotificationService(restClient)
        const amqp = new InngestAmqp<SpaceCompletedPayload>(context)
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
        triggers: {
          event: eventType(FeedbackReportSentEvent._NAME, {
            schema: z.object({
              feedbackReportId: idSchema,
              feedbackReportContent: stringSchema,
              feedbackReportIntent: stringSchema,
              feedbackReportSentAt: stringSchema,
              author: authorAggregateSchema,
            }),
          }),
        },
      },
      async (context) => {
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const service = new DiscordNotificationService(restClient)
        const amqp = new InngestAmqp<FeedbackReportSentPayload>(context)
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
        triggers: {
          event: eventType(ChallengePostedEvent._NAME, {
            schema: z.object({
              challengeSlug: stringSchema,
              challengeTitle: stringSchema,
              challengeAuthor: z.object({
                id: idSchema,
                entity: z
                  .object({
                    name: nameSchema,
                    slug: stringSchema,
                    avatar: z.object({
                      name: nameSchema,
                      image: stringSchema,
                    }),
                  })
                  .optional()
                  .nullable(),
              }),
            }),
          }),
        },
      },
      async (context) => {
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const service = new DiscordNotificationService(restClient)
        const amqp = new InngestAmqp<ChallengePostedPayload>(context)
        const job = new SendChallengePostedNotificationJob(service)
        return await job.handle(amqp)
      },
    )
  }

  private createSendUserCreatedNotificationFunction() {
    return this.inngest.createFunction(
      {
        id: SendUserCreatedNotificationJob.KEY,
        onFailure: (context) =>
          this.handleFailure(context, SendUserCreatedNotificationJob.name),
        triggers: {
          event: eventType(UserCreatedEvent._NAME, {
            schema: z.object({
              userId: idSchema,
              userName: nameSchema,
              userEmail: emailSchema,
              userSlug: stringSchema,
            }),
          }),
        },
      },
      async (context) => {
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const service = new DiscordNotificationService(restClient)
        const amqp = new InngestAmqp<UserCreatedPayload>(context)
        const job = new SendUserCreatedNotificationJob(service)
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
      this.createSendUserCreatedNotificationFunction(),
    ]
  }
}
