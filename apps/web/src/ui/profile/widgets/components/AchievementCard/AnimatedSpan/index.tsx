import type { ReactNode } from 'react'
import { type Variants, motion } from 'framer-motion'

const variants: Variants = {
  bounce: {
    scale: [1, 1.1, 1],
    transition: {
      repeat: Infinity,
      duration: 0.8,
    },
  },
}

type AnimatedSpan = {
  children: ReactNode
}

export function AnimatedSpan({ children }: AnimatedSpan) {
  return (
    <motion.span variants={variants} animate='bounce' className='w-max'>
      {children}
    </motion.span>
  )
}
