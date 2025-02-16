import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseShopService } from '@/api/supabase/services'
import { HandleUserSignedUpJob } from '@/queue/jobs/shop'
import { JOBS } from '@/queue/constants'
import { inngest } from '../client'
import { InngestQueue } from '../InngestQueue'

export const handleUserSignedUp = inngest.createFunction(
  { id: JOBS.shop.handleUserSignedUp.key },
  { event: JOBS.shop.handleUserSignedUp.eventName },
  async (context) => {
    const supabase = SupabaseServerClient()
    const shopService = SupabaseShopService(supabase)
    const queue = InngestQueue<typeof context.event.data>(context)
    const job = HandleUserSignedUpJob(shopService)
    return job.handle(queue)
  },
)

export const shopFunctions = [handleUserSignedUp]
