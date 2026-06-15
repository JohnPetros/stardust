import z from 'zod'
import { eventType } from 'inngest'

import type { AnalyticsEventDto } from '@stardust/core/analytics/entities/dtos'
import { AccountSignedInEvent, AccountSignedUpEvent } from '@stardust/core/auth/events'
import {
  ChallengeDeletedEvent,
  ChallengePostedEvent,
} from '@stardust/core/challenging/events'
import type { EventPayload } from '@stardust/core/global/types'
import {
  ChallengeCompletedEvent,
  ShopItemPurchasedEvent,
  StarUnlockedEvent,
  UserCreatedEvent,
  UserRewardedEvent,
} from '@stardust/core/profile/events'
import { FeedbackReportSentEvent } from '@stardust/core/reporting/events'
import {
  FirstStarUnlockedEvent,
  PlanetCompletedEvent,
  SpaceCompletedEvent,
} from '@stardust/core/space/events'
import {
  authorAggregateSchema,
  emailSchema,
  idSchema,
  nameSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'
import { feedbackReportIntentSchema } from '@stardust/validation/reporting/schemas'
import { platformSchema } from '@stardust/validation/profile/schemas'

import { PostHogAnalyticsProvider } from '@/provision/analytics'
import { TrackAnalyticsEventJob } from '@/queue/jobs/analytics'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'

type AccountSignedUpPayload = EventPayload<typeof AccountSignedUpEvent>
type AccountSignedInPayload = EventPayload<typeof AccountSignedInEvent>
type UserCreatedPayload = EventPayload<typeof UserCreatedEvent>
type StarUnlockedPayload = EventPayload<typeof StarUnlockedEvent>
type FirstStarUnlockedPayload = EventPayload<typeof FirstStarUnlockedEvent>
type PlanetCompletedPayload = EventPayload<typeof PlanetCompletedEvent>
type SpaceCompletedPayload = EventPayload<typeof SpaceCompletedEvent>
type UserRewardedPayload = EventPayload<typeof UserRewardedEvent>
type ChallengePostedPayload = EventPayload<typeof ChallengePostedEvent>
type ChallengeCompletedPayload = EventPayload<typeof ChallengeCompletedEvent>
type ChallengeDeletedPayload = EventPayload<typeof ChallengeDeletedEvent>
type ShopItemPurchasedPayload = EventPayload<typeof ShopItemPurchasedEvent>
type FeedbackReportSentPayload = EventPayload<typeof FeedbackReportSentEvent>

const weekStatusSchema = z.array(z.enum(['todo', 'undone', 'done'])).length(7)
const shopItemTypeSchema = z.enum(['rocket', 'avatar', 'insignia'])

export class AnalyticsFunctions extends InngestFunctions {
  private toAnalyticsEventDto(
    eventName: string,
    distinctId: string,
    insertId: string,
    properties: Record<string, unknown>,
  ): AnalyticsEventDto {
    return {
      name: eventName,
      distinctId,
      insertId,
      properties,
    }
  }

  private createTrackAccountSignedUpFunction() {
    return this.inngest.createFunction(
      {
        id: `${TrackAnalyticsEventJob.KEY}.account.signed.up`,
        onFailure: (context) => this.handleFailure(context, TrackAnalyticsEventJob.name),
        triggers: {
          event: eventType(AccountSignedUpEvent._NAME, {
            schema: z.object({
              accountId: idSchema,
              accountName: nameSchema,
              accountEmail: emailSchema,
            }),
          }),
        },
      },
      async (context) => {
        const payload = context.event.data as AccountSignedUpPayload
        const amqp = new InngestAmqp<AccountSignedUpPayload>(context)
        const job = new TrackAnalyticsEventJob(
          new PostHogAnalyticsProvider(),
          this.toAnalyticsEventDto(
            AccountSignedUpEvent._NAME,
            payload.accountId,
            context.event.id,
            {
              accountName: payload.accountName,
              accountEmail: payload.accountEmail,
            },
          ),
        )

        return await job.handle(amqp)
      },
    )
  }

  private createTrackAccountSignedInFunction() {
    return this.inngest.createFunction(
      {
        id: `${TrackAnalyticsEventJob.KEY}.account.signed.in`,
        onFailure: (context) => this.handleFailure(context, TrackAnalyticsEventJob.name),
        triggers: {
          event: eventType(AccountSignedInEvent._NAME, {
            schema: z.object({
              accountId: idSchema,
              platform: platformSchema,
            }),
          }),
        },
      },
      async (context) => {
        const payload = context.event.data as AccountSignedInPayload
        const amqp = new InngestAmqp<AccountSignedInPayload>(context)
        const job = new TrackAnalyticsEventJob(
          new PostHogAnalyticsProvider(),
          this.toAnalyticsEventDto(
            'account signed in',
            payload.accountId,
            context.event.id,
            {
              platform: payload.platform,
            },
          ),
        )

        return await job.handle(amqp)
      },
    )
  }

  private createTrackUserCreatedFunction() {
    return this.inngest.createFunction(
      {
        id: `${TrackAnalyticsEventJob.KEY}.user.created`,
        onFailure: (context) => this.handleFailure(context, TrackAnalyticsEventJob.name),
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
        const payload = context.event.data as UserCreatedPayload
        const amqp = new InngestAmqp<UserCreatedPayload>(context)
        const job = new TrackAnalyticsEventJob(
          new PostHogAnalyticsProvider(),
          this.toAnalyticsEventDto('user created', payload.userId, context.event.id, {
            userName: payload.userName,
            userEmail: payload.userEmail,
            userSlug: payload.userSlug,
          }),
        )

        return await job.handle(amqp)
      },
    )
  }

  private createTrackStarUnlockedFunction() {
    return this.inngest.createFunction(
      {
        id: `${TrackAnalyticsEventJob.KEY}.star.unlocked`,
        onFailure: (context) => this.handleFailure(context, TrackAnalyticsEventJob.name),
        triggers: {
          event: eventType(StarUnlockedEvent._NAME, {
            schema: z.object({
              userId: idSchema,
              starId: idSchema,
            }),
          }),
        },
      },
      async (context) => {
        const payload = context.event.data as StarUnlockedPayload
        const amqp = new InngestAmqp<StarUnlockedPayload>(context)
        const job = new TrackAnalyticsEventJob(
          new PostHogAnalyticsProvider(),
          this.toAnalyticsEventDto('star unlocked', payload.userId, context.event.id, {
            starId: payload.starId,
          }),
        )

        return await job.handle(amqp)
      },
    )
  }

  private createTrackFirstStarUnlockedFunction() {
    return this.inngest.createFunction(
      {
        id: `${TrackAnalyticsEventJob.KEY}.first.star.unlocked`,
        onFailure: (context) => this.handleFailure(context, TrackAnalyticsEventJob.name),
        triggers: {
          event: eventType(FirstStarUnlockedEvent._NAME, {
            schema: z.object({
              user: z.object({
                id: idSchema,
                name: nameSchema,
                email: emailSchema,
              }),
              firstUnlockedStarId: idSchema,
            }),
          }),
        },
      },
      async (context) => {
        const payload = context.event.data as FirstStarUnlockedPayload
        const amqp = new InngestAmqp<FirstStarUnlockedPayload>(context)
        const job = new TrackAnalyticsEventJob(
          new PostHogAnalyticsProvider(),
          this.toAnalyticsEventDto(
            'first star unlocked',
            payload.user.id,
            context.event.id,
            {
              firstUnlockedStarId: payload.firstUnlockedStarId,
              userName: payload.user.name,
              userEmail: payload.user.email,
            },
          ),
        )

        return await job.handle(amqp)
      },
    )
  }

  private createTrackPlanetCompletedFunction() {
    return this.inngest.createFunction(
      {
        id: `${TrackAnalyticsEventJob.KEY}.planet.completed`,
        onFailure: (context) => this.handleFailure(context, TrackAnalyticsEventJob.name),
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
        const payload = context.event.data as PlanetCompletedPayload
        const amqp = new InngestAmqp<PlanetCompletedPayload>(context)
        const job = new TrackAnalyticsEventJob(
          new PostHogAnalyticsProvider(),
          this.toAnalyticsEventDto(
            'planet completed',
            payload.userSlug,
            context.event.id,
            {
              userName: payload.userName,
              userSlug: payload.userSlug,
              planetName: payload.planetName,
            },
          ),
        )

        return await job.handle(amqp)
      },
    )
  }

  private createTrackSpaceCompletedFunction() {
    return this.inngest.createFunction(
      {
        id: `${TrackAnalyticsEventJob.KEY}.space.completed`,
        onFailure: (context) => this.handleFailure(context, TrackAnalyticsEventJob.name),
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
        const payload = context.event.data as SpaceCompletedPayload
        const amqp = new InngestAmqp<SpaceCompletedPayload>(context)
        const job = new TrackAnalyticsEventJob(
          new PostHogAnalyticsProvider(),
          this.toAnalyticsEventDto(
            'space completed',
            payload.userSlug,
            context.event.id,
            {
              userName: payload.userName,
              userSlug: payload.userSlug,
            },
          ),
        )

        return await job.handle(amqp)
      },
    )
  }

  private createTrackUserRewardedFunction() {
    return this.inngest.createFunction(
      {
        id: `${TrackAnalyticsEventJob.KEY}.user.rewarded`,
        onFailure: (context) => this.handleFailure(context, TrackAnalyticsEventJob.name),
        triggers: {
          event: eventType(UserRewardedEvent._NAME, {
            schema: z.object({
              userId: idSchema,
              newXp: z.number(),
              newCoins: z.number(),
              newLevel: z.number().nullable(),
              newStreak: z.number().nullable(),
              newWeekStatus: weekStatusSchema.nullable(),
            }),
          }),
        },
      },
      async (context) => {
        const payload = context.event.data as UserRewardedPayload
        const amqp = new InngestAmqp<UserRewardedPayload>(context)
        const job = new TrackAnalyticsEventJob(
          new PostHogAnalyticsProvider(),
          this.toAnalyticsEventDto('user rewarded', payload.userId, context.event.id, {
            newXp: payload.newXp,
            newCoins: payload.newCoins,
            newLevel: payload.newLevel,
            newStreak: payload.newStreak,
            newWeekStatus: payload.newWeekStatus,
          }),
        )

        return await job.handle(amqp)
      },
    )
  }

  private createTrackChallengePostedFunction() {
    return this.inngest.createFunction(
      {
        id: `${TrackAnalyticsEventJob.KEY}.challenge.posted`,
        onFailure: (context) => this.handleFailure(context, TrackAnalyticsEventJob.name),
        triggers: {
          event: eventType(ChallengePostedEvent._NAME, {
            schema: z.object({
              challengeSlug: stringSchema,
              challengeTitle: stringSchema,
              challengeAuthor: authorAggregateSchema,
            }),
          }),
        },
      },
      async (context) => {
        const payload = context.event.data as ChallengePostedPayload
        const amqp = new InngestAmqp<ChallengePostedPayload>(context)
        const job = new TrackAnalyticsEventJob(
          new PostHogAnalyticsProvider(),
          this.toAnalyticsEventDto(
            'challenge posted',
            payload.challengeAuthor.id,
            context.event.id,
            {
              challengeSlug: payload.challengeSlug,
              challengeTitle: payload.challengeTitle,
            },
          ),
        )

        return await job.handle(amqp)
      },
    )
  }

  private createTrackChallengeCompletedFunction() {
    return this.inngest.createFunction(
      {
        id: `${TrackAnalyticsEventJob.KEY}.challenge.completed`,
        onFailure: (context) => this.handleFailure(context, TrackAnalyticsEventJob.name),
        triggers: {
          event: eventType(ChallengeCompletedEvent._NAME, {
            schema: z.object({
              userId: idSchema,
              challengeId: idSchema,
            }),
          }),
        },
      },
      async (context) => {
        const payload = context.event.data as ChallengeCompletedPayload
        const amqp = new InngestAmqp<ChallengeCompletedPayload>(context)
        const job = new TrackAnalyticsEventJob(
          new PostHogAnalyticsProvider(),
          this.toAnalyticsEventDto(
            'challenge completed',
            payload.userId,
            context.event.id,
            {
              challengeId: payload.challengeId,
            },
          ),
        )

        return await job.handle(amqp)
      },
    )
  }

  private createTrackChallengeDeletedFunction() {
    return this.inngest.createFunction(
      {
        id: `${TrackAnalyticsEventJob.KEY}.challenge.deleted`,
        onFailure: (context) => this.handleFailure(context, TrackAnalyticsEventJob.name),
        triggers: {
          event: eventType(ChallengeDeletedEvent._NAME, {
            schema: z.object({
              challengeId: idSchema,
              challengeSlug: stringSchema,
              challengeTitle: stringSchema,
              challengeAuthor: authorAggregateSchema,
            }),
          }),
        },
      },
      async (context) => {
        const payload = context.event.data as ChallengeDeletedPayload
        const amqp = new InngestAmqp<ChallengeDeletedPayload>(context)
        const job = new TrackAnalyticsEventJob(
          new PostHogAnalyticsProvider(),
          this.toAnalyticsEventDto(
            'challenge deleted',
            payload.challengeAuthor.id,
            context.event.id,
            {
              challengeId: payload.challengeId,
              challengeSlug: payload.challengeSlug,
              challengeTitle: payload.challengeTitle,
            },
          ),
        )

        return await job.handle(amqp)
      },
    )
  }

  private createTrackShopItemPurchasedFunction() {
    return this.inngest.createFunction(
      {
        id: `${TrackAnalyticsEventJob.KEY}.shop.item.purchased`,
        onFailure: (context) => this.handleFailure(context, TrackAnalyticsEventJob.name),
        triggers: {
          event: eventType(ShopItemPurchasedEvent._NAME, {
            schema: z.object({
              userId: idSchema,
              itemId: stringSchema,
              itemType: shopItemTypeSchema,
              itemName: stringSchema.optional(),
              itemPrice: z.number(),
            }),
          }),
        },
      },
      async (context) => {
        const payload = context.event.data as ShopItemPurchasedPayload
        const amqp = new InngestAmqp<ShopItemPurchasedPayload>(context)
        const job = new TrackAnalyticsEventJob(
          new PostHogAnalyticsProvider(),
          this.toAnalyticsEventDto(
            'shop item purchased',
            payload.userId,
            context.event.id,
            {
              itemId: payload.itemId,
              itemType: payload.itemType,
              itemName: payload.itemName,
              itemPrice: payload.itemPrice,
            },
          ),
        )

        return await job.handle(amqp)
      },
    )
  }

  private createTrackFeedbackReportSentFunction() {
    return this.inngest.createFunction(
      {
        id: `${TrackAnalyticsEventJob.KEY}.feedback-report.sent`,
        onFailure: (context) => this.handleFailure(context, TrackAnalyticsEventJob.name),
        triggers: {
          event: eventType(FeedbackReportSentEvent._NAME, {
            schema: z.object({
              feedbackReportId: idSchema,
              feedbackReportContent: stringSchema,
              feedbackReportIntent: feedbackReportIntentSchema,
              feedbackReportSentAt: stringSchema,
              screenshot: stringSchema.optional(),
              author: authorAggregateSchema,
            }),
          }),
        },
      },
      async (context) => {
        const payload = context.event.data as FeedbackReportSentPayload
        const amqp = new InngestAmqp<FeedbackReportSentPayload>(context)
        const job = new TrackAnalyticsEventJob(
          new PostHogAnalyticsProvider(),
          this.toAnalyticsEventDto(
            'feedback report sent',
            payload.author.id,
            context.event.id,
            {
              feedbackReportId: payload.feedbackReportId,
              feedbackReportIntent: payload.feedbackReportIntent,
              feedbackReportSentAt: payload.feedbackReportSentAt,
            },
          ),
        )

        return await job.handle(amqp)
      },
    )
  }

  getFunctions() {
    return [
      this.createTrackAccountSignedUpFunction(),
      this.createTrackAccountSignedInFunction(),
      this.createTrackUserCreatedFunction(),
      this.createTrackStarUnlockedFunction(),
      this.createTrackFirstStarUnlockedFunction(),
      this.createTrackPlanetCompletedFunction(),
      this.createTrackSpaceCompletedFunction(),
      this.createTrackUserRewardedFunction(),
      this.createTrackChallengePostedFunction(),
      this.createTrackChallengeCompletedFunction(),
      this.createTrackChallengeDeletedFunction(),
      this.createTrackShopItemPurchasedFunction(),
      this.createTrackFeedbackReportSentFunction(),
    ]
  }
}
