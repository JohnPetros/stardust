import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { CacheProvider } from '@stardust/core/global/interfaces'
import { GetRemainingCodeExplanationUsesUseCase } from '@stardust/core/lesson/use-cases'

export class FetchRemainingCodeExplanationUsesController implements Controller {
  constructor(private readonly cacheProvider: CacheProvider) {}

  async handle(http: Http) {
    const userId = await http.getAccountId()
    const useCase = new GetRemainingCodeExplanationUsesUseCase(this.cacheProvider)
    const response = await useCase.execute({ userId })
    return http.send(response)
  }
}
