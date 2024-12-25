import type { ReactNode } from 'react'
import { type Variants, motion } from 'framer-motion'

const variants: Variants = {
  initial: {
    opacity: 0,
    x: -250,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      duration: 0.5,
    },
  },
}

type AnimatedInputProps = {
  children: ReactNode
  className?: string
}

export function AnimatedContainer({ children, className }: AnimatedInputProps) {
  return (
    <motion.div
      variants={variants}
      initial='initial'
      animate='visible'
      className={className}
    >
      {children}
    </motion.div>
  )
}
