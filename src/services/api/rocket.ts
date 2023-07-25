import { Rocket } from '@/types/rocket'
import { createClient } from '../supabase-browser'

const supabase = createClient()

export default {
  getRocket: async (rocketId: string) => {
    const { data, error } = await supabase
      .from('rockets')
      .select('*')
      .eq('id', rocketId)
      .single<Rocket>()
    if (error) {
      throw new Error(error.message)
    }
    return data
  },
}
