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

type AnimatedContainerViewProps = {
  children: ReactNode
  isSidenavExpanded: boolean
  onClick: VoidFunction
}

export function AnimatedContainerView({
  children,
  isSidenavExpanded,
  onClick,
}: AnimatedContainerViewProps) {
  return (
    <motion.main
      variants={variants}
      initial='shrink'
      animate={isSidenavExpanded ? 'expand' : 'shrink'}
      className='h-full pt-16'
      onClick={onClick}
    >
      {children}
    </motion.main>
  )
}
