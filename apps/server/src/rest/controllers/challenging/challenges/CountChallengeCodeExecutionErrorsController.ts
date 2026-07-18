import type { ChallengeCodeExecutionsRepository } from '@stardust/core/challenging/interfaces'
import { CountChallengeCodeExecutionErrorsUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    challengeId: string
  }
}

export class CountChallengeCodeExecutionErrorsController implements Controller<Schema> {
  constructor(private readonly repository: ChallengeCodeExecutionsRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    const userId = await http.getAccountId()

    const useCase = new CountChallengeCodeExecutionErrorsUseCase(this.repository)
    const errorsCount = await useCase.execute({ userId, challengeId })

    return http.send({ errorsCount })
  }
}
