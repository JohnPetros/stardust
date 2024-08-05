'use client'

import type { ReactNode } from 'react'

import { motion, type Variants } from 'framer-motion'

const variants: Variants = {
  shrink: {
    width: 0,
  },
  expand: {
    width: 'auto',
    paddingLeft: '8px',
    transition: {
      delay: 0.05,
    },
  },
}

type AnimatedTitleProps = {
  children: ReactNode
  isExpanded: boolean
}

export function AnimatedTitle({ children, isExpanded }: AnimatedTitleProps) {
  return (
    <motion.div
      variants={variants}
      initial='shrink'
      animate={isExpanded ? 'expand' : ''}
      className='block overflow-hidden'
    >
      {children}
    </motion.div>
  )
}
