import type { IProfileService } from '@stardust/core/interfaces'
import type { User } from '@stardust/core/global/entities'
import { ApiResponse } from '@stardust/core/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/constants'

import type { Supabase } from '../types'
import { SupabasePostgrestError } from '../errors'
import { SupabaseAchievementMapper, SupabaseUserMapper } from '../mappers'
import { SupabaseSpaceService } from './SupabaseSpaceService'
import { Planet } from '@stardust/core/space/entities'

export const SupabaseProfileService = (supabase: Supabase): IProfileService => {
  const supabaseUserMapper = SupabaseUserMapper()
  const supabaseAchievementMapper = SupabaseAchievementMapper()

  return {
    async fetchUserById(userId: string) {
      const { data, error } = await supabase
        .from('users_view')
        .select('*, avatar:avatars(*), rocket:rockets(*), tier:tiers(*)')
        .eq('id', userId)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Usuário não encontrado',
          HTTP_STATUS_CODE.notFound,
        )
      }

      const userDto = supabaseUserMapper.toDto(data)

      return new ApiResponse({ body: userDto })
    },

    async fetchUserBySlug(userSlug: string) {
      const { data, error } = await supabase
        .from('users_view')
        .select('*, avatar:avatars(*), rocket:rockets(*), tier:tiers(*)')
        .eq('slug', userSlug)
        .single()

      if (error)
        return SupabasePostgrestError(
          error,
          'Usuário não encontrado',
          HTTP_STATUS_CODE.notFound,
        )

      const userDto = supabaseUserMapper.toDto(data)
      return new ApiResponse({ body: userDto })
    },

    async fetchUsers() {
      const { data, error } = await supabase
        .from('users_view')
        .select('*, avatar:avatars(*), rocket:rockets(*), tier:tiers(*)')

      if (error)
        return SupabasePostgrestError(
          error,
          'Usuário não encontrado',
          HTTP_STATUS_CODE.notFound,
        )

      const usersDto = data.map(supabaseUserMapper.toDto)
      return new ApiResponse({ body: usersDto })
    },

    async fetchUserName(name: string) {
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('name', name)
        .single()

      if (error)
        return SupabasePostgrestError(
          error,
          'Nome não encontrado com esse usuário',
          HTTP_STATUS_CODE.notFound,
        )

      return new ApiResponse({ body: data.name })
    },

    async fetchUserEmail(email: string) {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single()

      if (error)
        return SupabasePostgrestError(
          error,
          'E-mail não encontrado com esse usuário',
          HTTP_STATUS_CODE.notFound,
        )

      return new ApiResponse({ body: data.email })
    },

    async saveUser(user: User) {
      const { error } = await supabase.from('users').insert({
        id: user.id,
        name: user.name.value,
        email: user.email.value,
        slug: user.name.slug,
        avatar_id: user.avatar.id,
        rocket_id: user.rocket.id,
        tier_id: user.tier.id,
        coins: user.coins.value,
        xp: user.xp.value,
        weekly_xp: user.weeklyXp.value,
        streak: user.streak.value,
        level: user.level.value,
        week_status: user.weekStatus.statuses,
      })

      if (error)
        return SupabasePostgrestError(error, 'Error inesperado ao cadastrar usuário')

      return new ApiResponse()
    },

    async updateUser(user: User) {
      const supabaseUser = supabaseUserMapper.toSupabase(user)

      const { error } = await supabase
        .from('users')
        // @ts-ignore
        .update(supabaseUser)
        .eq('id', user.id)

      if (error) {
        return SupabasePostgrestError(error, 'Error inesperado ao atualizar usuário')
      }

      return new ApiResponse()
    },

    async fetchAchievements() {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('position', { ascending: true })

      if (error) {
        return SupabasePostgrestError(error, 'Error inesperado ao buscar conquistas')
      }

      const achievements = data.map(supabaseAchievementMapper.toDto)

      return new ApiResponse({ body: achievements })
    },

    async fetchUnlockedAchievements(userId: string) {
      const { data, error } = await supabase
        .from('achievements')
        .select('*, users_unlocked_achievements!inner(user_id)')
        .eq('users_unlocked_achievements.user_id', userId)
        .order('position', { ascending: true })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar conquistas desbloqueadas',
        )
      }

      const achievements = data.map(supabaseAchievementMapper.toDto)

      return new ApiResponse({ body: achievements })
    },

    async saveUnlockedAchievement(achievementId: string, userId: string) {
      const { error } = await supabase
        .from('users_unlocked_achievements')
        .insert({ achievement_id: achievementId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(error, 'Erro inesperado ao salvar conquista')
      }

      return new ApiResponse()
    },

    async saveRescuableAchievement(achievementId: string, userId: string) {
      const { error } = await supabase
        .from('users_rescuable_achievements')
        .insert({ achievement_id: achievementId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao salvar conquista resgatável',
        )
      }

      return new ApiResponse()
    },

    async deleteRescuableAchievement(achievementId: string, userId: string) {
      const { error } = await supabase
        .from('users_rescuable_achievements')
        .delete()
        .match({
          achievement_id: achievementId,
          user_id: userId,
        })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao remover conquista resgatável',
        )
      }

      return new ApiResponse()
    },
  }
}
