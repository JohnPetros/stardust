import { createClient } from '../supabase-browser'

const supabase = createClient()

interface AddMethodParams {
  id: string
  name: string
  email: string
}

export const user = {
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) {
      throw new Error(error.message)
    }
    return data
  },
  
  getEmail: async (email: string) => {
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

  add: async ({ id, name, email }: AddMethodParams) => {
    const { error } = await supabase.from('users').insert([{ id, name, email }])
    if (error) {
      throw new Error(error.message)
    }
  },
}
