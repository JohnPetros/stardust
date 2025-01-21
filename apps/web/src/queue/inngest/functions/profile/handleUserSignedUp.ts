import { profileService } from '@/api/supabase/services/server'
import { HandleUserSignedUpJob } from '@/queue/jobs/profile'
import { inngest } from '../../client'
import { InngestQueue } from '../../InngestQueue'

const job = HandleUserSignedUpJob(profileService)

export const handleUserSignedUp = inngest.createFunction(
  { id: job.key },
  { event: 'auth/user.signed.up' },
  async (context) => {
    const queue = InngestQueue<typeof context.event.data>(context)
    job.handle(queue)
  },
)
