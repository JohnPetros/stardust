import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'

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

interface DialogAnimationProps {
  children: ReactNode
}

export function DialogAnimation({ children }: DialogAnimationProps) {
  return (
    <motion.div
      variants={dialogAnimations}
      initial='close'
      animate='open'
      exit='close'
      className='rounded-lg border border-gray-700 bg-gray-800 p-6'
    >
      {children}
    </motion.div>
  )
}
