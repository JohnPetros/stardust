import { ListApiKeysUseCase } from '@stardust/core/auth/use-cases'
import type { ApiKeysRepository } from '@stardust/core/auth/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'

export class FetchApiKeysListController implements Controller {
  constructor(private readonly repository: ApiKeysRepository) {}

  async handle(http: Http) {
    const accountId = await http.getAccountId()
    const useCase = new ListApiKeysUseCase(this.repository)
    const response = await useCase.execute({ userId: accountId })
    return http.statusOk().send(response)
  }
}
