import type { StarsRepository } from '@stardust/core/space/interfaces'
import type { Id, Slug } from '@stardust/core/global/structures'
import type { Star } from '@stardust/core/space/entities'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseStarMapper } from '../../mappers/space'

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
      return null
    }

    return SupabaseStarMapper.toEntity(data)
  }

  async findBySlug(starSlug: Slug): Promise<Star | null> {
    const { data, error } = await this.supabase
      .from('stars')
      .select('*')
      .eq('slug', starSlug)
      .single()

    if (error) {
      return null
    }

    return SupabaseStarMapper.toEntity(data)
  }
}
