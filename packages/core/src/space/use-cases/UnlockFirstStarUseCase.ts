import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { Broker } from '#global/interfaces/Broker'
import type { UseCase } from '#global/interfaces/UseCase'
import { PlanetNotFoundError } from '../domain/errors'
import { FirstStarUnlockedEvent } from '../domain/events'
import type { GalaxiesRepository, PlanetsRepository } from '../interfaces'

type Request = {
  userId: string
  userName: string
  userEmail: string
}

type Response = Promise<void>

export class UnlockFirstStarUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly planetsRepository: PlanetsRepository,
    private readonly galaxiesRepository: GalaxiesRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request) {
    const firstGalaxy = await this.galaxiesRepository.findFirst()
    if (!firstGalaxy) throw new PlanetNotFoundError()

    const firstPlanet = await this.planetsRepository.findByPosition(
      OrdinalNumber.create(1),
      firstGalaxy.id,
    )
    if (!firstPlanet) throw new PlanetNotFoundError()

    const event = new FirstStarUnlockedEvent({
      user: {
        id: request.userId,
        name: request.userName,
        email: request.userEmail,
      },
      firstUnlockedStarId: firstPlanet.firstStar.id.value,
    })
    await this.broker.publish(event)
  }
}
