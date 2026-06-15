import { Id } from '#global/domain/structures/Id'
import type { Broker } from '#global/interfaces/Broker'
import type { UseCase } from '#global/interfaces/UseCase'
import type { UserDto } from '../domain/entities/dtos'
import { ChallengeCompletedEvent } from '../domain/events'
import { UserNotFoundError } from '../domain/errors'
import type { UsersRepository } from '../interfaces'

type Request = {
  challengeId: string
  userId: string
}

type Response = Promise<UserDto>

export class CompleteChallengeUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ challengeId, userId }: Request) {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) throw new UserNotFoundError()

    const completedChallengeId = Id.create(challengeId)
    if (user.hasCompletedChallenge(completedChallengeId).isFalse) {
      user.completeChallenge(completedChallengeId)
      await this.repository.addCompletedChallenge(completedChallengeId, user.id)
      await this.broker.publish(
        new ChallengeCompletedEvent({
          userId: user.id.value,
          challengeId: completedChallengeId.value,
        }),
      )
    }

    return user.dto
  }
}
