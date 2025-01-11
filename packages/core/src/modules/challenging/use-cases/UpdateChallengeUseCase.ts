import type { IChallengingService, IUseCase } from '#interfaces'
import { Challenge } from '#challenging/entities'
import type { ChallengeDto } from '#challenging/dtos'

type Request = {
  challengeDto: ChallengeDto
  challengeId: string
}

type Response = Promise<ChallengeDto>

export class UpdateChallengeUseCase implements IUseCase<Request, Response> {
  constructor(private readonly challengingService: IChallengingService) {}

  async do({ challengeDto }: Request) {
    const challenge = Challenge.create(challengeDto)
    await this.updateChallenge(challenge)
    return challenge.dto
  }

  private async updateChallenge(challenge: Challenge) {
    const response = await this.challengingService.updateChallenge(challenge)
    if (response.isFailure) response.throwError()
  }
}
