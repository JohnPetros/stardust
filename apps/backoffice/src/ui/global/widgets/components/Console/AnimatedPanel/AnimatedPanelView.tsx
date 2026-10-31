'use client'

import { type Variants, motion } from 'motion/react'
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

type Props = {
  children: ReactNode
  height: string
  isOpen: boolean
  className: ClassNameValue
  onDragDown: VoidFunction
}

export const AnimatedPanelView = ({
  children,
  height,
  isOpen,
  className,
  onDragDown,
}: Props) => {
  const { animation, handleDragEnd } = useAnimatedPanel(isOpen, onDragDown)

  return (
    <motion.div
      variants={variants}
      animate={animation}
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
