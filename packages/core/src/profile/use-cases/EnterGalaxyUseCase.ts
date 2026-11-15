import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { UserDto } from '../domain/entities/dtos'
import type { GalaxyAggregateDto } from '../domain/aggregates/dtos'
import { GalaxyAggregate } from '../domain/aggregates'
import { UserNotFoundError } from '../domain/errors'
import type { UsersRepository } from '../interfaces'

type Request = {
  userId: string
  galaxy: GalaxyAggregateDto
}

type Response = Promise<UserDto>

export class EnterGalaxyUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({ userId, galaxy }: Request): Response {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) throw new UserNotFoundError()

    const galaxyAggregate = GalaxyAggregate.create(galaxy)
    if (user.isInGalaxy(galaxyAggregate.id).isTrue) return user.dto

    user.enterGalaxy(galaxyAggregate)
    await this.repository.replace(user)
    return user.dto
  }
}
