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

type AnimatedButton = {
  children: ReactNode
}

export function AnimatedButton({ children }: AnimatedButton) {
  return (
    <motion.main variants={variants} animate='bounce' className='w-max'>
      {children}
    </motion.main>
  )
}
