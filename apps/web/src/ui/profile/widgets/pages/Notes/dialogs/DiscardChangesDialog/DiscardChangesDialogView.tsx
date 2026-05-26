import { useEffect, useRef } from 'react'

import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { Button } from '@/ui/global/widgets/components/Button'

type Props = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onConfirm: () => void
}

export const DiscardChangesDialogView = ({ isOpen, onOpenChange, onConfirm }: Props) => {
  const dialogRef = useRef<AlertDialogRef | null>(null)

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.open()
      return
    }

    dialogRef.current?.close()
  }, [isOpen])

  return (
    <AlertDialog
      ref={dialogRef}
      type='asking'
      title='Descartar alterações?'
      body={
        <p className='text-center leading-8 text-gray-100'>
          Você tem mudanças não salvas. Deseja continuar sem salvar?
        </p>
      }
      action={<Button onClick={onConfirm}>Descartar</Button>}
      cancel={<Button className='bg-gray-500 text-gray-900'>Cancelar</Button>}
      shouldPlayAudio={false}
      onOpenChange={onOpenChange}
    />
  )
}
