import { Id, Slug } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import type { UserDto } from '../domain/entities/dtos'
import { UserNotFoundError } from '../errors'
import type { UsersRepository } from '../interfaces'

type Request = {
  userId?: string
  userSlug?: string
}

type Response = Promise<UserDto>

export class GetUserUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({ userId, userSlug }: Request) {
    if (userId) {
      const user = await this.repository.findById(Id.create(userId))
      if (!user) {
        throw new UserNotFoundError()
      }
      return user.dto
    }

    if (userSlug) {
      const user = await this.repository.findBySlug(Slug.create(userSlug))
      if (!user) {
        throw new UserNotFoundError()
      }
      return user.dto
    }

    throw new UserNotFoundError()
  }
}
