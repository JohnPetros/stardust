import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import { Challenge } from '../domain/entities'
import type { ChallengeVote } from '../domain/types'
import type { ChallengingService } from '../interfaces'

type Request = {
  challengeId: string
  userId: string
  userChallengeVote: ChallengeVote
}

type Response = Promise<{
  upvotesCount: number
  downvotesCount: number
  userChallengeVote: ChallengeVote
}>

export class VoteChallengeUseCase implements UseCase<Request, Response> {
  constructor(private readonly challengingService: ChallengingService) {}

  async execute({
    challengeId: challengeIdValue,
    userId: userValueId,
    userChallengeVote,
  }: Request) {
    const challengeId = Id.create(challengeIdValue)
    const userId = Id.create(userValueId)
    const challenge = await this.fetchChallenge(challengeId)
    challenge.userVote = await this.fetchCurrentChallengeVote(challengeId, userId)

    if (challenge.userVote && userChallengeVote === challenge.userVote) {
      await this.deleteChallengeVote(challenge.id, userId)
    }

    if (userChallengeVote !== challenge.userVote) {
      if (challenge.userVote)
        await this.updateChallengeVote(challengeId, userId, userChallengeVote)
      else await this.saveChallengeVote(challengeId, userId, userChallengeVote)
    }

    challenge.vote(userChallengeVote)

    return {
      upvotesCount: challenge.upvotesCount.value,
      downvotesCount: challenge.downvotesCount.value,
      userChallengeVote: challenge.userVote,
    }
  }

  private async fetchChallenge(challengeId: Id) {
    const response = await this.challengingService.fetchChallengeById(challengeId)
    if (response.isFailure) response.throwError()
    return Challenge.create(response.body)
  }

  private async saveChallengeVote(
    challengeId: Id,
    userId: Id,
    challengeVote: ChallengeVote,
  ) {
    const response = await this.challengingService.saveChallengeVote(
      challengeId,
      userId,
      challengeVote,
    )
    if (response.isFailure) response.throwError()
  }

  private async updateChallengeVote(
    challengeId: Id,
    userId: Id,
    challengeVote: ChallengeVote,
  ) {
    const response = await this.challengingService.updateChallengeVote(
      challengeId,
      userId,
      challengeVote,
    )
    if (response.isFailure) response.throwError()
  }

  private async deleteChallengeVote(challengeId: Id, userId: Id) {
    const response = await this.challengingService.deleteChallengeVote(
      challengeId,
      userId,
    )
    if (response.isFailure) response.throwError()
  }

  private async fetchCurrentChallengeVote(challengeId: Id, userId: Id) {
    const response = await this.challengingService.fetchChallengeVote(challengeId, userId)
    if (response.isFailure) return null
    return response.body.challengeVote
  }
}
