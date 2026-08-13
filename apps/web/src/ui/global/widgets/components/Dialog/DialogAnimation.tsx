import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { type ClassNameValue, twMerge } from 'tailwind-merge'

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
  className?: ClassNameValue
}

export function DialogAnimation({ children, className }: DialogAnimationProps) {
  return (
    <motion.div
      variants={dialogAnimations}
      initial='close'
      animate='open'
      exit='close'
      className={twMerge('rounded-lg border border-gray-700 bg-[#121819] p-6', className)}
    >
      {children}
    </motion.div>
  )
}
