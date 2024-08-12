'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const variants: Variants = {
  hidden: {
    opacity: 0,
    y: 64,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 2,
      duration: 0.2,
    },
  },
}

type AnimatedAvatarProps = {
  children: ReactNode
}

export function AnimatedAvatar({ children }: AnimatedAvatarProps) {
  return (
    <motion.div variants={variants} initial='hidden' animate='visible'>
      {children}
    </motion.div>
  )
}
