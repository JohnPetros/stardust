'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'

const variants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
}

export type RocketProps = {
  children: ReactNode
}

export function AnimatedItem({ children }: RocketProps) {
  return (
    <motion.div variants={variants} initial='hidden' animate='visible'>
      {children}
    </motion.div>
  )
}
