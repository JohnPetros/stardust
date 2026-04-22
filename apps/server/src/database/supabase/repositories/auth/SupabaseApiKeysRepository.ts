import type { ApiKey } from '@stardust/core/auth/entities'
import type { ApiKeysRepository } from '@stardust/core/auth/interfaces'
import type { Id } from '@stardust/core/global/structures'
import type { Text } from '@stardust/core/global/structures'

import { SupabasePostgreError } from '../../errors'
import { SupabaseApiKeyMapper } from '../../mappers/auth'
import { SupabaseRepository } from '../SupabaseRepository'

export class SupabaseApiKeysRepository
  extends SupabaseRepository
  implements ApiKeysRepository
{
  async findById(apiKeyId: Id): Promise<ApiKey | null> {
    const { data, error } = await this.supabase
      .from('api_keys')
      .select('*')
      .eq('id', apiKeyId.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseApiKeyMapper.toEntity(data)
  }

  async findManyByUserId(userId: Id): Promise<ApiKey[]> {
    const { data, error } = await this.supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId.value)
      .is('revoked_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseApiKeyMapper.toEntity)
  }

  async findByHash(keyHash: Text): Promise<ApiKey | null> {
    const { data, error } = await this.supabase
      .from('api_keys')
      .select('*')
      .eq('key_hash', keyHash.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseApiKeyMapper.toEntity(data)
  }

  async add(apiKey: ApiKey): Promise<void> {
    const supabaseApiKey = SupabaseApiKeyMapper.toSupabase(apiKey)
    const { error } = await this.supabase.from('api_keys').insert(supabaseApiKey)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replace(apiKey: ApiKey): Promise<void> {
    const { error } = await this.supabase
      .from('api_keys')
      .update({ name: apiKey.name.value })
      .eq('id', apiKey.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async revoke(apiKeyId: Id, revokedAt: Date): Promise<void> {
    const { error } = await this.supabase
      .from('api_keys')
      .update({ revoked_at: revokedAt.toISOString() })
      .eq('id', apiKeyId.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
