'use client'

import { ReactNode } from 'react'

import { useContentDialog } from './useConentDialog'

import { ContentType } from '@/@types/ContentType'
import { Dialog, DialogContent } from '@/global/components/Dialog'

type ContentDialogProps = {
  children: ReactNode
  contentType: ContentType
}

export function ContentDialog({
  children: content,
  contentType,
}: ContentDialogProps) {
  const { dialogRef, handleDialogOpenChange } = useContentDialog(contentType)

  return (
    <Dialog ref={dialogRef} onOpenChange={handleDialogOpenChange}>
      <DialogContent>
        <div className="max-h-[32rem] overflow-auto">{content}</div>
      </DialogContent>
    </Dialog>
  )
}
