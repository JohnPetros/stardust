import type { UseCase } from '#global/interfaces/UseCase'
import type { StarsRepository } from '../interfaces'
import type { StarDto } from '../domain/entities/dtos'
import { Id } from '#global/domain/structures/Id'
import { StarNotFoundError } from '../domain/errors'
import { Logical } from '#global/domain/structures/Logical'

type Request = {
  starId: string
  isAvailable: boolean
}

type Response = Promise<StarDto>

export class EditStarAvailabilityUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: StarsRepository) {}

  async execute({ starId, isAvailable }: Request): Response {
    const star = await this.repository.findById(Id.create(starId))
    if (!star) throw new StarNotFoundError()
    star.isAvailable = Logical.create(
      isAvailable,
      'A estrela está disponível para os usuários?',
    )
    await this.repository.replace(star)
    return star.dto
  }
}
