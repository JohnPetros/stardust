'use client'

import { useState } from 'react'

import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { SignUpFormFields } from './SignUpForm/types/SignUpFormFields'
import { useSignUpAction } from './useSignUpAction'

export function useSignUpPage() {
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false)
  const toast = useToastContext()
  const { signUp } = useSignUpAction(() => {
    toast.show('Enviamos para você um e-mail de confirmação', {
      type: 'success',
      seconds: 10,
    })
    setIsSignUpSuccess(true)
  })

  async function handleFormSubmit({ email, password, name }: SignUpFormFields) {
    await signUp(email, password, name)
  }

  return {
    isSignUpSuccess,
    handleFormSubmit,
  }
}
