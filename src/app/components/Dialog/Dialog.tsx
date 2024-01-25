'use client'

import { ReactNode } from 'react'
import { Overlay, Root } from '@radix-ui/react-dialog'
import { AnimatePresence } from 'framer-motion'

type DialogProps = {
  children: ReactNode
  onOpenChange?: (isOpen: boolean) => void
}

export function Dialog({ children, onOpenChange }: DialogProps) {
  return (
    <Root onOpenChange={onOpenChange}>
      <Overlay className="fixed inset-0 z-[500] overflow-y-auto bg-black bg-opacity-50" />
      <AnimatePresence>{children}</AnimatePresence>
    </Root>
  )
}
