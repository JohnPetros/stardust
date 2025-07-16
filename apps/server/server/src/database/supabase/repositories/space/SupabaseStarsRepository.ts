import type { StarsRepository } from '@stardust/core/space/interfaces'
import type { Id, OrdinalNumber, Slug } from '@stardust/core/global/structures'
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
      .select('id, name, number, slug')
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
      .select('id, name, number, slug')
      .eq('slug', starSlug.value)
      .single()

    if (error) {
      return null
    }

    return SupabaseStarMapper.toEntity(data)
  }

  async findByNumber(number: OrdinalNumber): Promise<Star | null> {
    const { data, error } = await this.supabase
      .from('stars')
      .select('id, name, number, slug')
      .eq('number', number.value)
      .order('number', { ascending: true })
      .single()

    if (error) {
      return null
    }

    return SupabaseStarMapper.toEntity(data)
  }
}
