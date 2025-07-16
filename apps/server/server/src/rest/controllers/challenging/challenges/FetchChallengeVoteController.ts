import { GetChallengeVoteUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'

type Schema = {
  routeParams: {
    challengeId: string
  }
}

export class FetchChallengeVoteController implements Controller<Schema> {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    const account = await http.getAccount()
    const useCase = new GetChallengeVoteUseCase(this.challengesRepository)
    const challengeVote = await useCase.execute({
      challengeId,
      userId: String(account.id),
    })
    return http.send(challengeVote)
  }
}
