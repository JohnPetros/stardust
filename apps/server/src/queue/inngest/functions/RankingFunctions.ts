import { ReachFirstTierJob } from '@/queue/jobs/ranking'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'
import type { SupabaseClient } from '@supabase/supabase-js'
import { FirstStarUnlockedEvent } from '@stardust/core/space/events'
import type { EventPayload } from '@stardust/core/global/types'
import { SupabaseTiersRepository } from '@/database/supabase/repositories/ranking'
import { InngestBroker } from '../InngestBroker'
import { eventType } from 'inngest'
import z from 'zod'
import { idSchema, nameSchema, emailSchema } from '@stardust/validation/global/schemas'

type FirstStarUnlockedPayload = EventPayload<typeof FirstStarUnlockedEvent>

export class RankingFunctions extends InngestFunctions {
  private reachFirstTierJob(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      {
        id: ReachFirstTierJob.KEY,
        onFailure: (context) => this.handleFailure(context, ReachFirstTierJob.name),
        triggers: {
          event: eventType(FirstStarUnlockedEvent._NAME, {
            schema: z.object({
              user: z.object({
                id: idSchema,
                name: nameSchema,
                email: emailSchema,
              }),
              firstUnlockedStarId: idSchema,
            }),
          }),
        },
      },
      async (context) => {
        const repository = new SupabaseTiersRepository(supabase)
        const amqp = new InngestAmqp<FirstStarUnlockedPayload>(context)
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
