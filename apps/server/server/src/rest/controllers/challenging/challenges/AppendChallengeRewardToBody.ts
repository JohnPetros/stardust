import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { GetChallengeRewardUseCase } from '@stardust/core/challenging/use-cases'

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
    const { xp, coins } = await useCase.execute({
      challengeId,
    })
    http.extendBody({
      challengeReward: {
        xp,
        coins,
      },
    })
    return http.pass()
  }
}
