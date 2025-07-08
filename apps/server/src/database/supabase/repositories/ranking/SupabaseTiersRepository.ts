import type { TiersRepository } from '@stardust/core/ranking/interfaces'
import type { Id, OrdinalNumber } from '@stardust/core/global/structures'
import type { Tier } from '@stardust/core/ranking/entities'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseTierMapper } from '../../mappers/ranking/SupabaseTierMapper'
import { SupabasePostgreError } from '../../errors'

export class SupabaseTiersRepository
  extends SupabaseRepository
  implements TiersRepository
{
  async findById(id: Id): Promise<Tier | null> {
    const { data, error } = await this.supabase
      .from('tiers')
      .select('*')
      .eq('id', id.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseTierMapper.toEntity(data)
  }
  async findAll(): Promise<Tier[]> {
    const { data, error } = await this.supabase
      .from('tiers')
      .select('*')
      .order('position', { ascending: true })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseTierMapper.toEntity)
  }

  async removeAllLastWeekRankingUsers(): Promise<void> {
    const { error } = await this.supabase.from('ranking_users').delete().neq('id', '0')

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async findByPosition(position: OrdinalNumber): Promise<Tier> {
    const { data, error } = await this.supabase
      .from('tiers')
      .select('*')
      .eq('position', position.value)
      .single()

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return SupabaseTierMapper.toEntity(data)
  }
}
