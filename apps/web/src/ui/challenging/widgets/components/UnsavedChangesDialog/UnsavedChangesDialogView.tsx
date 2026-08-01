import { useEffect, useRef, type RefObject } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'

type Props = {
  dialogRef: RefObject<AlertDialogRef | null>
  isOpen: boolean
  onContinueEditing: () => void
  onLeaveWithoutSaving: () => void
}

export const UnsavedChangesDialogView = ({
  dialogRef,
  isOpen,
  onContinueEditing,
  onLeaveWithoutSaving,
}: Props) => {
  const explicitActionRef = useRef<'continue' | 'leave' | null>(null)

  useEffect(() => {
    if (isOpen) explicitActionRef.current = null
  }, [isOpen])

  function handleContinueEditing() {
    explicitActionRef.current = 'continue'
    onContinueEditing()
  }

  function handleLeaveWithoutSaving() {
    explicitActionRef.current = 'leave'
    onLeaveWithoutSaving()
  }

  return (
    <AlertDialog
      ref={dialogRef}
      type='asking'
      title='Sair sem salvar?'
      body={
        <p className='text-center leading-8 text-gray-100'>
          Suas alterações serão perdidas se você sair agora.
        </p>
      }
      action={
        <Button onClick={handleLeaveWithoutSaving} className='bg-red-700 text-gray-100'>
          Sair sem salvar
        </Button>
      }
      cancel={
        <Button
          autoFocus
          onClick={handleContinueEditing}
          className='bg-green-400 text-gray-900'
        >
          Continuar editando
        </Button>
      }
      shouldPlayAudio={false}
      onOpenChange={(open) => {
        if (open) return
        if (explicitActionRef.current) {
          explicitActionRef.current = null
          return
        }
        onContinueEditing()
      }}
    />
  )
}
