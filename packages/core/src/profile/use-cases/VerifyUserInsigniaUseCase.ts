import type { UseCase } from '#global/interfaces/UseCase'
import type { User } from '../domain/entities'
import type { UsersRepository } from '../interfaces'
import { InsigniaRole } from '#global/domain/structures/InsigniaRole'
import { Id } from '#global/domain/structures/Id'
import { InsigniaNotIncludedError, UserNotFoundError } from '../domain/errors'

type Request = {
  userId: string
  insigniaRole: string
}

export class VerifyUserInsigniaUseCase implements UseCase<Request> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({ userId, insigniaRole }: Request) {
    const user = await this.findUser(Id.create(userId))
    const insignia = InsigniaRole.create(insigniaRole)

    if (user.hasInsignia(insignia).isFalse) {
      throw new InsigniaNotIncludedError()
    }
  }

  private async findUser(id: Id): Promise<User> {
    const user = await this.repository.findById(id)
    if (!user) throw new UserNotFoundError()
    return user
  }
}
