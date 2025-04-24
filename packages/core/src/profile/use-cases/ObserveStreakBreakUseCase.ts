import { User } from '#global/entities'
import type { UserDto } from '#global/dtos'
import type { UseCase } from '#global/interfaces'
import type { ProfileService } from '#profile/interfaces'

type Request = {
  userDto: UserDto
  newXp: number
  newCoins: number
}

export class ObserveStreakBreakUseCase implements UseCase<Request> {
  constructor(private profileService: ProfileService) {}

  async do() {
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
