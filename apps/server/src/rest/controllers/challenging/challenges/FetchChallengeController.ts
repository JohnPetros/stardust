import { GetChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'

type Schema = {
  routeParams: {
    challengeSlug?: string
    challengeId?: string
    starId?: string
  }
}

export class FetchChallengeController implements Controller<Schema> {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeId, challengeSlug, starId } = http.getRouteParams()
    const useCase = new GetChallengeUseCase(this.challengesRepository)
    const response = await useCase.execute({
      challengeId,
      challengeSlug,
      starId,
    })
    return http.send(response)
  }
}
