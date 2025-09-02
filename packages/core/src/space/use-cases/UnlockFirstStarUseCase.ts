import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { EventBroker } from '#global/interfaces/EventBroker'
import type { UseCase } from '#global/interfaces/UseCase'
import { PlanetNotFoundError } from '../domain/errors'
import { FirstStarUnlockedEvent } from '../domain/events'
import type { PlanetsRepository } from '../interfaces'

type Request = {
  userId: string
  userName: string
  userEmail: string
}

type Response = Promise<void>

export class UnlockFirstStarUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: PlanetsRepository,
    private readonly eventBroker: EventBroker,
  ) {}

  async execute(request: Request) {
    const firstPlanet = await this.repository.findByPosition(OrdinalNumber.create(1))
    if (!firstPlanet) {
      throw new PlanetNotFoundError()
    }

    const event = new FirstStarUnlockedEvent({
      user: {
        id: request.userId,
        name: request.userName,
        email: request.userEmail,
      },
      firstStarId: firstPlanet.firstStar.id.value,
    })
    await this.eventBroker.publish(event)
  }
}
