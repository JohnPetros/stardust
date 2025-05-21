import type { StarsRepository } from '@stardust/core/space/interfaces'
import type { Id } from '@stardust/core/global/structures'
import type { Star } from '@stardust/core/space/entities'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseStarMapper } from '../../mappers/space'
import { SupabasePostgreError } from '../../errors'

export class SupabaseStarsRepository
  extends SupabaseRepository
  implements StarsRepository
{
  async findById(starId: Id): Promise<Star | null> {
    const { data, error } = await this.supabase
      .from('stars')
      .select('id, name, number, slug, is_challenge, planet_id')
      .eq('id', starId.value)
      .single()

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return SupabaseStarMapper.toEntity(data)
  }

  async addUnlocked(starId: Id, userId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('users_unlocked_stars')
      .insert({ star_id: starId.value, user_id: userId.value })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
