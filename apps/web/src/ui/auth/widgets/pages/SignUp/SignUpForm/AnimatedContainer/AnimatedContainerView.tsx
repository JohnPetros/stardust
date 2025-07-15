import type { ReactNode } from 'react'
import { type Variants, motion } from 'motion/react'

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

type Props = {
  children: ReactNode
  className?: string
}

export const AnimatedContainerView = ({ children, className }: Props) => {
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
