import type { IChallengingService, IUseCase } from '../../global/interfaces'
import { Challenge } from '../domain/entities'
import type { ChallengeDto } from '../dtos'

type Request = {
  challengeDto: ChallengeDto
}

type Response = Promise<ChallengeDto>

export class PostChallengeUseCase implements IUseCase<Request, Response> {
  constructor(private readonly challengingService: IChallengingService) {}

  async do({ challengeDto }: Request) {
    const challenge = Challenge.create(challengeDto)
    await this.fetchChallenge(challenge.slug.value)
    await this.saveChallenge(challenge)
    await this.saveChallengeCategories(challenge)
    return challenge.dto
  }

  private async fetchChallenge(challengeSlug: string) {
    const response = await this.challengingService.fetchChallengeBySlug(challengeSlug)
    if (response.isSuccess) response.throwError()
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
