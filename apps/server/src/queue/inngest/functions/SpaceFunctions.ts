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
import { InngestBroker } from '../InngestBroker'

export class SpaceFunctions extends InngestFunctions {
  private createUnlockFirstStarFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      {
        id: UnlockFirstStarJob.KEY,
        onFailure: (context) => this.handleFailure(context, UnlockFirstStarJob.name),
      },
      { event: UserSignedUpEvent._NAME },
      async (context) => {
        const repository = new SupabasePlanetsRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const broker = new InngestBroker()
        const job = new UnlockFirstStarJob(repository, broker)
        return job.handle(amqp)
      },
    )
  }

  private createHandleStarsNewOrderFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      {
        id: HandleStarsNewOrderJob.KEY,
        onFailure: (context) => this.handleFailure(context, HandleStarsNewOrderJob.name),
      },
      [
        { event: PlanetsOrderChangedEvent._NAME },
        { event: StarsOrderChangedEvent._NAME },
      ],
      async (context) => {
        const repository = new SupabasePlanetsRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const broker = new InngestBroker()
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
