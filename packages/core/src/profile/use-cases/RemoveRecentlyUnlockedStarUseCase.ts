import type { UseCase } from '#global/interfaces/UseCase'
import type { UsersRepository } from '../interfaces'
import { Id } from '#global/domain/structures/Id'
import { UserNotFoundError } from '../errors'

type Request = {
  userId: string
  starId: string
}

type Response = Promise<void>

export class RemoveRecentlyUnlockedStarUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(request: Request): Response {
    const starId = Id.create(request.starId)
    const userId = Id.create(request.userId)
    const user = await this.findUser(userId)

    if (user.hasRecentlyUnlockedStar(starId).isTrue) {
      await this.repository.removeRecentlyUnlockedStar(starId, userId)
    }
  }

  private async findUser(userId: Id) {
    const user = await this.repository.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }
}
