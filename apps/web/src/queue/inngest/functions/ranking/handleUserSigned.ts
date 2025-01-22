import { HandleUserSignedUpJob } from '@/queue/jobs/ranking'
import { KEY } from '@/queue/jobs/ranking/HandleUserSignedUpJob'
import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseRankingService } from '@/api/supabase/services'
import { inngest } from '../../client'
import { InngestQueue } from '../../InngestQueue'

export const handleUserSignedUp = inngest.createFunction(
  { id: KEY },
  { event: 'auth/user.signed.up' },
  async (context) => {
    const supabase = SupabaseServerClient()
    const rankingService = SupabaseRankingService(supabase)
    const queue = InngestQueue<typeof context.event.data>(context)
    const job = HandleUserSignedUpJob(rankingService)
    return await job.handle(queue)
  },
)
