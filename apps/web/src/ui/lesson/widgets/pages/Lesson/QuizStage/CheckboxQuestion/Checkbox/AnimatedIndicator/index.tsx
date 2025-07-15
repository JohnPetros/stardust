'use client'

import type { ReactNode } from 'react'
import { type Variants, motion } from 'motion/react'

const variants: Variants = {
  initial: {
    rotate: 90,
  },
  rotate: {
    rotate: 0,
  },
}

type CheckboxProps = {
  children: ReactNode
}

export function AnimatedIndicator({ children }: CheckboxProps) {
  return (
    <motion.div variants={variants} initial='initial' animate='rotate'>
      {children}
    </motion.div>
  )
}
