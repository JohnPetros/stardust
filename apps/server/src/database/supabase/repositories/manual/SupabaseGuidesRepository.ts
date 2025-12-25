import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type { Guide } from '@stardust/core/manual/entities'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseGuideMapper } from '../../mappers/manual'
import { SupabasePostgreError } from '../../errors'

export class SupabaseGuidesRepository
  extends SupabaseRepository
  implements GuidesRepository
{
  async findAll(): Promise<Guide[]> {
    const { data, error } = await this.supabase
      .from('guides')
      .select('*')
      .order('position', { ascending: true })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseGuideMapper.toEntity)
  }
}
