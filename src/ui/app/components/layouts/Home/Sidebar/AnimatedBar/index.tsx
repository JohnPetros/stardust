'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'

const variants: Variants = {
  mobile: {
    paddingLeft: 0,
  },
  shrink: {
    paddingLeft: 80,
  },
  expand: {
    paddingLeft: 160,
  },
}

type AnimatedBarProps = {
  children: ReactNode
  isOpen: boolean
}

export function AnimatedBar({ children, isOpen }: AnimatedBarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          id='sidebar'
          variants={variants}
          initial='close'
          animate='open'
          exit='close'
          className='fixed left-0 z-20 h-screen w-80 bg-gray-900 pb-32 pt-16'
        >
          {children}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
