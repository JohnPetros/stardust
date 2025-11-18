import type { InsigniasRepository } from '@stardust/core/shop/interfaces'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseInsigniaMapper } from '../../mappers/shop'
import { SupabasePostgreError } from '../../errors'

export class SupabaseInsigniasRepository
  extends SupabaseRepository
  implements InsigniasRepository
{
  async findAll() {
    const { data, error } = await this.supabase.from('insignias').select('*')

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseInsigniaMapper.toEntity)
  }
}
