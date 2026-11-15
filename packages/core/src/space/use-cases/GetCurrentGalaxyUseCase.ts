import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { CurrentGalaxyDto } from '../domain/entities/dtos'
import { GalaxyNotFoundError } from '../domain/errors'
import { GalaxyCatalog } from '../domain/structures/GalaxyCatalog'
import type { GalaxiesRepository } from '../interfaces'

type Request = {
  currentGalaxyId: string | null
}

type Response = Promise<CurrentGalaxyDto>

export class GetCurrentGalaxyUseCase implements UseCase<Request, Response> {
  constructor(private readonly galaxiesRepository: GalaxiesRepository) {}

  async execute({ currentGalaxyId }: Request): Response {
    const galaxies = await this.galaxiesRepository.findAll()
    const catalog = GalaxyCatalog.create(galaxies)
    const galaxy = catalog.resolveCurrentGalaxy(
      currentGalaxyId ? Id.create(currentGalaxyId) : null,
    )
    if (!galaxy) throw new GalaxyNotFoundError()

    return {
      galaxy: {
        id: galaxy.id.value,
        slug: galaxy.slug.value,
        name: galaxy.name.value,
      },
      isFirstGalaxy: catalog.firstGalaxy?.id.value === galaxy.id.value,
      hasGalaxyChoice: catalog.hasGalaxyChoice.value,
    }
  }
}
