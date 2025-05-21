import type { SupabaseClient } from '@supabase/supabase-js'

import { UserCreatedEvent } from '@stardust/core/profile/events'

import { UnlockFirstStarJob } from '@/queue/jobs/space'
import { SupabasePlanetsRepository } from '@/database'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'
import { InngestEventBroker } from '../InngestEventBroker'

export class SpaceFunctions extends InngestFunctions {
  private unlockFirstStarFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: UnlockFirstStarJob.KEY },
      { event: UserCreatedEvent._NAME },
      async (context) => {
        const planetsRepository = new SupabasePlanetsRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const eventBroker = new InngestEventBroker(amqp)
        const job = new UnlockFirstStarJob(planetsRepository, eventBroker)
        return job.handle(amqp)
      },
    )
  }

  getFunctions(supabase: SupabaseClient) {
    return [this.unlockFirstStarFunction(supabase)]
  }
}
