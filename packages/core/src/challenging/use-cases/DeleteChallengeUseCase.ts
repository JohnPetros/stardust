import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengesRepository } from '../interfaces'
import { Id } from '#global/domain/structures/index'
import { ChallengeNotFoundError } from '../domain/errors'

type Request = {
  challengeId: string
}

export class DeleteChallengeUseCase implements UseCase<Request> {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute({ challengeId }: Request) {
    const challenge = await this.findChallenge(Id.create(challengeId))
    await this.repository.remove(challenge)
  }

  private async findChallenge(challengeId: Id) {
    const challenge = await this.repository.findById(challengeId)
    if (!challenge) throw new ChallengeNotFoundError()
    return challenge
  }
}
