import type { DrizzleDatabase } from '@/database/drizzle/DrizzleClient'

import { AccountSignedUpEvent } from '@stardust/core/auth/events'
import type { EventPayload } from '@stardust/core/global/types'
import {
  PlanetsOrderChangedEvent,
  StarsOrderChangedEvent,
} from '@stardust/core/space/events'

import { DrizzlePlanetsRepository } from '@/database/drizzle/repositories'
import { HandleStarsNewOrderJob, UnlockFirstStarJob } from '@/queue/jobs/space'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'
import { InngestBroker } from '../InngestBroker'
import { eventType } from './InngestFunctions'
import z from 'zod'
import { emailSchema, idSchema, nameSchema } from '@stardust/validation/global/schemas'

type AccountSignedUpPayload = EventPayload<typeof AccountSignedUpEvent>

export class SpaceFunctions extends InngestFunctions {
  private createUnlockFirstStarFunction(database: DrizzleDatabase) {
    return this.createFunction(
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
        const repository = new DrizzlePlanetsRepository(database, { kind: 'system' })
        const amqp = new InngestAmqp<AccountSignedUpPayload>(context)
        const broker = new InngestBroker()
        const job = new UnlockFirstStarJob(repository, broker)
        return job.handle(amqp)
      },
    )
  }

  private createHandleStarsNewOrderFunction(database: DrizzleDatabase) {
    return this.createFunction(
      {
        id: HandleStarsNewOrderJob.KEY,
        onFailure: (context) => this.handleFailure(context, HandleStarsNewOrderJob.name),
        triggers: [
          { event: eventType(PlanetsOrderChangedEvent._NAME) },
          { event: eventType(StarsOrderChangedEvent._NAME) },
        ],
      },
      async (context) => {
        const repository = new DrizzlePlanetsRepository(database, { kind: 'system' })
        const amqp = new InngestAmqp(context)
        const broker = new InngestBroker()
        const job = new HandleStarsNewOrderJob(repository, broker)
        return job.handle(amqp)
      },
    )
  }

  getFunctions(database: DrizzleDatabase) {
    return [
      this.createUnlockFirstStarFunction(database),
      this.createHandleStarsNewOrderFunction(database),
    ]
  }
}
