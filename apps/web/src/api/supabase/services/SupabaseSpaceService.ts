import type { ISpaceService } from '@stardust/core/interfaces'
import type { Planet } from '@stardust/core/space/entities'
import type { PlanetDto } from '@stardust/core/space/dtos'
import { ApiResponse } from '@stardust/core/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/constants'

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
        return SupabasePostgrestError(error, 'Erro inesperado ao buscar planetas')
      }

      const planets = data.map(supabasePlanetMapper.toDto)

      return new ApiResponse({ body: planets })
    },

    async fetchPlanetByStar(starId: string) {
      const response = await this.fetchStarById(starId)

      if (response.isFailure) {
        return new ApiResponse<PlanetDto>({ errorMessage: response.errorMessage })
      }

      const { data, error } = await supabase
        .from('planets')
        .select('*, stars(id, name, number, slug, is_challenge, planet_id)')
        .eq('id', response.body.planetId)
        .order('number', { foreignTable: 'stars', ascending: true })
        .single<SupabasePlanet>()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar planeta dessa estrela',
        )
      }

      const planet = supabasePlanetMapper.toDto(data)

      return new ApiResponse({ body: planet })
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

      return new ApiResponse({ body: planet })
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

      return new ApiResponse({ body: star })
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

      return new ApiResponse({ body: starDto })
    },

    async saveUserUnlockedStar(starId: string, userId: string) {
      const { error } = await supabase
        .from('users_unlocked_stars')
        .insert({ star_id: starId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(error, 'Erro inesperado ao desbloquear estrela')
      }

      return new ApiResponse()
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

      return new ApiResponse({ body: star })
    },

    async verifyStarIsUnlocked(starId: string, userId: string) {
      const { data, error } = await supabase
        .from('users_unlocked_stars')
        .select('star_id, user_id')
        .eq('star_id', starId)
        .eq('user_id', userId)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Estrela inseperado ao verificar status de bloqueio dessa estrela',
        )
      }

      return new ApiResponse({ body: Boolean(data) })
    },
  }
}
