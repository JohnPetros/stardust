import { Id } from '#global/domain/structures/Id'
import type { Broker } from '#global/interfaces/Broker'
import type { UseCase } from '#global/interfaces/UseCase'
import { PlanetCompletedEvent } from '#space/domain/events/PlanetCompletedEvent'
import { UserNotFoundError } from '../domain/errors'
import type { UsersRepository } from '../interfaces'

type Request = {
  userId: string
  starId: string
  completedPlanetName: string | null
}

export class CompleteStarUseCase implements UseCase<Request, Promise<void>> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ userId, starId, completedPlanetName }: Request) {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) throw new UserNotFoundError()

    const completedStarId = Id.create(starId)
    if (user.hasCompletedStar(completedStarId).isTrue) return

    await this.repository.addCompletedStar(completedStarId, user.id)
    user.completeStar(completedStarId)

    if (completedPlanetName === null) return
    await this.broker.publish(
      new PlanetCompletedEvent({
        userName: user.name.value,
        userSlug: user.slug.value,
        planetName: completedPlanetName,
      }),
    )
  }
}
