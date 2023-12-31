'use client'

import { useEffect, useState } from 'react'

import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { emailSchema } from '@/libs/zod'
import { useApi } from '@/services/api'
import { COOKIES } from '@/utils/constants'

export function useResetPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shouldResetPassword, setShouldResetPassword] = useState(false)
  // const { resetPassword } = useAuth()
  const api = useApi()
  const toast = useToast()

  function handleResetPasswordDialogClose() {}

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

        // await resetPassword(email)

        toast.show('você pode resetar seu senha', { seconds: 5 })
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

    setShouldResetPassword(true)
  }, [api, toast])

  return {
    isLoading,
    email,
    error,
    shouldResetPassword,
    handleSubmit,
    handleEmailChange,
    handleResetPasswordDialogClose,
  }
}
