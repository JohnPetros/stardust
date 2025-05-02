import type { UseCase } from '#global/interfaces/index'
import { Integer } from '#global/domain/structures/index'
import type { UserDto } from '../domain/entities/dtos'
import { User } from '../domain/entities'
import type { WeekStatusValue } from '../domain/types'
import type { UsersRepository } from '#profile/interfaces/index'

type Request = {
  userDto: UserDto
  newXp: number
  newCoins: number
}

type Response = Promise<{
  newLevel: number | null
  newStreak: number | null
  newWeekStatus: WeekStatusValue | null
}>

export class _RewardUserUseCase implements UseCase<Request, Response> {
  constructor(private usersRepository: UsersRepository) {}

  async do({ userDto, newXp, newCoins }: Request) {
    const user = User.create(userDto)
    user.earnXp(Integer.create(newXp))
    user.earnCoins(Integer.create(newCoins))
    const streakStatus = user.makeTodayStatusDone()
    await this.usersRepository.update(user)

    return {
      newLevel: user.level.didUp.isTrue ? user.level.value.number.value : null,
      newStreak: streakStatus?.newStreak?.value ?? null,
      newWeekStatus: streakStatus?.newWeekStatus.value ?? null,
    }
  }
}
