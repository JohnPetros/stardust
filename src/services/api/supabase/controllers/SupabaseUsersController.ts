import { IUsersController } from '../../interfaces/IUsersController'
import { SupabaseUserReverseAdapter } from '../adapters/reverse/SupabaseUserReverseAdapter'
import { SupabaseUserAdapter } from '../adapters/SupabaseUserAdapter'
import type { Supabase } from '../types/Supabase'

import type { User } from '@/@types/User'
import { slugify } from '@/global/helpers'

export const SupabaseUsersController = (
  supabase: Supabase
): IUsersController => {
  return {
    async getUserById(userId: string) {
      const { data, error } = await supabase
        .rpc('get_user_by_id', {
          _user_id: userId,
        })
        .single()

      if (error) {
        throw new Error(error.message)
      }

      const user = SupabaseUserAdapter(data)

      return user
    },

    async getUserBySlug(userSlug: string) {
      const { data, error } = await supabase
        .rpc('get_user_by_slug', {
          _user_slug: userSlug,
        })
        .single()

      if (error) {
        throw new Error(error.message)
      }

      const user = SupabaseUserAdapter(data)

      return user
    },

    async getUserEmail(email: string) {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single()

      if (error) return null

      return data
    },

    async addUser({ id, name, email }: Pick<User, 'id' | 'name' | 'email'>) {
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

    async getUsersByRanking(rankingId: string) {
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

    async updateUser(partialUserData: Partial<User>, userId: string) {
      const partialSupabaseUser = SupabaseUserReverseAdapter(partialUserData)

      const { error } = await supabase
        .from('users')
        .update(partialSupabaseUser as User)
        .eq('id', userId)

      if (error) {
        throw new Error(error.message)
      }
    },
  }
}
