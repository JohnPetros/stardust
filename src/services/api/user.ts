import { supabase } from '../supabase'

export default {
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .limit(1)
    if (error) {
      throw new Error(error.message)
    }
    const user = data[0]
    return user
  },

}
