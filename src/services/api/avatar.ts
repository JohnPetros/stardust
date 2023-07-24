import { Planet } from '@/types/planet'
import { createClient } from '../supabase-browser'
import { Avatar } from '@/types/avatar'

const supabase = createClient()

export default {
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
}
