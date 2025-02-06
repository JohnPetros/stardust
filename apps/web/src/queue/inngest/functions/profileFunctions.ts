import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseProfileService } from '@/api/supabase/services'
import {
  HandleUserSignedUpJob,
  ObserveStreakBreakJob,
  ResetWeekStatusJob,
} from '@/queue/jobs/profile'
import { JOBS } from '@/queue/constants'
import { InngestQueue } from '../InngestQueue'
import { inngest } from '../client'

const handleUserSignedUp = inngest.createFunction(
  { id: JOBS.profile.handleUserSignedUp.key },
  { event: JOBS.profile.handleUserSignedUp.eventName },
  async (context) => {
    const supabase = SupabaseServerClient()
    const service = SupabaseProfileService(supabase)
    const queue = InngestQueue<typeof context.event.data>(context)
    const job = HandleUserSignedUpJob(service)
    return await job.handle(queue)
  },
)

const observeStreakBreak = inngest.createFunction(
  { id: JOBS.profile.observerStreakBreak.key },
  { cron: `TZ=America/Sao_Paulo * * * * *` },
  async () => {
    const supabase = SupabaseServerClient()
    const service = SupabaseProfileService(supabase)
    const job = ResetWeekStatusJob(service)
    const queue = InngestQueue()
    await job.handle(queue)
    return { status: 'ok' }
  },
)

const resetWeekStatus = inngest.createFunction(
  { id: JOBS.profile.resetWeekStatus.key },
  { cron: `TZ=America/Sao_Paulo ${JOBS.profile.resetWeekStatus.cronExpression}` },
  async () => {
    const supabase = SupabaseServerClient()
    const service = SupabaseProfileService(supabase)
    const job = ResetWeekStatusJob(service)
    const queue = InngestQueue()
    return await job.handle(queue)
  },
)

export const profileFunctions = [handleUserSignedUp, observeStreakBreak, resetWeekStatus]
