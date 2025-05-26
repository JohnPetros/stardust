import type { OrdinalNumber } from '@stardust/core/global/structures'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import type { Planet } from '@stardust/core/space/entities'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'
import { SupabasePlanetMapper } from '../../mappers/space'
import type { SupabasePlanet } from '../../types'

export class SupabasePlanetsRepository
  extends SupabaseRepository
  implements PlanetsRepository
{
  async findAll(): Promise<Planet[]> {
    const { data, error } = await this.supabase
      .from('planets')
      .select('*, stars(id, name, number, slug, is_challenge, planet_id)')
      .order('position', { ascending: true })
      .order('number', { foreignTable: 'stars', ascending: true })
      .returns<SupabasePlanet[]>()

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabasePlanetMapper.toEntity)
  }

  async findByPosition(position: OrdinalNumber): Promise<Planet | null> {
    const { data, error } = await this.supabase
      .from('planets')
      .select('*, stars(id, name, number, slug, is_challenge, planet_id)')
      .eq('position', position.value)
      .order('number', { foreignTable: 'stars', ascending: true })
      .single()

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return SupabasePlanetMapper.toEntity(data)
  }
}
