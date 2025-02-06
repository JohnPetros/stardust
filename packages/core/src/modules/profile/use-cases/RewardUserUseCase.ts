import { User } from '#global/entities'
import type { UserDto } from '#global/dtos'
import type { IProfileService, IUseCase } from '#interfaces'

type Request = {
  userDto: UserDto
  newXp: number
  newCoins: number
}

type Response = Promise<{
  newLevel: number | null
  newStreak: number | null
}>

export class RewardUserUseCase implements IUseCase<Request, Response> {
  constructor(private profileService: IProfileService) {}

  async do({ userDto, newXp, newCoins }: Request) {
    const user = User.create(userDto)
    user.earnXp(newXp)
    user.earnCoins(newCoins)
    const streakStatus = user.makeTodayStatusDone()
    const respose = await this.profileService.updateUser(user)
    if (respose.isFailure) respose.throwError()

    console.log('did level up', user.level.didUp.isTrue)

    return {
      newLevel: user.level.didUp.isTrue ? user.level.value : null,
      newStreak: streakStatus?.newStreak?.value ?? null,
      newWeekStatus: streakStatus?.newWeekStatus.value ?? null,
    }
  }
}
