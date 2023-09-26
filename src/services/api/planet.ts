import { useSupabase } from '@/hooks/useSupabase'
import type { Planet } from '@/@types/planet'

export default () => {
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
