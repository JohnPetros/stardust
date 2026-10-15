import type { Database } from '#global/interfaces/Database'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { UseCase } from '#global/interfaces/UseCase'
import type { PlanetsRepository } from '../interfaces/PlanetsRepository'
import type { Planet } from '../domain/entities/Planet'
import type { PlanetDto } from '../domain/entities/dtos/PlanetDto'
import type { Broker } from '#global/interfaces/Broker'
import { PlanetNotFoundError } from '../domain/errors'
import { PlanetsOrderChangedEvent } from '../domain/events'
import { ConflictError } from '../../main'

type Request = {
  planetIds: string[]
}

type Response = Promise<PlanetDto[]>

export class ReorderPlanetsUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly database: Database,
    private readonly repository: PlanetsRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request): Response {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction({ planetIds }: Request): Response {
    const planets = await this.repository.findAll()
    const reorderedPlanets = this.orderPlanets(planets, planetIds)
    await this.repository.replaceMany(reorderedPlanets)
    await this.broker.publish(new PlanetsOrderChangedEvent())
    return reorderedPlanets.map((planet) => planet.dto)
  }
  private orderPlanets(planets: Planet[], planetIds: string[]) {
    this.validateUniqueIds(planetIds)
    return planetIds.map((planetId, index) =>
      this.positionPlanet(planets, planetId, index),
    )
  }

  private validateUniqueIds(planetIds: string[]) {
    if (new Set(planetIds).size !== planetIds.length) {
      throw new ConflictError('Todos os IDs dos planetas devem ser fornecidos e únicos')
    }
  }

  private positionPlanet(planets: Planet[], planetId: string, index: number) {
    const planet = planets.find((planet) => planet.id.value === planetId)
    if (!planet) throw new PlanetNotFoundError()
    planet.position = OrdinalNumber.create(index + 1)
    return planet
  }
}
