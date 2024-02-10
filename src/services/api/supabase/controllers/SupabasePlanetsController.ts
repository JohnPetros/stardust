import { SupabasePlanetAdapter } from '../adapters/SupabasePlanetController'
import { Supabase } from '../types/Supabase'

export const SupabasePlanetsController = (supabase: Supabase) => {
  return {
    getPlanets: async () => {
      const { data, error } = await supabase
        .from('planets')
        .select('*, stars(id, name, number, slug)')
        .order('position', { ascending: true })
        .order('number', { foreignTable: 'stars', ascending: true })

      if (error) {
        throw new Error(error.message)
      }

      const planets = data.map(SupabasePlanetAdapter)

      return planets
    },
  }
}
