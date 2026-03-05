import type { ChallengeSourcesRepository } from '@stardust/core/challenging/interfaces'
import { ReorderChallengeSourcesUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  body: {
    challengeSourceIds: string[]
  }
}

export class ReorderChallengeSourcesController implements Controller<Schema> {
  constructor(private readonly repository: ChallengeSourcesRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeSourceIds } = await http.getBody()
    const useCase = new ReorderChallengeSourcesUseCase(this.repository)
    const response = await useCase.execute({ challengeSourceIds })
    return http.statusOk().send(response)
  }
}
