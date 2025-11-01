import type { SupabaseClient } from '@supabase/supabase-js'

import {
  RankingLosersDefinedEvent,
  RankingWinnersDefinedEvent,
} from '@stardust/core/ranking/events'
import { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'

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
import { InngestFunctions } from './InngestFunctions'
import { SpaceOrderChangedEvent } from '@stardust/core/space/events'

export class ProfileFunctions extends InngestFunctions {
  private createCreateUserFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: CreateUserJob.KEY },
      { event: ShopItemsAcquiredByDefaultEvent._NAME },
      async (context) => {
        const repository = new SupabaseUsersRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new CreateUserJob(repository)
        return await job.handle(amqp)
      },
    )
  }

  private createUpdateTierForRankingWinnersFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: UpdateTierForRankingWinnersJob.KEY },
      { event: RankingWinnersDefinedEvent._NAME },
      async (context) => {
        const repository = new SupabaseUsersRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new UpdateTierForRankingWinnersJob(repository)
        return await job.handle(amqp)
      },
    )
  }

  private createUpdateTierForRankingLosersFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: UpdateTierForRankingLosersJob.KEY },
      { event: RankingLosersDefinedEvent._NAME },
      async (context) => {
        const repository = new SupabaseUsersRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new UpdateTierForRankingLosersJob(repository)
        return await job.handle(amqp)
      },
    )
  }

  private createObserveStreakBreakFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: ObserveStreakBreakJob.KEY },
      { cron: ObserveStreakBreakJob.CRON_EXPRESSION },
      async (context) => {
        const repository = new SupabaseUsersRepository(supabase)
        const amqp = new InngestAmqp(context)
        const job = new ObserveStreakBreakJob(repository)
        return await job.handle(amqp)
      },
    )
  }

  private createResetWeekStatusForAllUsersFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: ResetWeekStatusForAllUsersJob.KEY },
      { cron: ResetWeekStatusForAllUsersJob.CRON_EXPRESSION },
      async (context) => {
        const repository = new SupabaseUsersRepository(supabase)
        const amqp = new InngestAmqp(context)
        const job = new ResetWeekStatusForAllUsersJob(repository)
        return await job.handle(amqp)
      },
    )
  }

  private createUpdateSpaceForAllUsersFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: UpdateSpaceForAllUsersJob.KEY },
      { event: SpaceOrderChangedEvent._NAME },
      async (context) => {
        const repository = new SupabaseUsersRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new UpdateSpaceForAllUsersJob(repository)
        return await job.handle(amqp)
      },
    )
  }

  getFunctions(supabase: SupabaseClient) {
    return [
      this.createCreateUserFunction(supabase),
      this.createObserveStreakBreakFunction(supabase),
      this.createResetWeekStatusForAllUsersFunction(supabase),
      this.createUpdateTierForRankingWinnersFunction(supabase),
      this.createUpdateTierForRankingLosersFunction(supabase),
      this.createUpdateSpaceForAllUsersFunction(supabase),
    ]
  }
}
