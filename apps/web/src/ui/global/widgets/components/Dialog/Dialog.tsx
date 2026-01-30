'use client'

import { type ForwardedRef, forwardRef, type ReactNode, useImperativeHandle } from 'react'
import { Overlay, Root } from '@radix-ui/react-dialog'

import type { DialogRef } from './types'
import { useDialog } from './useDialog'

type DialogProps = {
  children: ReactNode
  open?: boolean
  shouldStartOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export const DialogComponent = (
  { children, open, shouldStartOpen = false, onOpenChange }: DialogProps,
  ref: ForwardedRef<DialogRef>,
) => {
  const {
    isOpen,
    open: openDialog,
    close,
    handleOpenChange,
  } = useDialog(open ?? shouldStartOpen, onOpenChange)

  useImperativeHandle(ref, () => {
    return {
      open: openDialog,
      close,
    }
  }, [openDialog, close])

  return (
    <Root open={isOpen} onOpenChange={handleOpenChange}>
      <Overlay className='fixed inset-0 z-[500] overflow-y-auto bg-gray-900 bg-opacity-50' />
      {children}
    </Root>
  )
}

export const Dialog = forwardRef(DialogComponent)
