import type {
  ChallengeSourcesRepository,
  ChallengesRepository,
} from '@stardust/core/challenging/interfaces'
import { UpdateChallengeSourceUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    challengeSourceId: string
  }
  body: {
    challengeId: string
    url: string
  }
}

export class UpdateChallengeSourceController implements Controller<Schema> {
  constructor(
    private readonly challengeSourcesRepository: ChallengeSourcesRepository,
    private readonly challengesRepository: ChallengesRepository,
  ) {}

  async handle(http: Http<Schema>) {
    const { challengeSourceId } = http.getRouteParams()
    const { challengeId, url } = await http.getBody()
    const useCase = new UpdateChallengeSourceUseCase(
      this.challengeSourcesRepository,
      this.challengesRepository,
    )
    const response = await useCase.execute({ challengeSourceId, challengeId, url })
    return http.send(response)
  }
}
