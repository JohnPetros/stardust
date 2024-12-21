'use client'

import type { ReactNode } from 'react'

import { AlertDialog } from '../AlertDialog'
import { Button } from '../Button'

import { useSignOutAlertDialog } from './useSignOutAlertDialog'

type SignOutAlertDialogProps = {
  children: ReactNode
}

export function SignOutAlertDialog({ children }: SignOutAlertDialogProps) {
  const { isLoading, handleConfirm } = useSignOutAlertDialog()

  return (
    <AlertDialog
      type='crying'
      title={'Calma aí! Deseja mesmo\nSAIR DA SUA CONTA 😢?'}
      shouldPlayAudio={false}
      body={null}
      action={
        <Button
          className='w-32 bg-red-700 text-gray-100'
          onClick={handleConfirm}
          isLoading={isLoading}
        >
          Sair
        </Button>
      }
      cancel={<Button className='w-32 bg-green-400 text-green-900'>Cancelar</Button>}
    >
      {children}
    </AlertDialog>
  )
}
