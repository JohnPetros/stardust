import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { UseCase } from '#global/interfaces/UseCase'
import type { PlanetsRepository } from '../interfaces/PlanetsRepository'
import type { GalaxiesRepository } from '../interfaces/GalaxiesRepository'
import type { Planet } from '../domain/entities/Planet'
import type { PlanetDto } from '../domain/entities/dtos/PlanetDto'
import type { Broker } from '#global/interfaces/Broker'
import { GalaxyNotFoundError, PlanetNotFoundError } from '../domain/errors'
import { PlanetsOrderChangedEvent } from '../domain/events'
import { ConflictError } from '../../main'

type Request = {
  planetIds: string[]
}

type Response = Promise<PlanetDto[]>

export class ReorderPlanetsUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: PlanetsRepository,
    private readonly galaxiesRepository: GalaxiesRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ planetIds }: Request): Response {
    const galaxy = await this.galaxiesRepository.findFirst()
    if (!galaxy) throw new GalaxyNotFoundError()

    const planets = await this.repository.findAllByGalaxy(galaxy.id)

    if (new Set(planetIds).size !== planetIds.length) {
      throw new ConflictError('Todos os IDs dos planetas devem ser fornecidos e únicos')
    }

    const reorderedPlanets = this.reorder(planets, planetIds)

    await this.repository.replaceMany(reorderedPlanets)
    await this.broker.publish(new PlanetsOrderChangedEvent())
    return reorderedPlanets.map((planet) => planet.dto)
  }

  private reorder(planets: Planet[], planetIds: string[]): Planet[] {
    return planetIds.map((planetId, index) => {
      const planet = planets.find((planet) => planet.id.value === planetId)
      if (!planet) throw new PlanetNotFoundError()

      planet.position = OrdinalNumber.create(index + 1)
      return planet
    })
  }
}
