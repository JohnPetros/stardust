'use client'

import { ReactNode, useRef } from 'react'
import { LockSimple } from '@phosphor-icons/react'

import { useResetPasswordDialog } from './useResetPasswordDialog'

import { Alert, AlertRef } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/app/components/Dialog'
import { Input } from '@/app/components/Input'
import { useAuth } from '@/contexts/AuthContext'

interface ResetPasswordDialogProps {
  children: ReactNode
}

export function ResetPasswordDialog({ children }: ResetPasswordDialogProps) {
  const { user } = useAuth()
  const alertRef = useRef<AlertRef | null>(null)
  const hasUser = !!user

  const { errors, isLoading, register, handleSubmit, handleAlert } =
    useResetPasswordDialog(alertRef.current, hasUser)

  return (
    <>
      <Alert
        type="asking"
        ref={alertRef}
        title="Você redefiniu sua senha"
        body={
          <p className="text-center text-lg text-green-500">
            {hasUser
              ? 'você pode voltar para o que estava fazendo'
              : 'vamos redirecionar você para fazer login com sua nova senha'}
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
              error={errors.password?.message}
              placeholder="seu@password.com"
            />
            <Input
              label="Confirme sua nova senha"
              type="password"
              icon={LockSimple}
              {...register('password_confirmation')}
              error={errors.password_confirmation?.message}
              placeholder="seu@password.com"
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
