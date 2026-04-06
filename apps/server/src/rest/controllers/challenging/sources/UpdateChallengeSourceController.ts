import type {
  ChallengeSourcesRepository,
  ChallengesRepository,
} from '@stardust/core/challenging/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { UpdateChallengeSourceUseCase } from '@stardust/core/challenging/use-cases'

type Schema = {
  routeParams: {
    challengeSourceId: string
  }
  body: {
    url: string
    challengeId?: string | null
    additionalInstructions?: string | null
  }
}

export class UpdateChallengeSourceController implements Controller<Schema> {
  constructor(
    private readonly challengeSourcesRepository: ChallengeSourcesRepository,
    private readonly challengesRepository: ChallengesRepository,
  ) {}

  async handle(http: Http<Schema>) {
    const { challengeSourceId } = http.getRouteParams()
    const { url, challengeId, additionalInstructions } = await http.getBody()
    const useCase = new UpdateChallengeSourceUseCase(
      this.challengeSourcesRepository,
      this.challengesRepository,
    )
    const response = await useCase.execute({
      challengeSourceId,
      url,
      challengeId,
      additionalInstructions,
    })
    return http.send(response)
  }
}
