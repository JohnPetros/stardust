'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

const variants: Variants = {
  hidden: {
    opacity: 0,
    y: -32,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

type TagProps = {
  children: ReactNode
}

export function Tag({ children }: TagProps) {
  return (
    <motion.div
      layout
      variants={variants}
      transition={{ delay: 0.5 }}
      initial='hidden'
      animate='visible'
      exit='hidden'
      className={
        'flex h-max w-max items-center justify-center gap-2 rounded-md bg-gray-800 p-2 text-xs text-gray-300'
      }
    >
      {children}
    </motion.div>
  )
}
