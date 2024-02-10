import type { IWinnersController } from '../../interfaces/IWinnersController'
import { SupabaseWinnerAdapter } from '../adapters/SupabaseWinnerAdapter'
import type { Supabase } from '../types/Supabase'

export const SupabaseWinnersController = (
  supabase: Supabase
): IWinnersController => {
  return {
    getWinnersByRankingId: async (rankingId: string) => {
      const { data, error } = await supabase
        .from('winners')
        .select('*')
        .eq('ranking_id', rankingId)

      if (error) {
        throw new Error(error.message)
      }

      const winners = data.map(SupabaseWinnerAdapter)

      return winners
    },
  }
}
