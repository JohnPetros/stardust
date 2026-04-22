import { Text } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import { ApiKeyNotFoundError } from '../domain/errors'
import type { ApiKeySecretProvider, ApiKeysRepository } from '../interfaces'

type Request = {
  apiKey: string
}

type Response = Promise<{
  userId: string
}>

export class AuthenticateApiKeyUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: ApiKeysRepository,
    private readonly secretProvider: ApiKeySecretProvider,
  ) {}

  async execute({ apiKey }: Request): Response {
    const keyHash = Text.create(this.secretProvider.hash(apiKey))
    const foundApiKey = await this.repository.findByHash(keyHash)

    if (!foundApiKey || foundApiKey.isRevoked.isTrue) {
      throw new ApiKeyNotFoundError()
    }

    return {
      userId: foundApiKey.userId.value,
    }
  }
}
