'use client'

import { useRef, useState } from 'react'

import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { SignUpFormFields } from './SignUpForm/types/SignUpFormFields'
import { useSignUpAction } from './useSignUpAction'
import { useApi } from '@/ui/global/hooks/useApi'
import { useUserCreatedSocket } from './useUserCreatedSocket'

type UserCredentials = {
  email: string
  password: string
}

export function useSignUpPage() {
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const api = useApi()
  const toast = useToastContext()
  const createdUserId = useRef('')
  const { signUp } = useSignUpAction((userId) => {
    createdUserId.current = userId
  })
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
    await signUp(email, password, name)
    setUserCredentials({ email, password })
  }

  async function handleResendEmail() {
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
