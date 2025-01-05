'use client'

import type { ReactNode } from 'react'

import { Dialog, DialogContent } from '@/ui/global/widgets/components/Dialog'
import type { ContentType } from '../../layouts/Challenge/types/ContentType'
import { useContentDialog } from './useContentDialog'

type ContentDialogProps = {
  children: ReactNode
  contentType: ContentType
}

export function ContentDialog({ children: content, contentType }: ContentDialogProps) {
  const { dialogRef, handleDialogOpenChange } = useContentDialog(contentType)

  return (
    <Dialog ref={dialogRef} onOpenChange={handleDialogOpenChange}>
      <DialogContent>
        <div className='max-h-[32rem] overflow-auto'>{content}</div>
      </DialogContent>
    </Dialog>
  )
}
