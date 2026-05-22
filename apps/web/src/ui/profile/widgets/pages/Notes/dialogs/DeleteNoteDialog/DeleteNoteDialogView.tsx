import { useEffect, useRef } from 'react'

import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { Button } from '@/ui/global/widgets/components/Button'

type Props = {
  isOpen: boolean
  isDeleting: boolean
  onOpenChange: (isOpen: boolean) => void
  onConfirm: () => Promise<boolean>
}

export const DeleteNoteDialogView = ({
  isOpen,
  isDeleting,
  onOpenChange,
  onConfirm,
}: Props) => {
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
      title='Excluir anotação?'
      body={
        <p className='text-center leading-8 text-gray-100'>
          Essa ação não pode ser desfeita.
        </p>
      }
      action={
        <Button
          isLoading={isDeleting}
          onClick={async () => {
            await onConfirm()
          }}
        >
          Excluir
        </Button>
      }
      cancel={<Button className='bg-gray-500 text-gray-900'>Cancelar</Button>}
      shouldPlayAudio={false}
      onOpenChange={onOpenChange}
    />
  )
}
