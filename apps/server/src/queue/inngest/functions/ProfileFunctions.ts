import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
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
      this.createCreateUserFunctionOptions(),
      async (context) => {
        const amqp = new InngestAmqp<ShopItemsAcquiredByDefaultPayload>(context)
        return this.createCreateUserJob(database).handle(amqp)
      },
    )
  }

  private createObserveStreakBreakFunction(database: DrizzleDatabase) {
    return this.createFunction(
      this.createObserveStreakBreakFunctionOptions(),
      async (context) => {
        const amqp = new InngestAmqp(context)
        return this.createObserveStreakBreakJob(database).handle(amqp)
      },
    )
  }

  getFunctions(database: DrizzleDatabase) {
    return [
      this.createCreateUserFunction(database),
      this.createObserveStreakBreakFunction(database),
    ]
  }
  private createCreateUserJob(database: DrizzleDatabase) {
    const repository = new DrizzleUsersRepository(database, { kind: 'system' })
    const broker = new InngestBroker()
    const job = new CreateUserJob(repository, broker, new DrizzleUnitOfWork(database))
    return job
  }

  private createObserveStreakBreakJob(database: DrizzleDatabase) {
    const repository = new DrizzleUsersRepository(database, { kind: 'system' })
    const job = new ObserveStreakBreakJob(repository)
    return job
  }

  private createCreateUserFunctionOptions() {
    return {
      id: CreateUserJob.KEY,
      onFailure: this.handleJobFailure(CreateUserJob.name),
      retries: 0,
      triggers: createShopItemsAcquiredByDefaultEventTrigger(),
    }
  }

  private createObserveStreakBreakFunctionOptions() {
    return {
      id: ObserveStreakBreakJob.KEY,
      onFailure: this.handleJobFailure(ObserveStreakBreakJob.name),
      triggers: {
        cron: ObserveStreakBreakJob.CRON_EXPRESSION,
      },
    }
  }
}

function createShopItemsAcquiredByDefaultEventSchema() {
  return z.object({
    user: createUserSchema(),
    ...shopDefaultsShape(),
    firstReachedTierId: idSchema,
    firstUnlockedStarId: idSchema,
  })
}

function createUserSchema() {
  return z.object({ id: idSchema, name: nameSchema, email: emailSchema })
}

function shopDefaultsShape() {
  return {
    selectedAvatarByDefaultId: idSchema,
    selectedRocketByDefaultId: idSchema,
    acquiredAvatarsByDefaultIds: z.array(idSchema),
    acquiredRocketsByDefaultIds: z.array(idSchema),
  }
}

function createShopItemsAcquiredByDefaultEventTrigger() {
  return {
    event: eventType(ShopItemsAcquiredByDefaultEvent._NAME, {
      schema: createShopItemsAcquiredByDefaultEventSchema(),
    }),
  }
}
