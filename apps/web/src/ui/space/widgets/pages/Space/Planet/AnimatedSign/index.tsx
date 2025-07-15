import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'

const variants: Variants = {
  float: {
    y: [6, -6, 6],
    transition: {
      repeat: Infinity,
      duration: 3,
    },
  },
}

type AnimatedSignProps = {
  children: ReactNode
}

export function AnimatedSign({ children }: AnimatedSignProps) {
  return (
    <motion.div
      variants={variants}
      animate='float'
      className='flex max-w-sm items-center gap-3 rounded-lg bg-green-800 p-3'
    >
      {children}
    </motion.div>
  )
}
