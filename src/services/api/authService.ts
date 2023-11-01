'use client'
import { useSupabase } from '@/hooks/useSupabase'

export const AuthService = () => {
  const { supabase } = useSupabase()

  return {
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { session: null, error: error.message }
      }

      return { session: data.session, error: null }
    },

    signUp: async (email: string, password: string) => {
      const { data: response, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) return { userId: null, error }

      if (response.user) return { userId: response.user.id, error: null }

      return null
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return error.message
      }
    },
  }
}
