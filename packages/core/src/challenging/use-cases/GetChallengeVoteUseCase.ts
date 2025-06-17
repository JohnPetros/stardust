import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/index'
import type { ChallengesRepository } from '../interfaces'
import { ChallengeNotFoundError } from '../domain/errors'

type Request = {
  challengeId: string
  userId: string
}

type Response = Promise<{
  challengeVote: string
}>

export class GetChallengeVoteUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute({ challengeId, userId }: Request) {
    const challenge = await this.repository.findById(Id.create(challengeId))
    if (!challenge) throw new ChallengeNotFoundError()

    const challengeVote = await this.repository.findVoteByChallengeAndUser(
      challenge.id,
      Id.create(userId),
    )

    return {
      challengeVote: challengeVote.value,
    }
  }
}
