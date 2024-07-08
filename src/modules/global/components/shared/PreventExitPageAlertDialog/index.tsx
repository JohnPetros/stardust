'use client'

import { useRef } from 'react'

import { AlertDialog } from '../AlertDialog'
import { AlertDialogRef } from '../AlertDialog/types/AlertDialogRef'

import { usePreventExitPageAlertDialog } from './usePreventExitPageAlertDialog'

import { Button } from '@/modules/global/components/sharedButton'

type ExitPageAlertDialogProps = {
  message: string
  isEnabled: boolean
}

export function PreventExitPageAlertDialog({
  message,
  isEnabled,
}: ExitPageAlertDialogProps) {
  const alertDialogRef = useRef<AlertDialogRef>(null)

  usePreventExitPageAlertDialog(alertDialogRef.current?.open ?? null, isEnabled)

  return (
    <AlertDialog
      ref={alertDialogRef}
      type='crying'
      title='Tem certeza mesmo?'
      body={<p className='text-gray-200'>{message}</p>}
      action={<Button className='bg-red-700 text-gray-100'>Sim, quero sair 😠</Button>}
      cancel={<Button className='bg-green-400 '>Não, vou foi ficar 😙</Button>}
      shouldPlayAudio={false}
    />
  )
}
