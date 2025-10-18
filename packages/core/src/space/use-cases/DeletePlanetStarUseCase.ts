import type { UseCase } from '#global/interfaces/UseCase'
import type { PlanetsRepository, StarsRepository } from '../interfaces'
import { Id } from '#global/domain/structures/Id'
import { PlanetNotFoundError } from '../domain/errors'

type Request = {
  planetId: string
  starId: string
}

export class DeletePlanetStarUseCase implements UseCase<Request> {
  constructor(
    private readonly planetsRepository: PlanetsRepository,
    private readonly starsRepository: StarsRepository,
  ) {}

  async execute({ planetId, starId }: Request) {
    const planet = await this.findPlanet(Id.create(planetId))
    planet.removeStar(Id.create(starId))

    await Promise.all([
      this.starsRepository.remove(Id.create(starId)),
      this.starsRepository.replaceMany(planet.stars),
    ])
  }

  private async findPlanet(planetId: Id) {
    const planet = await this.planetsRepository.findById(planetId)
    if (!planet) throw new PlanetNotFoundError()
    return planet
  }
}
