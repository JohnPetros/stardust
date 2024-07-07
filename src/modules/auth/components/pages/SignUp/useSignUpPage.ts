'use client'

import { useState } from 'react'

import { useAuthContext } from '@/modules/global/contexts/AuthContext'

import type { SignUpForm } from '@/infra/forms/types'
import { useSignUpForm } from '@/infra/forms'

export function useSignUpPage() {
  const { handleSubmit, register, errors } = useSignUpForm()

  const [isLoading, setIsLoading] = useState(false)

  const { handleSignUp } = useAuthContext()

  async function handleFormSubmit({ email, password, name }: SignUpForm) {
    setIsLoading(true)

    await handleSignUp(email, password, name)

    setIsLoading(false)
  }

  return {
    errors,
    isLoading,
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
  }
}
