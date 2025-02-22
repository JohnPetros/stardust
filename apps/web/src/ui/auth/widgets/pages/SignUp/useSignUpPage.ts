'use client'

import { useState } from 'react'

import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { SignUpFormFields } from './SignUpForm/types/SignUpFormFields'
import { useSignUpAction } from './useSignUpAction'
import { useApi } from '@/ui/global/hooks/useApi'
import { useSleep } from '@/ui/global/hooks/useSleep'

type UserCredentials = {
  email: string
  password: string
}

export function useSignUpPage() {
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null)
  const api = useApi()
  const toast = useToastContext()
  const { sleep } = useSleep()
  const { signUp } = useSignUpAction(() => {
    toast.show('Enviamos para você um e-mail de confirmação', {
      type: 'success',
      seconds: 10,
    })
    setIsSignUpSuccess(true)
  })

  async function handleFormSubmit({ email, password, name }: SignUpFormFields) {
    await signUp(email, password, name)
    await sleep(1500)
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
    isSignUpSuccess,
    isResendingEmail,
    handleFormSubmit,
    handleResendEmail,
  }
}
