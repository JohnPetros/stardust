import type { IRankingService } from '@stardust/core/interfaces'
import type { RankingUser } from '@stardust/core/ranking/entities'
import type { RankingUserDto } from '@stardust/core/ranking/dtos'

import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { SupabaseRankingUserMapper, SupabaseTierMapper } from '../mappers'
import { ApiResponse } from '@stardust/core/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/constants'

export const SupabaseRankingService = (supabase: Supabase): IRankingService => {
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
        return SupabasePostgrestError(
          error,
          'Tier não encontrado',
          HTTP_STATUS_CODE.notFound,
        )
      }

      const tier = supabaseTierMapper.toTier(data)

      return new ApiResponse({ body: tier })
    },

    async fetchTierByPosition(tierPosition: number) {
      const { data, error } = await supabase
        .from('tiers')
        .select('*')
        .eq('position', tierPosition)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Tier não encontrado para essa posição',
          HTTP_STATUS_CODE.notFound,
        )
      }

      const tier = supabaseTierMapper.toTier(data)

      return new ApiResponse({ body: tier })
    },

    async fetchTiers() {
      const { data, error } = await supabase
        .from('tiers')
        .select('*')
        .order('position', { ascending: true })

      if (error) {
        return SupabasePostgrestError(error, 'Erro inesperado ao buscar tiers')
      }

      const ranking = data.map(supabaseTierMapper.toTier)

      return new ApiResponse({ body: ranking })
    },

    async fetchRankingUsersByTier(tierId: string) {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, slug, tier_id, xp:weekly_xp, avatar:avatars(name, image)')
        .eq('tier_id', tierId)
        .order('weekly_xp', { ascending: false })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar usuários desse ranking',
        )
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

      return new ApiResponse({ body: rankingUsers })
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
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar usuários do ranking da semana passada',
        )
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

      return new ApiResponse({ body: rankingUsers })
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
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar usuários vencedores desse ranking',
        )
      }

      const rankingWinners = data.map(supabaseRankingUserMapper.toRankingUser)

      return new ApiResponse({ body: rankingWinners })
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
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao salvar usuários perdedores desse ranking',
        )
      }

      return new ApiResponse()
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
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao salvar usuários vencedores desse ranking',
        )
      }

      return new ApiResponse({ body: true })
    },

    async verifyRankingLoserState(rankingUserId: string) {
      const { error, data } = await supabase
        .from('ranking_users')
        .select('status')
        .eq('id', rankingUserId)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao verificar o status de perdedor desse usuário',
        )
      }

      return new ApiResponse({ body: data.status === 'loser' })
    },

    async updateRankingUsersTier(rankingUsers: RankingUser[], tierId: string) {
      const ids = rankingUsers.map((user) => user.id)

      const { error } = await supabase
        .from('users')
        .update({ tier_id: tierId })
        .in('id', ids)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao atualizar o tier desses usuários',
        )
      }

      return new ApiResponse({ body: true })
    },

    async updateLastWeekRankingPositions() {
      const { error } = await supabase.rpc('update_last_week_ranking_positions')

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao atualizar o tier desses usuários',
        )
      }

      return new ApiResponse()
    },

    async allowUsersSeeRankingResult() {
      const { error } = await supabase
        .from('users')
        .update({ can_see_ranking: true })
        .neq('id', 0)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao permitir que os usuários vejam o resultado do ranking',
        )
      }

      return new ApiResponse()
    },

    async deleteLastWeekRankingUsers() {
      const { error } = await supabase.from('ranking_users').delete().neq('id', 0)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao remover que os usuários do ranking da semana passada',
        )
      }

      return new ApiResponse()
    },

    async resetRankingUsersXp() {
      const { error } = await supabase.from('users').update({ weekly_xp: 0 }).neq('id', 0)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao fazer o reset do ranking',
        )
      }

      return new ApiResponse()
    },
  }
}
