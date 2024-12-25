'use client'

import { useState } from 'react'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import type { SignUpFormFields } from './SignUpForm/types/SignUpFormFields'

export function useSignUpPage() {
  const { handleSignUp } = useAuthContext()
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false)

  async function handleFormSubmit({ email, password, name }: SignUpFormFields) {
    const isSuccess = await handleSignUp(email, password, name)
    setIsSignUpSuccess(isSuccess)
  }

  return {
    isSignUpSuccess,
    handleFormSubmit,
  }
}
