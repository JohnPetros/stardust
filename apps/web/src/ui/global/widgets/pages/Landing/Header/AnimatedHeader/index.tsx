'use client'

import { motion, type Variants } from 'framer-motion'
import type { PropsWithChildren } from 'react'

import { useAnimatedHeader } from './useAnimatedHeader'

const variants: Variants = {
  hidden: {
    y: '-100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
  },
}

export function AnimatedHeader({ children }: PropsWithChildren) {
  const { isVisible } = useAnimatedHeader()

  return (
    <motion.header
      variants={variants}
      initial='hidden'
      animate={isVisible ? 'visible' : ''}
      transition={{
        duration: 0.35,
        ease: 'easeInOut',
      }}
      className='fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-600 py-2 z-50'
    >
      {children}
    </motion.header>
  )
}
