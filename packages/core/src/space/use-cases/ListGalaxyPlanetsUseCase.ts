import { Slug } from '#global/domain/structures/Slug'
import type { UseCase } from '#global/interfaces/UseCase'
import type { PlanetDto } from '../domain/entities/dtos'
import { GalaxyNotFoundError } from '../domain/errors'
import type { GalaxiesRepository, PlanetsRepository } from '../interfaces'

type Request = {
  galaxySlug: string
}

type Response = Promise<PlanetDto[]>

export class ListGalaxyPlanetsUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly galaxiesRepository: GalaxiesRepository,
    private readonly planetsRepository: PlanetsRepository,
  ) {}

  async execute({ galaxySlug }: Request): Response {
    const galaxy = await this.galaxiesRepository.findBySlug(Slug.create(galaxySlug))
    if (!galaxy?.canBeEntered.isTrue) throw new GalaxyNotFoundError()

    const planets = await this.planetsRepository.findAllByGalaxy(galaxy.id)
    return planets.map((planet) => planet.dto)
  }
}
