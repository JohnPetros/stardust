import { Id } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import { ApiKeyAccessDeniedError, ApiKeyNotFoundError } from '../domain/errors'
import type { ApiKeysRepository } from '../interfaces'

type Request = {
  apiKeyId: string
  name: string
  userId: string
}

type Response = Promise<{
  id: string
  name: string
  keyPreview: string
  createdAt: Date
}>

export class RenameApiKeyUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ApiKeysRepository) {}

  async execute({ apiKeyId, name, userId }: Request): Response {
    const apiKey = await this.repository.findById(Id.create(apiKeyId))

    if (!apiKey || apiKey.isRevoked.isTrue) {
      throw new ApiKeyNotFoundError()
    }

    if (apiKey.belongsToUser(Id.create(userId)).isFalse) {
      throw new ApiKeyAccessDeniedError()
    }

    apiKey.rename(name)
    await this.repository.replace(apiKey)

    return {
      id: apiKey.id.value,
      name: apiKey.name.value,
      keyPreview: apiKey.keyPreview,
      createdAt: apiKey.createdAt,
    }
  }
}
