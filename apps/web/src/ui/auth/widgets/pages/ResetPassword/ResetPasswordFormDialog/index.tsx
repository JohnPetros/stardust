'use client'

import { type ReactNode, useRef } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Input } from '@/ui/global/widgets/components/Input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/ui/global/widgets/components/Dialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { useResetPasswordFormDialog } from './useResetPasswordFormDialog'
import { useRest } from '@/ui/global/hooks/useRest'

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
  const { authService } = useRest()
  const { errors, isSubmitting, register, handleSubmit, handleOpenChange } =
    useResetPasswordFormDialog(authService, alertDialogRef, onNewPasswordSubmit)

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
        onOpenChange={handleOpenChange}
        action={<Button onClick={onPasswordReset}>Fazer login</Button>}
      />
      <Dialog>
        <DialogContent>
          <DialogHeader>Insira sua nova senha</DialogHeader>

          <form className='mt-3'>
            <div>
              <Input
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
                label='Confirme sua nova senha'
                type='password'
                icon='lock'
                {...register('passwordConfirmation')}
                errorMessage={errors.passwordConfirmation?.message}
                placeholder='********'
              />
            </div>
            <Button onClick={handleSubmit} isLoading={isSubmitting} className='mt-8'>
              Redefinir senha
            </Button>
          </form>
        </DialogContent>
        <DialogTrigger>{children}</DialogTrigger>
      </Dialog>
    </>
  )
}
