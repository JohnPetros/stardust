import { UserCreatedEvent } from '@stardust/core/profile/events'

import { shopService } from '@/api/supabase/services/server'
import { HandleUserCreatedJob } from '@/queue/jobs/shop/HandleUserCreatedJob'
import { inngest } from '../../client'
import { InngestQueue } from '../../InngestQueue'

const job = HandleUserCreatedJob(shopService)

export const handleUserCreted = inngest.createFunction(
  { id: job.key },
  { event: UserCreatedEvent.name },
  async (context) => {
    const queue = InngestQueue<typeof context.event.data>(context)
    job.handle(queue)
  },
)
