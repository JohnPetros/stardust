'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

const variants: Variants = {
  exit: {
    opacity: 0,
    x: -40,
  },
  left: {
    opacity: 1,
    x: 0,
  },
  right: {
    opacity: 0,
    x: 40,
  },
}

type AnimatedContent = {
  children: ReactNode
}

export function AnimatedContent({ children }: AnimatedContent) {
  return (
    <motion.div
      variants={variants}
      initial='right'
      animate='left'
      exit='exit'
      className='h-full'
    >
      {children}
    </motion.div>
  )
}
