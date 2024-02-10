'use client'

import { useEffect, useState } from 'react'

import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { deleteCookie } from '@/global/actions/deleteCookie'
import { getCookie } from '@/global/actions/getCookie'
import { COOKIES } from '@/global/constants'
import { useApi } from '@/services/api'
import { useValidation } from '@/services/validation'

export function useResetPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shouldResetPassword, setShouldResetPassword] = useState(false)

  const toast = useToastContext()

  const api = useApi()
  const validation = useValidation()

  function handleResetPasswordDialogClose() {}

  function handleEmailChange(value: string) {
    setEmail(value)
    setError('')
  }

  async function handleSubmit() {
    try {
      setIsLoading(true)
      const emailValidation = validation.validateEmail(email)

      if (emailValidation.isValid) {
        try {
          const hasUser = await api.getUserEmail(email)

          if (!hasUser) setError('Usuário não encontrado com esse e-mail')

          await api.requestPasswordReset(email)

          toast.show('Enviamos um e-mail para você redefinir sua senha', {
            seconds: 5,
          })
        } catch (error) {
          console.error(error)
        }
      } else {
        setError(emailValidation.errors[0])
      }
    } catch (error) {
      console.error(error)
      toast.show(
        'Error ao tentar redefinir a senha, tente novamente mais tarde',
        { type: 'error' }
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function fetchCookie() {
      const shouldResetPassword = await getCookie(
        COOKIES.keys.shouldReturnPassword
      )

      if (shouldResetPassword) {
        setShouldResetPassword(true)
        await deleteCookie(COOKIES.keys.shouldReturnPassword)
      }
    }

    fetchCookie()
  }, [api])

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
