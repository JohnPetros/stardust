'use client'
import type { Ranking } from '@/@types/ranking'
import { useSupabase } from '@/hooks/useSupabase'

export const RankingService = () => {
  const { supabase } = useSupabase()

  return {
    getRanking: async (rankingId: string) => {
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

    getRankings: async () => {
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
