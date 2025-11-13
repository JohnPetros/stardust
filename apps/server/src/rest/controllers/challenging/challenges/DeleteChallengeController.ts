import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { DeleteChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    challengeId: string
  }
}

export class DeleteChallengeController implements Controller<Schema> {
  constructor(private readonly repository: ChallengesRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    const useCase = new DeleteChallengeUseCase(this.repository)
    await useCase.execute({ challengeId })
    return http.statusNoContent().send()
  }
}
