import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { GetChallengeNavigationUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    challengeSlug: string
  }
}

export class FetchChallengeNavigationController implements Controller<Schema> {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeSlug } = http.getRouteParams()
    const useCase = new GetChallengeNavigationUseCase(this.challengesRepository)
    const response = await useCase.execute({ challengeSlug })
    return http.send(response)
  }
}
