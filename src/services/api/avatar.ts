'use client'
import { useSupabase } from '@/hooks/useSupabase'
import type { Avatar } from '@/@types/avatar'

export default () => {
  const { supabase } = useSupabase()

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

    getAvatars: async () => {
      const { data, error } = await supabase
        .from('avatars')
        .select('*')
        .order('price, name', { ascending: true })
        .returns<Avatar[]>()
      if (error) {
        throw new Error(error.message)
      }
      return data
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
