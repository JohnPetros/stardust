import type { ChallengeDto } from '../domain/entities/dtos'
import type { ChallengingService } from '../interfaces'
import type { UseCase } from '#global/interfaces/UseCase'
import type { Id, Slug } from '#global/domain/structures/index'
import { Challenge } from '../domain/entities'

type Request = {
  challengeDto: ChallengeDto
}

type Response = Promise<ChallengeDto>

export class EditChallengeUseCase implements UseCase<Request, Response> {
  constructor(private readonly challengingService: ChallengingService) {}

  async execute({ challengeDto }: Request) {
    const challenge = Challenge.create(challengeDto)
    await this.fetchChallengeById(challenge.id)

    if (challenge.title.value !== challengeDto.title) {
      await this.fetchChallengeBySlug(challenge.slug)
    }

    await this.deleteChallengeCategories(challenge.id)
    await Promise.all([
      this.saveChallengeCategories(challenge),
      this.updateChallenge(challenge),
    ])
    return challenge.dto
  }

  private async updateChallenge(challenge: Challenge) {
    const response = await this.challengingService.updateChallenge(challenge)
    if (response.isFailure) response.throwError()
  }

  private async fetchChallengeById(challengeId: Id) {
    const response = await this.challengingService.fetchChallengeById(challengeId)
    if (response.isFailure) response.throwError()
  }

  private async fetchChallengeBySlug(challengeSlug: Slug) {
    const response = await this.challengingService.fetchChallengeBySlug(challengeSlug)
    if (response.isSuccessful) response.throwError()
  }

  private async saveChallengeCategories(challenge: Challenge) {
    const response = await this.challengingService.saveChallengeCategories(
      challenge.id,
      challenge.categories,
    )
    if (response.isFailure) response.throwError()
  }

  private async deleteChallengeCategories(challengeId: Id) {
    const response = await this.challengingService.deleteChallengeCategories(challengeId)
    if (response.isFailure) response.throwError()
  }
}
