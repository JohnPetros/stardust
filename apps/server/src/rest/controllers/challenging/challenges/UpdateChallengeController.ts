import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'
import type { UpdateChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    challengeId: string
  }
  body: ChallengeDto
}

export class UpdateChallengeController implements Controller<Schema> {
  constructor(private readonly updateChallenge: UpdateChallengeUseCase) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    const challengeDto = await http.getBody()
    challengeDto.id = challengeId
    const response = await this.updateChallenge.execute({ challengeDto })
    return http.send(response)
  }
}
