import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { UserDto } from '../domain/entities/dtos'
import { UserNotFoundError } from '../domain/errors'
import type { UsersRepository } from '../interfaces'

type Request = {
  starId: string
  userId: string
}

type Response = Promise<UserDto>

export class UnlockStarUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({ starId, userId }: Request) {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) throw new UserNotFoundError()

    const unlockedStarId = Id.create(starId)
    if (user.hasUnlockedStar(unlockedStarId).isFalse) {
      await this.repository.addUnlockedStar(unlockedStarId, user.id)
      user.unlockStar(unlockedStarId)
    }
    return user.dto
  }
}
