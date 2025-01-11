'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { emailSchema, passwordSchema } from '@stardust/validation/global/schemas'

import type { SignInFormFields } from './types/SignInFormFields'

const signInFormSchema = z.object({
  password: passwordSchema,
  email: emailSchema,
})

export function useSignInForm(onFormSubmit: (fields: SignInFormFields) => Promise<void>) {
  const [isLoading, setIsloading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormFields>({
    resolver: zodResolver(signInFormSchema),
  })

  async function handleFormSubmit(fields: SignInFormFields) {
    setIsloading(true)
    await onFormSubmit(fields)
    setIsloading(false)
  }

  return {
    isLoading,
    errors,
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
  }
}
