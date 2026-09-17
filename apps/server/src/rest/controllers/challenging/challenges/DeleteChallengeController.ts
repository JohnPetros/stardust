import type { DeleteChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    challengeId: string
  }
}

export class DeleteChallengeController implements Controller<Schema> {
  constructor(private readonly deleteChallenge: DeleteChallengeUseCase) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    await this.deleteChallenge.execute({ challengeId })
    return http.statusNoContent().send()
  }
}
