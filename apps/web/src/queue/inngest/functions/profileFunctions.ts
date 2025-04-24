import { SupabaseServerClient } from '@/rest/supabase/clients'
import { SupabaseProfileService } from '@/rest/supabase/services'
import {
  HandleFirstTierReachedJob,
  ObserveStreakBreakJob,
  ResetWeekStatusJob,
} from '@/queue/jobs/profile'
import { JOBS } from '@/queue/constants'
import { InngestQueue } from '../InngestQueue'
import { inngest } from '../client'

const handleFirstTierReached = inngest.createFunction(
  { id: JOBS.profile.handleFirstTierReached.key },
  { event: JOBS.profile.handleFirstTierReached.eventName },
  async (context) => {
    const supabase = SupabaseServerClient()
    const service = SupabaseProfileService(supabase)
    const queue = InngestQueue<typeof context.event.data>(context)
    const job = HandleFirstTierReachedJob(service)
    return job.handle(queue)
  },
)

const observeStreakBreak = inngest.createFunction(
  { id: JOBS.profile.observeStreakBreak.key },
  { cron: `TZ=America/Sao_Paulo ${JOBS.profile.observeStreakBreak.cronExpression}` },
  async (context) => {
    const supabase = SupabaseServerClient()
    const service = SupabaseProfileService(supabase)
    const job = ObserveStreakBreakJob(service)
    const queue = InngestQueue(context)
    return job.handle(queue)
  },
)

const resetWeekStatus = inngest.createFunction(
  { id: JOBS.profile.resetWeekStatus.key },
  { cron: `TZ=America/Sao_Paulo ${JOBS.profile.resetWeekStatus.cronExpression}` },
  async (context) => {
    const supabase = SupabaseServerClient()
    const service = SupabaseProfileService(supabase)
    const job = ResetWeekStatusJob(service)
    const queue = InngestQueue(context)
    return job.handle(queue)
  },
)

export const profileFunctions = [
  handleFirstTierReached,
  observeStreakBreak,
  resetWeekStatus,
]
