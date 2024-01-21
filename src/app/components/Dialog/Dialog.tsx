'use client'

import { ReactNode } from 'react'
import { Overlay, Root } from '@radix-ui/react-dialog'
import { AnimatePresence } from 'framer-motion'

interface DialogProps {
  children: ReactNode
  onClose?: VoidFunction
}

export function Dialog({ children, onClose }: DialogProps) {
  return (
    <Root onOpenChange={onClose}>
      <Overlay className="fixed inset-0 z-[400] overflow-y-auto bg-black bg-opacity-50" />
      <AnimatePresence>{children}</AnimatePresence>
    </Root>
  )
}
