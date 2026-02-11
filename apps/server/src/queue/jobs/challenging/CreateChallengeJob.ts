import type { Job, Amqp } from '@stardust/core/global/interfaces'
import type { CreateChallengeWorkflow } from '@stardust/core/challenging/interfaces'

export class CreateChallengeJob implements Job {
  static readonly KEY = 'challenging/create.challenge.job'
  static readonly CRON_EXPRESSION = 'TZ=America/Sao_Paulo 0 0 * * *'

  constructor(private readonly workflow: CreateChallengeWorkflow) {}

  async handle(amqp: Amqp) {
    await amqp.run(async () => await this.workflow.run(), 'Create Challenge Workflow')
  }
}
