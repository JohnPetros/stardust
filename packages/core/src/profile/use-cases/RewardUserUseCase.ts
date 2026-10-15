import type { Database } from '#global/interfaces/Database'
import type { UseCase } from '#global/interfaces/index'
import type { Broker } from '#global/interfaces/Broker'
import { Id, Integer } from '#global/domain/structures/index'
import type { User } from '../domain/entities'
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
    private readonly database: Database,
    private readonly repository: UsersRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request) {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction({ userId, newXp, newCoins }: Request) {
    const user = await this.findUser(Id.create(userId))
    const streakStatus = await this.persistReward(user, newXp, newCoins)

    return this.publishReward(this.rewardPayload(user, streakStatus))
  }

  private async findUser(userId: Id) {
    const user = await this.repository.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }

  private rewardPayload(user: User, streak: ReturnType<User['makeTodayStatusDone']>) {
    return {
      userId: user.id.value,
      newXp: user.xp.value,
      newCoins: user.coins.value,
      ...this.progressPayload(user, streak),
    }
  }

  private progressPayload(user: User, streak: ReturnType<User['makeTodayStatusDone']>) {
    return {
      newLevel: user.level.didUp.isTrue ? user.level.value.number.value : null,
      newStreak: streak?.newStreak?.value ?? null,
      newWeekStatus: streak?.newWeekStatus.value ?? null,
    }
  }

  private rewardResult(payload: UserRewardedEvent['payload']) {
    return {
      newLevel: payload.newLevel,
      newStreak: payload.newStreak,
      newWeekStatus: payload.newWeekStatus,
    }
  }
  private async persistReward(user: User, xp: number, coins: number) {
    user.earnXp(Integer.create(xp))
    user.earnCoins(Integer.create(coins))
    const status = user.makeTodayStatusDone()
    await this.repository.replace(user)
    return status
  }
  private async publishReward(payload: UserRewardedEvent['payload']) {
    await this.broker.publish(new UserRewardedEvent(payload))
    return this.rewardResult(payload)
  }
}
