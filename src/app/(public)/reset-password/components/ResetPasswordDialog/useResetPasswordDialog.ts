'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { _getCookie } from '@/global/actions/_getCookie'
import { AlertDialogRef } from '@/global/components/AlertDialog/types/AlertDialogRef'
import { COOKIES, ROUTES } from '@/global/constants'
import { useApi } from '@/services/api'
import { useValidation } from '@/services/validation'
import { ResetPasswordForm } from '@/services/validation/types/ResetPasswordForm'

export function useResetPasswordDialog(alertDialogRef: AlertDialogRef | null) {
  const { resolveResetPasswordForm } = useValidation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: resolveResetPasswordForm(),
  })
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToastContext()
  const router = useRouter()
  const api = useApi()

  function handleAlert() {
    router.push(ROUTES.public.signIn)
  }

  async function handleFormSubmit({ password }: ResetPasswordForm) {
    try {
      setIsLoading(true)

      const accessToken = await _getCookie(COOKIES.keys.accessToken)
      const refreshToken = await _getCookie(COOKIES.keys.refreshToken)

      if (!accessToken || !refreshToken)
        throw new Error('Access or refresh token not found')

      await api.resetPassword(password, accessToken, refreshToken)

      alertDialogRef?.open()
    } catch (error) {
      console.error(error)
      toast.show('Erro de redefinição, escolha outra senha', {
        type: 'error',
        seconds: 5,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    alertDialogRef,
    isLoading,
    errors,
    register,
    handleAlert,
    handleSubmit: handleSubmit(handleFormSubmit),
  }
}
