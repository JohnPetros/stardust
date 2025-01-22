import { HandleUserSignedUpJob } from '@/queue/jobs/space'
import { KEY } from '@/queue/jobs/space/HandleUserSignedUpJob'
import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseSpaceService } from '@/api/supabase/services'
import { inngest } from '../../client'
import { InngestQueue } from '../../InngestQueue'

export const handleUserSignedUp = inngest.createFunction(
  { id: KEY },
  { event: 'auth/user.signed.up' },
  async (context) => {
    const supabase = SupabaseServerClient()
    const spaceService = SupabaseSpaceService(supabase)
    const queue = InngestQueue<typeof context.event.data>(context)
    const job = HandleUserSignedUpJob(spaceService)
    return await job.handle(queue)
  },
)
