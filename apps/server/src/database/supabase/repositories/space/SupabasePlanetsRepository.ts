import type { Id, OrdinalNumber } from '@stardust/core/global/structures'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import type { Planet } from '@stardust/core/space/entities'

import type { SupabasePlanet, SupabaseStar } from '../../types'
import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'
import { SupabasePlanetMapper } from '../../mappers/space'

type SupabasePlanetRow = Omit<SupabasePlanet, 'stars'>
type SupabasePlanetStarRow = Partial<SupabaseStar> & {
  planet_id: string
  id: string
  name: string
  number: number
  slug: string
  is_challenge: boolean
}

export class SupabasePlanetsRepository
  extends SupabaseRepository
  implements PlanetsRepository
{
  private withDefaultCounts(
    planet: Partial<Omit<SupabasePlanet, 'stars'>> & {
      id: string
      name: string
      icon: string
      image: string
      position: number
    },
  ): Omit<SupabasePlanet, 'stars'> {
    return {
      ...planet,
      completion_count: planet.completion_count ?? 0,
      user_count: planet.user_count ?? 0,
      is_available: planet.is_available ?? false,
    }
  }

  private shouldFallbackPlanetCounts(error: { message: string } | null) {
    return Boolean(
      error?.message.includes('count_planet_completions') ||
        error?.message.includes('count_users_at_planet'),
    )
  }

  private shouldFallbackStarAvailability(error: { message: string } | null) {
    return Boolean(
      error?.message.includes("Could not find the 'is_available' column") ||
        error?.message.includes('column stars.is_available does not exist'),
    )
  }

  private buildPlanet(
    planet: Omit<SupabasePlanet, 'stars'>,
    stars: SupabaseStar[],
  ): Planet {
    return SupabasePlanetMapper.toEntity({
      ...planet,
      stars,
    })
  }

  private async findStarsByPlanetIds(planetIds: string[]) {
    if (planetIds.length === 0) {
      return new Map<string, SupabaseStar[]>()
    }

    const primaryResponse = await this.supabase
      .from('stars')
      .select(
        `planet_id,
          id,
          name,
          number,
          slug,
          is_available,
          is_challenge,
          user_count: count_users_at_star,
          unlock_count: count_star_unlocks`,
      )
      .in('planet_id', planetIds)
      .order('number', { ascending: true })

    let data = (primaryResponse.data as unknown as SupabasePlanetStarRow[] | null) ?? null
    let error = primaryResponse.error

    if (this.shouldFallbackStarAvailability(error)) {
      const fallbackResponse = await this.supabase
        .from('stars')
        .select(
          `planet_id,
            id,
            name,
            number,
            slug,
            is_challenge`,
        )
        .in('planet_id', planetIds)
        .order('number', { ascending: true })

      data = (fallbackResponse.data as unknown as SupabasePlanetStarRow[] | null) ?? null
      error = fallbackResponse.error
    }

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const starsByPlanetId = new Map<string, SupabaseStar[]>()

    for (const row of data ?? []) {
      const stars = starsByPlanetId.get(row.planet_id) ?? []
      stars.push({
        id: row.id,
        name: row.name,
        number: row.number,
        slug: row.slug,
        is_available: row.is_available ?? false,
        is_challenge: row.is_challenge,
        user_count: row.user_count ?? 0,
        unlock_count: row.unlock_count ?? 0,
      })
      starsByPlanetId.set(row.planet_id, stars)
    }

    return starsByPlanetId
  }

  async findAll(): Promise<Planet[]> {
    const primaryResponse = await this.supabase
      .from('planets')
      .select(`
        *,
        completion_count: count_planet_completions,
        user_count: count_users_at_planet
      `)
      .order('position', { ascending: true })
      .overrideTypes<Array<Omit<SupabasePlanet, 'stars'>>>()

    let data = (primaryResponse.data as unknown as SupabasePlanetRow[] | null) ?? null
    let error = primaryResponse.error

    if (this.shouldFallbackPlanetCounts(error)) {
      const fallbackResponse = await this.supabase
        .from('planets')
        .select('*')
        .order('position', { ascending: true })

      data = (fallbackResponse.data as unknown as SupabasePlanetRow[] | null) ?? null
      error = fallbackResponse.error
    }

    if (error) {
      throw new SupabasePostgreError(error)
    }

    if (!data) {
      return []
    }

    const normalizedPlanets = data.map((planet) => this.withDefaultCounts(planet))

    const starsByPlanetId = await this.findStarsByPlanetIds(
      normalizedPlanets.map((planet) => planet.id),
    )

    return normalizedPlanets.map((planet) =>
      this.buildPlanet(planet, starsByPlanetId.get(planet.id) ?? []),
    )
  }

  async findById(id: Id): Promise<Planet | null> {
    const primaryResponse = await this.supabase
      .from('planets')
      .select(`
        *,
        completion_count: count_planet_completions,
        user_count: count_users_at_planet
      `)
      .eq('id', id.value)
      .single<Omit<SupabasePlanet, 'stars'>>()

    let data = (primaryResponse.data as unknown as SupabasePlanetRow | null) ?? null
    let error = primaryResponse.error

    if (this.shouldFallbackPlanetCounts(error)) {
      const fallbackResponse = await this.supabase
        .from('planets')
        .select('*')
        .eq('id', id.value)
        .single<Omit<SupabasePlanet, 'stars'>>()

      data = (fallbackResponse.data as unknown as SupabasePlanetRow | null) ?? null
      error = fallbackResponse.error
    }

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    if (!data) {
      return null
    }

    const planet = this.withDefaultCounts(data)
    const starsByPlanetId = await this.findStarsByPlanetIds([planet.id])

    return this.buildPlanet(planet, starsByPlanetId.get(planet.id) ?? [])
  }

  async findByPosition(position: OrdinalNumber): Promise<Planet | null> {
    const primaryResponse = await this.supabase
      .from('planets')
      .select(`
        *,
        completion_count: count_planet_completions,
        user_count: count_users_at_planet
      `)
      .eq('position', position.value)
      .single<Omit<SupabasePlanet, 'stars'>>()

    let data = (primaryResponse.data as unknown as SupabasePlanetRow | null) ?? null
    let error = primaryResponse.error

    if (this.shouldFallbackPlanetCounts(error)) {
      const fallbackResponse = await this.supabase
        .from('planets')
        .select('*')
        .eq('position', position.value)
        .single<Omit<SupabasePlanet, 'stars'>>()

      data = (fallbackResponse.data as unknown as SupabasePlanetRow | null) ?? null
      error = fallbackResponse.error
    }

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    if (!data) {
      return null
    }

    const planet = this.withDefaultCounts(data)
    const starsByPlanetId = await this.findStarsByPlanetIds([planet.id])

    return this.buildPlanet(planet, starsByPlanetId.get(planet.id) ?? [])
  }

  async findByStar(starId: Id): Promise<Planet | null> {
    const primaryResponse = await this.supabase
      .from('planets')
      .select(`
        *,
        completion_count: count_planet_completions,
        user_count: count_users_at_planet,
        stars!inner(id)
      `)
      .eq('stars.id', starId.value)
      .single<Omit<SupabasePlanet, 'stars'>>()

    let data = (primaryResponse.data as unknown as SupabasePlanetRow | null) ?? null
    let error = primaryResponse.error

    if (this.shouldFallbackPlanetCounts(error)) {
      const fallbackResponse = await this.supabase
        .from('planets')
        .select('*, stars!inner(id)')
        .eq('stars.id', starId.value)
        .single<Omit<SupabasePlanet, 'stars'>>()

      data = (fallbackResponse.data as unknown as SupabasePlanetRow | null) ?? null
      error = fallbackResponse.error
    }

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    if (!data) {
      return null
    }

    const planet = this.withDefaultCounts(data)
    const starsByPlanetId = await this.findStarsByPlanetIds([planet.id])

    return this.buildPlanet(planet, starsByPlanetId.get(planet.id) ?? [])
  }

  async findLastPlanet(): Promise<Planet | null> {
    const primaryResponse = await this.supabase
      .from('planets')
      .select(`
        *,
        completion_count: count_planet_completions,
        user_count: count_users_at_planet
      `)
      .order('position', { ascending: false })
      .limit(1)
      .single<Omit<SupabasePlanet, 'stars'>>()

    let data = (primaryResponse.data as unknown as SupabasePlanetRow | null) ?? null
    let error = primaryResponse.error

    if (this.shouldFallbackPlanetCounts(error)) {
      const fallbackResponse = await this.supabase
        .from('planets')
        .select('*')
        .order('position', { ascending: false })
        .limit(1)
        .single<Omit<SupabasePlanet, 'stars'>>()

      data = (fallbackResponse.data as unknown as SupabasePlanetRow | null) ?? null
      error = fallbackResponse.error
    }

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    if (!data) {
      return null
    }

    const planet = this.withDefaultCounts(data)
    const starsByPlanetId = await this.findStarsByPlanetIds([planet.id])

    return this.buildPlanet(planet, starsByPlanetId.get(planet.id) ?? [])
  }

  async add(planet: Planet): Promise<void> {
    const input = {
      id: planet.id.value,
      name: planet.name.value,
      icon: planet.icon.value,
      image: planet.image.value,
      position: planet.position.value,
      is_available: planet.isAvailable.value,
    }

    const { error } = await this.supabase.from('planets').insert(input)

    if (error?.message.includes("Could not find the 'is_available' column")) {
      const { error: fallbackError } = await this.supabase.from('planets').insert({
        id: planet.id.value,
        name: planet.name.value,
        icon: planet.icon.value,
        image: planet.image.value,
        position: planet.position.value,
      })

      if (fallbackError) {
        throw new SupabasePostgreError(fallbackError)
      }

      return
    }

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
