import { GetChallengesNavigationSidebarProgressUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'

type Schema = {
  body: {
    userCompletedChallengesIds?: string[]
  }
}

export class FetchChallengesCompletionProgressController implements Controller<Schema> {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async handle(http: Http<Schema>) {
    const account = await http.getAccount()
    const { userCompletedChallengesIds = [] } = await http.getBody()

    const useCase = new GetChallengesNavigationSidebarProgressUseCase(
      this.challengesRepository,
    )

    const response = await useCase.execute({ userCompletedChallengesIds })

    return http.send({
      completedChallengesCount: account ? response.completedChallengesCount : null,
      totalChallengesCount: response.totalChallengesCount,
    })
  }
}
