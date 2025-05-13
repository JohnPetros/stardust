import type { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import { User } from '../domain/entities'
import type { UserDto } from '../domain/entities/dtos'
import { UserNotFoundError } from '../errors'
import type { UsersRepository } from '../interfaces'

export class UpdateUserUseCase implements UseCase<UserDto, Promise<User>> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(userDto: UserDto): Promise<User> {
    const user = User.create(userDto)
    await this.findUser(user.id)
    await this.repository.replace(user)
    return user
  }

  private async findUser(id: Id): Promise<void> {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new UserNotFoundError()
    }
  }
}
