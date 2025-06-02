'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useSignUpPage } from './useSignUpPage'
import { SignUpPageView } from './SignUpPageView'

export const SignUpPage = () => {
  const { authService, profileService } = useRest()
  const { user } = useAuthContext()
  const {
    isSubmitting,
    isSignUpSuccessfull,
    isResendingEmail,
    handleFormSubmit,
    handleResendEmail,
  } = useSignUpPage(authService, user !== null)

  return (
    <SignUpPageView
      isSignUpSuccessfull={isSignUpSuccessfull}
      isResendingEmail={isResendingEmail}
      isSubmitting={isSubmitting}
      profileService={profileService}
      onFormSubmit={handleFormSubmit}
      onResendEmail={handleResendEmail}
    />
  )
}
