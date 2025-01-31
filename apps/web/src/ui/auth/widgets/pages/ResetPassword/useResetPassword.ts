'use client'

import { useEffect, useState } from 'react'

import { StringValidation } from '@stardust/core/libs'
import { ValidationError } from '@stardust/core/global/errors'

import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useApi } from '@/ui/global/hooks/useApi'
import { COOKIES } from '@/constants'
import { useCookieActions } from '@/ui/global/hooks/useCookieActions'

export function useResetPassword() {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shouldResetPassword, setShouldResetPassword] = useState(false)
  const { getCookie, deleteCookie } = useCookieActions()

  const toast = useToastContext()
  const api = useApi()

  function handleResetPasswordDialogClose() {}

  function handleEmailChange(value: string) {
    setEmail(value)
    setErrorMessage('')
  }

  async function handleSubmit() {
    setIsLoading(true)

    try {
      new StringValidation(email, 'seu e-mail').email().validate()

      const hasUser = await api.fetchUserEmail(email)
      if (!hasUser) setErrorMessage('Usuário não encontrado com esse e-mail')
      await api.requestPasswordReset(email)

      toast.show('Enviamos um e-mail para você redefinir sua senha', {
        seconds: 5,
        type: 'success',
      })
    } catch (error) {
      if (error instanceof ValidationError) setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function fetchCookie() {
      const shouldResetPassword = await getCookie(COOKIES.keys.shouldReturnPassword)
      if (shouldResetPassword) {
        setShouldResetPassword(true)
      }
    }

    fetchCookie()
  }, [getCookie])

  return {
    isLoading,
    email,
    errorMessage,
    shouldResetPassword,
    handleSubmit,
    handleEmailChange,
    handleResetPasswordDialogClose,
  }
}
