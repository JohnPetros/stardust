import type { DrizzleDatabase } from '@/database/drizzle/DrizzleClient'

import { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'
import type { EventPayload } from '@stardust/core/global/types'

import { ObserveStreakBreakJob, CreateUserJob } from '@/queue/jobs/profile'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories'
import { InngestAmqp } from '../InngestAmqp'
import { InngestBroker } from '../InngestBroker'
import { InngestFunctions, eventType } from './InngestFunctions'
import z from 'zod'
import { emailSchema, idSchema, nameSchema } from '@stardust/validation/global/schemas'

type ShopItemsAcquiredByDefaultPayload = EventPayload<
  typeof ShopItemsAcquiredByDefaultEvent
>

export class ProfileFunctions extends InngestFunctions {
  private createCreateUserFunction(database: DrizzleDatabase) {
    return this.createFunction(
      {
        id: CreateUserJob.KEY,
        onFailure: (context) => this.handleFailure(context, CreateUserJob.name),
        retries: 0,
        triggers: {
          event: eventType(ShopItemsAcquiredByDefaultEvent._NAME, {
            schema: z.object({
              user: z.object({
                id: idSchema,
                name: nameSchema,
                email: emailSchema,
              }),
              selectedAvatarByDefaultId: idSchema,
              selectedRocketByDefaultId: idSchema,
              acquiredAvatarsByDefaultIds: z.array(idSchema),
              acquiredRocketsByDefaultIds: z.array(idSchema),
              firstReachedTierId: idSchema,
              firstUnlockedStarId: idSchema,
            }),
          }),
        },
      },
      async (context) => {
        const repository = new DrizzleUsersRepository(database, { kind: 'system' })
        const broker = new InngestBroker()
        const amqp = new InngestAmqp<ShopItemsAcquiredByDefaultPayload>(context)
        const job = new CreateUserJob(repository, broker)
        return await job.handle(amqp)
      },
    )
  }

  private createObserveStreakBreakFunction(database: DrizzleDatabase) {
    return this.createFunction(
      {
        id: ObserveStreakBreakJob.KEY,
        onFailure: (context) => this.handleFailure(context, ObserveStreakBreakJob.name),
        triggers: {
          cron: ObserveStreakBreakJob.CRON_EXPRESSION,
        },
      },
      async (context) => {
        const repository = new DrizzleUsersRepository(database, { kind: 'system' })
        const amqp = new InngestAmqp(context)
        const job = new ObserveStreakBreakJob(repository)
        return await job.handle(amqp)
      },
    )
  }

  getFunctions(database: DrizzleDatabase) {
    return [
      this.createCreateUserFunction(database),
      this.createObserveStreakBreakFunction(database),
    ]
  }
}
