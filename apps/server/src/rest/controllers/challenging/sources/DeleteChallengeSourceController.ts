import type { ChallengeSourcesRepository } from '@stardust/core/challenging/interfaces'
import { DeleteChallengeSourceUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    challengeSourceId: string
  }
}

export class DeleteChallengeSourceController implements Controller<Schema> {
  constructor(private readonly repository: ChallengeSourcesRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeSourceId } = http.getRouteParams()
    const useCase = new DeleteChallengeSourceUseCase(this.repository)
    await useCase.execute({ challengeSourceId })
    return http.statusNoContent().send()
  }
}
