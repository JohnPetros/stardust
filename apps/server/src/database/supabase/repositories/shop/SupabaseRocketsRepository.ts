import type { RocketsRepository } from '@stardust/core/shop/interfaces'
import type { Rocket } from '@stardust/core/shop/entities'
import type { Id, Integer } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'
import type { ShopItemsListingParams } from '@stardust/core/shop/types'

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

  async findSelectedByDefault(): Promise<Rocket | null> {
    const { data, error } = await this.supabase
      .from('rockets')
      .select('*')
      .eq('is_selected_by_default', true)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseRocketMapper.toEntity(data)
  }

  async findMany({
    search,
    page,
    itemsPerPage,
    order,
  }: ShopItemsListingParams): Promise<ManyItems<Rocket>> {
    let query = this.supabase.from('rockets').select('*', {
      count: 'exact',
      head: false,
    })

    if (search && search.value.length > 1) {
      query = query.ilike('name', `%${search.value}%`)
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
      items: rockets,
      count: count ?? rockets.length,
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

  async add(rocket: Rocket): Promise<void> {
    const supabaseRocket = SupabaseRocketMapper.toSupabase(rocket)
    const rocketDto = rocket.dto
    const { error } = await this.supabase.from('rockets').insert({
      ...supabaseRocket,
      is_acquired_by_default: rocketDto.isAcquiredByDefault ?? false,
      is_selected_by_default: rocketDto.isSelectedByDefault ?? false,
    })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replace(rocket: Rocket): Promise<void> {
    const supabaseRocket = SupabaseRocketMapper.toSupabase(rocket)
    const rocketDto = rocket.dto
    const { error } = await this.supabase
      .from('rockets')
      .update({
        ...supabaseRocket,
        is_acquired_by_default: rocketDto.isAcquiredByDefault ?? false,
        is_selected_by_default: rocketDto.isSelectedByDefault ?? false,
      })
      .eq('id', rocket.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async remove(id: Id): Promise<void> {
    const { error } = await this.supabase.from('rockets').delete().eq('id', id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
