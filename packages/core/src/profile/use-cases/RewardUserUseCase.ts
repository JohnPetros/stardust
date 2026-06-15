import type { UseCase } from '#global/interfaces/index'
import type { Broker } from '#global/interfaces/Broker'
import { Id, Integer } from '#global/domain/structures/index'
import type { UsersRepository } from '../interfaces'
import type { WeekStatusValue } from '../domain/types'
import { UserRewardedEvent } from '../domain/events'
import { UserNotFoundError } from '../domain/errors'

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
  constructor(
    private readonly repository: UsersRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ userId, newXp, newCoins }: Request) {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) throw new UserNotFoundError()
    user.earnXp(Integer.create(newXp))
    user.earnCoins(Integer.create(newCoins))
    const streakStatus = user.makeTodayStatusDone()
    await this.repository.replace(user)

    const payload = {
      userId: user.id.value,
      newXp: user.xp.value,
      newCoins: user.coins.value,
      newLevel: user.level.didUp.isTrue ? user.level.value.number.value : null,
      newStreak: streakStatus?.newStreak?.value ?? null,
      newWeekStatus: streakStatus?.newWeekStatus.value ?? null,
    }

    await this.broker.publish(new UserRewardedEvent(payload))

    return {
      newLevel: payload.newLevel,
      newStreak: payload.newStreak,
      newWeekStatus: payload.newWeekStatus,
    }
  }
}
