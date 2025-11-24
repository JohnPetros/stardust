import { Email } from '#global/domain/structures/Email'
import type { UseCase } from '#global/interfaces/UseCase'
import { UserEmailAlreadyInUseError } from '../domain/errors'
import type { UsersRepository } from '../interfaces'

export class VerifyUserEmailInUseUseCase implements UseCase<string, Promise<void>> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(email: string): Promise<void> {
    const user = await this.repository.findByEmail(Email.create(email))
    if (user) {
      throw new UserEmailAlreadyInUseError()
    }
  }
}
