import type { IChallengingService, IUseCase } from '#interfaces'
import { Challenge } from '#challenging/entities'
import type { ChallengeDto } from '#challenging/dtos'

type Request = {
  challengeDto: ChallengeDto
}

type Response = Promise<ChallengeDto>

export class PostChallengeUseCase implements IUseCase<Request, Response> {
  constructor(private readonly challengingService: IChallengingService) {}

  async do({ challengeDto }: Request) {
    const challenge = Challenge.create(challengeDto)
    await this.saveChallenge(challenge)
    return challenge.dto
  }

  private async saveChallenge(challenge: Challenge) {
    const response = await this.challengingService.saveChallenge(challenge)
    if (response.isFailure) response.throwError()
  }
}
