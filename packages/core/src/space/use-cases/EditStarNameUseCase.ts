import type { UseCase } from '#global/interfaces/UseCase'
import type { StarsRepository } from '../interfaces'
import type { StarDto } from '../domain/entities/dtos'
import { Id } from '#global/domain/structures/Id'
import { StarNotFoundError } from '../domain/errors'
import { Name } from '#global/domain/structures/Name'

type Request = {
  starId: string
  name: string
}

type Response = Promise<StarDto>

export class EditStarNameUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: StarsRepository) {}

  async execute({ starId, name }: Request) {
    const star = await this.repository.findById(Id.create(starId))
    if (!star) throw new StarNotFoundError()
    star.name = Name.create(name)
    await this.repository.replace(star)
    return star.dto
  }
}
