import type { SupabaseClient } from '@supabase/supabase-js'

import { FirstTierReachedEvent } from '@stardust/core/ranking/events'
import {
  SupabaseAvatarsRepository,
  SupabaseRocketsRepository,
} from '@/database/supabase/repositories/shop'

import { AcquireDefaultShopItemsJob } from '@/queue/jobs/shop'
import { InngestAmqp } from '../InngestAmqp'
import { InngestBroker } from '../InngestBroker'
import { InngestFunctions } from './InngestFunctions'

export class ShopFunctions extends InngestFunctions {
  private acquireDefaultShopItemsJob(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      { id: AcquireDefaultShopItemsJob.KEY },
      { event: FirstTierReachedEvent._NAME },
      async (context) => {
        const rocketsRepository = new SupabaseRocketsRepository(supabase)
        const avatarsRepository = new SupabaseAvatarsRepository(supabase)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
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
