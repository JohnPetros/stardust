import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { RemoveChallengeStarUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    challengeId: string
  }
}

export class RemoveChallengeStarController implements Controller<Schema> {
  constructor(private readonly repository: ChallengesRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    const useCase = new RemoveChallengeStarUseCase(this.repository)
    await useCase.execute({ challengeId })
    return http.statusNoContent().send()
  }
}
