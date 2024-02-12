import type { Supabase } from '../types/Supabase'

import type { Ranking } from '@/@types/Ranking'

export const SupabaseRankingsController = (supabase: Supabase) => {
  return {
    async getRankingById(rankingId: string) {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .eq('id', rankingId)
        .single<Ranking>()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },

    async getRankingsOrderedByPosition() {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('position', { ascending: true })
        .returns<Ranking[]>()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
  }
}
