import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { EditChallengeStarUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    challengeId: string
  }
  body: {
    starId: string
  }
}

export class EditChallengeStarController implements Controller<Schema> {
  constructor(private readonly repository: ChallengesRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    const { starId } = await http.getBody()
    const useCase = new EditChallengeStarUseCase(this.repository)
    const challengeDto = await useCase.execute({ challengeId, starId })
    return http.send(challengeDto)
  }
}
