import { createClient } from '../supabase-browser'

const supabase = createClient()

export const user = {
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
  getEmail: async (email: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .limit(1)
    if (error) {
      throw new Error(error.message)
    }
    const user = data[0]
    return user
  },
}
