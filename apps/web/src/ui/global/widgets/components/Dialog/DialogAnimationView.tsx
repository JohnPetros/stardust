'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { type ClassNameValue, extendTailwindMerge } from 'tailwind-merge'

// Registra os utilitários `theme-*` nos grupos de raio e de largura de borda para que
// os overrides de `className` dos chamadores continuem prevalecendo.
const twMerge = extendTailwindMerge({
  theme: {
    borderRadius: ['theme', 'theme-full'],
  },
  classGroups: {
    'border-w': [{ border: ['theme-control'] }],
  },
})

const dialogAnimations: Variants = {
  close: {
    opacity: 0,
    scale: 0.8,
  },
  open: {
    opacity: 1,
    scale: 1,
  },
}

type DialogAnimationProps = {
  children: ReactNode
  className?: ClassNameValue
}

export function DialogAnimationView({ children, className }: DialogAnimationProps) {
  return (
    <motion.div
      variants={dialogAnimations}
      initial='close'
      animate='open'
      exit='close'
      className={twMerge(
        'rounded-theme border-theme-control border-theme-border-quiet bg-theme-surface p-6',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
