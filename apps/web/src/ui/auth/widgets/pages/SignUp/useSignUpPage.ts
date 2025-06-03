'use client'

import { useState } from 'react'

import type { AuthService } from '@stardust/core/auth/interfaces'
import { Email, Name } from '@stardust/core/global/structures'
import { Password } from '@stardust/core/auth/structures'

import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useUserCreatedSocket } from './useUserCreatedSocket'

export function useSignUpPage(authService: AuthService, isUserCreated: boolean) {
  const [isSignUpSuccessfull, setIsSignUpSuccessfull] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [userEmail, setUserEmail] = useState<Email | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToastContext()
  useUserCreatedSocket((event) => {
    if (event.payload.userEmail === userEmail?.value) {
      toast.showSuccess('Enviamos para você um e-mail de confirmação', 10)
      setIsSignUpSuccessfull(true)
    }
  })

  async function handleFormSubmit(email: string, password: string, name: string) {
    setIsSubmitting(true)

    const userEmail = Email.create(email)
    const response = await authService.requestSignUp(
      userEmail,
      Password.create(password),
      Name.create(name),
    )

    if (response.isSuccessful) {
      setUserEmail(userEmail)
      return
    }

    toast.showError(response.errorMessage, 5)
    setIsSubmitting(false)
  }

  async function handleResendEmail() {
    if (isUserCreated) {
      toast.showError('Seu cadastro já foi confirmado', 5)
    }
    setIsResendingEmail(true)

    if (userEmail) {
      const response = await authService.resendSignUpEmail(userEmail)

      if (response.isSuccessful) {
        toast.showSuccess('Reenviamos para você o e-mail de confirmação', 10)
      }

      if (response.isFailure) {
        toast.showError(response.errorMessage, 5)
      }
    }
    setIsResendingEmail(false)
  }

  return {
    isSubmitting,
    isSignUpSuccessfull,
    isResendingEmail,
    handleFormSubmit,
    handleResendEmail,
  }
}
