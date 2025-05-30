import { Email } from '#global/domain/structures/Email'
import type { UseCase } from '#global/interfaces/UseCase'
import { UserEmailAlreadyInUseError } from '../errors'
import type { UsersRepository } from '../interfaces'

export class VerifyUserEmailInUseUseCase implements UseCase<string, Promise<void>> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(email: string): Promise<void> {
    const isEmailInUse = await this.repository.containsWithEmail(Email.create(email))
    if (isEmailInUse.isTrue) {
      throw new UserEmailAlreadyInUseError()
    }
  }
}
