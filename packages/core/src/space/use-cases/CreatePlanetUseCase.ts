import type { UseCase } from '#global/interfaces/UseCase'
import type { PlanetDto } from '../domain/entities/dtos'
import type { PlanetsRepository } from '../interfaces'
import { Planet } from '../domain/entities'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'

type Request = {
  name: string
  image: string
  icon: string
}

type Response = Promise<PlanetDto>

export class CreatePlanetUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: PlanetsRepository) {}

  async execute({ name, image, icon }: Request): Response {
    const lastPlanetPosition = await this.findLastPlanetPosition()
    const planet = Planet.create({
      name,
      icon,
      image,
      isAvailable: false,
      position: lastPlanetPosition.value,
      stars: [],
      completionCount: 0,
      userCount: 0,
    })
    await this.repository.add(planet)
    return planet.dto
  }

  private async findLastPlanetPosition(): Promise<OrdinalNumber> {
    const planet = await this.repository.findLastPlanet()
    if (!planet) return OrdinalNumber.create(1)
    return planet.position.increment()
  }
}
