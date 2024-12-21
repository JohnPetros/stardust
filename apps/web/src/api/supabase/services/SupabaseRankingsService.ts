import type { IRankingsService } from '@/@core/interfaces/services'
import type { RankingUser } from '@/@core/domain/entities'
import type { RankingUserDto, TierDto } from '#dtos'
import {
  DeleteLastWeekRankingUsersUnexpectedError,
  FetchRankingsWinnersUnexpectedError,
  FetchTiersUnexpectedError,
  ResetRankingUsersXpUnexpectedError,
  SaveRankingLosersUnexpectedError,
  SaveRankingWinnersUnexpectedError,
  TierNotFoundError,
} from '@/@core/errors/rankings'
import { ServiceResponse } from '@/@core/responses'

import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { SupabaseRankingUserMapper, SupabaseTierMapper } from '../mappers'
import { VerifyRankingLoserStatusUnexpectedError } from '@/@core/errors/rankings/VerifyRankingLoserStateUnexpectedError'
import { UpdateLastWeekRankingPositionsUnexpectedError } from '@/@core/errors/rankings/UpdateLastWeekRankingPositionsUnexpetedError'
import { FetchRankingsUsersUnexpectedError } from '@/@core/errors/rankings/FetchRankingUsersUnexpectedError'

export const SupabaseRankingsService = (supabase: Supabase): IRankingsService => {
  const supabaseTierMapper = SupabaseTierMapper()
  const supabaseRankingUserMapper = SupabaseRankingUserMapper()

  return {
    async fetchTierById(tierId: string) {
      const { data, error } = await supabase
        .from('tiers')
        .select('*')
        .eq('id', tierId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, TierNotFoundError)
      }

      const tier = supabaseTierMapper.toTier(data)

      return new ServiceResponse(tier)
    },

    async fetchTierByPosition(tierPosition: number) {
      const { data, error } = await supabase
        .from('tiers')
        .select('*')
        .eq('position', tierPosition)
        .single()

      if (error) {
        return SupabasePostgrestError(error, TierNotFoundError)
      }

      const tier = supabaseTierMapper.toTier(data)

      return new ServiceResponse(tier)
    },

    async fetchTiers() {
      const { data, error } = await supabase
        .from('tiers')
        .select('*')
        .order('position', { ascending: true })

      if (error) {
        return SupabasePostgrestError(error, FetchTiersUnexpectedError)
      }

      const ranking = data.map(supabaseTierMapper.toTier)

      return new ServiceResponse(ranking)
    },

    async fetchRankingUsersByTier(tierId: string) {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, slug, tier_id, xp:weekly_xp, avatar:avatars(name, image)')
        .eq('tier_id', tierId)
        .order('weekly_xp', { ascending: false })

      if (error) {
        return SupabasePostgrestError(error, FetchRankingsUsersUnexpectedError)
      }

      const rankingUsers: RankingUserDto[] = data.map((user, index) => ({
        id: user.id,
        name: user.name ?? '',
        slug: user.slug ?? '',
        avatar: {
          image: user.avatar?.image ?? '',
          name: user.avatar?.name ?? '',
        },
        tierId: user.tier_id ?? '',
        xp: user.xp,
        position: index + 1,
      }))

      return new ServiceResponse(rankingUsers)
    },

    async fetchLastWeekRankingUsersByTier(tierId: string) {
      const { data, error } = await supabase
        .from('users')
        .select(
          'id, name, slug, tier_id, xp:weekly_xp, last_week_ranking_position, avatar:avatars(name, image)',
        )
        .eq('tier_id', tierId)
        .not('last_week_ranking_position', 'is', null)
        .order('last_week_ranking_position', { ascending: false })

      if (error) {
        return SupabasePostgrestError(error, FetchRankingsWinnersUnexpectedError)
      }

      const rankingUsers: RankingUserDto[] = data.map((user, index) => ({
        id: user.id,
        name: user.name ?? '',
        slug: user.slug ?? '',
        avatar: {
          image: user.avatar?.image ?? '',
          name: user.avatar?.name ?? '',
        },
        tierId: user.tier_id ?? '',
        xp: user.xp,
        position: user.last_week_ranking_position ?? index,
      }))

      return new ServiceResponse(rankingUsers)
    },

    async fetchRankingWinnersByTier(tierId: string) {
      const { data, error } = await supabase
        .from('ranking_users')
        .select(
          'id, xp, tier_id, position, user:users(name, slug, avatar:avatars(name, image))',
        )
        .eq('status', 'winner')
        .eq('tier_id', tierId)
        .order('position', { ascending: true })
        .limit(3)

      console.log(data)

      if (error) {
        return SupabasePostgrestError(error, FetchRankingsWinnersUnexpectedError)
      }

      const rankingWinners = data.map(supabaseRankingUserMapper.toRankingUser)

      return new ServiceResponse(rankingWinners)
    },

    async fetchRankingLosersByTier(tierId: string) {
      throw new Error('Method not implemented')
    },

    async saveRankingLosers(losers: RankingUser[], tierId: string) {
      const { error } = await supabase.from('ranking_users').insert(
        // @ts-ignore
        losers.map((loser) => ({
          id: loser.id,
          xp: loser.xp.value,
          tier_id: tierId,
          status: 'loser',
          position: loser.rankingPosition.position.value,
        })),
      )

      if (error) {
        return SupabasePostgrestError(error, SaveRankingLosersUnexpectedError)
      }

      return new ServiceResponse(true)
    },

    async saveRankingWinners(winners: RankingUser[], tierId: string) {
      const { error } = await supabase.from('ranking_users').insert(
        // @ts-ignore
        winners.map((winner) => ({
          id: winner.id,
          xp: winner.xp.value,
          tier_id: tierId,
          status: 'winner',
          position: winner.rankingPosition.position.value,
        })),
      )

      if (error) {
        console.log({ tierId })
        return SupabasePostgrestError(error, SaveRankingWinnersUnexpectedError)
      }

      return new ServiceResponse(true)
    },

    async verifyRankingLoserState(rankingUserId: string) {
      const { error, data } = await supabase
        .from('ranking_users')
        .select('status')
        .eq('id', rankingUserId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, VerifyRankingLoserStatusUnexpectedError)
      }

      return new ServiceResponse(data.status === 'loser')
    },

    async updateRankingUsersTier(rankingUsers: RankingUser[], tierId: string) {
      const ids = rankingUsers.map((user) => user.id)

      const { error } = await supabase
        .from('users')
        .update({ tier_id: tierId })
        .in('id', ids)

      if (error) {
        return SupabasePostgrestError(error, TierNotFoundError)
      }

      return new ServiceResponse(true)
    },

    async updateLastWeekRankingPositions() {
      const { error } = await supabase.rpc('update_last_week_ranking_positions')

      if (error) {
        return SupabasePostgrestError(error, TierNotFoundError)
      }

      return new ServiceResponse(true)
    },

    async allowUsersSeeRankingResult() {
      const { error } = await supabase
        .from('users')
        .update({ can_see_ranking: true })
        .neq('id', 0)

      if (error) {
        return SupabasePostgrestError(
          error,
          UpdateLastWeekRankingPositionsUnexpectedError,
        )
      }

      return new ServiceResponse(true)
    },

    async deleteLastWeekRankingUsers() {
      const { error } = await supabase.from('ranking_users').delete().neq('id', 0)

      if (error) {
        return SupabasePostgrestError(error, DeleteLastWeekRankingUsersUnexpectedError)
      }

      return new ServiceResponse(true)
    },

    async resetRankingUsersXp() {
      const { error } = await supabase.from('users').update({ weekly_xp: 0 }).neq('id', 0)

      if (error) {
        return SupabasePostgrestError(error, ResetRankingUsersXpUnexpectedError)
      }

      return new ServiceResponse(true)
    },
  }
}
