import { Integer } from '#global/structures'
import { User } from '#global/entities'
import type { UserDto } from '#global/dtos'
import type { UseCase } from '#global/interfaces'
import type { ProfileService } from '#profile/interfaces'

type Request = {
  userDto: UserDto
  newXp: number
  newCoins: number
}

type Response = Promise<{
  newLevel: number | null
  newStreak: number | null
}>

export class RewardUserUseCase implements UseCase<Request, Response> {
  constructor(private profileService: ProfileService) {}

  async do({ userDto, newXp, newCoins }: Request) {
    const user = User.create(userDto)
    user.earnXp(Integer.create(newXp))
    user.earnCoins(Integer.create(newCoins))
    const streakStatus = user.makeTodayStatusDone()
    const respose = await this.profileService.updateUser(user)
    if (respose.isFailure) respose.throwError()

    return {
      newLevel: user.level.didUp.isTrue ? user.level.value : null,
      newStreak: streakStatus?.newStreak?.value ?? null,
      newWeekStatus: streakStatus?.newWeekStatus.value ?? null,
    }
  }
}
