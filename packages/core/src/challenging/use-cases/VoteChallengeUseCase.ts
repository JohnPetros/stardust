import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import { ChallengeNotFoundError } from '../domain/errors'
import { ChallengeVote } from '../domain/structures'
import type { ChallengesRepository } from '../interfaces'

type Request = {
  challengeId: string
  userId: string
  challengeVote: string
}

type Response = Promise<{
  upvotesCount: number
  downvotesCount: number
  userChallengeVote: string
}>

export class VoteChallengeUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute({ userId: userValueId, challengeId, challengeVote }: Request) {
    const userId = Id.create(userValueId)
    const userChallengeVote = ChallengeVote.create(challengeVote)
    const challenge = await this.findChallenge(Id.create(challengeId))
    challenge.userVote = await this.repository.findVoteByChallengeAndUser(
      challenge.id,
      userId,
    )

    if (challenge.isVoted.and(userChallengeVote.isEqualTo(challenge.userVote)).isTrue) {
      await this.repository.removeVote(challenge.id, userId)
    }

    if (userChallengeVote.isEqualTo(challenge.userVote).isFalse) {
      if (challenge.isVoted.isTrue) {
        await this.repository.replaceVote(challenge.id, userId, userChallengeVote)
      } else await this.repository.addVote(challenge.id, userId, userChallengeVote)
    }

    challenge.vote(userChallengeVote)

    return {
      upvotesCount: challenge.upvotesCount.value,
      downvotesCount: challenge.downvotesCount.value,
      userChallengeVote: challenge.userVote.value,
    }
  }

  private async findChallenge(challengeId: Id) {
    const challenge = await this.repository.findById(challengeId)
    if (!challenge) throw new ChallengeNotFoundError()
    return challenge
  }
}
