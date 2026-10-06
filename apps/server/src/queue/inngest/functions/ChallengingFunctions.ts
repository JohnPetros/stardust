import type { DrizzleDatabase } from '@/database/drizzle/DrizzleClient'

import { InngestFunctions } from './InngestFunctions'
import { InngestAmqp } from '../InngestAmqp'
import { CreateChallengeJob, ExpireNewChallengesJob } from '@/queue/jobs/challenging'
import { MastraCreateChallengeWorkflow } from '@/ai/mastra/workflows/MastraCreateChallengeWorkflow'
import { DrizzleChallengesRepository } from '@/database/drizzle/repositories'

export class ChallengingFunctions extends InngestFunctions {
  private createCreateChallengeFunction() {
    return this.createFunction(
      {
        id: CreateChallengeJob.KEY,
        onFailure: (context) => this.handleFailure(context, CreateChallengeJob.name),
        retries: 0,
        triggers: {
          cron: CreateChallengeJob.CRON_EXPRESSION,
        },
      },
      async (context) => {
        const workflow = new MastraCreateChallengeWorkflow()
        const amqp = new InngestAmqp(context)
        const job = new CreateChallengeJob(workflow)
        return await job.handle(amqp)
      },
    )
  }

  private createExpireNewChallengesFunction(database: DrizzleDatabase) {
    return this.createFunction(
      {
        id: ExpireNewChallengesJob.KEY,
        onFailure: (context) => this.handleFailure(context, ExpireNewChallengesJob.name),
        retries: 0,
        triggers: {
          cron: ExpireNewChallengesJob.CRON_EXPRESSION,
        },
      },
      async (context) => {
        const repository = new DrizzleChallengesRepository(database, { kind: 'system' })
        const amqp = new InngestAmqp(context)
        const job = new ExpireNewChallengesJob(repository)
        return await job.handle(amqp)
      },
    )
  }

  getFunctions(database: DrizzleDatabase) {
    return [
      this.createCreateChallengeFunction(),
      this.createExpireNewChallengesFunction(database),
    ]
  }
}
