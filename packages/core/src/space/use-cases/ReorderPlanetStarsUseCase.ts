import type { UseCase } from '#global/interfaces/UseCase'
import type { PlanetsRepository, StarsRepository } from '../interfaces'
import type { Broker } from '#global/interfaces/Broker'
import { ConflictError } from '#global/domain/errors/ConflictError'
import { Id } from '#global/domain/structures/Id'
import { PlanetNotFoundError } from '../domain/errors'
import { StarsOrderChangedEvent } from '../domain/events'

type Request = {
  planetId: string
  starIds: string[]
}

export class ReorderPlanetStarsUseCase implements UseCase<Request> {
  constructor(
    private readonly planetsRepository: PlanetsRepository,
    private readonly starsRepository: StarsRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ planetId, starIds }: Request) {
    const planet = await this.findPlanet(Id.create(planetId))
    if (new Set(starIds).size !== starIds.length) {
      throw new ConflictError('Todos os IDs das estrelas devem ser fornecidos e únicos')
    }
    planet.reorderStars(starIds.map((starId) => Id.create(starId)))
    await this.starsRepository.replaceMany(planet.stars)
    await this.broker.publish(new StarsOrderChangedEvent())
  }

  private async findPlanet(planetId: Id) {
    const planet = await this.planetsRepository.findById(planetId)
    if (!planet) throw new PlanetNotFoundError()
    return planet
  }
}
