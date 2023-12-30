import { useEffect, useRef, useState } from 'react'

import { ToastRef } from '@/app/components/Toast'
import { useAuth } from '@/contexts/AuthContext'
import { emailSchema } from '@/libs/zod'
import { useApi } from '@/services/api'
import { COOKIES } from '@/utils/constants'

export function useResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword } = useAuth()
  const api = useApi()
  const toastRef = useRef<ToastRef | null>(null)

  function handleEmailChange(value: string) {
    setEmail(value)
    setError('')
  }

  async function handleSubmit() {
    try {
      setIsLoading(true)
      const emailValidation = emailSchema.safeParse(email)

      if (emailValidation.success) {
        const hasUser = await api.getUserEmail(email)

        if (!hasUser) setError('usuário não encontrado com esse e-mail')

        await resetPassword(email)

        toastRef.current?.open({
          type: 'success',
          message: 'Enviamos um messagem para o seu e-mail',
          seconds: 5,
        })
      } else {
        console.log(emailValidation.error.errors)
        setError('e-mail inválido')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function fetchCookie() {
      return await api.getCookie(COOKIES.shouldReturnPassword)
    }

    const shouldResetPassword = fetchCookie()

    if (!shouldResetPassword) {
      toastRef.current?.open({
        type: 'success',
        message: 'você pode resetar seu senha',
      })
    }
  }, [api])

  return {
    isLoading,
    email,
    error,
    toastRef,
    handleSubmit,
    handleEmailChange,
  }
}
