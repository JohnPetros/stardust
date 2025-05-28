import type { RocketsRepository } from '@stardust/core/shop/interfaces'
import type { Rocket } from '@stardust/core/shop/entities'
import type { Id, Integer } from '@stardust/core/global/structures'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'
import { SupabaseRocketMapper } from '../../mappers/shop'
import type { ShopItemsListingParams } from '@stardust/core/shop/types'

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

  async findMany({ search, page, itemsPerPage, order }: ShopItemsListingParams) {
    let query = this.supabase.from('rockets').select('*', {
      count: 'exact',
      head: false,
    })

    if (search && search.value.length > 1) {
      query = query.ilike('name', `%${search}%`)
    }

    const range = this.calculateQueryRange(page.value, itemsPerPage.value)

    query = query
      .order('price', { ascending: order.value === 'ascending' })
      .range(range.from, range.to)

    const { data, count, error } = await query

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const rockets = data.map(SupabaseRocketMapper.toEntity)

    return {
      rockets,
      totalRocketsCount: count ?? rockets.length,
    }
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
