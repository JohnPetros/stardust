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
import { useResetPasswordDialog } from './useResetPasswordDialog'

interface ResetPasswordDialogProps {
  children: ReactNode
}

export function ResetPasswordDialog({ children }: ResetPasswordDialogProps) {
  const alertRef = useRef<AlertDialogRef | null>(null)

  const { errors, isLoading, register, handleSubmit, handleAlert } =
    useResetPasswordDialog(alertRef.current)

  return (
    <>
      <AlertDialog
        type='asking'
        ref={alertRef}
        title='Você redefiniu sua senha com sucesso!'
        body={
          <p className='mb-3 text-center text-base text-green-500'>
            vamos redirecionar você para fazer login com sua nova senha
          </p>
        }
        shouldPlayAudio={false}
        action={<Button onClick={handleAlert}>Fazer login</Button>}
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
                error={errors.password?.message}
                placeholder='********'
              />
            </div>
            <div className='mt-6'>
              <Input
                label='Confirme sua nova senha'
                type='password'
                icon='lock'
                {...register('passwordConfirmation')}
                error={errors.passwordConfirmation?.message}
                placeholder='********'
              />
            </div>
            <Button onClick={handleSubmit} isLoading={isLoading} className='mt-8'>
              Redefinir senha
            </Button>
          </form>
        </DialogContent>
        <DialogTrigger>{children}</DialogTrigger>
      </Dialog>
    </>
  )
}
