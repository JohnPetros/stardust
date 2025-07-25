import type { Id, OrdinalNumber } from '@stardust/core/global/structures'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import type { Planet } from '@stardust/core/space/entities'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'
import { SupabasePlanetMapper } from '../../mappers/space'

export class SupabasePlanetsRepository
  extends SupabaseRepository
  implements PlanetsRepository
{
  async findAll(): Promise<Planet[]> {
    const { data, error } = await this.supabase
      .from('planets_view')
      .select('*, stars(id, name, number, slug)')
      .order('position', { ascending: true })
      .order('number', { foreignTable: 'stars', ascending: true })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabasePlanetMapper.toEntity)
  }

  async findByPosition(position: OrdinalNumber): Promise<Planet | null> {
    const { data, error } = await this.supabase
      .from('planets_view')
      .select('*, stars(id, name, number, slug)')
      .eq('position', position.value)
      .order('number', { foreignTable: 'stars', ascending: true })
      .single()

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return SupabasePlanetMapper.toEntity(data)
  }

  async findByStar(starId: Id): Promise<Planet | null> {
    const { data, error } = await this.supabase
      .from('planets_view')
      .select('*, stars!inner(id, name, number, slug)')
      .eq('stars.id', starId.value)
      .single()

    if (error) {
      return null
    }

    const { data: stars, error: starsError } = await this.supabase
      .from('stars')
      .select('*')
      .eq('planet_id', data?.id ?? '')

    if (starsError) {
      throw new SupabasePostgreError(starsError)
    }

    data.stars = stars

    return SupabasePlanetMapper.toEntity(data)
  }
}
