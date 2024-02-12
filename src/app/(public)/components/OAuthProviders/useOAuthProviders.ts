'use client'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import type { OAuthProvider } from '@/contexts/AuthContext/types/OAuthProvider'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { APP_ERRORS } from '@/global/constants'

export function useOAuthProviders() {
  const { signInWithOAuth } = useAuthContext()
  const toast = useToastContext()

  async function handleOAuthProvider(oauthProvider: OAuthProvider) {
    try {
      await signInWithOAuth(oauthProvider)
    } catch (error) {
      console.error(error)
      toast.show(APP_ERRORS.auth.failedSignInWithOAuth)
    }
  }

  return {
    handleOAuthProvider,
  }
}
