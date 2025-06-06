import { CountCompletedChallengesByDifficultyLevelUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'

type Schema = {
  body: {
    userCompletedChallengesIds: string[]
  }
}

export class FetchCompletedChallengesCountByDifficultyLevelController
  implements Controller<Schema>
{
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async handle(http: Http<Schema>) {
    const { userCompletedChallengesIds } = await http.getBody()
    const account = await http.getAccount()
    const useCase = new CountCompletedChallengesByDifficultyLevelUseCase(
      this.challengesRepository,
    )
    const response = await useCase.execute({
      userId: String(account.id),
      userCompletedChallengesIds,
    })
    return http.send(response)
  }
}
