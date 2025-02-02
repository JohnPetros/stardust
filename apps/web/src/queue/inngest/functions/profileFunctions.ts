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
    const profileService = SupabaseProfileService(supabase)
    const queue = InngestQueue<typeof context.event.data>(context)
    const job = HandleUserSignedUpJob(profileService)
    return await job.handle(queue)
  },
)

const observeStreakBreak = inngest.createFunction(
  { id: JOBS.profile.observerStreakBreak.key },
  { cron: `TZ=America/Sao_Paulo ${JOBS.profile.observerStreakBreak.cronExpression}` },
  async (context) => {
    const supabase = SupabaseServerClient()
    const profileService = SupabaseProfileService(supabase)
    const job = ObserveStreakBreakJob(profileService)
    const queue = InngestQueue(context)
    return await job.handle(queue)
  },
)

const resetWeekStatus = inngest.createFunction(
  { id: JOBS.profile.resetWeekStatus.key },
  { cron: `TZ=America/Sao_Paulo ${JOBS.profile.resetWeekStatus.cronExpression}` },
  async (context) => {
    const supabase = SupabaseServerClient()
    const profileService = SupabaseProfileService(supabase)
    const job = ResetWeekStatusJob(profileService)
    const queue = InngestQueue(context)
    return await job.handle(queue)
  },
)

export const profileFunctions = [handleUserSignedUp, observeStreakBreak, resetWeekStatus]
