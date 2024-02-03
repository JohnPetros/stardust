'use client'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ToastRef } from '@/app/components/Toast'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useApi } from '@/services/api'
import { SignUpForm } from '@/services/validation/types/signUpForm'
import { signUpFormSchema } from '@/services/validation/zod/schemas/signUpFormSchema'

export const SIGN_UP_ERRORS: Record<string, string> = {
  'For security purposes, you can only request this after 50 seconds.':
    'Por questões de segurança, espere 50 segundos para tentar cadastrar novamente',
  'Email rate limit exceeded':
    'Você execedeu o limite permitido de tentativas de cadastro',
}

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

  function handleError(error: string) {
    console.error(error)
    const message = SIGN_UP_ERRORS[error] ?? 'Erro ao tentar fazer cadastro'

    toastRef.current?.open({
      type: 'error',
      message,
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
        handleError(response?.error.message)
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
