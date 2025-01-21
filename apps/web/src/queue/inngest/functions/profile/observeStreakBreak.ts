import { ObserveStreakBreakJob } from '@/queue/jobs/profile/ObserveStreakBreakJob'
import { profileService } from '@/api/supabase/services/server'
import { inngest } from '../../client'
import { InngestQueue } from '../../InngestQueue'

const job = ObserveStreakBreakJob(profileService)

export const observeStreakBreak = inngest.createFunction(
  { id: job.key },
  { cron: 'TZ=America/Sao_Paulo 0 0 * * *' }, // Everyday at 00:00
  async (context) => {
    const queue = InngestQueue(context)
    await job.handle()
  },
)
