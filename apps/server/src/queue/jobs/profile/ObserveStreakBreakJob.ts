import type { Amqp } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { _ObserveStreakBreakUseCase } from '@stardust/core/profile/use-cases'

export class ObserveStreakBreakJob {
  static readonly KEY = 'profile/observe.streak.break.job'
  static readonly CRON_EXPRESSION = 'TZ=America/Sao_Paulo 1 0 * * *'

  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(amqp: Amqp) {
    const useCase = new _ObserveStreakBreakUseCase(this.usersRepository)
    await amqp.run(async () => useCase.execute(), _ObserveStreakBreakUseCase.name)
  }
}
