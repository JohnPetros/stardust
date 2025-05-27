import { Slug } from '#global/domain/structures/Slug'
import type { UseCase } from '#global/interfaces/UseCase'
import type { StarDto } from '../domain/entities/dtos'
import type { StarsRepository } from '../interfaces'
import { StarNotFoundError } from '../domain/errors'

type Request = {
  starSlug: string
}

type Response = Promise<StarDto>

export class GetStarUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: StarsRepository) {}

  async execute({ starSlug }: Request) {
    const star = await this.repository.findBySlug(Slug.create(starSlug))
    if (!star) {
      throw new StarNotFoundError()
    }
    return star.dto
  }
}
