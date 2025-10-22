import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import type { PlanetsRepository } from '../interfaces'
import { PlanetNotFoundError } from '../domain/errors'

type Request = {
  planetId: string
}

type Response = Promise<void>

export class DeletePlanetUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: PlanetsRepository) {}

  async execute({ planetId }: Request): Response {
    const planet = await this.repository.findById(Id.create(planetId))
    if (!planet) throw new PlanetNotFoundError()

    await this.repository.remove(planet.id)
  }
}
