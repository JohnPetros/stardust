import { Id } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import { ApiKeyAccessDeniedError, ApiKeyNotFoundError } from '../domain/errors'
import type { ApiKeysRepository } from '../interfaces'

type Request = {
  apiKeyId: string
  userId: string
}

type Response = Promise<void>

export class RevokeApiKeyUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ApiKeysRepository) {}

  async execute({ apiKeyId, userId }: Request): Response {
    const apiKey = await this.repository.findById(Id.create(apiKeyId))

    if (!apiKey) {
      throw new ApiKeyNotFoundError()
    }

    if (apiKey.belongsToUser(Id.create(userId)).isFalse) {
      throw new ApiKeyAccessDeniedError()
    }

    if (apiKey.isRevoked.isTrue) {
      return
    }

    await this.repository.revoke(apiKey.id, new Date())
  }
}
