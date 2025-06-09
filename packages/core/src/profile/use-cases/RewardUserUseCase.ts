import type { UseCase } from '#global/interfaces/index'
import { Id, Integer } from '#global/domain/structures/index'
import type { UsersRepository } from '../interfaces'
import type { WeekStatusValue } from '../domain/types'
import { UserNotFoundError } from '../errors'

type Request = {
  userId: string
  newXp: number
  newCoins: number
}

type Response = Promise<{
  newLevel: number | null
  newStreak: number | null
  newWeekStatus: WeekStatusValue | null
}>

export class RewardUserUseCase implements UseCase<Request, Response> {
  constructor(private repository: UsersRepository) {}

  async execute({ userId, newXp, newCoins }: Request) {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) throw new UserNotFoundError()
    user.earnXp(Integer.create(newXp))
    user.earnCoins(Integer.create(newCoins))
    const streakStatus = user.makeTodayStatusDone()
    await this.repository.replace(user)

    return {
      newLevel: user.level.didUp.isTrue ? user.level.value.number.value : null,
      newStreak: streakStatus?.newStreak?.value ?? null,
      newWeekStatus: streakStatus?.newWeekStatus.value ?? null,
    }
  }
}
