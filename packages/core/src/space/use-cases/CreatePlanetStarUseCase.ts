import type { StarDto } from '@stardust/core/space/entities/dtos'
import type { PlanetsRepository, StarsRepository } from '@stardust/core/space/interfaces'
import type { UseCase } from '@stardust/core/global/interfaces'
import { PlanetNotFoundError } from '@stardust/core/space/errors'
import { Id } from '@stardust/core/global/structures'

type Request = {
  planetId: string
}

type Response = Promise<StarDto>

export class CreatePlanetStarUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly planetsRepository: PlanetsRepository,
    private readonly starsRepository: StarsRepository,
  ) {}

  async execute({ planetId }: Request) {
    const planet = await this.findPlanet(Id.create(planetId))
    planet.addStar()
    await this.starsRepository.add(planet.lastStar, planet.id)
    return planet.lastStar.dto
  }

  private async findPlanet(planetId: Id) {
    const planet = await this.planetsRepository.findById(planetId)
    if (!planet) throw new PlanetNotFoundError()
    return planet
  }
}
