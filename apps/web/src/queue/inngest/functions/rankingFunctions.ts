import { JOBS } from '@/queue/constants'
import {
  HandleShopItemsAcquiredByDefaultJob,
  UpdateRankingsJob,
} from '@/queue/jobs/ranking'
import { SupabaseServerClient } from '@/rest/supabase/clients'
import { SupabaseRankingService } from '@/rest/supabase/services'
import { inngest } from '../client'
import { InngestAmqp } from '../InngestAmqp'

const handleUserSignedUp = inngest.createFunction(
  { id: JOBS.ranking.handleShopItemsAcquiredByDefault.key },
  { event: JOBS.ranking.handleShopItemsAcquiredByDefault.eventName },
  async (context) => {
    const supabase = SupabaseServerClient()
    const service = SupabaseRankingService(supabase)
    const queue = InngestAmqp<typeof context.event.data>(context)
    const job = HandleShopItemsAcquiredByDefaultJob(service)
    return job.handle(queue)
  },
)

const updateRankings = inngest.createFunction(
  { id: JOBS.ranking.updateRankings.key },
  { cron: `TZ=America/Sao_Paulo ${JOBS.ranking.updateRankings.cronExpression}` },
  async (context) => {
    const supabase = SupabaseServerClient()
    const service = SupabaseRankingService(supabase)
    const queue = InngestAmqp(context)
    const job = UpdateRankingsJob(service)
    return job.handle(queue)
  },
)

export const rankingFunctions = [handleUserSignedUp, updateRankings]
