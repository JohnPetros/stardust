import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'

const variants: Variants = {
  down: {
    y: 0,
  },
  up: {
    y: -16,
    transition: {
      repeat: Infinity,
      repeatType: 'mirror',
      duration: 1.5,
    },
  },
}

export type Props = {
  children: ReactNode
  isSelected: boolean
}

export const AnimatedImageView = ({ children, isSelected }: Props) => {
  return (
    <motion.div
      variants={variants}
      initial='down'
      animate={isSelected ? 'up' : 'down'}
      className='relative mx-auto my-8 h-28 w-28'
    >
      {children}
    </motion.div>
  )
}
