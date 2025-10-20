import type { UseCase } from '#global/interfaces/UseCase'
import type { StarsRepository } from '../interfaces'
import type { StarDto } from '../domain/entities/dtos'
import { Id } from '#global/domain/structures/Id'
import { StarNotFoundError } from '../domain/errors'
import { Logical } from '#global/domain/structures/Logical'

type Request = {
  starId: string
  isChallenge: boolean
}

type Response = Promise<StarDto>

export class EditStarTypeUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: StarsRepository) {}

  async execute({ starId, isChallenge }: Request) {
    const star = await this.repository.findById(Id.create(starId))
    if (!star) throw new StarNotFoundError()
    star.isChallenge = Logical.create(isChallenge, 'A estrela é um desafio?')
    await this.repository.replace(star)
    return star.dto
  }
}
