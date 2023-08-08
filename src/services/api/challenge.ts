import { createClient } from '../supabase-browser'
import type { Challenge } from '@/types/challenge'

const supabase = createClient()

interface getFilteredChallengesProps {
  userId: string
  status: string
  difficulty: string
  categoriesIds: string[]
  search: string
  range: number
}

export default {
  getChallenges: async (userId: string) => {
    const { data, error } = await supabase
      .from('challenges')
      .select('*, users_completed_challenges (user_id)')
      .eq('users_completed_challenges.user_id', userId)
      .returns<Challenge[]>()

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  getFilteredChallenges: async ({
    userId,
    status,
    difficulty,
    categoriesIds,
    search,
    range,
  }: getFilteredChallengesProps) => {
    const { data, error } = await supabase
      .rpc('get_filtered_challenges', {
        userid: userId,
        _difficulty: difficulty,
        status,
        categories_ids: categoriesIds,
        search,
      })
      .returns<Challenge[]>()

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  getChallengeId: async (starId: string) => {
    const { data, error } = await supabase
      .from('challenges')
      .select('id')
      .eq('star_id', starId)

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
