'use client'

import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'

const variants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
}

export type AnimatedEndMessageProps = {
  children: ReactNode
}

export function AnimatedEndMessage({ children }: AnimatedEndMessageProps) {
  return (
    <motion.p variants={variants} initial='hidden' animate='visible'>
      {children}
    </motion.p>
  )
}
