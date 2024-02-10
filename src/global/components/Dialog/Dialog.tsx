'use client'

import { ForwardedRef, forwardRef, ReactNode, useImperativeHandle } from 'react'
import { Overlay, Root } from '@radix-ui/react-dialog'
import { AnimatePresence } from 'framer-motion'

import { useDialog } from './useDialog'

export type DialogRef = {
  open: VoidFunction
  close: VoidFunction
}

type DialogProps = {
  children: ReactNode
  shouldStartOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export const DialogComponent = (
  { children, shouldStartOpen = false, onOpenChange }: DialogProps,
  ref: ForwardedRef<DialogRef>
) => {
  const { isOpen, open, close, handleOpenChange } = useDialog(
    shouldStartOpen,
    onOpenChange
  )

  useImperativeHandle(ref, () => {
    return {
      open,
      close,
    }
  })

  return (
    <Root open={isOpen} onOpenChange={handleOpenChange}>
      <Overlay className="fixed inset-0 z-[500] overflow-y-auto bg-gray-900 bg-opacity-50" />
      <AnimatePresence>{children}</AnimatePresence>
    </Root>
  )
}

export const Dialog = forwardRef(DialogComponent)
