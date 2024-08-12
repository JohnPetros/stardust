'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

const variants: Variants = {
  hover: {
    rotate: ['0deg', '15deg', '0deg', '-15deg', '0deg'],
    transition: {
      duration: 0.5,
    },
  },
}

type AnimatedImageProps = {
  children: ReactNode
  isLocked: boolean
}

export function AnimatedImage({ children, isLocked }: AnimatedImageProps) {
  return (
    <motion.div
      variants={variants}
      whileHover={!isLocked ? 'hover' : ''}
      className='cursor-pointer'
    >
      {children}
    </motion.div>
  )
}
