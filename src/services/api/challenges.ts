import { createClient } from '../supabase-browser'
import type { Challenge } from '@/types/challenge'

const supabase = createClient()

export default {
  getChallenges: async (
    range: number,
    userId: string,
    categoriesIds: string[]
  ) => {
    const { data, error } = await supabase
      .from('challenges')
      .select('*, users_completed_challenges(*)')
      // .range(range, range + 19)
      // .or('id.eq.2')
      // .filter('categories.id', 'in', "(" + categoriesIds.join() + ")")
      .returns<Challenge[]>()

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  getUserCompletedChallengesIds: async (userId: string) => {
    const { data, error } = await supabase
      .from('users_completed_challenges')
      .select('challenge_id')
      .eq('user_id', userId)

    if (error) {
      throw new Error(error.message)
    }

    return data
  },
}
