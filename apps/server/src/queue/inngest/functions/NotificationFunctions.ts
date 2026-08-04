import { PlanetCompletedEvent, SpaceCompletedEvent } from '@stardust/core/space/events'
import { FeedbackReportSentEvent } from '@stardust/core/reporting/events'
import { ChallengePostedEvent } from '@stardust/core/challenging/events'
import { UserCreatedEvent } from '@stardust/core/profile/events'
import type { EventPayload } from '@stardust/core/global/types'

import { ENV } from '@/constants'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import {
  SendFeedbackNotificationJob,
  SendFeedbackReplyDiscordJob,
  SendPlanetCompletedNotificationJob,
  SendSpaceCompletedNotificationJob,
  SendChallengePostedNotificationJob,
  SendUserCreatedNotificationJob,
} from '@/queue/jobs/notification'
import { DiscordNotificationService } from '@/rest/services'
import { ResendEmailProvider } from '@/provision/email/resend'
import {
  SendFeedbackReportReplyEmailJob,
  type FeedbackReplyEmailEventPayload,
} from '@/queue/jobs/notification'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'
import { eventType } from './InngestFunctions'
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

const feedbackReplyEmailSchema = z.object({
  recipientEmail: emailSchema,
  subject: stringSchema.optional(),
  preview: stringSchema,
  reply: stringSchema,
  conversationUrl: stringSchema,
  isClosed: z.boolean().optional(),
  idempotencyKey: stringSchema,
})

const feedbackReplyDiscordSchema = z.object({
  reportId: idSchema,
  messageId: idSchema,
  userName: stringSchema.optional(),
  preview: stringSchema.optional(),
  hasAttachments: z.boolean().optional(),
  conversationUrl: stringSchema.optional(),
})

export class NotificationFunctions extends InngestFunctions {
  private createCreateUserFunction() {
    return this.createFunction(
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
    return this.createFunction(
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
    return this.createFunction(
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
    return this.createFunction(
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
    return this.createFunction(
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

  private createSendFeedbackReplyEmailFunction() {
    return this.createFunction(
      {
        id: SendFeedbackReportReplyEmailJob.KEY,
        onFailure: this.handleJobFailure(SendFeedbackReportReplyEmailJob.name),
        triggers: {
          event: eventType('feedback.message.created', {
            schema: feedbackReplyEmailSchema,
          }),
        },
      },
      async (context) => {
        const amqp = new InngestAmqp<FeedbackReplyEmailEventPayload>(context)
        const job = new SendFeedbackReportReplyEmailJob(
          new ResendEmailProvider(new AxiosRestClient()),
        )
        return await job.handle(amqp)
      },
    )
  }

  private createSendFeedbackReplyDiscordFunction() {
    return this.createFunction(
      {
        id: SendFeedbackReplyDiscordJob.KEY,
        onFailure: this.handleJobFailure(SendFeedbackReplyDiscordJob.name),
        triggers: {
          event: eventType('feedback.user.message.created', {
            schema: feedbackReplyDiscordSchema,
          }),
        },
      },
      async (context) => {
        const job = new SendFeedbackReplyDiscordJob(
          new DiscordNotificationService(new AxiosRestClient(ENV.discordWebhookUrl)),
        )
        return await job.handle(new InngestAmqp(context))
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
      this.createSendFeedbackReplyEmailFunction(),
      this.createSendFeedbackReplyDiscordFunction(),
    ]
  }
}
