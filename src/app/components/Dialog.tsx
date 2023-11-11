'use client'

import { ReactNode } from 'react'
import * as Container from '@radix-ui/react-dialog'
import { motion, Variants } from 'framer-motion'

export const DialogTitle = Container.Title
export const DialogTrigger = Container.Trigger
export const DialogClose = Container.Close

const dialogAnimations: Variants = {
  close: {
    opacity: 0,
    scale: 0.8,
  },
  open: {
    opacity: 1,
    scale: 1,
  },
}

interface DialogProps {
  children: ReactNode
  onClose?: VoidFunction
}

export function Dialog({ children, onClose }: DialogProps) {
  return (
    <Container.Root onOpenChange={onClose}>
      <Container.Overlay className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50" />
      {children}
    </Container.Root>
  )
}

export function DialogAnimation({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={dialogAnimations}
      initial="close"
      animate="open"
      exit="close"
      className="rounded-lg border border-gray-700 bg-gray-800 p-6"
    >
      {children}
    </motion.div>
  )
}

export function DialogContent({ children }: { children: ReactNode }) {
  return (
    <Container.Portal>
      <Container.Content className="fixed left-1/2 top-1/2 z-50 max-h-screen w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-6">
        <DialogAnimation>{children}</DialogAnimation>
      </Container.Content>
    </Container.Portal>
  )
}
