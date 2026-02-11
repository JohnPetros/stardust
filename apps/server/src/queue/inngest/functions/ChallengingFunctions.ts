import { InngestFunctions } from './InngestFunctions'
import { InngestAmqp } from '../InngestAmqp'
import { CreateChallengeJob } from '@/queue/jobs/challenging'
import { MastraCreateChallengeWorkflow } from '@/ai/mastra/workflows/MastraCreateChallengeWorkflow'

export class ChallengingFunctions extends InngestFunctions {
  private createCreateChallengeFunction() {
    return this.inngest.createFunction(
      { id: CreateChallengeJob.KEY },
      { cron: CreateChallengeJob.CRON_EXPRESSION },
      async (context) => {
        const workflow = new MastraCreateChallengeWorkflow()
        const amqp = new InngestAmqp(context)
        const job = new CreateChallengeJob(workflow)
        return await job.handle(amqp)
      },
    )
  }

  getFunctions() {
    return [this.createCreateChallengeFunction()]
  }
}
