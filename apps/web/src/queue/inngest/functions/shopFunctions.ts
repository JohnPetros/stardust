import { SupabaseServerClient } from '@/rest/supabase/clients'
import { SupabaseShopService } from '@/rest/supabase/services'
import { handleFirstStarUnlockedJob } from '@/queue/jobs/shop'
import { JOBS } from '@/queue/constants'
import { inngest } from '../client'
import { InngestQueue } from '../InngestQueue'

export const handleUserSignedUp = inngest.createFunction(
  { id: JOBS.shop.handleFirstStarUnlocked.key },
  { event: JOBS.shop.handleFirstStarUnlocked.eventName },
  async (context) => {
    const supabase = SupabaseServerClient()
    const shopService = SupabaseShopService(supabase)
    const queue = InngestQueue<typeof context.event.data>(context)
    const job = handleFirstStarUnlockedJob(shopService)
    return job.handle(queue)
  },
)

export const shopFunctions = [handleUserSignedUp]
