import { Name } from '#global/domain/structures/Name'
import type { UseCase } from '#global/interfaces/UseCase'
import { UserNameAlreadyInUseError } from '../errors'
import type { UsersRepository } from '../interfaces'

export class VerifyUserNameInUseUseCase implements UseCase<string, Promise<void>> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(name: string): Promise<void> {
    const isNameInUse = await this.repository.findByName(Name.create(name))
    if (isNameInUse.isTrue) {
      throw new UserNameAlreadyInUseError()
    }
  }
}
