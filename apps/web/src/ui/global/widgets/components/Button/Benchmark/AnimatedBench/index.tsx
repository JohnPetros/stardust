'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'

type AnimatedBenchProps = {
  children: ReactNode
  delay: number
}

export function AnimatedBench({ children, delay }: AnimatedBenchProps) {
  const metricAniamtions: Variants = {
    down: {
      opacity: 0,
      y: 24,
    },
    up: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay,
      },
    },
  }

  return (
    <motion.div variants={metricAniamtions} initial='down' animate='up'>
      {children}
    </motion.div>
  )
}
