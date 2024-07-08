'use client'

import { useForm } from 'react-hook-form'

import type { SignInFormFields } from '@/infra/forms/types'
import { ValidationResolver } from '../../validation'
import { useState } from 'react'

export function useSignInForm(onFormSubmit: (fields: SignInFormFields) => Promise<void>) {
  const { resolveSignInForm } = ValidationResolver()
  const [isLoading, setIsloading] = useState(false)

  async function handleFormSubmit(fields: SignInFormFields) {
    setIsloading(true)
    await onFormSubmit(fields)
    setIsloading(false)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormFields>({
    resolver: resolveSignInForm(),
  })

  return {
    isLoading,
    errors,
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
  }
}
