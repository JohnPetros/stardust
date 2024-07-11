import { FetchPlanetsUnexpectedError } from '@/@core/errors/planets/FetchPlanetsUnexpectedError'
import { SupabasePostgrestError } from '../errors'
import { SupabasePlanetMapper } from '../mappers/SupabasePlanetMapper'
import type { Supabase } from '../types/Supabase'

export const SupabasePlanetsService = (supabase: Supabase) => {
  const supabasePlanetMapper = SupabasePlanetMapper()

  return {
    async fetchPlanets() {
      const { data, error } = await supabase
        .from('planets')
        .select('*, stars(*)')
        .order('position', { ascending: true })
        .order('number', { foreignTable: 'stars', ascending: true })

      if (error) {
        return SupabasePostgrestError(error, FetchPlanetsUnexpectedError)
      }

      const planets = data.map(supabasePlanetMapper.toPlanet)

      return planets
    },
  }
}
