import { Name } from '#global/domain/structures/Name'
import type { UseCase } from '#global/interfaces/UseCase'
import { UserNameAlreadyInUseError } from '../errors'
import type { UsersRepository } from '../interfaces'

export class VerifyUserNameInUseUseCase implements UseCase<string, Promise<void>> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(name: string): Promise<void> {
    const user = await this.repository.containsWithName(Name.create(name))
    if (user) {
      throw new UserNameAlreadyInUseError()
    }
  }
}
