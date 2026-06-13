import type { SupabaseClient } from '@supabase/supabase-js'

import {
  RankingLosersDefinedEvent,
  RankingWinnersDefinedEvent,
} from '@stardust/core/ranking/events'
import { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'
import type { EventPayload } from '@stardust/core/global/types'

import {
  ObserveStreakBreakJob,
  ResetWeekStatusForAllUsersJob,
  UpdateTierForRankingWinnersJob,
  UpdateTierForRankingLosersJob,
  CreateUserJob,
  UpdateSpaceForAllUsersJob,
} from '@/queue/jobs/profile'
import { SupabaseUsersRepository } from '@/database'
import { InngestAmqp } from '../InngestAmqp'
import { InngestBroker } from '../InngestBroker'
import { InngestFunctions } from './InngestFunctions'
import { SpaceOrderChangedEvent } from '@stardust/core/space/events'
import { eventType } from 'inngest'
import z from 'zod'
import { emailSchema, idSchema, nameSchema } from '@stardust/validation/global/schemas'

type ShopItemsAcquiredByDefaultPayload = EventPayload<
  typeof ShopItemsAcquiredByDefaultEvent
>

export class ProfileFunctions extends InngestFunctions {
  private createCreateUserFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      {
        id: CreateUserJob.KEY,
        onFailure: (context) => this.handleFailure(context, CreateUserJob.name),
        retries: 0,
        triggers: {
          event: eventType(ShopItemsAcquiredByDefaultEvent._NAME, {
            schema: z.object({
              user: z.object({
                id: idSchema,
                name: nameSchema,
                email: emailSchema,
              }),
              selectedAvatarByDefaultId: idSchema,
              selectedRocketByDefaultId: idSchema,
              acquiredAvatarsByDefaultIds: z.array(idSchema),
              acquiredRocketsByDefaultIds: z.array(idSchema),
              firstReachedTierId: idSchema,
              firstUnlockedStarId: idSchema,
            }),
          }),
        },
      },
      async (context) => {
        const repository = new SupabaseUsersRepository(supabase)
        const broker = new InngestBroker()
        const amqp = new InngestAmqp<ShopItemsAcquiredByDefaultPayload>(context)
        const job = new CreateUserJob(repository, broker)
        return await job.handle(amqp)
      },
    )
  }

  private createObserveStreakBreakFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      {
        id: ObserveStreakBreakJob.KEY,
        onFailure: (context) => this.handleFailure(context, ObserveStreakBreakJob.name),
        triggers: {
          cron: ObserveStreakBreakJob.CRON_EXPRESSION,
        },
      },
      async (context) => {
        const repository = new SupabaseUsersRepository(supabase)
        const amqp = new InngestAmqp(context)
        const job = new ObserveStreakBreakJob(repository)
        return await job.handle(amqp)
      },
    )
  }

  getFunctions(supabase: SupabaseClient) {
    return [
      this.createCreateUserFunction(supabase),
      this.createObserveStreakBreakFunction(supabase),
    ]
  }
}
