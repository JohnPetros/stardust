import { IAuthController } from '../../interfaces/IAuthController'
import type { Supabase } from '../types/supabase'

import { ROUTES } from '@/utils/constants'
import { getAppBaseUrl } from '@/utils/helpers'

export const AuthController = (supabase: Supabase): IAuthController => {
  return {
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      return data.session
    },

    signUp: async (email: string, password: string) => {
      const { data: response, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getAppBaseUrl()}/${
            ROUTES.server.auth.confirm
          }&type=confirm-email`,
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

    requestPasswordReset: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getAppBaseUrl()}${ROUTES.server.auth.confirm}`,
      })

      if (error) {
        throw new Error(error.message)
      }
    },

    resetPassword: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        throw new Error(error.message)
      }
    },

    githubOAuth: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${getAppBaseUrl()}${ROUTES.server.auth.confirm}`,
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
