'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'

const variants: Variants = {
  hidden: {
    y: -64,
  },
  visible: {
    y: 0,
    transition: {
      delay: 2,
    },
  },
}

type AnimatedContainerProps = {
  children: ReactNode
}

export function AnimatedContainer({ children }: AnimatedContainerProps) {
  return (
    <motion.main
      variants={variants}
      initial='hidden'
      animate='visible'
      className='fixed top-0 z-50 flex h-16 w-screen justify-between border-b border-gray-700 bg-gray-900 px-6 py-3 md:justify-end'
    >
      {children}
    </motion.main>
  )
}
