import { ReachFirstTierJob } from '@/queue/jobs/ranking'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'
import type { DrizzleDatabase } from '@/database/drizzle/DrizzleClient'
import { FirstStarUnlockedEvent } from '@stardust/core/space/events'
import type { EventPayload } from '@stardust/core/global/types'
import { DrizzleTiersRepository } from '@/database/drizzle/repositories'
import { InngestBroker } from '../InngestBroker'
import { eventType } from './InngestFunctions'
import z from 'zod'
import { idSchema, nameSchema, emailSchema } from '@stardust/validation/global/schemas'

type FirstStarUnlockedPayload = EventPayload<typeof FirstStarUnlockedEvent>

export class RankingFunctions extends InngestFunctions {
  private reachFirstTierJob(database: DrizzleDatabase) {
    return this.createFunction(
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
        const repository = new DrizzleTiersRepository(database, { kind: 'system' })
        const amqp = new InngestAmqp<FirstStarUnlockedPayload>(context)
        const Broker = new InngestBroker()
        const job = new ReachFirstTierJob(repository, Broker)
        return job.handle(amqp)
      },
    )
  }

  getFunctions(database: DrizzleDatabase) {
    return [this.reachFirstTierJob(database)]
  }
}
