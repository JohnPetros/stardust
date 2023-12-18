import { IUserService } from './interfaces/IUserService'

import type { Supabase } from '@/@types/supabase'
import type { User, WinnerUser } from '@/@types/user'
import { slugify } from '@/utils/helpers'

export const UserService = (supabase: Supabase): IUserService => {
  return {
    getUserById: async (userId: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single<User>()

      if (error) {
        throw new Error(error.message)
      }
      return data
    },

    getUserBySlug: async (userSlug: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('slug', userSlug)
        .single<User>()

      if (error) {
        throw new Error(error.message)
      }
      return data
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
