'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { AlertRef } from '@/app/components/Alert'
import { useToast } from '@/contexts/ToastContext'
import { useApi } from '@/services/api'
import { useValidation } from '@/services/validation'
import { ResetPasswordForm } from '@/services/validation/types/ResetPasswordForm'
import { ROUTES } from '@/utils/constants'

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
  const toast = useToast()
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
