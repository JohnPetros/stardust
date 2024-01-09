'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { AlertRef } from '@/app/components/Alert'
import { useToast } from '@/contexts/ToastContext'
import { ResetPasswordFormFields, resetPasswordFormSchema } from '@/libs/zod'
import { useApi } from '@/services/api'
import { ROUTES } from '@/utils/constants'

export function useResetPasswordDialog(
  alertRef: AlertRef | null,
  hasUser: boolean
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormFields>({
    resolver: zodResolver(resetPasswordFormSchema),
  })
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const api = useApi()

  function handleAlert() {
    if (hasUser) router.back()
    else router.push(ROUTES.public.signIn)
  }

  async function handleFormSubmit({ password }: ResetPasswordFormFields) {
    try {
      setIsLoading(true)

      await api.resetPassword(password)

      alertRef?.open()
    } catch (error) {
      console.error(error)
      toast.show('Erro ao redefinir sua senha, tente novamente mais tarde', {
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
