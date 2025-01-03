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
}>

export class RewardUserUseCase implements IUseCase<Request, Response> {
  constructor(private profileService: IProfileService) {}

  async do({ userDto, newXp, newCoins }: Request) {
    const user = User.create(userDto)
    user.earnXp(newXp)
    user.earnCoins(newCoins)
    const respose = await this.profileService.updateUser(user)
    if (respose.isFailure) respose.throwError()

    return {
      newLevel: user.level.didUp.isTrue ? user.level.value : null,
    }
  }
}
