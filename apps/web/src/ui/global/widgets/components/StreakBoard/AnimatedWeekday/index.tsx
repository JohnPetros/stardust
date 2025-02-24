'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const variants: Variants = {
  up: {
    opacity: 0,
    y: -12,
  },
  down: {
    opacity: 1,
    y: 0,
  },
}

type AnimatedWeekdayProps = {
  children: ReactNode
  index: number
}

export function AnimatedWeekday({ index, children }: AnimatedWeekdayProps) {
  return (
    <motion.div
      variants={variants}
      initial='up'
      animate='down'
      transition={{ delay: index * 0.4 }}
      className='flex flex-col items-center justify-center gap-2'
    >
      {children}
    </motion.div>
  )
}
