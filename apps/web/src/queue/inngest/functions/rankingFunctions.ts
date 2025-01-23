import { HandleUserSignedUpJob } from '@/queue/jobs/ranking'
import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseRankingService } from '@/api/supabase/services'
import { JOBS } from '@/queue/constants'
import { inngest } from '../client'
import { InngestQueue } from '../InngestQueue'

export const handleUserSignedUp = inngest.createFunction(
  { id: JOBS.ranking.handleUserSignedUp.key },
  { event: JOBS.ranking.handleUserSignedUp.eventName },
  async (context) => {
    const supabase = SupabaseServerClient()
    const rankingService = SupabaseRankingService(supabase)
    const queue = InngestQueue<typeof context.event.data>(context)
    const job = HandleUserSignedUpJob(rankingService)
    return await job.handle(queue)
  },
)

export const rankingFunctions = [handleUserSignedUp]
