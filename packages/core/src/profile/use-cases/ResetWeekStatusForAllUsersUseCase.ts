import type { UseCase } from '#global/interfaces/UseCase'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'

export class ResetWeekStatusForAllUsersUseCase implements UseCase<void, void> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute() {
    const users = await this.usersRepository.findAll()
    for (const user of users) {
      user.resetWeekStatus()
    }
    await this.usersRepository.replaceMany(users)
  }
}
