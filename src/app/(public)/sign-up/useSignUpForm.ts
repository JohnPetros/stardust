'use client'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ToastRef } from '@/app/components/Toast'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
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

  const toastRef = useRef<ToastRef>(null)

  function handleError(errorMessage: string) {
    console.error(errorMessage)

    toastRef.current?.open({
      type: 'error',
      message: errorMessage,
    })
  }

  async function handleFormSubmit({ name, email, password }: SignUpForm) {
    setIsLoading(true)
    let userEmail

    try {
      userEmail = await api.getUserEmail(email)
    } catch (error) {
      toastRef.current?.open({
        type: 'error',
        message: 'Erro ao tentar fazer cadastro',
      })
    }

    if (userEmail) {
      toastRef.current?.open({
        type: 'error',
        message: 'Usuário já registrado com esse e-mail',
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

      toastRef.current?.open({
        type: 'success',
        message: 'Verifique seu e-mail para confirmar o seu cadastro',
        seconds: 5,
      })

      if (response?.userId) {
        await api.addUser({ id: response.userId, name, email })
      }
    } catch (error) {
      console.error({ error })
      toastRef.current?.open({
        type: 'error',
        message: 'Erro ao ',
      })
    } finally {
      setIsLoading(false)
    }

    toastRef.current?.open({
      type: 'success',
      message: 'Confira seu e-mail para confirmar seu cadastro',
    })
  }

  return {
    errors,
    isLoading,
    toastRef,
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
  }
}
