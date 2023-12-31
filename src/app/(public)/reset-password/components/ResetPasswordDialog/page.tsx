'use client'

import { ReactNode } from 'react'
import { LockSimple } from '@phosphor-icons/react'

import { useResetPasswordDialog } from './useResetPasswordDialog'

import { Button } from '@/app/components/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/app/components/Dialog'
import { Input } from '@/app/components/Input'

interface ResetPasswordDialogProps {
  children: ReactNode
}

export function ResetPasswordDialog({ children }: ResetPasswordDialogProps) {
  const { error, isLoading, password, handlePasswordChange, handleSubmit } =
    useResetPasswordDialog()

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>Insira sua nova senha</DialogHeader>

        <form>
          <Input
            label="Nova senha"
            type="password"
            icon={LockSimple}
            value={password}
            onChange={({ currentTarget }) =>
              handlePasswordChange(currentTarget.value)
            }
            error={error}
            placeholder="seu@password.com"
            className="mt-3 space-y-4"
          />
          <Input
            label="Confirme sua nova senha"
            type="password"
            icon={LockSimple}
            value={password}
            onChange={({ currentTarget }) =>
              handlePasswordChange(currentTarget.value)
            }
            error={error}
            placeholder="seu@password.com"
            className="w-[100rem]"
          />
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Redefinir senha
          </Button>
        </form>
      </DialogContent>
      <DialogTrigger>{children}</DialogTrigger>
    </Dialog>
  )
}
