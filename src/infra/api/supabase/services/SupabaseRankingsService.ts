import type { IRankingsService } from '@/@core/interfaces/services'
import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import {
  FetchRankingsUnexpectedError,
  FetchRankingsWinnersUnexpectedError,
  RankingNotFoundError,
} from '@/@core/errors/rankings'
import { ServiceResponse } from '@/@core/responses'
import {
  SupabaseRankingWinnerMapper,
  SupabaseRankingUserMapper,
  SupabaseRankingMapper,
} from '../mappers'
import { FetchRankingsUsersUnexpectedError } from '@/@core/errors/rankings/FetchRankingUsersUnexpectedError'

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

    async fetchRankings() {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('position', { ascending: true })

      if (error) {
        return SupabasePostgrestError(error, FetchRankingsUnexpectedError)
      }

      const rankings = data.map(supabaseRankingMapper.toRanking)

      return new ServiceResponse(rankings)
    },

    async fetchRankingUsers(rankingId: string) {
      const supabaseRankedUserMapper = SupabaseRankingUserMapper()

      const { data, error } = await supabase
        .from('users')
        .select('id, slug, name, weekly_xp, avatars(*)')
        .eq('ranking_id', rankingId)
        .order('weekly_xp', { ascending: false })

      if (error) {
        return SupabasePostgrestError(error, FetchRankingsUsersUnexpectedError)
      }

      const rankingsUsers = data.map(supabaseRankedUserMapper.toDTO)

      return new ServiceResponse(rankingsUsers)
    },

    async fetchRankingWinners(rankingId: string) {
      const supabaseRankingWinnerMapper = SupabaseRankingWinnerMapper()

      const { data, error } = await supabase
        .from('winners')
        .select('*, avatars(*)')
        .eq('ranking_id', rankingId)

      if (error) {
        return SupabasePostgrestError(error, FetchRankingsWinnersUnexpectedError)
      }

      const rakingwinners = data.map(supabaseRankingWinnerMapper.toDTO)

      return new ServiceResponse(rakingwinners)
    },
  }
}
