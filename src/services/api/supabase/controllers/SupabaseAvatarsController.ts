import { IAvatarsController } from '../../interfaces/IAvatarsController'
import { SupabaseAvatarAdapter } from '../adapters/SupabaseAvatarAdapter'
import type { Supabase } from '../types/Supabase'

import type { Avatar } from '@/@types/Avatar'

export const SupabaseAvatarsController = (
  supabase: Supabase
): IAvatarsController => {
  return {
    async getAvatar(avatarId: string) {
      const { data, error } = await supabase
        .from('avatars')
        .select('*')
        .eq('id', avatarId)
        .single<Avatar>()

      if (error) {
        throw new Error(error.message)
      }

      const avatar = SupabaseAvatarAdapter(data)

      return avatar
    },

    async getFilteredAvatars({ search, offset, limit, priceOrder }) {
      const canSearch = search.length > 1

      const { data, count, error } = await supabase
        .from('avatars')
        .select('*', { count: 'exact', head: false })
        .order('price', { ascending: priceOrder === 'ascending' })
        .ilike(canSearch ? 'name' : '', canSearch ? `%${search}%` : '')
        .range(offset, limit)

      if (error) {
        throw new Error(error.message)
      }

      const avatars = data.map(SupabaseAvatarAdapter)

      return {
        avatars,
        count,
      }
    },

    async getUserAcquiredAvatarsIds(userId: string) {
      const { data, error } = await supabase
        .from('users_acquired_avatars')
        .select('avatar_id')
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      return data.map((data) => data.avatar_id)
    },

    async addUserAcquiredAvatar(avatarId: string, userId: string) {
      const { error } = await supabase
        .from('users_acquired_avatars')
        .insert([{ avatar_id: avatarId, user_id: userId }])

      if (error) {
        return error.message
      }
    },
  }
}
