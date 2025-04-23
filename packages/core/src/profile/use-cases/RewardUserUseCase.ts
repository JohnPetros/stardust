import { Integer } from '#global/structures'
import { User } from '../../global/domain/entities'
import type { UserDto } from '../../global/dtos'
import type { IProfileService, IUseCase } from '../../global/interfaces'

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
