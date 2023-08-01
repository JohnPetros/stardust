import { createClient } from '../supabase-browser'
import type { Challenge } from '@/types/challenge'

const supabase = createClient()

interface getFilteredChallengesProps {
  userId: string
  status: string
  difficulty: string
  categoriesIds: string[]
  range: number
}

export default {
  getFilteredChallenges: async ({
    userId,
    status,
    difficulty,
    categoriesIds,
    range,
  }: getFilteredChallengesProps) => {
    const { data, error } = await supabase
      .rpc('get_filtered_challenges', {
        userid: userId,
        _difficulty: difficulty,
        status,
        categories_ids: categoriesIds,
      })
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

    return data.map((data) => data.challenge_id)
  },
}
