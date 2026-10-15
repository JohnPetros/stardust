import type { Database } from '#global/interfaces/Database'
import type { UseCase } from '#global/interfaces/UseCase'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import type { Broker } from '#global/interfaces/Broker'
import { Id } from '#global/domain/structures/Id'
import { SpaceCompletedEvent } from '#space/domain/events/SpaceCompletedEvent'
import type { User } from '../domain/entities'
import { UserNotFoundError } from '../domain/errors'

type Request = {
  userId: string
  nextStarId: string | null
}

export class CompleteSpaceUseCase implements UseCase<Request, void> {
  constructor(
    private readonly database: Database,
    private readonly repository: UsersRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request): Promise<void> {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction(request: Request): Promise<void> {
    const user = await this.findUser(Id.create(request.userId))

    if (request.nextStarId === null && user.hasCompletedSpace.isFalse) {
      await this.completeSpace(user)
    }
  }

  private async completeSpace(user: User) {
    user.completeSpace()
    await this.repository.replace(user)
    await this.publishCompletion(user)
  }

  private async findUser(userId: Id) {
    const user = await this.repository.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }
  private publishCompletion(user: User) {
    return this.broker.publish(
      new SpaceCompletedEvent({
        userSlug: user.slug.value,
        userName: user.name.value,
      }),
    )
  }
}
