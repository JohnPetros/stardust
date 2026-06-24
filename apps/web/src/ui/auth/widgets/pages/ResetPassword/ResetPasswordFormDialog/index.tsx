'use client'

import { type ReactNode, useRef } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Input } from '@/ui/global/widgets/components/Input'
import * as Dialog from '@/ui/global/widgets/components/Dialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { useResetPasswordFormDialog } from './useResetPasswordFormDialog'
import { useRestContext } from '@/ui/global/hooks/useRestContext'

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
    <>
      <AlertDialog
        type='asking'
        ref={alertDialogRef}
        title='Você redefiniu sua senha com sucesso!'
        body={
          <p className='mb-3 text-center text-base text-green-500'>
            vamos redirecionar você para fazer login com sua nova senha
          </p>
        }
        shouldPlayAudio={false}
        shouldCloseOnInteractOutside
        onOpenChange={handleOpenChange}
        action={<Button>Fazer login</Button>}
      />
      <Dialog.Container>
        <Dialog.Content>
          <Dialog.Header>Insira sua nova senha</Dialog.Header>

          <form className='mt-3'>
            <div>
              <Input
                testId='new-password-input'
                label='Nova senha'
                type='password'
                icon='lock'
                autoFocus
                {...register('password')}
                errorMessage={errors.password?.message}
                placeholder='********'
              />
            </div>
            <div className='mt-6'>
              <Input
                testId='new-password-confirmation-input'
                label='Confirme sua nova senha'
                type='password'
                icon='lock'
                {...register('passwordConfirmation')}
                errorMessage={errors.passwordConfirmation?.message}
                placeholder='********'
              />
            </div>
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className='mt-8'
              testId='reset-password-submit-button'
            >
              Redefinir senha
            </Button>
          </form>
        </Dialog.Content>
        <Dialog.Trigger>{children}</Dialog.Trigger>
      </Dialog.Container>
    </>
  )
}
