'use client'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { SignUpError } from '@/@types/signUpError'
import { ToastRef } from '@/app/components/Toast'
import { useAuth } from '@/contexts/AuthContext'
import { SignUpFormFields, signUpFormSchema } from '@/libs/zod'
import { useApi } from '@/services/api'
import { SIGN_UP_ERRORS } from '@/utils/constants/signup-errors'

export function useSignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormFields>({
    resolver: zodResolver(signUpFormSchema),
  })
  const [isLoading, setIsLoading] = useState(false)

  const { signUp } = useAuth()

  const api = useApi()

  const toastRef = useRef<ToastRef>(null)

  function handleError(error: SignUpError) {
    console.error(error)
    const message = SIGN_UP_ERRORS[error] ?? 'Erro ao tentar fazer cadastro'

    toastRef.current?.open({
      type: 'error',
      message,
    })
  }

  async function handleFormSubmit({ name, email, password }: SignUpFormFields) {
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
        handleError(response?.error.message as SignUpError)
        return
      }

      toastRef.current?.open({
        type: 'success',
        message: 'Verifique seu e-mail para confirmar o seu cadastro',
        seconds: 5,
      })

      if (response?.userId) {
        console.log({ userEmail })

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
