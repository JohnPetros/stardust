import type { Planet } from '@/@types/planet'
import { useSupabase } from '@/hooks/useSupabase'

export const PlanetService = () => {
  const { supabase } = useSupabase()

  return {
    getPlanets: async () => {
      const { data, error } = await supabase
        .from('planets')
        .select('*, stars (*)')
        .order('position', { ascending: true })
        .order('number', { foreignTable: 'stars', ascending: true })
        .returns<Planet[]>()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
  }
}
