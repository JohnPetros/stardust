import type { IChallengingService, UseCase } from '../../global/interfaces'
import { Challenge } from '../domain/entities'
import type { ChallengeVote } from '../domain/types'

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
  constructor(private readonly challengingService: IChallengingService) {}

  async do({ challengeId, userId, userChallengeVote }: Request) {
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

  private async fetchChallenge(challengeId: string) {
    const response = await this.challengingService.fetchChallengeById(challengeId)
    if (response.isFailure) response.throwError()
    return Challenge.create(response.body)
  }

  private async saveChallengeVote(
    challengeId: string,
    userId: string,
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
    challengeId: string,
    userId: string,
    challengeVote: ChallengeVote,
  ) {
    const response = await this.challengingService.updateChallengeVote(
      challengeId,
      userId,
      challengeVote,
    )
    if (response.isFailure) response.throwError()
  }

  private async deleteChallengeVote(challengeId: string, userId: string) {
    const response = await this.challengingService.deleteChallengeVote(
      challengeId,
      userId,
    )
    if (response.isFailure) response.throwError()
  }

  private async fetchCurrentChallengeVote(challengeId: string, userId: string) {
    const response = await this.challengingService.fetchChallengeVote(challengeId, userId)
    if (response.isFailure) return null
    return response.body.challengeVote
  }
}
