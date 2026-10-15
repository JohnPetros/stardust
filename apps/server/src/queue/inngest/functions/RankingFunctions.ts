import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
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
    return this.createFunction(this.reachFirstTierJobOptions(), async (context) => {
      const amqp = new InngestAmqp<FirstStarUnlockedPayload>(context)
      return this.createReachFirstTierJob(database).handle(amqp)
    })
  }

  getFunctions(database: DrizzleDatabase) {
    return [this.reachFirstTierJob(database)]
  }
  private createReachFirstTierJob(database: DrizzleDatabase) {
    const repository = new DrizzleTiersRepository(database, { kind: 'system' })
    const Broker = new InngestBroker()
    const job = new ReachFirstTierJob(repository, Broker, new DrizzleUnitOfWork(database))
    return job
  }

  private reachFirstTierJobOptions() {
    return {
      id: ReachFirstTierJob.KEY,
      onFailure: this.handleJobFailure(ReachFirstTierJob.name),
      triggers: createFirstStarUnlockedEventTrigger(),
    }
  }
}

function createFirstStarUnlockedEventSchema() {
  return z.object({
    user: createUserSchema(),
    firstUnlockedStarId: idSchema,
  })
}

function createUserSchema() {
  return z.object({ id: idSchema, name: nameSchema, email: emailSchema })
}

function createFirstStarUnlockedEventTrigger() {
  return {
    event: eventType(FirstStarUnlockedEvent._NAME, {
      schema: createFirstStarUnlockedEventSchema(),
    }),
  }
}
