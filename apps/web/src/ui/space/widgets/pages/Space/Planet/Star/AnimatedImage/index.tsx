import { motion, type Variants } from 'framer-motion'

import type { ReactNode } from 'react'

const variants: Variants = {
  default: {
    scale: 1,
  },
  pulse: {
    scale: 1.15,
    transition: {
      repeat: Infinity,
      repeatType: 'mirror',
      duration: 0.4,
    },
  },
}

type AnimatedImageProps = {
  children: ReactNode
  shouldAnimate: boolean
}

export function AnimatedImage({ children, shouldAnimate }: AnimatedImageProps) {
  return (
    <motion.div
      variants={variants}
      initial='default'
      animate={shouldAnimate ? 'pulse' : ''}
      className='-ml-[36px]'
    >
      {children}
    </motion.div>
  )
}
