import type { Amqp } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { ResetWeekStatusForAllUsersUseCase } from '@stardust/core/profile/use-cases'

export class ResetWeekStatusForAllUsersJob {
  static readonly KEY = 'profile/reset.week.status.job'
  static readonly CRON_EXPRESSION = 'TZ=America/Sao_Paulo 3 0 * * 0'

  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(amqp: Amqp) {
    const useCase = new ResetWeekStatusForAllUsersUseCase(this.usersRepository)
    await amqp.run(
      async () => await useCase.execute(),
      ResetWeekStatusForAllUsersUseCase.name,
    )
  }
}
