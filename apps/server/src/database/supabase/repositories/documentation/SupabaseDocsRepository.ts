import type { DocsRepository } from '@stardust/core/documentation/interfaces'
import type { Doc } from '@stardust/core/documentation/entities'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseDocMapper } from '../../mappers/documentation'
import { SupabasePostgreError } from '../../errors'

export class SupabaseDocsRepository extends SupabaseRepository implements DocsRepository {
  async findAll(): Promise<Doc[]> {
    const { data, error } = await this.supabase
      .from('docs')
      .select('*')
      .order('position', { ascending: true })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseDocMapper.toEntity)
  }
}
