'use client'

import { useEffect, useState } from 'react'

import { deleteCookie } from '@/app/server/actions/deleteCookie'
import { getCookie } from '@/app/server/actions/getCookie'
import { useToast } from '@/contexts/ToastContext'
import { useApi } from '@/services/api'
import { useValidation } from '@/services/validation'
import { COOKIES } from '@/utils/constants'

export function useResetPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shouldResetPassword, setShouldResetPassword] = useState(false)

  const toast = useToast()
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
      const shouldResetPassword = await getCookie(COOKIES.shouldReturnPassword)

      if (shouldResetPassword) {
        setShouldResetPassword(true)
        await deleteCookie(COOKIES.shouldReturnPassword)
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
