'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useSignUpPage } from './useSignUpPage'
import { SignUpPageView } from './SignUpPageView'
import { useProfileSocket } from '@/ui/global/hooks/useProfileSocket'

export const SignUpPage = () => {
  const { authService, profileService } = useRest()
  const { user } = useAuthContext()
  const {
    isSubmitting,
    isSignUpSuccessfull,
    isResendingEmail,
    handleFormSubmit,
    handleResendEmail,
    handleUserCreated,
  } = useSignUpPage(authService, user !== null)
  useProfileSocket(handleUserCreated)

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
