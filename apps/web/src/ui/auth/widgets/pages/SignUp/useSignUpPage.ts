'use client'

import { useRef, useState } from 'react'

import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { SignUpFormFields } from './SignUpForm/types/SignUpFormFields'
import { useApi } from '@/ui/global/hooks/useApi'
import { useUserCreatedSocket } from './useUserCreatedSocket'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

type UserCredentials = {
  email: string
  password: string
}

export function useSignUpPage() {
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuthContext()
  const api = useApi()
  const toast = useToastContext()
  const createdUserId = useRef('')

  useUserCreatedSocket((event) => {
    if (event.payload.userId === createdUserId.current) {
      toast.show('Enviamos para você um e-mail de confirmação', {
        type: 'success',
        seconds: 10,
      })
      setIsSignUpSuccess(true)
    }
  })

  async function handleFormSubmit({ email, password, name }: SignUpFormFields) {
    setIsSubmitting(true)
    setUserCredentials({ email, password })
  }

  async function handleResendEmail() {
    if (user) {
      toast.show('Seu cadastro já foi confirmado', {
        type: 'error',
        seconds: 5,
      })
    }
    setIsResendingEmail(true)
    if (userCredentials) {
      await api.signUp(userCredentials.email, userCredentials.password)
      toast.show('Reenviamos para você o e-mail de confirmação', {
        type: 'success',
        seconds: 10,
      })
    }
    setIsResendingEmail(false)
  }

  return {
    isSubmitting,
    isSignUpSuccess,
    isResendingEmail,
    handleFormSubmit,
    handleResendEmail,
  }
}
