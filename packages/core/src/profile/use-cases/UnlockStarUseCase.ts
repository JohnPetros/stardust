import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { UserDto } from '../domain/entities/dtos'
import { UserNotFoundError } from '../errors'
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
    user.unlockStar(Id.create(starId))
    await this.repository.addUnlockedStar(Id.create(starId), user.id)
    return user.dto
  }
}
