import type { UseCase } from '#global/interfaces/UseCase'
import type { PlanetDto } from '../domain/entities/dtos'
import type { PlanetsRepository } from '../interfaces'
import { Planet } from '../domain/entities'
import { PlanetNotFoundError } from '../domain/errors'

type Request = {
  name: string
  image: string
  icon: string
}

type Response = Promise<PlanetDto>

export class CreatePlanetUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: PlanetsRepository) {}

  async execute({ name, image, icon }: Request): Response {
    const lastPlanet = await this.findLastPlanet()
    const planet = Planet.create({
      name,
      icon,
      image,
      isAvailable: false,
      position: lastPlanet?.position.value + 1,
      stars: [],
      completionsCount: 0,
    })
    await this.repository.add(planet)
    return planet.dto
  }

  private async findLastPlanet(): Promise<Planet> {
    const planet = await this.repository.findLastPlanet()
    if (!planet) throw new PlanetNotFoundError()
    return planet
  }
}
