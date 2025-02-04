'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

const variants: Variants = {
  close: {
    x: -300,
  },
  open: {
    x: 0,
    transition: {
      ease: 'linear',
      duration: 0.25,
    },
  },
}

type AnimatedBarProps = {
  children: ReactNode
  isOpen: boolean
  className?: string
}

export function AnimatedBar({ children, isOpen, className }: AnimatedBarProps) {
  return (
    <motion.aside
      id='sidebar'
      variants={variants}
      initial='close'
      animate={isOpen ? 'open' : ''}
      className={twMerge(
        'fixed left-0 z-20 h-screen w-80 bg-gray-900 pb-32 pt-16',
        className,
      )}
    >
      {children}
    </motion.aside>
  )
}
