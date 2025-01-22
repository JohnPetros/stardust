import { KEY, ObserveStreakBreakJob } from '@/queue/jobs/profile/ObserveStreakBreakJob'
import { inngest } from '../../client'
import { InngestQueue } from '../../InngestQueue'
import { SupabaseProfileService } from '@/api/supabase/services'
import { SupabaseServerClient } from '@/api/supabase/clients'

export const observeStreakBreak = inngest.createFunction(
  { id: KEY },
  { cron: 'TZ=America/Sao_Paulo 0 0 * * *' }, // Everyday at 00:00
  async (context) => {
    const supabase = SupabaseServerClient()
    const profileService = SupabaseProfileService(supabase)
    const job = ObserveStreakBreakJob(profileService)
    const queue = InngestQueue(context)
    return await job.handle(queue)
  },
)
