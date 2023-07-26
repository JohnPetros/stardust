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

  getRockets: async () => {
    const { data, error } = await supabase
      .from('rockets')
      .select('*')
      .order('price', { ascending: true })
      .returns<Rocket[]>()
    if (error) {
      throw new Error(error.message)
    }
    return data
  },

  getUserAcquiredRocketsIds: async (userId: string) => {
    const { data, error } = await supabase
      .from('users_acquired_rockets')
      .select('rocket_id')
      .eq('user_id', userId)
    if (error) {
      throw new Error(error.message)
    }

    return data.map((data) => data.rocket_id)
  },
}
