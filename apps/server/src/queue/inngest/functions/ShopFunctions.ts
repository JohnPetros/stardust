import type { SupabaseClient } from '@supabase/supabase-js'

import { FirstTierReachedEvent } from '@stardust/core/ranking/events'
import type { EventPayload } from '@stardust/core/global/types'
import {
  SupabaseAvatarsRepository,
  SupabaseRocketsRepository,
} from '@/database/supabase/repositories/shop'

import { AcquireDefaultShopItemsJob } from '@/queue/jobs/shop'
import { InngestAmqp } from '../InngestAmqp'
import { InngestBroker } from '../InngestBroker'
import { InngestFunctions } from './InngestFunctions'
import { eventType } from 'inngest'
import z from 'zod'
import { emailSchema, idSchema, nameSchema } from '@stardust/validation/global/schemas'

type FirstTierReachedPayload = EventPayload<typeof FirstTierReachedEvent>

export class ShopFunctions extends InngestFunctions {
  private acquireDefaultShopItemsJob(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      {
        id: AcquireDefaultShopItemsJob.KEY,
        onFailure: (context) =>
          this.handleFailure(context, AcquireDefaultShopItemsJob.name),
        triggers: {
          event: eventType(FirstTierReachedEvent._NAME, {
            schema: z.object({
              user: z.object({
                id: idSchema,
                name: nameSchema,
                email: emailSchema,
              }),
              firstUnlockedStarId: idSchema,
              firstReachedTierId: idSchema,
              firstTierId: idSchema,
            }),
          }),
        },
      },
      async (context) => {
        const rocketsRepository = new SupabaseRocketsRepository(supabase)
        const avatarsRepository = new SupabaseAvatarsRepository(supabase)
        const amqp = new InngestAmqp<FirstTierReachedPayload>(context)
        const Broker = new InngestBroker()
        const job = new AcquireDefaultShopItemsJob(
          rocketsRepository,
          avatarsRepository,
          Broker,
        )
        return job.handle(amqp)
      },
    )
  }

  getFunctions(supabase: SupabaseClient) {
    return [this.acquireDefaultShopItemsJob(supabase)]
  }
}
