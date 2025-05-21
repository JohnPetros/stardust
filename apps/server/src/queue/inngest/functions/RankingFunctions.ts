import { ReachFirstTierJob, UpdateRankingsJob } from '@/queue/jobs/ranking'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'
import type { SupabaseClient } from '@supabase/supabase-js'
import { FirstStarUnlockedEvent } from '@stardust/core/space/events'
import {
  SupabaseTiersRepository,
  SupabaseRankersRepository,
} from '@/database/supabase/repositories/ranking'
import { InngestEventBroker } from '../InngestEventBroker'

export class RankingFunctions extends InngestFunctions {
  private reachFirstTierJob(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: ReachFirstTierJob.KEY },
      { event: FirstStarUnlockedEvent._NAME },
      async (context) => {
        const repository = new SupabaseTiersRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const eventBroker = new InngestEventBroker(amqp)
        const job = new ReachFirstTierJob(repository, eventBroker)
        return job.handle(amqp)
      },
    )
  }

  private updateRankingsJob(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: UpdateRankingsJob.KEY },
      { cron: UpdateRankingsJob.cronExpression },
      async (context) => {
        const tiersRepository = new SupabaseTiersRepository(supabase)
        const rankersRepository = new SupabaseRankersRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const eventBroker = new InngestEventBroker(amqp)
        const job = new UpdateRankingsJob(tiersRepository, rankersRepository, eventBroker)
        return job.handle(amqp)
      },
    )
  }

  getFunctions(supabase: SupabaseClient) {
    return [this.reachFirstTierJob(supabase), this.updateRankingsJob(supabase)]
  }
}
