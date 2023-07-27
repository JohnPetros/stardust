import { User } from '@/types/user'
import { createClient } from '../supabase-browser'

const supabase = createClient()

interface AddMethodParams {
  id: string
  name: string
  email: string
}

export default {
  getUser: async (userId: string) => {
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

  getUserByEmail: async (email: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()
    if (error) {
      throw new Error(error.message)
    }
    return data
  },

  addUser: async ({ id, name, email }: AddMethodParams) => {
    const { error } = await supabase.from('users').insert([{ id, name, email }])
    if (error) {
      throw new Error(error.message)
    }
  },

  updateUser: async (newData: Partial<User>, userId: string) => {
    const { error } = await supabase
      .from('users')
      .update(newData)
      .eq('id', userId)

    if (error) {
      return error.message
    }
  },
}
