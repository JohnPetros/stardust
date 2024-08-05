'use client'

import { motion, type Variants } from 'framer-motion'

const BASE_DELAY = 0.8 // s

type AnimatedLabelProps = {
  position: number
  baseHeight: number
}

export function AnimatedPodium({ position, baseHeight }: AnimatedLabelProps) {
  const podiumVariants: Variants = {
    hidden: {
      height: baseHeight - 40 * position - 1,
    },
    visible: {
      height: 0,
      transition: {
        delay: BASE_DELAY * position - 1,
        duration: 0.5,
      },
    },
  }

  return (
    <motion.span
      variants={podiumVariants}
      initial='hidden'
      animate='visible'
      className='absolute bottom-0 top-0 z-30 h-full w-full bg-gray-900'
    />
  )
}
