import { Id } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import { ListResponse } from '#global/responses/ListResponse'
import type { ApiKeysRepository } from '../interfaces'

type ApiKeyData = {
  id: string
  name: string
  keyPreview: string
  createdAt: Date
}

type Request = {
  userId: string
}

type Response = Promise<ListResponse<ApiKeyData>>

export class ListApiKeysUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ApiKeysRepository) {}

  async execute({ userId }: Request): Response {
    const apiKeys = await this.repository.findManyByUserId(Id.create(userId))

    return new ListResponse({
      items: apiKeys.map((apiKey) => ({
        id: apiKey.id.value,
        name: apiKey.name.value,
        keyPreview: apiKey.keyPreview,
        createdAt: apiKey.createdAt,
      })),
    })
  }
}
