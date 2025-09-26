import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { UserDto } from '../domain/entities/dtos'
import { UserNotFoundError } from '../errors'
import type { UsersRepository } from '../interfaces'

type Request = {
  challengeId: string
  userId: string
}

type Response = Promise<UserDto>

export class CompleteChallengeUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({ challengeId, userId }: Request) {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) throw new UserNotFoundError()

    const completedChallengeId = Id.create(challengeId)
    if (user.hasCompletedChallenge(completedChallengeId).isFalse) {
      user.completeChallenge(completedChallengeId)
      await this.repository.addCompletedChallenge(completedChallengeId, user.id)
    }

    return user.dto
  }
}
