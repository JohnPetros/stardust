import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { GetUnlockedStarsKpiUseCase } from '@stardust/core/profile/use-cases'

export class GetUnlockedStarsKpiController implements Controller {
  constructor(private readonly repository: UsersRepository) {}

  async handle(http: Http): Promise<RestResponse> {
    const useCase = new GetUnlockedStarsKpiUseCase(this.repository)
    const response = await useCase.execute()
    return http.send(response)
  }
}
