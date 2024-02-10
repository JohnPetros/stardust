'use client'

import { ReactNode, useRef } from 'react'
import { LockSimple } from '@phosphor-icons/react'

import { useResetPasswordDialog } from './useResetPasswordDialog'

import { Alert, AlertRef } from '@/global/components/Alert'
import { Button } from '@/global/components/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/global/components/Dialog'
import { Input } from '@/global/components/Input'
import { APP_ERRORS } from '@/global/constants'

interface ResetPasswordDialogProps {
  children: ReactNode
}

export function ResetPasswordDialog({ children }: ResetPasswordDialogProps) {
  const alertRef = useRef<AlertRef | null>(null)

  const { errors, isLoading, register, handleSubmit, handleAlert } =
    useResetPasswordDialog(alertRef.current)

  return (
    <>
      <Alert
        type="asking"
        ref={alertRef}
        title="Você redefiniu sua senha com sucesso!"
        body={
          <p className="mb-3 text-center text-base text-green-500">
            vamos redirecionar você para fazer login com sua nova senha
          </p>
        }
        canPlaySong={false}
        action={<Button onClick={handleAlert}>Fazer login</Button>}
      />
      <Dialog>
        <DialogContent>
          <DialogHeader>Insira sua nova senha</DialogHeader>

          <form className="mt-3 flex flex-col gap-6">
            <Input
              label="Nova senha"
              type="password"
              icon={LockSimple}
              autoFocus
              {...register('password')}
              error={errors.password?.message?.toString()}
              placeholder="********"
            />
            <Input
              label="Confirme sua nova senha"
              type="password"
              icon={LockSimple}
              {...register('password_confirmation')}
              error={String(errors.password_confirmation?.message)}
              placeholder="********"
            />
            <Button onClick={handleSubmit} isLoading={isLoading}>
              Redefinir senha
            </Button>
          </form>
        </DialogContent>
        <DialogTrigger>{children}</DialogTrigger>
      </Dialog>
    </>
  )
}
