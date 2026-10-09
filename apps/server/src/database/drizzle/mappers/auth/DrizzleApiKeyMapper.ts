import { ApiKey } from '@stardust/core/auth/entities'
import type { DrizzleApiKey, DrizzleInsertApiKey } from '../../types/entities/auth'

export class DrizzleApiKeyMapper {
  static toEntity(row: DrizzleApiKey): ApiKey {
    return ApiKey.create({
      ...DrizzleApiKeyMapper.readIdentity(row),
      createdAt: row.createdAt,
      revokedAt: row.revokedAt ?? undefined,
    })
  }

  static toPersistence(apiKey: ApiKey): DrizzleInsertApiKey {
    return {
      ...DrizzleApiKeyMapper.writeIdentity(apiKey),
      createdAt: apiKey.createdAt,
      revokedAt: apiKey.revokedAt ?? null,
    }
  }

  private static readIdentity(
    row: DrizzleApiKey,
  ): Pick<DrizzleApiKey, 'id' | 'name' | 'keyHash' | 'keyPreview' | 'userId'> {
    const { id, name, keyHash, keyPreview, userId } = row
    return { id, name, keyHash, keyPreview, userId }
  }

  private static writeIdentity(
    apiKey: ApiKey,
  ): Pick<DrizzleInsertApiKey, 'id' | 'name' | 'keyHash' | 'keyPreview' | 'userId'> {
    return {
      id: apiKey.id.value,
      name: apiKey.name.value,
      keyHash: apiKey.keyHash,
      keyPreview: apiKey.keyPreview,
      userId: apiKey.userId.value,
    }
  }
}
