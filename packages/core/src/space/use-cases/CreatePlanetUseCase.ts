import type { UseCase } from '#global/interfaces/UseCase'
import type { PlanetDto } from '../domain/entities/dtos'
import type { GalaxiesRepository, PlanetsRepository } from '../interfaces'
import { Planet } from '../domain/entities'
import { GalaxyNotFoundError } from '../domain/errors'
import type { Id } from '#global/domain/structures/Id'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'

type Request = {
  name: string
  image: string
}

type Response = Promise<PlanetDto>

export class CreatePlanetUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: PlanetsRepository,
    private readonly galaxiesRepository: GalaxiesRepository,
  ) {}

  async execute({ name, image }: Request): Response {
    const galaxy = await this.galaxiesRepository.findFirst()
    if (!galaxy) throw new GalaxyNotFoundError()

    const lastPlanetPosition = await this.findLastPlanetPosition(galaxy.id)
    const planet = Planet.create({
      name,
      image,
      isAvailable: false,
      galaxyId: galaxy.id.value,
      position: lastPlanetPosition.value,
      stars: [],
      completionCount: 0,
      userCount: 0,
    })
    await this.repository.add(planet)
    return planet.dto
  }

  private async findLastPlanetPosition(galaxyId: Id): Promise<OrdinalNumber> {
    const planet = await this.repository.findLastPlanet(galaxyId)
    if (!planet) return OrdinalNumber.create(1)
    return planet.position.increment()
  }
}
