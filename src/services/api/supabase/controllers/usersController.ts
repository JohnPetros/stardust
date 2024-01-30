import { IUsersController } from '../../interfaces/IUsersController'
import type { Supabase } from '../types/supabase'

import type { User, WinnerUser } from '@/@types/user'
import { slugify } from '@/utils/helpers'

export const UsersController = (supabase: Supabase): IUsersController => {
  return {
    getUserById: async (userId: string) => {
      const { data, error } = await supabase
        .rpc('get_user_by_id', {
          _user_id: userId,
        })
        .single<User>()

      if (error) {
        throw new Error(error.message)
      }

      const user: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        slug: data.slug,
        level: data.level,
        coins: data.coins,
        xp: data.xp,
        weekly_xp: data.weekly_xp,
        avatar_id: data.avatar_id,
        ranking_id: data.ranking_id,
        rocket_id: data.rocket_id,
        acquired_rockets_count: data.acquired_rockets_count,
        completed_challenges_count: data.completed_challenges_count,
        completed_planets_count: data.completed_planets_count,
        unlocked_stars_count: data.unlocked_stars_count,
        last_position: data.last_position,
        study_time: data.study_time,
        unlocked_achievements_count: data.unlocked_achievements_count,
        did_update_ranking: data.did_update_ranking,
        created_at: data.created_at,
        did_break_streak: data.did_break_streak,
        is_admin: data.is_admin,
        did_complete_saturday: data.did_complete_saturday,
        streak: data.streak,
        week_status: data.week_status,
        is_loser: data.is_loser,
      }

      return user
    },

    getUserBySlug: async (userSlug: string) => {
      const { data, error } = await supabase
        .rpc('get_user_by_slug', {
          _user_slug: userSlug,
        })
        .single<User>()

      if (error) {
        throw new Error(error.message)
      }

      const user: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        slug: data.slug,
        level: data.level,
        coins: data.coins,
        xp: data.xp,
        weekly_xp: data.weekly_xp,
        avatar_id: data.avatar_id,
        ranking_id: data.ranking_id,
        rocket_id: data.rocket_id,
        acquired_rockets_count: data.acquired_rockets_count,
        completed_challenges_count: data.completed_challenges_count,
        completed_planets_count: data.completed_planets_count,
        unlocked_stars_count: data.unlocked_stars_count,
        last_position: data.last_position,
        study_time: data.study_time,
        unlocked_achievements_count: data.unlocked_achievements_count,
        did_update_ranking: data.did_update_ranking,
        created_at: data.created_at,
        did_break_streak: data.did_break_streak,
        is_admin: data.is_admin,
        did_complete_saturday: data.did_complete_saturday,
        streak: data.streak,
        week_status: data.week_status,
        is_loser: data.is_loser,
      }

      return user
    },

    getUserEmail: async (email: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single()

      if (error) return null

      return data
    },

    updateUser: async (newUserData: Partial<User>, userId: string) => {
      const { error } = await supabase
        .from('users')
        .update(newUserData)
        .eq('id', userId)

      if (error) {
        throw new Error(error.message)
      }
    },

    getUsersByRanking: async (rankingId: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('ranking_id', rankingId)
        .order('weekly_xp', { ascending: false })
        .returns<User[]>()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },

    getWinnerUsers: async (lastWeekRankingId: string) => {
      const { data, error } = await supabase
        .from('winners')
        .select('*')
        .eq('ranking_id', lastWeekRankingId)
        .returns<WinnerUser[]>()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },

    addUser: async ({
      id,
      name,
      email,
    }: Pick<User, 'id' | 'name' | 'email'>) => {
      const { error } = await supabase.from('users').insert({
        id,
        name,
        email,
        slug: slugify(name),
      })
      if (error) {
        throw new Error(error.message)
      }
    },
  }
}
