'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import * as C from '@radix-ui/react-checkbox'

const variants: Variants = {
  initial: {
    rotate: 90,
  },
  rotate: {
    rotate: 0,
  },
}

type AnimatedIndicatorProps = {
  children: ReactNode
}

export function AnimatedIndicator({ children }: AnimatedIndicatorProps) {
  return (
    <C.Indicator className='grid place-content-center'>
      <motion.div variants={variants} initial='initial' animate='rotate'>
        {children}
      </motion.div>
    </C.Indicator>
  )
}
