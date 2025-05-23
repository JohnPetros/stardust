'use client'

import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from '@stardust/validation/global/schemas'

import { useApi } from '@/ui/global/hooks/useApi'
import type { SignUpFormFields } from './types/SignUpFormFields'

const signUpFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
})

export function useSignUpForm(onFormSubmit: (fields: SignUpFormFields) => Promise<void>) {
  const api = useApi()
  const {
    watch,
    register,
    handleSubmit,
    getFieldState,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormFields>({
    mode: 'onChange',
    resolver: zodResolver(signUpFormSchema),
  })
  const nameFieldWatch = watch('name')
  const emailFieldWatch = watch('email')
  const passwordFieldWatch = watch('password')

  async function handleFormSubmit(fields: SignUpFormFields) {
    await onFormSubmit(fields)
  }

  const checkUserAlreadyExistsByName = useCallback(async () => {
    const response = await api.fetchUserName(nameFieldWatch)

    if (response.isSuccessful) {
      setError('name', { message: 'Nome já utilizado por outro usuário' })
    }
  }, [nameFieldWatch, api.fetchUserName, setError])

  const checkUserAlreadyExistsByEmail = useCallback(async () => {
    const response = await api.fetchUserEmail(emailFieldWatch)

    if (response.isSuccessful) {
      setError('email', { message: 'E-mail já utilizado por outro usuário' })
      return false
    }
  }, [emailFieldWatch, api.fetchUserEmail, setError])

  function checkFieldIsValid(fieldName: keyof SignUpFormFields) {
    const nameFieldState = getFieldState(fieldName)
    return !nameFieldState.invalid
  }

  const isNameValid = Boolean(nameFieldWatch) && checkFieldIsValid('name')
  const isEmailValid =
    isNameValid && Boolean(emailFieldWatch) && checkFieldIsValid('email')
  const isPasswordValid =
    isEmailValid && Boolean(passwordFieldWatch) && checkFieldIsValid('password')

  useEffect(() => {
    if (isNameValid) checkUserAlreadyExistsByName()
    if (isEmailValid) checkUserAlreadyExistsByEmail()
  }, [
    isNameValid,
    isEmailValid,
    checkUserAlreadyExistsByName,
    checkUserAlreadyExistsByEmail,
  ])

  return {
    isSubmitting,
    errors,
    isNameValid,
    isEmailValid,
    isPasswordValid,
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
  }
}
