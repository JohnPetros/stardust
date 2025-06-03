import type { SupabaseClient } from '@supabase/supabase-js'

import { UserSignedUpEvent } from '@stardust/core/auth/events'

import { UnlockFirstStarJob } from '@/queue/jobs/space'
import { SupabasePlanetsRepository } from '@/database'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'
import { InngestEventBroker } from '../InngestEventBroker'

export class SpaceFunctions extends InngestFunctions {
  private unlockFirstStarFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: UnlockFirstStarJob.KEY },
      { event: UserSignedUpEvent._NAME },
      async (context) => {
        const planetsRepository = new SupabasePlanetsRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const eventBroker = new InngestEventBroker()
        const job = new UnlockFirstStarJob(planetsRepository, eventBroker)
        return job.handle(amqp)
      },
    )
  }

  getFunctions(supabase: SupabaseClient) {
    return [this.unlockFirstStarFunction(supabase)]
  }
}
