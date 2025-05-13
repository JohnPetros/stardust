import type { ProfileService } from '../interfaces'
import type { UseCase } from '#global/interfaces/UseCase'
import type { UserDto } from '../domain/entities/dtos'
import { User } from '../domain/entities'

type Request = {
  userDto: UserDto
  newXp: number
  newCoins: number
}

export class ObserveStreakBreakUseCase implements UseCase<Request> {
  constructor(private profileService: ProfileService) {}

  async execute() {
    const users = await this.fetchUsers()
    const promises = []

    for (const user of users) {
      const didUserBreakStreak = user.weekStatus.yesterdayStatus === 'todo'
      if (didUserBreakStreak) {
        user.breakStreak()
        promises.push(this.updateUser(user))
      }
    }

    await Promise.all(promises)
  }

  private async fetchUsers() {
    const response = await this.profileService.fetchUsers()
    if (response.isFailure) response.throwError()
    return response.body.map(User.create)
  }

  private async updateUser(user: User) {
    const response = await this.profileService.updateUser(user)
    if (response.isFailure) response.throwError()
  }
}
