import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseSpaceService } from '@/api/supabase/services'
import { HandleUserSignedUpJob } from '@/queue/jobs/space'
import { JOBS } from '@/queue/constants'
import { inngest } from '../client'
import { InngestQueue } from '../InngestQueue'

export const handleUserSignedUp = inngest.createFunction(
  { id: JOBS.space.handleUserSignedUp.key },
  { event: JOBS.space.handleUserSignedUp.eventName },
  async (context) => {
    const supabase = SupabaseServerClient()
    const spaceService = SupabaseSpaceService(supabase)
    const queue = InngestQueue<typeof context.event.data>(context)
    const job = HandleUserSignedUpJob(spaceService)
    return job.handle(queue)
  },
)

export const spaceFunctions = [handleUserSignedUp]
