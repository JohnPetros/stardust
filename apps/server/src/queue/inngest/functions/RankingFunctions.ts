import { ReachFirstTierJob } from '@/queue/jobs/ranking'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'
import type { SupabaseClient } from '@supabase/supabase-js'
import { FirstStarUnlockedEvent } from '@stardust/core/space/events'
import { SupabaseTiersRepository } from '@/database/supabase/repositories/ranking'
import { InngestBroker } from '../InngestBroker'

export class RankingFunctions extends InngestFunctions {
  private reachFirstTierJob(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      {
        id: ReachFirstTierJob.KEY,
        onFailure: (context) => this.handleFailure(context, ReachFirstTierJob.name),
      },
      { event: FirstStarUnlockedEvent._NAME },
      async (context) => {
        const repository = new SupabaseTiersRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const Broker = new InngestBroker()
        const job = new ReachFirstTierJob(repository, Broker)
        return job.handle(amqp)
      },
    )
  }

  getFunctions(supabase: SupabaseClient) {
    return [this.reachFirstTierJob(supabase)]
  }
}
