import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { User } from '../domain/entities'
import { UserNotFoundError } from '../errors'
import type { UsersRepository } from '../interfaces'

export class GetUserUseCase implements UseCase<string, Promise<User>> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) {
      throw new UserNotFoundError()
    }
    return user
  }
}
