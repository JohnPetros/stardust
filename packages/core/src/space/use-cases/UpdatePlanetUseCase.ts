import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { Name } from '#global/domain/structures/Name'
import { Image } from '#global/domain/structures/Image'
import type { PlanetsRepository } from '../interfaces'
import type { PlanetDto } from '../domain/entities/dtos'
import { PlanetNotFoundError } from '../domain/errors'

type Request = {
  planetId: string
  name?: string
  icon?: string
  image?: string
}

type Response = Promise<PlanetDto>

export class UpdatePlanetUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: PlanetsRepository) {}

  async execute({ planetId, name, icon, image }: Request): Response {
    const planet = await this.repository.findById(Id.create(planetId))
    if (!planet) throw new PlanetNotFoundError()

    if (typeof name !== 'undefined') {
      planet.name = Name.create(name)
    }

    if (typeof icon !== 'undefined') {
      planet.icon = Image.create(icon)
    }

    if (typeof image !== 'undefined') {
      planet.image = Image.create(image)
    }

    await this.repository.replace(planet)
    return planet.dto
  }
}
