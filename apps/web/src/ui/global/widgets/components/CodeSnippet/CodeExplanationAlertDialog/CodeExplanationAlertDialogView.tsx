import { type RefObject } from 'react'

import { AlertDialog } from '../../AlertDialog'
import type { AlertDialogRef } from '../../AlertDialog/types'
import { Button } from '../../Button'

type CodeExplanationAlertDialogViewProps = {
  dialogRef: RefObject<AlertDialogRef | null>
  title: string
  description: string
  actionLabel: string
  shouldShowCancel: boolean
  type: 'asking' | 'denying'
  isLoading: boolean
  onConfirm: () => void
  onClose: () => void
}

export const CodeExplanationAlertDialogView = ({
  dialogRef,
  title,
  description,
  actionLabel,
  shouldShowCancel,
  type,
  isLoading,
  onConfirm,
  onClose,
}: CodeExplanationAlertDialogViewProps) => {
  return (
    <AlertDialog
      ref={dialogRef}
      type={type}
      title={title}
      body={<p className='mt-2 text-center text-sm text-gray-300'>{description}</p>}
      action={
        <Button className='w-max px-4' isLoading={isLoading} onClick={onConfirm}>
          {actionLabel}
        </Button>
      }
      cancel={
        shouldShowCancel ? (
          <Button className='w-max px-4 bg-gray-700 text-gray-100' onClick={onClose}>
            Cancelar
          </Button>
        ) : undefined
      }
      shouldPlayAudio={false}
      shouldForceMount={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <span />
    </AlertDialog>
  )
}
