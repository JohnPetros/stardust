import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { UserDto } from '../../main'
import { UserNotFoundError } from '../errors'
import type { UsersRepository } from '../interfaces'

type Request = {
  userId: string
}

type Response = Promise<UserDto>

export class GetUserUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({ userId }: Request): Response {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) {
      throw new UserNotFoundError()
    }
    return user.dto
  }
}
