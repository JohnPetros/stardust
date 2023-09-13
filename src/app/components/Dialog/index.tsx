import * as Container from '@radix-ui/react-dialog'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import { ReactNode } from 'react'

export const DialogTitle = Container.Title

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

interface ShortCutsProps {
  children: ReactNode
  isOpen: boolean
  onClose: VoidFunction
}

export function Dialog({ children, isOpen, onClose }: ShortCutsProps) {
  return (
    <Container.Root open={isOpen} onOpenChange={onClose}>
      <Container.Portal>
        <Container.Overlay className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 z-50" />
        <Container.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-screen w-full max-w-lg p-6 z-50">
            <motion.div
              variants={dialogAnimations}
              initial="close"
              animate="open"
              exit="close"
              className="rounded-lg bg-gray-800 p-6 border border-gray-700"
            >
              {children}
            </motion.div>
        </Container.Content>
      </Container.Portal>
    </Container.Root>
  )
}
