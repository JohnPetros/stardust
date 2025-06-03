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
} from '@/queue/jobs/profile'
import { SupabaseUsersRepository } from '@/database'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'

export class ProfileFunctions extends InngestFunctions {
  private createUserJob(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: CreateUserJob.KEY },
      { event: ShopItemsAcquiredByDefaultEvent._NAME },
      async (context) => {
        const repository = new SupabaseUsersRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new CreateUserJob(repository)
        return job.handle(amqp)
      },
    )
  }

  private updateTierForRankingWinnersJob(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: UpdateTierForRankingWinnersJob.KEY },
      { event: RankingWinnersDefinedEvent._NAME },
      async (context) => {
        const repository = new SupabaseUsersRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new UpdateTierForRankingWinnersJob(repository)
        return job.handle(amqp)
      },
    )
  }

  private updateTierForRankingLosersJob(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: UpdateTierForRankingLosersJob.KEY },
      { event: RankingLosersDefinedEvent._NAME },
      async (context) => {
        const repository = new SupabaseUsersRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new UpdateTierForRankingLosersJob(repository)
        return job.handle(amqp)
      },
    )
  }

  private observeStreakBreakFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: ObserveStreakBreakJob.KEY },
      { cron: ObserveStreakBreakJob.CRON_EXPRESSION },
      async () => {
        const repository = new SupabaseUsersRepository(supabase)
        const amqp = new InngestAmqp()
        const job = new ObserveStreakBreakJob(repository)
        return job.handle(amqp)
      },
    )
  }

  private resetWeekStatusForAllUsersFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: ResetWeekStatusForAllUsersJob.KEY },
      { cron: ResetWeekStatusForAllUsersJob.CRON_EXPRESSION },
      async () => {
        const repository = new SupabaseUsersRepository(supabase)
        const amqp = new InngestAmqp()
        const job = new ResetWeekStatusForAllUsersJob(repository)
        return job.handle(amqp)
      },
    )
  }

  getFunctions(supabase: SupabaseClient) {
    return [
      this.createUserJob(supabase),
      this.observeStreakBreakFunction(supabase),
      this.resetWeekStatusForAllUsersFunction(supabase),
      this.updateTierForRankingWinnersJob(supabase),
      this.updateTierForRankingLosersJob(supabase),
    ]
  }
}
