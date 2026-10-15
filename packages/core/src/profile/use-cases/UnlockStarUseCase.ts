import type { Database } from '#global/interfaces/Database'
import { Id } from '#global/domain/structures/Id'
import type { Broker } from '#global/interfaces/Broker'
import type { UseCase } from '#global/interfaces/UseCase'
import type { UserDto } from '../domain/entities/dtos'
import { StarUnlockedEvent } from '../domain/events'
import { UserNotFoundError } from '../domain/errors'
import type { User } from '../domain/entities'
import type { UsersRepository } from '../interfaces'

type Request = {
  starId: string
  userId: string
}

type Response = Promise<UserDto>

export class UnlockStarUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly database: Database,
    private readonly repository: UsersRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request) {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction({ starId, userId }: Request) {
    const user = await this.findUser(Id.create(userId))

    const unlockedStarId = Id.create(starId)
    await this.persistStar(user, unlockedStarId)
    return user.dto
  }
  private async findUser(userId: Id) {
    const user = await this.repository.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }

  private async persistStar(user: User, itemId: Id) {
    if (user.hasUnlockedStar(itemId).isTrue) return
    await this.repository.addUnlockedStar(itemId, user.id)
    user.unlockStar(itemId)
    await this.publishCompletion(user.id, itemId)
  }
  private publishCompletion(userId: Id, itemId: Id) {
    return this.broker.publish(
      new StarUnlockedEvent({
        userId: userId.value,
        starId: itemId.value,
      }),
    )
  }
}
