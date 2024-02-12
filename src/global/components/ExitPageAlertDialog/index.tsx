'use client'

import { useRef } from 'react'

import { AlertDialog } from '../AlertDialog'
import { AlertDialogRef } from '../AlertDialog/types/AlertDialogRef'

import { useExitPageAlertDialog } from './useExitPageAlertDialog'

import { Button } from '@/global/components/Button'

type ExitPageAlertDialogProps = {
  message: string
  shouldOpen: boolean
}

export function ExitPageAlertDialog({
  message,
  shouldOpen,
}: ExitPageAlertDialogProps) {
  const alertDialogRef = useRef<AlertDialogRef>(null)

  useExitPageAlertDialog(alertDialogRef.current?.open ?? null, shouldOpen)

  return (
    <AlertDialog
      ref={alertDialogRef}
      type="crying"
      title="Tem certeza mesmo?"
      body={<p className="text-gray-200">{message}</p>}
      action={
        <Button className="bg-red-700 text-gray-100">Sim, quero sair 😠</Button>
      }
      cancel={<Button className="bg-green-400 ">Não, vou foi ficar 😙</Button>}
      shouldPlayAudio={false}
    />
  )
}
