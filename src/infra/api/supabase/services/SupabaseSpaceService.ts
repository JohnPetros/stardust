import type { ISpaceService } from '@/@core/interfaces/services'
import type { PlanetDTO } from '@/@core/dtos'
import type { Planet } from '@/@core/domain/entities'
import { ServiceResponse } from '@/@core/responses'
import { SaveUnlockedStarUnexpectedError, StarNotFoundError } from '@/@core/errors/stars'
import { FetchPlanetsUnexpectedError } from '@/@core/errors/planets/FetchPlanetsUnexpectedError'

import type { Supabase } from '../types/Supabase'
import { SupabasePlanetMapper, SupabaseStarMapper } from '../mappers'
import { SupabasePostgrestError } from '../errors'
import type { SupabasePlanet } from '../types'

export const SupabaseSpaceService = (supabase: Supabase): ISpaceService => {
  const supabasePlanetMapper = SupabasePlanetMapper()
  const supabaseStarMapper = SupabaseStarMapper()

  return {
    async fetchPlanets() {
      const { data, error } = await supabase
        .from('planets')
        .select('*, stars(id, name, number, slug, is_challenge, planet_id)')
        .order('position', { ascending: true })
        .order('number', { foreignTable: 'stars', ascending: true })
        .returns<SupabasePlanet[]>()

      if (error) {
        return SupabasePostgrestError(error, FetchPlanetsUnexpectedError)
      }

      const planets = data.map(supabasePlanetMapper.toDTO)

      return new ServiceResponse(planets)
    },

    async fetchPlanetByStar(starId: string) {
      const response = await this.fetchStarById(starId)

      if (response.isFailure) {
        return new ServiceResponse<PlanetDTO>(null, response.error)
      }

      const { data, error } = await supabase
        .from('planets')
        .select('*, stars(id, name, number, slug, is_challenge, planet_id)')
        .eq('id', response.data.planetId)
        .order('number', { foreignTable: 'stars', ascending: true })
        .single<SupabasePlanet>()

      if (error) {
        return SupabasePostgrestError(error, FetchPlanetsUnexpectedError)
      }

      const planet = supabasePlanetMapper.toDTO(data)

      return new ServiceResponse(planet)
    },

    async fetchStarBySlug(starSlug: string) {
      const { data, error } = await supabase
        .from('stars')
        .select('*')
        .eq('slug', starSlug)
        .single()

      if (error) {
        return SupabasePostgrestError(error, StarNotFoundError)
      }

      const star = supabaseStarMapper.toDTO(data)

      return new ServiceResponse(star)
    },

    async fetchStarById(starId: string) {
      const { data, error } = await supabase
        .from('stars')
        .select('id, name, number, slug, is_challenge, planet_id')
        .eq('id', starId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, StarNotFoundError)
      }

      const starDTO = supabaseStarMapper.toDTO(data)

      return new ServiceResponse(starDTO)
    },

    async saveUserUnlockedStar(starId: string, userId: string) {
      const { error } = await supabase
        .from('users_unlocked_stars')
        .insert({ star_id: starId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(error, SaveUnlockedStarUnexpectedError)
      }

      return new ServiceResponse(true)
    },

    async fetchNextStarFromNextPlanet(starPlanet: Planet) {
      const { data, error } = await supabase
        .from('stars')
        .select(
          'id, name, number, slug, is_challenge, planet_id, planets!inner(position)',
        )
        .eq('number', 1)
        .eq('planets.position', starPlanet.position.incrementOne().value)
        .single()

      if (error) {
        return SupabasePostgrestError(error, StarNotFoundError)
      }

      const star = supabaseStarMapper.toDTO(data)

      return new ServiceResponse(star)
    },

    async verifyStarIsUnlocked(starId: string, userId: string) {
      const { data, error } = await supabase
        .from('users_unlocked_stars')
        .select('star_id, user_id')
        .eq('star_id', starId)
        .eq('user_id', userId)
        .single()

      if (error) {
        return new ServiceResponse(false)
      }

      return new ServiceResponse(Boolean(data))
    },

    async savePlanet(planet) {
      throw new Error('Not implemented')
    },
  }
}
