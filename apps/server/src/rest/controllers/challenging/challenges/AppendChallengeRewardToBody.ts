import { GetChallengeRewardUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'

type Schema = {
  body: {
    challengeId: string
  }
}

export class AppendChallengeRewardToBodyController implements Controller<Schema> {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = await http.getBody()
    const useCase = new GetChallengeRewardUseCase(this.challengesRepository)
    const challengeReward = await useCase.execute({ challengeId })
    http.extendBody({ challengeReward })
    return http.pass()
  }
}
