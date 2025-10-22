import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import type { PlanetsRepository } from '../interfaces'
import { Planet } from '../domain/entities'
import { PlanetNotFoundError } from '../domain/errors'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'

type Request = {
  planetIds: string[]
}

type Response = Promise<void>

export class ReorderPlanetsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: PlanetsRepository) {}

  async execute({ planetIds }: Request): Response {
    const planets = await this.repository.findAll()
    const reorderedPlanets: Planet[] = []

    for (let number = 1; number <= planetIds.length; number++) {
      const planetId = planetIds[number - 1]
      const planet = planets.find((planet) => planet.id.value === planetId)
      if (!planet) throw new PlanetNotFoundError()

      planet.position = OrdinalNumber.create(number)
      reorderedPlanets.push(planet)
    }

    await this.repository.replaceMany(reorderedPlanets)
  }
}
