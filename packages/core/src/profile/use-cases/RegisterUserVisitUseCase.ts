import type { UseCase } from '#global/interfaces/UseCase'
import type { UsersRepository } from '../interfaces'
import { Id } from '#global/domain/structures/Id'
import { Platform } from '#profile/domain/structures/Platform'
import { UserNotFoundError } from '../domain/errors'

type Request = {
  userId: string
  platform: string
}

export class RegisterUserVisitUseCase implements UseCase<Request, Promise<void>> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({ userId, platform }: Request): Promise<void> {
    const user = await this.findUser(Id.create(userId))
    const visit = user.registerVisit(Platform.create(platform))
    const hasVisit = await this.repository.hasVisit(visit)
    if (hasVisit.isFalse) await this.repository.addVisit(visit)
  }

  private async findUser(userId: Id) {
    const user = await this.repository.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }
}
