import { ReactNode } from 'react'
import { Variants, motion } from 'framer-motion'

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
}

export function AnimatedContainer({ children }: AnimatedInputProps) {
  return (
    <motion.div variants={variants} initial='initial' animate='visible'>
      {children}
    </motion.div>
  )
}
