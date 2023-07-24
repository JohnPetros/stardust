import { createClient } from '../supabase-browser'
import type { Star } from '@/types/star'

const supabase = createClient()

export default {
  getUserUnlockedStars: async (userId: string) => {
    const { data, error } = await supabase
      .from('users_unlocked_stars')
      .select('*')
      .eq('user_id', userId)
      .returns<Star[]>()
    if (error) {
      throw new Error(error.message)
    }
    return data
  },
}
