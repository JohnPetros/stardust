import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { UpdateChallengeUseCase } from '@stardust/core/challenging/use-cases'

type Schema = {
  routeParams: {
    challengeId: string
  }
  body: ChallengeDto
}

export class UpdateChallengeController implements Controller<Schema> {
  constructor(private readonly repository: ChallengesRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    const challengeDto = await http.getBody()
    challengeDto.id = challengeId
    const useCase = new UpdateChallengeUseCase(this.repository)
    const response = await useCase.execute({ challengeDto })
    return http.send(response)
  }
}
