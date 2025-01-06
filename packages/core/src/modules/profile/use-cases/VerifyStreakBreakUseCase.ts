import { User } from '#global/entities'
import type { UserDto } from '#global/dtos'
import type { IProfileService, IUseCase } from '#interfaces'

type Request = {
  userDto: UserDto
  newXp: number
  newCoins: number
}

export class VerifyStreakBreakUseCase implements IUseCase<Request> {
  constructor(private profileService: IProfileService) {}

  async do() {
    const users = await this.fetchUsers()
    const promises = []

    for (const user of users) {
      const didUserBreakStreak = user.weekStatus.todayStatus === 'todo'
      if (didUserBreakStreak) {
        user.breakStreak()
        promises.push(this.profileService.updateUser(user))
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
