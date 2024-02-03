'use client'

import { ReactNode } from 'react'

import { useContentDialog } from './useConentDialog'

import { ContentType } from '@/@types/contentType'
import { Dialog, DialogContent } from '@/app/components/Dialog'

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
