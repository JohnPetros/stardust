'use client'

import { useEffect, useRef } from 'react'

import type { AlertDialogRef } from '../../AlertDialog/types'
import { useCodeExplanationAlertDialog } from './useCodeExplanationAlertDialog'
import { CodeExplanationAlertDialogView } from './CodeExplanationAlertDialogView'

type CodeExplanationAlertDialogMode = 'confirm' | 'blocked'

type CodeExplanationAlertDialogProps = {
  isOpen: boolean
  mode: CodeExplanationAlertDialogMode
  remainingUses: number | null
  isLoading: boolean
  onConfirm: () => void
  onClose: () => void
}

export const CodeExplanationAlertDialog = ({
  isOpen,
  mode,
  remainingUses,
  isLoading,
  onConfirm,
  onClose,
}: CodeExplanationAlertDialogProps) => {
  const dialogRef = useRef<AlertDialogRef>(null)
  const { title, description, actionLabel, shouldShowCancel, type } =
    useCodeExplanationAlertDialog({
      mode,
      remainingUses,
    })

  useEffect(() => {
    if (isOpen) dialogRef.current?.open()
    else dialogRef.current?.close()
  }, [isOpen])

  return (
    <CodeExplanationAlertDialogView
      dialogRef={dialogRef}
      title={title}
      description={description}
      actionLabel={actionLabel}
      shouldShowCancel={shouldShowCancel}
      type={type}
      isLoading={isLoading}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
