import type { ReactNode } from 'react'
import { type Variants, motion } from 'motion/react'

const formVariants: Variants = {
  initial: {
    opacity: 0,
    x: -250,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      duration: 0.4,
    },
  },
  hidden: {
    opacity: 0,
    x: -250,
    transition: {
      duration: 1.5,
    },
  },
}

type AnimatedFormProps = {
  isVisible: boolean
  children: ReactNode
}

export function AnimatedForm({ isVisible, children }: AnimatedFormProps) {
  return (
    <motion.div
      variants={formVariants}
      initial={false}
      animate={isVisible ? 'hidden' : 'visible'}
      className={`w-full max-w-[320px] ${isVisible ? 'pointer-events-none' : ''}`}
      aria-hidden={isVisible}
      data-testid='animated-form'
    >
      {children}
    </motion.div>
  )
}
