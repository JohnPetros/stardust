import { RenameApiKeyUseCase } from '@stardust/core/auth/use-cases'
import type { ApiKeysRepository } from '@stardust/core/auth/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  body: {
    name: string
  }
  routeParams: {
    apiKeyId: string
  }
}

export class RenameApiKeyController implements Controller<Schema> {
  constructor(private readonly repository: ApiKeysRepository) {}

  async handle(http: Http<Schema>) {
    const { name } = await http.getBody()
    const { apiKeyId } = http.getRouteParams()
    const accountId = await http.getAccountId()
    const useCase = new RenameApiKeyUseCase(this.repository)
    const response = await useCase.execute({
      apiKeyId,
      name,
      userId: accountId,
    })

    return http.statusOk().send(response)
  }
}
