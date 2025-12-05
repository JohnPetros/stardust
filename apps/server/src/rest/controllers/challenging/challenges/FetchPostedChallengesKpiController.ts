import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { GetPostedChallengesKpiUseCase } from '@stardust/core/challenging/use-cases'

export class FetchPostedChallengesKpiController implements Controller {
  constructor(private readonly repository: ChallengesRepository) {}

  async handle(http: Http): Promise<RestResponse> {
    const useCase = new GetPostedChallengesKpiUseCase(this.repository)
    const response = await useCase.execute()
    return http.send(response)
  }
}
