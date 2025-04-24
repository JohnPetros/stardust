import type { RankingService } from '@stardust/core/global/interfaces'
import type { RankingUser } from '@stardust/core/ranking/entities'
import type { RankingUserDto } from '@stardust/core/ranking/dtos'
import { RestResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { SupabaseRankingUserMapper, SupabaseTierMapper } from '../mappers'

export const SupabaseRankingService = (supabase: Supabase): RankingService => {
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

      return new RestResponse({ body: tier })
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

      return new RestResponse({ body: tier })
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

      return new RestResponse({ body: ranking })
    },

    async fetchFirstTier() {
      const { data, error } = await supabase
        .from('tiers')
        .select('*')
        .eq('position', 1)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Primeiro tier não encontrado',
          HTTP_STATUS_CODE.notFound,
        )
      }

      const ranking = supabaseTierMapper.toTier(data)

      return new RestResponse({ body: ranking })
    },

    async fetchRankingUsersByTier(tierId: string) {
      const { data, error, status } = await supabase
        .from('users')
        .select('id, name, slug, tier_id, xp:weekly_xp, avatar:avatars(name, image)')
        .eq('tier_id', tierId)
        .order('weekly_xp', { ascending: false })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar usuários desse ranking',
          status,
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

      return new RestResponse({ body: rankingUsers })
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

      return new RestResponse({ body: rankingUsers })
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

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar usuários vencedores desse ranking',
        )
      }

      const rankingWinners = data.map(supabaseRankingUserMapper.toRankingUser)

      return new RestResponse({ body: rankingWinners })
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

      return new RestResponse()
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
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao salvar usuários vencedores desse ranking',
        )
      }

      return new RestResponse({ body: true })
    },

    async fetchLastWeekRankingUserTierPosition(rankingUserId: string) {
      const { error, data } = await supabase
        .from('ranking_users')
        .select('tiers(position)')
        .eq('id', rankingUserId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, 'Erro ao buscar esse usuário de ranking')
      }

      return new RestResponse({ body: { position: data.tiers?.position as number } })
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

      return new RestResponse({ body: true })
    },

    async updateLastWeekRankingPositions() {
      const { error } = await supabase.rpc('update_last_week_ranking_positions')

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao atualizar o tier desses usuários',
        )
      }

      return new RestResponse()
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

      return new RestResponse()
    },

    async deleteLastWeekRankingUsers() {
      const { error } = await supabase.from('ranking_users').delete().neq('id', 0)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao remover que os usuários do ranking da semana passada',
        )
      }

      return new RestResponse()
    },

    async resetRankingUsersXp() {
      const { error } = await supabase.from('users').update({ weekly_xp: 0 }).neq('id', 0)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao fazer o reset do ranking',
        )
      }

      return new RestResponse()
    },
  }
}
