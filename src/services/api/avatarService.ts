import { IAvatarService } from './interfaces/IAvatarService'

import type { Avatar } from '@/@types/avatar'
import type { Supabase } from '@/@types/supabase'

export const AvatarService = (supabase: Supabase): IAvatarService => {
  return {
    getAvatar: async (avatarId: string) => {
      const { data, error } = await supabase
        .from('avatars')
        .select('*')
        .eq('id', avatarId)
        .single<Avatar>()
      if (error) {
        throw new Error(error.message)
      }
      return data
    },

    getAvatars: async ({ search, offset, limit, priceOrder }) => {
      const canSearch = search.length > 1

      const { data, count, error } = await supabase
        .from('avatars')
        .select('*', { count: 'exact', head: false })
        .order('price', { ascending: priceOrder === 'ascending' })
        .ilike(canSearch ? 'name' : '', canSearch ? `%${search}%` : '')
        .range(offset, limit)
        .returns<Avatar[]>()

      if (error) {
        throw new Error(error.message)
      }

      return {
        avatars: data,
        count,
      }
    },

    getUserAcquiredAvatarsIds: async (userId: string) => {
      const { data, error } = await supabase
        .from('users_acquired_avatars')
        .select('avatar_id')
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      return data.map((data) => data.avatar_id)
    },

    addUserAcquiredAvatar: async (avatarId: string, userId: string) => {
      const { error } = await supabase
        .from('users_acquired_avatars')
        .insert([{ avatar_id: avatarId, user_id: userId }])

      if (error) {
        return error.message
      }
    },
  }
}
