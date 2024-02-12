'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { APP_ERRORS } from '@/global/constants'
import { useApi } from '@/services/api'
import { SignUpForm } from '@/services/validation/types/signUpForm'
import { signUpFormSchema } from '@/services/validation/zod/schemas/signUpFormSchema'

export function useSignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpFormSchema),
  })
  const [isLoading, setIsLoading] = useState(false)

  const { signUp } = useAuthContext()

  const api = useApi()

  const toast = useToastContext()

  function handleError(errorMessage: string) {
    console.error(errorMessage)

    toast.show(errorMessage, {
      type: 'error',
      seconds: 10,
    })
  }

  async function handleFormSubmit({ name, email, password }: SignUpForm) {
    setIsLoading(true)
    let userEmail

    try {
      userEmail = await api.getUserEmail(email)
    } catch (error) {
      toast.show(APP_ERRORS.auth.failedSignUp, {
        seconds: 10,
        type: 'error',
      })
    }

    if (userEmail) {
      toast.show(APP_ERRORS.auth.duplicatedEmail, {
        seconds: 10,
        type: 'error',
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await signUp(email, password)

      if (response?.error) {
        handleError(response?.error)
        return
      }

      toast?.show('Verifique seu e-mail para confirmar o seu cadastro', {
        type: 'success',
        seconds: 5,
      })

      if (response?.userId) {
        await api.addUser({ id: response.userId, name, email })
      }
    } catch (error) {
      console.error({ error })
      toast.show(APP_ERRORS.auth.failedSignUp, {
        seconds: 10,
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }

    toast.show('Confira seu e-mail para confirmar seu cadastro', {
      type: 'success',
      seconds: 5,
    })
  }

  return {
    errors,
    isLoading,
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
  }
}
