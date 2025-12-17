import type { AvatarsRepository } from '@stardust/core/shop/interfaces'
import type { Avatar } from '@stardust/core/shop/entities'
import type { Id, Integer } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'

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
      return this.handleQueryPostgresError(error)
    }

    return SupabaseAvatarMapper.toEntity(data)
  }

  async findAllByPrice(price: Integer): Promise<Avatar[]> {
    const { data, error } = await this.supabase
      .from('avatars')
      .select('*')
      .eq('price', price.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseAvatarMapper.toEntity)
  }

  async findSelectedByDefault(): Promise<Avatar | null> {
    const { data, error } = await this.supabase
      .from('avatars')
      .select('*')
      .eq('is_selected_by_default', true)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseAvatarMapper.toEntity(data)
  }

  async findMany({
    search,
    page,
    itemsPerPage,
    order,
  }: ShopItemsListingParams): Promise<ManyItems<Avatar>> {
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
      items: avatars,
      count: count ?? avatars.length,
    }
  }

  async add(avatar: Avatar): Promise<void> {
    const supabaseAvatar = SupabaseAvatarMapper.toSupabase(avatar)
    const { error } = await this.supabase.from('avatars').insert(supabaseAvatar)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replace(avatar: Avatar): Promise<void> {
    const supabaseAvatar = SupabaseAvatarMapper.toSupabase(avatar)
    const { error } = await this.supabase
      .from('avatars')
      .update(supabaseAvatar)
      .eq('id', avatar.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async remove(id: Id): Promise<void> {
    const { error } = await this.supabase.from('avatars').delete().eq('id', id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
