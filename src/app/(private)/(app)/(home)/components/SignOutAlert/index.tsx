'use client'

import { ReactNode } from 'react'

import { useSignOutAlert } from './useSignOutAlert'

import { Alert } from '@/global/components/Alert'
import { Button } from '@/global/components/Button'

type SignOutAlertProps = {
  children: ReactNode
}

export function SignOutAlert({ children }: SignOutAlertProps) {
  const { isLoading, handleSignOut } = useSignOutAlert()

  return (
    <Alert
      type="crying"
      title={`Calma aí! Deseja mesmo\nSAIR DA SUA CONTA 😢?`}
      canPlaySong={false}
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
    </Alert>
  )
}
