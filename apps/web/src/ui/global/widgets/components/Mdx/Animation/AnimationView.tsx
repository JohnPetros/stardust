import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'

const variants: Variants = {
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

type Props = {
  children: ReactNode
  hasAnimation: boolean
}

export const AnimationView = ({ hasAnimation = false, children }: Props) => {
  return (
    <motion.div
      variants={variants}
      initial={hasAnimation && 'hidden'}
      animate={hasAnimation && 'visible'}
      className='mt-10 w-full'
    >
      {children}
    </motion.div>
  )
}
