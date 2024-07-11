import type { IPlanetsService } from '@/@core/interfaces/services'
import { ServiceResponse } from '@/@core/responses'
import { FetchPlanetsUnexpectedError } from '@/@core/errors/planets/FetchPlanetsUnexpectedError'

import { SupabasePostgrestError } from '../errors'
import { SupabasePlanetMapper } from '../mappers/SupabasePlanetMapper'
import type { Supabase } from '../types/Supabase'
import type { SupabasePlanet } from '../types'

export const SupabasePlanetsService = (supabase: Supabase): IPlanetsService => {
  const supabasePlanetMapper = SupabasePlanetMapper()

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
  }
}
