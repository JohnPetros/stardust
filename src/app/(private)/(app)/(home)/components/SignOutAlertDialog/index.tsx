'use client'

import { ReactNode } from 'react'

import { useSignOutAlertDialog } from './useSignOutDialogAlert'

import { AlertDialog } from '@/global/components/AlertDialog'
import { Button } from '@/global/components/Button'

type SignOutAlertDialogProps = {
  children: ReactNode
}

export function SignOutAlertDialog({ children }: SignOutAlertDialogProps) {
  const { isLoading, handleSignOut } = useSignOutAlertDialog()

  return (
    <AlertDialog
      type="crying"
      title={`Calma aí! Deseja mesmo\nSAIR DA SUA CONTA 😢?`}
      shouldPlayAudio={false}
      body={null}
      action={
        <Button
          className="w-32 bg-red-700 text-gray-100"
          onClick={handleSignOut}
          isLoading={isLoading}
        >
          Sair
        </Button>
      }
      cancel={
        <Button className="w-32 bg-green-400 text-green-900">Cancelar</Button>
      }
    >
      {children}
    </AlertDialog>
  )
}
