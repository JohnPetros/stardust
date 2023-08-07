import { createClient } from '../supabase-browser'
import type { Star } from '@/types/star'

const supabase = createClient()

export default {
  getStar: async (starId: string) => {
    const { data, error } = await supabase
      .from('stars')
      .select('*')
      .eq('id', starId)
      .single<Star>()

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  getNextStar: async (currentStar: Star) => {
    const { data, error } = await supabase
      .from('stars')
      .select('*')
      .match({
        planet_id: currentStar.planet_id,
        number: currentStar.number + 1,
      })
      .single<Star>()

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  getUserUnlockedStars: async (userId: string) => {
    const { data, error } = await supabase
      .from('users_unlocked_stars')
      .select('*')
      .eq('user_id', userId)
    if (error) {
      throw new Error(error.message)
    }
    return data
  },
}
