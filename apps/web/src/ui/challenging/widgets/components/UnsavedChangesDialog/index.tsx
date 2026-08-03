'use client'

import { useEffect, useRef } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { UnsavedChangesDialogView } from './UnsavedChangesDialogView'

type Props = {
  isOpen: boolean
  onContinueEditing: () => void
  onLeaveWithoutSaving: () => void
}

export const UnsavedChangesDialog = (props: Props) => {
  const dialogRef = useRef<AlertDialogRef>(null)

  useEffect(() => {
    if (props.isOpen) dialogRef.current?.open()
    else dialogRef.current?.close()
  }, [props.isOpen])

  return <UnsavedChangesDialogView {...props} dialogRef={dialogRef} />
}
