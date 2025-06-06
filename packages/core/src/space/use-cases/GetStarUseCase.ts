import { Slug } from '#global/domain/structures/Slug'
import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import type { StarDto } from '../domain/entities/dtos'
import type { StarsRepository } from '../interfaces'
import { StarNotFoundError } from '../domain/errors'

type Request = {
  starId?: string
  starSlug?: string
}

type Response = Promise<StarDto>

export class GetStarUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: StarsRepository) {}

  async execute({ starId, starSlug }: Request) {
    if (starId) {
      const star = await this.repository.findById(Id.create(starId))
      if (!star) {
        throw new StarNotFoundError()
      }
      return star.dto
    }

    if (starSlug) {
      const star = await this.repository.findBySlug(Slug.create(starSlug))
      if (!star) {
        throw new StarNotFoundError()
      }
      return star.dto
    }

    throw new StarNotFoundError()
  }
}
