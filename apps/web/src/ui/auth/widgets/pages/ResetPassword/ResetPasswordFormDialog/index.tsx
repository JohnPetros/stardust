'use client'

import { type ReactNode, useRef } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useResetPasswordFormDialog } from './useResetPasswordFormDialog'
import { ResetPasswordFormDialogView } from './ResetPasswordFormDialogView'

type Props = {
  children: ReactNode
  onNewPasswordSubmit: () => Promise<{
    accessToken: string | null
    refreshToken: string | null
  }>
  onPasswordReset: () => Promise<void>
}

export const ResetPasswordFormDialog = ({
  children,
  onNewPasswordSubmit,
  onPasswordReset,
}: Props) => {
  const alertDialogRef = useRef<AlertDialogRef | null>(null)
  const { authService } = useRestContext()
  const { errors, isSubmitting, register, handleSubmit, handleOpenChange } =
    useResetPasswordFormDialog(
      authService,
      alertDialogRef,
      onNewPasswordSubmit,
      onPasswordReset,
    )

  return (
    <ResetPasswordFormDialogView
      errors={errors}
      isSubmitting={isSubmitting}
      alertDialogRef={alertDialogRef}
      register={register}
      handleSubmit={handleSubmit}
      onOpenChange={handleOpenChange}
    >
      {children}
    </ResetPasswordFormDialogView>
  )
}
