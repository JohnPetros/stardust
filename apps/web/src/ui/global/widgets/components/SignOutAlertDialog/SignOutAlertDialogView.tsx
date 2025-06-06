import type { PropsWithChildren } from 'react'

import { AlertDialog } from '../AlertDialog'
import { Button } from '../Button'

type Props = {
  isSigningOut: boolean
  onConfirm: () => void
}

export const SignOutAlertDialogView = ({
  children,
  isSigningOut,
  onConfirm,
}: PropsWithChildren<Props>) => {
  return (
    <AlertDialog
      type='crying'
      title={'Calma aí! Deseja mesmo\nSAIR DA SUA CONTA 😢?'}
      shouldPlayAudio={false}
      body={null}
      action={
        <Button
          className='w-32 bg-red-700 text-gray-100'
          onClick={onConfirm}
          isLoading={isSigningOut}
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
