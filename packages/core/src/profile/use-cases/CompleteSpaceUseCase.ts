import type { UseCase } from '#global/interfaces/UseCase'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import type { EventBroker } from '#global/interfaces/EventBroker'
import { Id } from '#global/domain/structures/Id'
import { SpaceCompletedEvent } from '#space/domain/events/SpaceCompletedEvent'
import { UserNotFoundError } from '../domain/errors'

type Request = {
  userId: string
  nextStarId: string | null
}

export class CompleteSpaceUseCase implements UseCase<Request, void> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly broker: EventBroker,
  ) {}

  async execute(request: Request): Promise<void> {
    const user = await this.findUser(Id.create(request.userId))

    const isLastSpaceStar = request.nextStarId === null

    if (isLastSpaceStar && user.hasCompletedSpace.isFalse) {
      user.completeSpace()
      await this.repository.replace(user)

      const event = new SpaceCompletedEvent({
        userSlug: user.slug.value,
        userName: user.name.value,
      })
      await this.broker.publish(event)
    }
  }

  private async findUser(userId: Id) {
    const user = await this.repository.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }
}
