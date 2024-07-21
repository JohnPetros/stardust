import type { IRankingsService } from '@/@core/interfaces/services'
import type { RankingUser } from '@/@core/domain/entities'
import type { RankingUserDTO, TierDTO } from '@/@core/dtos'
import { TierNotFoundError } from '@/@core/errors/rankings'
import { ServiceResponse } from '@/@core/responses'

import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { SupabaseRankingUserMapper, SupabaseTierMapper } from '../mappers'

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

    async fetchTiers() {
      const { data, error } = await supabase.from('tiers').select('*')

      if (error) {
        return SupabasePostgrestError(error, TierNotFoundError)
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
        return SupabasePostgrestError(error, TierNotFoundError)
      }

      const rankingUsers: RankingUserDTO[] = data.map((user) => ({
        id: user.id,
        name: user.name ?? '',
        slug: user.slug ?? '',
        avatar: {
          image: user.avatar?.image ?? '',
          name: user.avatar?.name ?? '',
        },
        tierId: user.tier_id ?? '',
        xp: user.xp,
      }))

      return new ServiceResponse(rankingUsers)
    },

    async fetchRankingWinnersByTier(tierId: string) {
      const { data, error } = await supabase
        .from('ranking_users')
        .select('id, xp, tier_id, user:users(name, slug, avatar:avatars(name, image))')
        .eq('tier_id', tierId)

      if (error) {
        return SupabasePostgrestError(error, TierNotFoundError)
      }

      const rankingWinners = data.map(supabaseRankingUserMapper.toRankingUser)

      return new ServiceResponse(rankingWinners)
    },

    async fetchRankingLosersByTier(tierId: string) {
      throw new Error('Method not implemented')
    },

    async fetchLastWeekTier(rankingUserId: string) {
      const { data, error } = await supabase
        .from('ranking_users')
        .select('tier:tiers(*)')
        .eq('id', rankingUserId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, TierNotFoundError)
      }

      if (data.tier) {
        const tier = supabaseTierMapper.toTier(data.tier)
        return new ServiceResponse(tier)
      }

      return new ServiceResponse<TierDTO>(null)
    },

    async saveRankingLosers(losers: RankingUser[], tierId: string) {
      const { error } = await supabase.from('ranking_users').insert(
        losers.map((loser) => ({
          id: loser.id,
          xp: loser.xp.value,
          tier_id: tierId,
          stauts: 'loser',
        }))
      )

      if (error) {
        return SupabasePostgrestError(error, TierNotFoundError)
      }

      return new ServiceResponse(true)
    },

    async saveRankingWinners(winners: RankingUser[], tierId: string) {
      await supabase.from('ranking_users').insert(
        winners.map((winner) => ({
          id: winner.id,
          xp: winner.xp.value,
          tier_id: tierId,
          stauts: 'winner',
        }))
      )

      return new ServiceResponse(true)
    },

    async checkRankingLoserState(rankingUserId: string) {
      const { error, data } = await supabase
        .from('ranking_users')
        .select('status')
        .eq('id', rankingUserId)
        .single()

      if (error) {
        return new ServiceResponse(false)
      }

      return new ServiceResponse(data.status === 'loser')
    },

    async updateLastWeekRankingPositions() {
      const { error } = await supabase.rpc('update_last_week_ranking_positions')

      if (error) {
        return SupabasePostgrestError(error, TierNotFoundError)
      }

      return new ServiceResponse(true)
    },

    async allowUsersSeeRankingResult() {
      await supabase.from('users').update({ can_see_ranking: true })

      return new ServiceResponse(true)
    },

    async resetRankingsState() {
      await Promise.all([
        supabase.from('ranking_users').delete(),
        supabase.from('users').update({ weekly_xp: 0 }),
      ])

      return new ServiceResponse(true)
    },
  }
}
