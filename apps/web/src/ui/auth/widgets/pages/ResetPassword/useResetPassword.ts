'use client'

import { useState } from 'react'

import { ValidationError } from '@stardust/core/global/errors'
import { Email } from '@stardust/core/global/structures'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import type { ActionResponse } from '@stardust/core/global/responses'

import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { COOKIES, ROUTES } from '@/constants'

export function useResetPassword(
  authService: AuthService,
  profileService: ProfileService,
  getCookie: (key: string) => Promise<ActionResponse<string | null>>,
  deleteCookie: (key: string) => Promise<ActionResponse<void>>,
) {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToastContext()
  const router = useRouter()

  async function handlePasswordReset() {
    await Promise.all([
      deleteCookie(COOKIES.accessToken.key),
      deleteCookie(COOKIES.refreshToken.key),
      deleteCookie(COOKIES.shouldResetPassword.key),
    ])
    router.goTo(ROUTES.auth.signIn)
  }

  async function handleNewPasswordSubmit() {
    const [accessToken, refreshToken] = await Promise.all([
      getCookie(COOKIES.accessToken.key),
      getCookie(COOKIES.refreshToken.key),
    ])
    return { accessToken: accessToken.data, refreshToken: refreshToken.data }
  }

  function handleEmailChange(value: string) {
    setEmail(value)
    setErrorMessage('')
  }

  async function handleEmailSubmit() {
    setIsLoading(true)

    try {
      const userEmail = Email.create(email)

      const requestPasswordResetResponse =
        await authService.requestPasswordReset(userEmail)

      if (requestPasswordResetResponse.isFailure) {
        setErrorMessage('Erro ao enviar e-mail de redefinição de senha')
        return
      }

      toast.showSuccess(
        'Enviamos um e-mail para você redefinir sua senha (se seu e-mail estiver cadastrado, claro)',
        10,
      )
    } catch (error) {
      if (error instanceof ValidationError) setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    email,
    errorMessage,
    handleEmailSubmit,
    handleEmailChange,
    handlePasswordReset,
    handleNewPasswordSubmit,
  }
}
