import type { RefObject } from 'react'

import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'

type Props = {
  dialogRef: RefObject<AlertDialogRef | null>
  onConfirm: () => void
  onCancel: () => void
}

export const ChallengeNavigationAlertDialogView = ({
  dialogRef,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <AlertDialog
      ref={dialogRef}
      type='asking'
      title='Voce tem alteracoes nao salvas'
      body={
        <div className='text-center text-gray-300'>
          <p>Deseja descartar o codigo atual para navegar para outro desafio?</p>
        </div>
      }
      action={
        <Button onClick={onConfirm} className='bg-red-700 text-gray-100'>
          Descartar e navegar
        </Button>
      }
      cancel={
        <Button autoFocus onClick={onCancel} className='bg-green-400 text-gray-900'>
          Permanecer
        </Button>
      }
      shouldPlayAudio={false}
    />
  )
}
