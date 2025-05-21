import type { RocketsRepository } from '@stardust/core/shop/interfaces'
import type { Rocket } from '@stardust/core/shop/entities'
import type { Id, Integer } from '@stardust/core/global/structures'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'
import { SupabaseRocketMapper } from '../../mappers/shop'

export class SupabaseRocketsRepository
  extends SupabaseRepository
  implements RocketsRepository
{
  async findById(rocketId: Id): Promise<Rocket | null> {
    const { data, error } = await this.supabase
      .from('rockets')
      .select('*')
      .eq('id', rocketId.value)
      .single()

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return SupabaseRocketMapper.toEntity(data)
  }

  async findAllByPrice(price: Integer): Promise<Rocket[]> {
    const { data, error } = await this.supabase
      .from('rockets')
      .select('*')
      .eq('price', price.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseRocketMapper.toEntity)
  }
}
