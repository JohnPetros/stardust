import type { IChallengingService, IUseCase } from '../../global/interfaces'
import { Challenge } from '../domain/entities'
import type { ChallengeDto } from '../dtos'

type Request = {
  challengeDto: ChallengeDto
}

type Response = Promise<ChallengeDto>

export class EditChallengeUseCase implements IUseCase<Request, Response> {
  constructor(private readonly challengingService: IChallengingService) {}

  async do({ challengeDto }: Request) {
    console.log(challengeDto)
    const challenge = Challenge.create(challengeDto)
    await this.fetchChallengeById(challenge.id)

    if (challenge.title.value !== challengeDto.title) {
      await this.fetchChallengeBySlug(challenge.slug.value)
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

  private async fetchChallengeById(challengeId: string) {
    const response = await this.challengingService.fetchChallengeById(challengeId)
    if (response.isFailure) response.throwError()
  }

  private async fetchChallengeBySlug(challengeSlug: string) {
    const response = await this.challengingService.fetchChallengeBySlug(challengeSlug)
    if (response.isSuccess) response.throwError()
  }

  private async saveChallengeCategories(challenge: Challenge) {
    const response = await this.challengingService.saveChallengeCategories(
      challenge.id,
      challenge.categories,
    )
    if (response.isFailure) response.throwError()
  }

  private async deleteChallengeCategories(challengeId: string) {
    const response = await this.challengingService.deleteChallengeCategories(challengeId)
    if (response.isFailure) response.throwError()
  }
}
