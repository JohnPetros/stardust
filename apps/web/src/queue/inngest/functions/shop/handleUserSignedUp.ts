import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseShopService } from '@/api/supabase/services'
import { HandleUserSignedUpJob } from '@/queue/jobs/shop'
import { KEY } from '@/queue/jobs/shop/HandleUserSignedUpJob'
import { inngest } from '../../client'
import { InngestQueue } from '../../InngestQueue'

export const handleUserSignedUp = inngest.createFunction(
  { id: KEY },
  { event: 'auth/user.signed.up' },
  async (context) => {
    const supabase = SupabaseServerClient()
    const shopService = SupabaseShopService(supabase)
    const queue = InngestQueue<typeof context.event.data>(context)
    const job = HandleUserSignedUpJob(shopService)
    return await job.handle(queue)
  },
)
