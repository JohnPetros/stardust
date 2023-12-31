import { IAuthController } from './interfaces/IAuthController'

import type { Supabase } from '@/@types/supabase'
import { ROUTES } from '@/utils/constants'

const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL

export const AuthController = (supabase: Supabase): IAuthController => {
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
        throw new Error(error.message)
      }
    },

    resetPassword: async (email: string) => {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${BASE_URL}/${ROUTES.server.auth.resetPassword}`,
      })
    },

    githubOAuth: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${BASE_URL}/${ROUTES.server.auth.confirm}`,
        },
      })

      if (error) throw new Error(error?.message)
    },

    getUserId: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      return user?.id ?? null
    },

    confirmEmail: async (token: string) => {
      const {
        data: { user },
        error,
      } = await supabase.auth.verifyOtp({
        type: 'email',
        token_hash: token,
      })

      if (error) {
        throw new Error(error?.message)
      }

      console.log({ user })

      return !!user?.email
    },

    confirmPasswordReset: async (token: string) => {
      const {
        data: { user },
        error,
      } = await supabase.auth.verifyOtp({
        type: 'recovery',
        token_hash: token,
      })

      if (error) {
        throw new Error(error?.message)
      }

      return !!user?.email
    },
  }
}
