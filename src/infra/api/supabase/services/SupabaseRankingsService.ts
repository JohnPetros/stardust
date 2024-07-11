import type { IRankingsService } from '@/@core/interfaces/services'
import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import {
  FetchRankingsOrderedByPositionUnexpectedError,
  RankingNotFoundError,
} from '@/@core/errors/rankings'
import { ServiceResponse } from '@/@core/responses'
import { SupabaseRankingMapper } from '../mappers'

export const SupabaseRankingsService = (supabase: Supabase): IRankingsService => {
  const supabaseRankingMapper = SupabaseRankingMapper()

  return {
    async fetchRankingById(rankingId: string) {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .eq('id', rankingId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, RankingNotFoundError)
      }

      const ranking = supabaseRankingMapper.toRanking(data)

      return new ServiceResponse(ranking)
    },

    async fetchRankingsOrderedByPosition() {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('position', { ascending: true })

      if (error) {
        return SupabasePostgrestError(
          error,
          FetchRankingsOrderedByPositionUnexpectedError
        )
      }

      const rankings = data.map(supabaseRankingMapper.toRanking)

      return new ServiceResponse(rankings)
    },
  }
}
