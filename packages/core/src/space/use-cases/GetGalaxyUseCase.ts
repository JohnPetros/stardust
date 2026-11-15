import { Slug } from '#global/domain/structures/Slug'
import type { UseCase } from '#global/interfaces/UseCase'
import type { GalaxyDto } from '../domain/entities/dtos'
import { GalaxyNotEnterableError, GalaxyNotFoundError } from '../domain/errors'
import type { GalaxiesRepository } from '../interfaces'

type Request = {
  galaxySlug: string
  shouldBeEnterable: boolean
}

type Response = Promise<GalaxyDto>

export class GetGalaxyUseCase implements UseCase<Request, Response> {
  constructor(private readonly galaxiesRepository: GalaxiesRepository) {}

  async execute({ galaxySlug, shouldBeEnterable }: Request): Response {
    const galaxy = await this.galaxiesRepository.findBySlug(Slug.create(galaxySlug))
    if (!galaxy?.isVisible.isTrue) throw new GalaxyNotFoundError()
    if (shouldBeEnterable && !galaxy.canBeEntered.isTrue)
      throw new GalaxyNotEnterableError()

    return galaxy.dto
  }
}
