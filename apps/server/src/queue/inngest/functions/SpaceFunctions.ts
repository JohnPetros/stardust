import type { SupabaseClient } from '@supabase/supabase-js'

import { AccountSignedUpEvent } from '@stardust/core/auth/events'
import type { EventPayload } from '@stardust/core/global/types'
import {
  PlanetsOrderChangedEvent,
  StarsOrderChangedEvent,
} from '@stardust/core/space/events'

import { SupabasePlanetsRepository } from '@/database'
import { HandleStarsNewOrderJob, UnlockFirstStarJob } from '@/queue/jobs/space'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'
import { InngestBroker } from '../InngestBroker'
import { eventType } from 'inngest'
import z from 'zod'
import { emailSchema, idSchema, nameSchema } from '@stardust/validation/global/schemas'

type AccountSignedUpPayload = EventPayload<typeof AccountSignedUpEvent>

export class SpaceFunctions extends InngestFunctions {
  private createUnlockFirstStarFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      {
        id: UnlockFirstStarJob.KEY,
        onFailure: (context) => this.handleFailure(context, UnlockFirstStarJob.name),
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
        const repository = new SupabasePlanetsRepository(supabase)
        const amqp = new InngestAmqp<AccountSignedUpPayload>(context)
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
        triggers: [
          { event: eventType(PlanetsOrderChangedEvent._NAME) },
          { event: eventType(StarsOrderChangedEvent._NAME) },
        ],
      },
      async (context) => {
        const repository = new SupabasePlanetsRepository(supabase)
        const amqp = new InngestAmqp(context)
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
