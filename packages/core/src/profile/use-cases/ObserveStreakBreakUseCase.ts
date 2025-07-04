import type { UsersRepository } from '../interfaces'
import type { UseCase } from '#global/interfaces/UseCase'
import type { UserDto } from '../domain/entities/dtos'

type Request = {
  userDto: UserDto
  newXp: number
  newCoins: number
}

export class ObserveStreakBreakUseCase implements UseCase<Request> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute() {
    const users = await this.usersRepository.findAll()
    const usersWithBrokenStreak = []

    for (const user of users) {
      const didUserBreakStreak = user.weekStatus.yesterdayStatus === 'todo'
      if (didUserBreakStreak) {
        user.breakStreak()
        usersWithBrokenStreak.push(user)
      }
    }

    await this.usersRepository.replaceMany(usersWithBrokenStreak)
  }
}
