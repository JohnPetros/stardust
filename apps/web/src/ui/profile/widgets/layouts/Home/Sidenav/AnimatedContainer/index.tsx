'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'

const variants: Variants = {
  shrink: {
    width: 88,
  },
  expand: {
    width: 164,
  },
}

type SidenavProps = {
  children: ReactNode
  isExpanded: boolean
}

export function AnimatedContainer({ children, isExpanded }: SidenavProps) {
  return (
    <motion.div
      id='sidenav'
      variants={variants}
      initial='shrink'
      animate={isExpanded ? 'expand' : ''}
      className='left-0 top-0 z-50 hidden h-full bg-gray-900 md:fixed md:flex'
    >
      {children}
    </motion.div>
  )
}
