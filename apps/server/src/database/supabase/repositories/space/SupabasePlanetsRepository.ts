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
      .select('*, stars(id, name, number, slug, is_available, is_challenge)')
      .order('position', { ascending: true })
      .order('number', { foreignTable: 'stars', ascending: true })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabasePlanetMapper.toEntity)
  }

  async findById(id: Id): Promise<Planet | null> {
    const { data, error } = await this.supabase
      .from('planets_view')
      .select('*, stars(id, name, number, slug, is_available, is_challenge)')
      .eq('id', id.value)
      .order('number', { foreignTable: 'stars', ascending: true })
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabasePlanetMapper.toEntity(data)
  }

  async findByPosition(position: OrdinalNumber): Promise<Planet | null> {
    const { data, error } = await this.supabase
      .from('planets_view')
      .select('*, stars(id, name, number, slug, is_available, is_challenge)')
      .eq('position', position.value)
      .order('number', { foreignTable: 'stars', ascending: true })
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabasePlanetMapper.toEntity(data)
  }

  async findByStar(starId: Id): Promise<Planet | null> {
    const { data, error } = await this.supabase
      .from('planets_view')
      .select('*, stars!inner(id, name, number, slug, is_available, is_challenge)')
      .eq('stars.id', starId.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    const { data: stars, error: starsError } = await this.supabase
      .from('stars')
      .select('*')
      .eq('planet_id', data?.id ?? '')

    if (starsError) {
      return this.handleQueryPostgresError(starsError)
    }

    data.stars = stars

    return SupabasePlanetMapper.toEntity(data)
  }

  async findLastPlanet(): Promise<Planet | null> {
    const { data, error } = await this.supabase
      .from('planets_view')
      .select('*, stars!inner(id, name, number, slug, is_available, is_challenge)')
      .order('position', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabasePlanetMapper.toEntity(data)
  }

  async add(planet: Planet): Promise<void> {
    const { error } = await this.supabase.from('planets').insert({
      name: planet.name.value,
      icon: planet.icon.value,
      image: planet.image.value,
      position: planet.position.value,
      is_available: planet.isAvailable.value,
    })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replace(planet: Planet): Promise<void> {
    const { error } = await this.supabase
      .from('planets')
      .update({
        name: planet.name.value,
        icon: planet.icon.value,
        image: planet.image.value,
        position: planet.position.value,
      })
      .eq('id', planet.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replaceMany(planets: Planet[]): Promise<void> {
    await Promise.all(planets.map((planet) => this.replace(planet)))
  }

  async remove(planetId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('planets')
      .delete()
      .eq('id', planetId.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
