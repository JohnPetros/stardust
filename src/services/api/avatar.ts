import { Planet } from '@/types/planet'
import { createClient } from '../supabase-browser'
import { Avatar } from '@/types/avatar'

const supabase = createClient()

export default {
  getAvatar: async (avatarId: string) => {
    const { data, error } = await supabase
      .from('avatars')
      .select('*')
      .eq('id', '557a33e8-ce8a-4ac2-992c-7eab630d186d')
      .single<Avatar>()
    if (error) {
      throw new Error(error.message)
    }
    return data
  },
}
