import { SupabaseServerClient } from '@/rest/supabase/clients'
import { SupabaseSpaceService } from '@/rest/supabase/services'
import { HandleUserSignedUpJob } from '@/queue/jobs/space'
import { JOBS } from '@/queue/constants'
import { inngest } from '../client'
import { InngestAmqp } from '../InngestAmqp'

export const handleUserSignedUp = inngest.createFunction(
  { id: JOBS.space.handleUserSignedUp.key },
  { event: JOBS.space.handleUserSignedUp.eventName },
  async (context) => {
    const supabase = SupabaseServerClient()
    const spaceService = SupabaseSpaceService(supabase)
    const queue = InngestAmqp<typeof context.event.data>(context)
    const job = HandleUserSignedUpJob(spaceService)
    return job.handle(queue)
  },
)

export const spaceFunctions = [handleUserSignedUp]
