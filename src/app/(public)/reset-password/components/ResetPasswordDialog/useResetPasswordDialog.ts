'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { AlertRef } from '@/app/components/Alert'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { ResetPasswordFields, resetPasswordFormSchema } from '@/libs/zod'
import { ROUTES } from '@/utils/constants'

export function useResetPasswordDialog(
  alertRef: AlertRef | null,
  hasUser: boolean
) {
  const { resetPassword } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordFormSchema),
  })
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()

  function handleAlert() {
    if (hasUser) router.back()
    else router.push(ROUTES.public.signIn)
  }

  async function handleFormSubmit({ password }: ResetPasswordFields) {
    try {
      setIsLoading(true)

      await resetPassword(password)

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
