import { JOBS } from '@/queue/constants'
import { HandleUserSignedUpJob, UpdateRankingsJob } from '@/queue/jobs/ranking'
import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseRankingService } from '@/api/supabase/services'
import { inngest } from '../client'
import { InngestQueue } from '../InngestQueue'

const handleUserSignedUp = inngest.createFunction(
  { id: JOBS.ranking.handleUserSignedUp.key },
  { event: JOBS.ranking.handleUserSignedUp.eventName },
  async (context) => {
    const supabase = SupabaseServerClient()
    const service = SupabaseRankingService(supabase)
    const queue = InngestQueue<typeof context.event.data>(context)
    const job = HandleUserSignedUpJob(service)
    return await job.handle(queue)
  },
)

const updateRankings = inngest.createFunction(
  { id: JOBS.ranking.updateRankings.key },
  { cron: `TZ=America/Sao_Paulo ${JOBS.ranking.updateRankings.cronExpression}` },
  async (context) => {
    const supabase = SupabaseServerClient()
    const service = SupabaseRankingService(supabase)
    const queue = InngestQueue(context)
    const job = UpdateRankingsJob(service)
    return await job.handle(queue)
  },
)

export const rankingFunctions = [handleUserSignedUp, updateRankings]
