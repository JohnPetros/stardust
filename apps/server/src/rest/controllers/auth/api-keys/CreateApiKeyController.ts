import {
  type ApiKeySecretProvider,
  type ApiKeysRepository,
} from '@stardust/core/auth/interfaces'
import { CreateApiKeyUseCase } from '@stardust/core/auth/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  body: {
    name: string
  }
}

export class CreateApiKeyController implements Controller<Schema> {
  constructor(
    private readonly repository: ApiKeysRepository,
    private readonly secretProvider: ApiKeySecretProvider,
  ) {}

  async handle(http: Http<Schema>) {
    const { name } = await http.getBody()
    const accountId = await http.getAccountId()
    const useCase = new CreateApiKeyUseCase(this.repository, this.secretProvider)
    const response = await useCase.execute({
      name,
      userId: accountId,
    })

    return http.statusCreated().send(response)
  }
}
