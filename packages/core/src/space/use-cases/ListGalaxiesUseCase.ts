import { IdsList } from '#global/domain/structures/IdsList'
import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { GalaxySummaryDto } from '../domain/entities/dtos'
import { GalaxyCatalog } from '../domain/structures/GalaxyCatalog'
import type { GalaxiesRepository } from '../interfaces'

type Request = {
  currentGalaxyId: string | null
  completedPlanetsIds: string[]
}

type Response = Promise<GalaxySummaryDto[]>

export class ListGalaxiesUseCase implements UseCase<Request, Response> {
  constructor(private readonly galaxiesRepository: GalaxiesRepository) {}

  async execute({ currentGalaxyId, completedPlanetsIds }: Request): Response {
    const galaxies = await this.galaxiesRepository.findAll()
    const catalog = GalaxyCatalog.create(galaxies)
    const currentGalaxy = catalog.resolveCurrentGalaxy(
      currentGalaxyId ? Id.create(currentGalaxyId) : null,
    )
    const completedIds = IdsList.create(completedPlanetsIds)

    return catalog.visibleGalaxies.map((galaxy) => {
      const isPublished = galaxy.canBeEntered.isTrue
      return {
        id: galaxy.id.value,
        slug: galaxy.slug.value,
        name: galaxy.name.value,
        description: galaxy.description.value,
        animation: galaxy.animation.value,
        position: galaxy.position.value,
        status: isPublished ? 'published' : 'announced',
        planetsCount: isPublished ? galaxy.planetsCount.value : null,
        completedPlanetsCount: isPublished
          ? galaxy.countCompletedPlanets(completedIds).value
          : null,
        isCurrent: currentGalaxy?.id.value === galaxy.id.value,
      }
    })
  }
}
