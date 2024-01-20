import { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'

const textAnimations: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.99,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
      type: 'tween',
      ease: 'linear',
    },
  },
}

type AnimationProps = {
  children: ReactNode
  hasAnimation: boolean
}

export function Animation({ hasAnimation, children }: AnimationProps) {
  return (
    <motion.div
      variants={textAnimations}
      initial={hasAnimation && 'hidden'}
      animate={hasAnimation && 'visible'}
    >
      {children}
    </motion.div>
  )
}
