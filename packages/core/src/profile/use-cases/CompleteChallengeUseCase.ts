import type { Database } from '#global/interfaces/Database'
import { Id } from '#global/domain/structures/Id'
import type { Broker } from '#global/interfaces/Broker'
import type { UseCase } from '#global/interfaces/UseCase'
import type { UserDto } from '../domain/entities/dtos'
import { ChallengeCompletedEvent } from '../domain/events'
import { UserNotFoundError } from '../domain/errors'
import type { User } from '../domain/entities'
import type { UsersRepository } from '../interfaces'

type Request = {
  challengeId: string
  userId: string
}

type Response = Promise<UserDto>

export class CompleteChallengeUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly database: Database,
    private readonly repository: UsersRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request) {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction({ challengeId, userId }: Request) {
    const user = await this.findUser(Id.create(userId))

    const completedChallengeId = Id.create(challengeId)
    await this.persistChallenge(user, completedChallengeId)
    return user.dto
  }
  private async findUser(userId: Id) {
    const user = await this.repository.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }

  private async persistChallenge(user: User, itemId: Id) {
    if (user.hasCompletedChallenge(itemId).isTrue) return
    user.completeChallenge(itemId)
    await this.repository.addCompletedChallenge(itemId, user.id)
    await this.publishCompletion(user.id, itemId)
  }
  private publishCompletion(userId: Id, itemId: Id) {
    return this.broker.publish(
      new ChallengeCompletedEvent({
        userId: userId.value,
        challengeId: itemId.value,
      }),
    )
  }
}
