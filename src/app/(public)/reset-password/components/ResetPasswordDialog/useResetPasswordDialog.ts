'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { AlertRef } from '@/app/components/Alert'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { ROUTES } from '@/global/constants'
import { useApi } from '@/services/api'
import { useValidation } from '@/services/validation'
import { ResetPasswordForm } from '@/services/validation/types/ResetPasswordForm'

export function useResetPasswordDialog(alertRef: AlertRef | null) {
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

      await api.resetPassword(password)

      alertRef?.open()
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
    alertRef,
    isLoading,
    errors,
    register,
    handleAlert,
    handleSubmit: handleSubmit(handleFormSubmit),
  }
}
