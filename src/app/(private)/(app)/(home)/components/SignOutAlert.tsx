'use client'

import { ReactNode, useRef, useState } from 'react'

import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { ToastRef } from '@/app/components/Toast'
import { useAuth } from '@/contexts/AuthContext'

interface SignOutAlertProps {
  children: ReactNode
}

export function SignOutAlert({ children }: SignOutAlertProps) {
  const { signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const toastRef = useRef<ToastRef>(null)

  async function handleSignOut() {
    function showErrorMessage() {
      toastRef.current?.open({
        type: 'error',
        message: 'Erro ao tentar sair da conta',
      })
      setIsLoading(false)
    }

    setIsLoading(true)

    const error = await signOut()

    if (error) {
      console.error(error)
      showErrorMessage()
    }

    setTimeout(() => {
      showErrorMessage()
    }, 10000)
  }

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
