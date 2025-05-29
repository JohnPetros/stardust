import type { AvatarsRepository } from '@stardust/core/shop/interfaces'
import type { Avatar, Rocket } from '@stardust/core/shop/entities'
import type { Id, Integer } from '@stardust/core/global/structures'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'
import { SupabaseAvatarMapper } from '../../mappers/shop'
import type { ShopItemsListingParams } from '@stardust/core/shop/types'

export class SupabaseAvatarsRepository
  extends SupabaseRepository
  implements AvatarsRepository
{
  async findById(avatarId: Id): Promise<Avatar | null> {
    const { data, error } = await this.supabase
      .from('avatars')
      .select('*')
      .eq('id', avatarId.value)
      .single()

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return SupabaseAvatarMapper.toEntity(data)
  }

  async findAllByPrice(price: Integer): Promise<Rocket[]> {
    const { data, error } = await this.supabase
      .from('rockets')
      .select('*')
      .eq('price', price.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseAvatarMapper.toEntity)
  }

  async findMany({ search, page, itemsPerPage, order }: ShopItemsListingParams) {
    let query = this.supabase.from('avatars').select('*', {
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

    const avatars = data.map(SupabaseAvatarMapper.toEntity)

    return {
      avatars,
      totalAvatarsCount: count ?? avatars.length,
    }
  }
}
