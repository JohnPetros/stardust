import type { ChallengingService } from '../interfaces'
import type { UseCase } from '#global/interfaces/UseCase'
import type { ChallengeDto } from '../domain/entities/dtos'
import { Challenge } from '../domain/entities'

type Request = {
  challengeDto: ChallengeDto
}

type Response = Promise<ChallengeDto>

export class PostChallengeUseCase implements UseCase<Request, Response> {
  constructor(private readonly challengingService: ChallengingService) {}

  async execute({ challengeDto }: Request) {
    const challenge = Challenge.create(challengeDto)
    await this.fetchChallenge(challenge.slug.value)
    await this.saveChallenge(challenge)
    await this.saveChallengeCategories(challenge)
    return challenge.dto
  }

  private async fetchChallenge(challengeSlug: string) {
    const response = await this.challengingService.fetchChallengeBySlug(challengeSlug)
    if (response.isSuccessful) response.throwError()
  }

  private async saveChallenge(challenge: Challenge) {
    const response = await this.challengingService.saveChallenge(challenge)
    if (response.isFailure) response.throwError()
  }

  private async saveChallengeCategories(challenge: Challenge) {
    const response = await this.challengingService.saveChallengeCategories(
      challenge.id,
      challenge.categories,
    )
    if (response.isFailure) response.throwError()
  }
}
