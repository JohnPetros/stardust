import type { Amqp } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { ObserveStreakBreakUseCase } from '@stardust/core/profile/use-cases'

export class ObserveStreakBreakJob {
  static readonly KEY = 'profile/observe.streak.break.job'
  static readonly CRON_EXPRESSION = 'TZ=America/Sao_Paulo 0 0 * * *'

  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(amqp: Amqp) {
    const useCase = new ObserveStreakBreakUseCase(this.usersRepository)
    return await amqp.run(async () => useCase.execute(), ObserveStreakBreakUseCase.name)
  }
}
