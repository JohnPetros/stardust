import type {
  ChallengeSourcesRepository,
  ChallengesRepository,
} from '@stardust/core/challenging/interfaces'
import { CreateChallengeSourceUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  body: {
    challengeId?: string | null
    url: string
    additionalInstructions?: string | null
  }
}

export class CreateChallengeSourceController implements Controller<Schema> {
  constructor(
    private readonly challengeSourcesRepository: ChallengeSourcesRepository,
    private readonly challengesRepository: ChallengesRepository,
  ) {}

  async handle(http: Http<Schema>) {
    const { challengeId, url, additionalInstructions } = await http.getBody()
    const useCase = new CreateChallengeSourceUseCase(
      this.challengeSourcesRepository,
      this.challengesRepository,
    )
    const response = await useCase.execute({
      challengeId,
      url,
      additionalInstructions,
    })
    return http.statusCreated().send(response)
  }
}
