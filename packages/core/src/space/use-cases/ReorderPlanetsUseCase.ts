import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { UseCase } from '#global/interfaces/UseCase'
import type { PlanetsRepository } from '../interfaces/PlanetsRepository'
import type { Planet } from '../domain/entities/Planet'
import type { PlanetDto } from '../domain/entities/dtos/PlanetDto'
import type { EventBroker } from '#global/interfaces/EventBroker'
import { PlanetNotFoundError } from '../domain/errors'
import { PlanetsOrderChangedEvent } from '../domain/events'

type Request = {
  planetIds: string[]
}

type Response = Promise<PlanetDto[]>

export class ReorderPlanetsUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: PlanetsRepository,
    private readonly broker: EventBroker,
  ) {}

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
    await this.broker.publish(new PlanetsOrderChangedEvent())
    return reorderedPlanets.map((planet) => planet.dto)
  }
}
