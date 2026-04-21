import type { Id } from '#global/domain/structures/Id'
import type { ApiKey } from '../domain/entities'

export interface ApiKeysRepository {
  findById(apiKeyId: Id): Promise<ApiKey | null>
  findManyByUserId(userId: Id): Promise<ApiKey[]>
  add(apiKey: ApiKey): Promise<void>
  replace(apiKey: ApiKey): Promise<void>
  revoke(apiKeyId: Id, revokedAt: Date): Promise<void>
}
