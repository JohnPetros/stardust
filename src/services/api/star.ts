import { createClient } from '../supabase-browser'

const supabase = createClient()

export default {
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
