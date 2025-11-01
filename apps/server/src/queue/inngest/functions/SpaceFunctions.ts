import type { SupabaseClient } from '@supabase/supabase-js'

import { UserSignedUpEvent } from '@stardust/core/auth/events'
import {
  PlanetsOrderChangedEvent,
  StarsOrderChangedEvent,
} from '@stardust/core/space/events'

import { SupabasePlanetsRepository } from '@/database'
import { HandleStarsNewOrderJob, UnlockFirstStarJob } from '@/queue/jobs/space'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'
import { InngestEventBroker } from '../InngestEventBroker'

export class SpaceFunctions extends InngestFunctions {
  private createUnlockFirstStarFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: UnlockFirstStarJob.KEY },
      { event: UserSignedUpEvent._NAME },
      async (context) => {
        const repository = new SupabasePlanetsRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const broker = new InngestEventBroker()
        const job = new UnlockFirstStarJob(repository, broker)
        return job.handle(amqp)
      },
    )
  }

  private createHandleStarsNewOrderFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: HandleStarsNewOrderJob.KEY },
      [
        { event: PlanetsOrderChangedEvent._NAME },
        { event: StarsOrderChangedEvent._NAME },
      ],
      async (context) => {
        const repository = new SupabasePlanetsRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const broker = new InngestEventBroker()
        const job = new HandleStarsNewOrderJob(repository, broker)
        return job.handle(amqp)
      },
    )
  }

  getFunctions(supabase: SupabaseClient) {
    return [
      this.createUnlockFirstStarFunction(supabase),
      this.createHandleStarsNewOrderFunction(supabase),
    ]
  }
}
