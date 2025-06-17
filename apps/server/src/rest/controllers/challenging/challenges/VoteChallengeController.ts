import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { VoteChallengeUseCase } from '@stardust/core/challenging/use-cases'

type Schema = {
  routeParams: {
    challengeId: string
  }
  body: {
    challengeVote: string
  }
}

export class VoteChallengeController implements Controller<Schema> {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    const { challengeVote } = await http.getBody()
    const account = await http.getAccount()
    const useCase = new VoteChallengeUseCase(this.challengesRepository)
    const response = await useCase.execute({
      challengeId,
      challengeVote,
      userId: String(account.id),
    })
    return http.send(response)
  }
}
