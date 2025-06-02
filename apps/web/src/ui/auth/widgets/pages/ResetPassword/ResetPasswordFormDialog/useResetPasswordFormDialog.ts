'use client'

import { z } from 'zod'
import { type RefObject, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { passwordSchema, stringSchema } from '@stardust/validation/global/schemas'
import { Password } from '@stardust/core/auth/structures'
import { Text } from '@stardust/core/global/structures'
import type { AuthService } from '@stardust/core/auth/interfaces'

import { ROUTES } from '@/constants'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useRouter } from '@/ui/global/hooks/useRouter'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'

const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: stringSchema,
  })
  .refine((fields) => fields.password === fields.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'as senhas devem ser iguais',
  })

type ResetPasswordFormFields = z.infer<typeof resetPasswordFormSchema>

export function useResetPasswordFormDialog(
  authService: AuthService,
  alertDialogRef: RefObject<AlertDialogRef>,
  onNewPasswordSubmit: () => Promise<{
    accessToken: string | null
    refreshToken: string | null
  }>,
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormFields>({
    resolver: zodResolver(resetPasswordFormSchema),
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToastContext()
  const router = useRouter()

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) router.goTo(ROUTES.auth.signIn)
  }

  async function handleFormSubmit({ password }: ResetPasswordFormFields) {
    setIsSubmitting(true)

    const { accessToken, refreshToken } = await onNewPasswordSubmit()

    if (!accessToken || !refreshToken)
      throw new Error('Access or refresh token not found')

    const response = await authService.resetPassword(
      Password.create(password),
      Text.create(accessToken),
      Text.create(refreshToken),
    )

    if (response.isFailure) {
      toast.showError('Erro de redefinição, escolha outra senha', 5)
    }

    if (response.isSuccessful) {
      alertDialogRef.current?.open()
      await authService.signOut()
    }

    setIsSubmitting(false)
  }

  return {
    isSubmitting,
    errors,
    register,
    handleOpenChange,
    handleSubmit: handleSubmit(handleFormSubmit),
  }
}
