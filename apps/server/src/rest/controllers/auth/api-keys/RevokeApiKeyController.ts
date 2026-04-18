import { RevokeApiKeyUseCase } from '@stardust/core/auth/use-cases'
import type { ApiKeysRepository } from '@stardust/core/auth/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    apiKeyId: string
  }
}

export class RevokeApiKeyController implements Controller<Schema> {
  constructor(private readonly repository: ApiKeysRepository) {}

  async handle(http: Http<Schema>) {
    const { apiKeyId } = http.getRouteParams()
    const accountId = await http.getAccountId()
    const useCase = new RevokeApiKeyUseCase(this.repository)
    await useCase.execute({
      apiKeyId,
      userId: accountId,
    })

    return http.statusNoContent().send()
  }
}
