'use client'

import { ReactNode } from 'react'

import { useContentDialog } from './useConentDialog'

import { Dialog, DialogContent } from '@/app/components/Dialog'

type ContentDialogProps = {
  children: ReactNode
}

export function ContentDialog({ children: content }: ContentDialogProps) {
  const { dialogRef, handleDialogOpenChange } = useContentDialog()

  return (
    <Dialog ref={dialogRef} onOpenChange={handleDialogOpenChange}>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  )
}
