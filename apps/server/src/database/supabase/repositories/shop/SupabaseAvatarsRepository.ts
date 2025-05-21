import type { AvatarsRepository } from '@stardust/core/shop/interfaces'
import type { Avatar, Rocket } from '@stardust/core/shop/entities'
import type { Id, Integer } from '@stardust/core/global/structures'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'
import { SupabaseAvatarMapper } from '../../mappers/shop'

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
}
