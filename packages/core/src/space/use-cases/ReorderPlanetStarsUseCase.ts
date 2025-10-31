import type { UseCase } from '#global/interfaces/UseCase'
import type { PlanetsRepository, StarsRepository } from '../interfaces'
import type { EventBroker } from '#global/interfaces/EventBroker'
import { Id } from '#global/domain/structures/Id'
import { PlanetNotFoundError } from '../domain/errors'
import { PlanetsOrderChangedEvent } from '../domain/events'

type Request = {
  planetId: string
  starIds: string[]
}

export class ReorderPlanetStarsUseCase implements UseCase<Request> {
  constructor(
    private readonly planetsRepository: PlanetsRepository,
    private readonly starsRepository: StarsRepository,
    private readonly broker: EventBroker,
  ) {}

  async execute({ planetId, starIds }: Request) {
    const planet = await this.findPlanet(Id.create(planetId))
    planet.reorderStars(starIds.map((starId) => Id.create(starId)))
    await this.starsRepository.replaceMany(planet.stars)
    await this.broker.publish(new PlanetsOrderChangedEvent())
  }

  private async findPlanet(planetId: Id) {
    const planet = await this.planetsRepository.findById(planetId)
    if (!planet) throw new PlanetNotFoundError()
    return planet
  }
}
