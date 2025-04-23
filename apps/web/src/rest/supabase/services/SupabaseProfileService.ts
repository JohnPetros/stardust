import type { IProfileService } from '@stardust/core/global/interfaces'
import type { User } from '@stardust/core/global/entities'
import { RestResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { WeekStatus } from '@stardust/core/profile/structs'

import type { Supabase, SupabaseUser } from '../types'
import { SupabasePostgrestError } from '../errors'
import { SupabaseAchievementMapper, SupabaseUserMapper } from '../mappers'

export const SupabaseProfileService = (supabase: Supabase): IProfileService => {
  const supabaseUserMapper = SupabaseUserMapper()
  const supabaseAchievementMapper = SupabaseAchievementMapper()

  async function fetchUsersCompletedPlanets(userId: string) {
    const { data, error } = await supabase
      .from('users_completed_planets_view')
      .select('planet_id')
      .eq('user_id', userId)

    if (error) return []

    return data
  }

  return {
    async fetchUserById(userId: string) {
      const { data, error, status } = await supabase
        .from('users')
        .select(
          `*, 
          avatar:avatars(*), 
          rocket:rockets(*), 
          tier:tiers(*),
          users_unlocked_stars(star_id),
          users_unlocked_achievements(achievement_id),
          users_rescuable_achievements(achievement_id),
          users_acquired_rockets(rocket_id),
          users_acquired_avatars(avatar_id),
          users_completed_challenges(challenge_id),
          users_upvoted_solutions(solution_id),
          users_upvoted_comments(comment_id)`,
        )
        .eq('id', userId)
        .single()

      if (error) return SupabasePostgrestError(error, 'Usuário não encontrado', status)

      const supabaseUser: SupabaseUser = {
        ...data,
        users_completed_planets: await fetchUsersCompletedPlanets(data.id),
      }

      const userDto = supabaseUserMapper.toDto(supabaseUser)

      return new RestResponse({ body: userDto })
    },

    async fetchUserBySlug(userSlug: string) {
      const { data, error, status } = await supabase
        .from('users')
        .select(
          `*, 
          avatar:avatars(*), 
          rocket:rockets(*), 
          tier:tiers(*),
          users_unlocked_stars(star_id),
          users_unlocked_achievements(achievement_id),
          users_rescuable_achievements(achievement_id),
          users_acquired_rockets(rocket_id),
          users_acquired_avatars(avatar_id),
          users_completed_challenges(challenge_id),
          users_upvoted_solutions(solution_id),
          users_upvoted_comments(comment_id)`,
        )
        .eq('slug', userSlug)
        .single()

      if (error) return SupabasePostgrestError(error, 'Usuário não encontrado', status)

      const supabaseUser: SupabaseUser = {
        ...data,
        users_completed_planets: await fetchUsersCompletedPlanets(data.id),
      }

      const userDto = supabaseUserMapper.toDto(supabaseUser)
      return new RestResponse({ body: userDto })
    },

    async fetchUsers() {
      const { data, error, status } = await supabase.from('users').select(
        `*, 
        avatar:avatars(*), 
        rocket:rockets(*), 
        tier:tiers(*),
        users_unlocked_stars(star_id),
        users_unlocked_achievements(achievement_id),
        users_rescuable_achievements(achievement_id),
        users_acquired_rockets(rocket_id),
        users_acquired_avatars(avatar_id),
        users_completed_challenges(challenge_id),
        users_upvoted_solutions(solution_id),
        users_upvoted_comments(comment_id)`,
      )

      if (error)
        return SupabasePostgrestError(error, 'Erro inesperado ao buscar usuários', status)

      const usersDto = data.map(supabaseUserMapper.toDto)
      return new RestResponse({ body: usersDto })
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

      return new RestResponse({ body: data.name })
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

      return new RestResponse({ body: data.email })
    },

    async resetWeekStatus() {
      const { error } = await supabase
        .from('users')
        .update({ week_status: WeekStatus.DEFAULT_WEEK_STATUS })
        .neq('id', 0)

      if (error)
        return SupabasePostgrestError(
          error,
          'Erro ao fazer o reset do status da semana',
          HTTP_STATUS_CODE.notFound,
        )

      return new RestResponse()
    },

    async saveUser(user: User) {
      const supabaseUser = supabaseUserMapper.toSupabase(user)

      const { error } = await supabase.from('users').insert({
        // @ts-ignore
        id: user.id,
        name: supabaseUser.name,
        email: supabaseUser.email,
        slug: supabaseUser.slug,
        avatar_id: supabaseUser.avatar_id,
        rocket_id: supabaseUser.rocket_id,
        tier_id: supabaseUser.tier_id,
        coins: supabaseUser.coins,
        xp: supabaseUser.xp,
        weekly_xp: supabaseUser.weekly_xp,
        streak: supabaseUser.streak,
        level: supabaseUser.level,
        week_status: supabaseUser.week_status,
        created_at: supabaseUser.created_at,
      })

      if (error)
        return SupabasePostgrestError(error, 'Error inesperado ao cadastrar usuário')

      return new RestResponse()
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

      return new RestResponse({ body: achievements })
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

      return new RestResponse({ body: achievements })
    },

    async saveUnlockedAchievement(achievementId: string, userId: string) {
      const { error } = await supabase
        .from('users_unlocked_achievements')
        .insert({ achievement_id: achievementId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(error, 'Erro inesperado ao salvar conquista')
      }

      return new RestResponse()
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

      return new RestResponse()
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

      return new RestResponse()
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

      return new RestResponse()
    },
  }
}
