import type { Supabase } from '@/@types/supabase'

export const AuthService = (supabase: Supabase) => {
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
          emailRedirectTo: `${location.origin}/server/auth/confirm-email-callback`,
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

    githubOAuth: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `http://localhost:3000/server/auth/confirm-email-callback`,
        },
      })

      if (error) throw new Error(error?.message)
    },

    getAuthUserId: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        throw new Error(error?.message)
      }

      return user.id
    },

    confirmEmail: async (code: string) => {
      const {
        data: { user },
      } = await supabase.auth.exchangeCodeForSession(code)

      if (!user) return null

      return {
        id: user.id,
        email: user.email,
      }
    },
  }
}
