import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
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
      this.createUnlockFirstStarFunctionOptions(),
      async (context) => {
        const amqp = new InngestAmqp<AccountSignedUpPayload>(context)
        return this.createUnlockFirstStarJob(database).handle(amqp)
      },
    )
  }

  private createHandleStarsNewOrderFunction(database: DrizzleDatabase) {
    return this.createFunction(
      this.createHandleStarsNewOrderFunctionOptions(),
      async (context) => {
        const amqp = new InngestAmqp(context)
        return this.createHandleStarsNewOrderJob(database).handle(amqp)
      },
    )
  }

  getFunctions(database: DrizzleDatabase) {
    return [
      this.createUnlockFirstStarFunction(database),
      this.createHandleStarsNewOrderFunction(database),
    ]
  }
  private createUnlockFirstStarJob(database: DrizzleDatabase) {
    const repository = new DrizzlePlanetsRepository(database, { kind: 'system' })
    const broker = new InngestBroker()
    const job = new UnlockFirstStarJob(
      repository,
      broker,
      new DrizzleUnitOfWork(database),
    )
    return job
  }

  private createHandleStarsNewOrderJob(database: DrizzleDatabase) {
    const repository = new DrizzlePlanetsRepository(database, { kind: 'system' })
    const broker = new InngestBroker()
    const job = new HandleStarsNewOrderJob(
      repository,
      broker,
      new DrizzleUnitOfWork(database),
    )
    return job
  }

  private createUnlockFirstStarFunctionOptions() {
    return {
      id: UnlockFirstStarJob.KEY,
      onFailure: this.handleJobFailure(UnlockFirstStarJob.name),
      triggers: createAccountSignedUpEventTrigger(),
    }
  }

  private createHandleStarsNewOrderFunctionOptions() {
    return {
      id: HandleStarsNewOrderJob.KEY,
      onFailure: this.handleJobFailure(HandleStarsNewOrderJob.name),
      triggers: createOrderChangedTriggers(),
    }
  }
}

function createAccountSignedUpEventSchema() {
  return z.object({
    accountId: idSchema,
    accountName: nameSchema,
    accountEmail: emailSchema,
  })
}

function createAccountSignedUpEventTrigger() {
  return {
    event: eventType(AccountSignedUpEvent._NAME, {
      schema: createAccountSignedUpEventSchema(),
    }),
  }
}

function createOrderChangedTriggers() {
  return [
    { event: eventType(PlanetsOrderChangedEvent._NAME) },
    { event: eventType(StarsOrderChangedEvent._NAME) },
  ]
}
