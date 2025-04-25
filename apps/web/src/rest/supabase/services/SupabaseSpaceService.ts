import type { SpaceService } from '@stardust/core/global/interfaces'
import type { Planet } from '@stardust/core/space/entities'
import { RestResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import type { Supabase } from '../types/Supabase'
import { SupabasePlanetMapper, SupabaseStarMapper } from '../mappers'
import { SupabasePostgrestError } from '../errors'
import type { SupabasePlanet } from '../types'

export const SupabaseSpaceService = (supabase: Supabase): SpaceService => {
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
        return SupabasePostgrestError(error, 'Erro inesperado ao buscar planetas')
      }

      const planets = data.map(supabasePlanetMapper.toDto)

      return new RestResponse({ body: planets })
    },

    async fetchPlanetByStar(starId: string) {
      const { data: starData, error: starError } = await supabase
        .from('stars')
        .select('planet_id')
        .eq('id', starId)
        .single()

      if (starError) {
        return SupabasePostgrestError(
          starError,
          'Erro inesperado ao buscar planeta dessa estrela',
        )
      }

      const { data, error } = await supabase
        .from('planets')
        .select('*, stars(id, name, number, slug, is_challenge, planet_id)')
        .eq('id', starData.planet_id)
        .order('number', { foreignTable: 'stars', ascending: true })
        .single<SupabasePlanet>()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar planeta dessa estrela',
        )
      }

      return new RestResponse({ body: supabasePlanetMapper.toDto(data) })
    },

    async fetchFirstPlanet() {
      const { data, error } = await supabase
        .from('planets')
        .select('*, stars(id, name, number, slug, is_challenge, planet_id)')
        .eq('position', 1)
        .order('number', { foreignTable: 'stars', ascending: true })
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Planeta não encontrado',
          HTTP_STATUS_CODE.notFound,
        )
      }

      const planet = supabasePlanetMapper.toDto(data)

      return new RestResponse({ body: planet })
    },

    async fetchStarBySlug(starSlug: string) {
      const { data, error } = await supabase
        .from('stars')
        .select('*')
        .eq('slug', starSlug)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Estrela não encontrada',
          HTTP_STATUS_CODE.notFound,
        )
      }

      const star = supabaseStarMapper.toDto(data)

      return new RestResponse({ body: star })
    },

    async fetchStarById(starId: string) {
      const { data, error } = await supabase
        .from('stars')
        .select('id, name, number, slug, is_challenge, planet_id')
        .eq('id', starId)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Estrela não encontrada',
          HTTP_STATUS_CODE.notFound,
        )
      }

      const starDto = supabaseStarMapper.toDto(data)

      return new RestResponse({ body: starDto })
    },

    async saveUnlockedStar(starId: string, userId: string) {
      const { error } = await supabase
        .from('users_unlocked_stars')
        .insert({ star_id: starId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(error, 'Erro inesperado ao desbloquear estrela')
      }

      return new RestResponse()
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
        return SupabasePostgrestError(
          error,
          'Próxima estrela não encontrada',
          HTTP_STATUS_CODE.notFound,
        )
      }

      const star = supabaseStarMapper.toDto(data)

      return new RestResponse({ body: star })
    },
  }
}
