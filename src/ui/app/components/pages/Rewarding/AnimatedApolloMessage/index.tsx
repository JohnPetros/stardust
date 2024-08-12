'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const variants: Variants = {
  up: {
    opacity: 0,
    y: -32,
  },
  down: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
}

export type AnimatedApolloMessageProps = {
  children: ReactNode
}

export function AnimatedApolloMessage({ children }: AnimatedApolloMessageProps) {
  return (
    <motion.div variants={variants} initial='up' animate='down'>
      {children}
    </motion.div>
  )
}
