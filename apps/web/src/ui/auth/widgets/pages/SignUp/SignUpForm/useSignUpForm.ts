'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useApi } from 'apps/web/src/ui/global/hooks/useApi'
import type { SignUpFormFields } from './SignUpFormFields'

const signUpFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
})

export function useSignUpForm(onFormSubmit: (fields: SignUpFormFields) => Promise<void>) {
  const [isLoading, setIsloading] = useState(false)
  const api = useApi()
  const {
    watch,
    register,
    handleSubmit,
    getFieldState,
    setError,
    formState: { errors },
  } = useForm<SignUpFormFields>({
    mode: 'onChange',
    resolver: zodResolver(signUpFormSchema),
  })
  const nameFieldWatch = watch('name')
  const emailFieldWatch = watch('email')
  const passwordFieldWatch = watch('password')

  async function handleFormSubmit(fields: SignUpFormFields) {
    setIsloading(true)
    await onFormSubmit(fields)
    setIsloading(false)
  }

  async function checkUserAlreadyExistsByName() {
    const response = await api.fetchUserName(nameFieldWatch)

    if (response.isSuccess) {
      setError('name', { message: 'Nome já utilizado por outro usuário' })
    }
  }

  async function checkUserAlreadyExistsByEmail() {
    const response = await api.fetchUserEmail(emailFieldWatch)

    if (response.isSuccess) {
      setError('email', { message: 'E-mail já utilizado por outro usuário' })
      return false
    }
  }

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
  }, [isNameValid, isEmailValid])

  return {
    isLoading,
    errors,
    isNameValid,
    isEmailValid,
    isPasswordValid,
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
  }
}
