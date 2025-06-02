'use client'

import { useCookieActions } from '@/ui/global/hooks/useCookieActions'
import { useRest } from '@/ui/global/hooks/useRest'
import { useResetPassword } from './useResetPassword'
import { ResetPasswordPageView } from './ResetPasswordPageView'

type ResetPasswordPageProps = {
  canResetPassword: boolean
}

export function ResetPasswordPage({ canResetPassword }: ResetPasswordPageProps) {
  const { authService, profileService } = useRest()
  const { getCookie, deleteCookie } = useCookieActions()
  const {
    isLoading,
    email,
    errorMessage,
    handleEmailChange,
    handleEmailSubmit,
    handleNewPasswordSubmit,
    handlePasswordReset,
  } = useResetPassword(authService, profileService, getCookie, deleteCookie)

  return (
    <ResetPasswordPageView
      canResetPassword={canResetPassword}
      isLoading={isLoading}
      email={email}
      errorMessage={errorMessage}
      onEmailChange={handleEmailChange}
      onEmailSubmit={handleEmailSubmit}
      onNewPasswordSubmit={handleNewPasswordSubmit}
      onPasswordReset={handlePasswordReset}
    />
  )
}
