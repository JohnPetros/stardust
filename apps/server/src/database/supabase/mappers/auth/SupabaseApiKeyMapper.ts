import type { ApiKeyDto } from '@stardust/core/auth/entities/dtos'
import { ApiKey } from '@stardust/core/auth/entities'

import type { SupabaseApiKey } from '../../types'

export class SupabaseApiKeyMapper {
  static toEntity(supabaseApiKey: SupabaseApiKey): ApiKey {
    return ApiKey.create(SupabaseApiKeyMapper.toDto(supabaseApiKey))
  }

  static toDto(supabaseApiKey: SupabaseApiKey): ApiKeyDto {
    return {
      id: supabaseApiKey.id,
      name: supabaseApiKey.name,
      keyHash: supabaseApiKey.key_hash,
      keyPreview: supabaseApiKey.key_preview,
      userId: supabaseApiKey.user_id,
      createdAt: new Date(supabaseApiKey.created_at),
      revokedAt: supabaseApiKey.revoked_at
        ? new Date(supabaseApiKey.revoked_at)
        : undefined,
    }
  }

  static toSupabase(apiKey: ApiKey): SupabaseApiKey {
    return {
      id: apiKey.id.value,
      name: apiKey.name.value,
      key_hash: apiKey.keyHash,
      key_preview: apiKey.keyPreview,
      user_id: apiKey.userId.value,
      created_at: apiKey.createdAt.toISOString(),
      revoked_at: apiKey.revokedAt?.toISOString() ?? null,
    }
  }
}
