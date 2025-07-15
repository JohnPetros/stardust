import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'

const variants: Variants = {
  down: {
    opacity: 0,
    y: 100,
  },
  up: {
    opacity: 1,
    y: 0,
  },
}

type Animated404 = {
  children: ReactNode
}

export function Animated404({ children }: Animated404) {
  return (
    <motion.div
      variants={variants}
      initial='down'
      animate='up'
      className='w-full max-w-3xl'
    >
      {children}
    </motion.div>
  )
}
