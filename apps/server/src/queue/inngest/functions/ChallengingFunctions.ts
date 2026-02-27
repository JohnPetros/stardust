import type { SupabaseClient } from '@supabase/supabase-js'

import { InngestFunctions } from './InngestFunctions'
import { InngestAmqp } from '../InngestAmqp'
import { CreateChallengeJob, ExpireNewChallengesJob } from '@/queue/jobs/challenging'
import { MastraCreateChallengeWorkflow } from '@/ai/mastra/workflows/MastraCreateChallengeWorkflow'
import { SupabaseChallengesRepository } from '@/database/supabase/repositories/challenging'

export class ChallengingFunctions extends InngestFunctions {
  private createCreateChallengeFunction() {
    return this.inngest.createFunction(
      {
        id: CreateChallengeJob.KEY,
        onFailure: (context) => this.handleFailure(context, CreateChallengeJob.name),
        retries: 0,
      },
      { cron: CreateChallengeJob.CRON_EXPRESSION },
      async (context) => {
        const workflow = new MastraCreateChallengeWorkflow()
        const amqp = new InngestAmqp(context)
        const job = new CreateChallengeJob(workflow)
        return await job.handle(amqp)
      },
    )
  }

  private createExpireNewChallengesFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      {
        id: ExpireNewChallengesJob.KEY,
        onFailure: (context) => this.handleFailure(context, ExpireNewChallengesJob.name),
        retries: 0,
      },
      { cron: ExpireNewChallengesJob.CRON_EXPRESSION },
      async (context) => {
        const repository = new SupabaseChallengesRepository(supabase)
        const amqp = new InngestAmqp(context)
        const job = new ExpireNewChallengesJob(repository)
        return await job.handle(amqp)
      },
    )
  }

  getFunctions(supabase: SupabaseClient) {
    return [
      this.createCreateChallengeFunction(),
      this.createExpireNewChallengesFunction(supabase),
    ]
  }
}
