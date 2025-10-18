import type { StarsRepository } from '@stardust/core/space/interfaces'
import type { Id, OrdinalNumber, Slug } from '@stardust/core/global/structures'
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
      .select('id, name, number, slug, is_available, is_challenge')
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
      .select('id, name, number, slug, is_available, is_challenge')
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
      .select('id, name, number, slug, is_available, is_challenge')
      .eq('number', number.value)
      .order('number', { ascending: true })
      .single()

    if (error) {
      return null
    }

    return SupabaseStarMapper.toEntity(data)
  }

  async add(star: Star, planetId: Id): Promise<void> {
    const { error } = await this.supabase.from('stars').insert({
      id: star.id.value,
      planet_id: planetId.value,
      name: star.name.value,
      number: star.number.value,
      slug: star.slug.value,
      is_available: star.isAvailable.value,
      is_challenge: star.isChallenge.value,
    })

    if (error) throw new SupabasePostgreError(error)
  }

  async replace(star: Star): Promise<void> {
    const { error } = await this.supabase
      .from('stars')
      .update(SupabaseStarMapper.toSupabase(star))
      .eq('id', star.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replaceMany(stars: Star[]): Promise<void> {
    await Promise.all(stars.map((star) => this.replace(star)))
  }

  async remove(starId: Id): Promise<void> {
    const { error } = await this.supabase.from('stars').delete().eq('id', starId.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
