import type { IProfileService } from '@stardust/core/interfaces'
import type { User } from '@stardust/core/global/entities'
import { ApiResponse } from '@stardust/core/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/constants'

import type { Supabase } from '../types'
import { SupabasePostgrestError } from '../errors'
import { SupabaseAchievementMapper, SupabaseUserMapper } from '../mappers'

export const SupabaseProfileService = (supabase: Supabase): IProfileService => {
  const supabaseUserMapper = SupabaseUserMapper()
  const supabaseAchievementMapper = SupabaseAchievementMapper()

  return {
    async fetchUserById(userId: string) {
      const { data, error } = await supabase
        .from('users')
        .select(
          '*, avatar:avatars(*), rocket:rockets(*), tier:tiers(*), users_unlocked_stars(star_id), users_unlocked_achievements(achievement_id), users_acquired_rockets(rocket_id), users_acquired_avatars(avatar_id), users_completed_challenges(challenge_id), users_rescuable_achievements(achievement_id)',
        )
        .eq('id', userId)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Usuário não encontrado',
          HTTP_STATUS_CODE.notFound,
        )
      }

      const user = supabaseUserMapper.toDto(data)

      return new ApiResponse({ body: user })
    },

    async fetchUserBySlug(userSlug: string) {
      const { data, error } = await supabase
        .from('users')
        .select(
          '*, avatar:avatars(*), rocket:rockets(*), tier:tiers(*), users_unlocked_stars(star_id), users_unlocked_achievements(achievement_id), users_acquired_rockets(rocket_id), users_acquired_avatars(avatar_id), users_completed_challenges(challenge_id), users_rescuable_achievements(achievement_id)',
        )
        .eq('slug', userSlug)
        .single()

      if (error)
        return SupabasePostgrestError(
          error,
          'Usuário não encontrado',
          HTTP_STATUS_CODE.notFound,
        )

      const user = supabaseUserMapper.toDto(data)

      return new ApiResponse({ body: user })
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
