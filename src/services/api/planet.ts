import { Planet } from '@/types/planet'
import { createClient } from '../supabase-browser'

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
