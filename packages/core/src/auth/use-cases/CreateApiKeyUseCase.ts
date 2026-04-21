import { Id } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import { ApiKey } from '../domain/entities'
import type { ApiKeySecretProvider, ApiKeysRepository } from '../interfaces'

type Request = {
  name: string
  userId: string
}

type Response = Promise<{
  id: string
  name: string
  keyPreview: string
  createdAt: Date
  key: string
}>

export class CreateApiKeyUseCase implements UseCase<Request, Response> {
  private static readonly KEY_PREFIX = 'sk_'
  private static readonly TOKEN_BYTE_LENGTH = 32

  constructor(
    private readonly repository: ApiKeysRepository,
    private readonly secretProvider: ApiKeySecretProvider,
  ) {}

  async execute({ name, userId }: Request): Response {
    const key = this.createApiKeySecret()
    const createdAt = new Date()

    const apiKey = ApiKey.create({
      id: Id.create().value,
      name,
      keyHash: this.secretProvider.hash(key),
      keyPreview: this.createPreview(key),
      userId,
      createdAt,
    })

    await this.repository.add(apiKey)

    return {
      id: apiKey.id.value,
      name: apiKey.name.value,
      keyPreview: apiKey.keyPreview,
      createdAt: apiKey.createdAt,
      key,
    }
  }

  private createApiKeySecret(): string {
    const token = this.secretProvider.generateToken(CreateApiKeyUseCase.TOKEN_BYTE_LENGTH)
    return `${CreateApiKeyUseCase.KEY_PREFIX}${token}`
  }

  private createPreview(key: string): string {
    return `${key.slice(0, 6)}...${key.slice(-4)}`
  }
}
