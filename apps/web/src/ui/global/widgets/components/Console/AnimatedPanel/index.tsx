'use client'

import { type Variants, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { ClassNameValue } from 'tailwind-merge'

import { useAnimatedPanel } from './useAnimatedPanel'

const variants: Variants = {
  closed: {
    y: '100%',
  },
  open: {
    y: '40%',
  },
}

type AnimatedPanelProps = {
  children: ReactNode
  height: string
  isOpen: boolean
  className: ClassNameValue
}

export function AnimatedPanel({
  children,
  height,
  isOpen,
  className,
}: AnimatedPanelProps) {
  const { controls, handleDragEnd } = useAnimatedPanel(isOpen)

  return (
    <motion.div
      variants={variants}
      animate={controls}
      initial='closed'
      drag='y'
      dragConstraints={{ top: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{ minHeight: height }}
      className={className?.toString()}
    >
      {children}
    </motion.div>
  )
}
