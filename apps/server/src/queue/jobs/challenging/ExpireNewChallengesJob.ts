import type { Job, Amqp } from '@stardust/core/global/interfaces'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { ExpireNewChallengesUseCase } from '@stardust/core/challenging/use-cases'

export class ExpireNewChallengesJob implements Job {
  static readonly KEY = 'challenging/expire.new.challenges.job'
  static readonly CRON_EXPRESSION = 'TZ=America/Sao_Paulo 5 0 * * *'

  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async handle(amqp: Amqp) {
    const useCase = new ExpireNewChallengesUseCase(this.challengesRepository)
    await amqp.run(async () => await useCase.execute(), 'Expire New Challenges')
  }
}
