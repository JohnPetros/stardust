'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const weekDayAnimations: Variants = {
  up: {
    opacity: 0,
    y: -12,
  },
  down: {
    opacity: 1,
    y: 0,
    transition: (index: number) => ({
      delay: index * 0.4,
    }),
  },
}

type AnimatedWeekdayProps = {
  children: ReactNode
  index: number
}

export function AnimatedWeekday({ index, children }: AnimatedWeekdayProps) {
  return (
    <motion.div
      variants={weekDayAnimations}
      initial='up'
      animate='down'
      custom={index}
      className='flex flex-col items-center justify-center gap-2'
    >
      {children}
    </motion.div>
  )
}
