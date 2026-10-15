import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import type { DrizzleDatabase } from '@/database/drizzle/DrizzleClient'

import { FirstTierReachedEvent } from '@stardust/core/ranking/events'
import type { EventPayload } from '@stardust/core/global/types'
import {
  DrizzleAvatarsRepository,
  DrizzleRocketsRepository,
} from '@/database/drizzle/repositories'

import { AcquireDefaultShopItemsJob } from '@/queue/jobs/shop'
import { InngestAmqp } from '../InngestAmqp'
import { InngestBroker } from '../InngestBroker'
import { InngestFunctions } from './InngestFunctions'
import { eventType } from './InngestFunctions'
import z from 'zod'
import { emailSchema, idSchema, nameSchema } from '@stardust/validation/global/schemas'

type FirstTierReachedPayload = EventPayload<typeof FirstTierReachedEvent>

export class ShopFunctions extends InngestFunctions {
  private acquireDefaultShopItemsJob(database: DrizzleDatabase) {
    return this.createFunction(
      this.acquireDefaultShopItemsJobOptions(),
      async (context) => {
        const amqp = new InngestAmqp<FirstTierReachedPayload>(context)
        return this.createAcquireDefaultShopItemsJob(database).handle(amqp)
      },
    )
  }

  getFunctions(database: DrizzleDatabase) {
    return [this.acquireDefaultShopItemsJob(database)]
  }
  private createAcquireDefaultShopItemsJob(database: DrizzleDatabase) {
    const job = new AcquireDefaultShopItemsJob(
      this.rockets(database),
      this.avatars(database),
      new InngestBroker(),
      new DrizzleUnitOfWork(database),
    )
    return job
  }

  private acquireDefaultShopItemsJobOptions() {
    return {
      id: AcquireDefaultShopItemsJob.KEY,
      onFailure: this.handleJobFailure(AcquireDefaultShopItemsJob.name),
      triggers: createFirstTierReachedEventTrigger(),
    }
  }

  private rockets(database: DrizzleDatabase) {
    return new DrizzleRocketsRepository(database, { kind: 'system' })
  }

  private avatars(database: DrizzleDatabase) {
    return new DrizzleAvatarsRepository(database, { kind: 'system' })
  }
}

function createFirstTierReachedEventSchema() {
  return z.object({
    user: createUserSchema(),
    firstUnlockedStarId: idSchema,
    firstReachedTierId: idSchema,
    firstTierId: idSchema,
  })
}

function createUserSchema() {
  return z.object({ id: idSchema, name: nameSchema, email: emailSchema })
}

function createFirstTierReachedEventTrigger() {
  return {
    event: eventType(FirstTierReachedEvent._NAME, {
      schema: createFirstTierReachedEventSchema(),
    }),
  }
}
