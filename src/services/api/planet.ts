import { createClient } from '../supabase-browser'
import type { Planet } from '@/types/planet'

const supabase = createClient()

export default {
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
