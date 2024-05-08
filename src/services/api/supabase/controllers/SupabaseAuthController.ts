import { IAuthController } from '../../interfaces/IAuthController'
import { SUBAPASE_SIGN_UP_ERRORS } from '../constants/supabase-sign-up-errors'
import type { Supabase } from '../types/Supabase'

import { ROUTES } from '@/global/constants'
import { getAppBaseUrl } from '@/global/helpers'

export const SupabaseAuthController = (supabase: Supabase): IAuthController => {
  return {
    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      return data.session
    },

    async signUp(email: string, password: string) {
      const { data: response, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getAppBaseUrl()}/${
            ROUTES.server.auth.confirm
          }&type=confirm-email`,
        },
      })

      if (error) {
        return { userId: null, error: SUBAPASE_SIGN_UP_ERRORS[error.message] }
      }

      if (response.user) return { userId: response.user.id, error: null }

      return { userId: null, error: null }
    },

    async signOut() {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw new Error(error.message)
      }
    },

    async requestPasswordReset(email: string) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getAppBaseUrl()}${ROUTES.server.auth.confirm}`,
      })

      if (error) {
        throw new Error(error.message)
      }
    },

    async resetPassword(newPassword: string, accessToken: string, refreshToken: string) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (sessionError) {
        throw new Error(sessionError?.message)
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      console.log(error)

      if (error) {
        throw new Error(error.message)
      }
    },

    async confirmEmail(token: string) {
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

    async confirmPasswordReset(token: string) {
      const {
        data: { session },
        error: otpError,
      } = await supabase.auth.verifyOtp({
        type: 'recovery',
        token_hash: token,
      })

      if (otpError) {
        throw new Error(otpError?.message)
      }

      if (!session) {
        throw new Error('Session is not defined')
      }

      return {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
      }
    },

    async signInWithGithubOAuth() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        // options: {
        //   redirectTo: `${getAppBaseUrl()}/${ROUTES.server.auth.confirm}`,
        // },
      })

      if (error) {
        console.log(error)
        throw new Error(error?.message)
      }
    },

    async getUserId() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      return user?.id ?? null
    },
  }
}
