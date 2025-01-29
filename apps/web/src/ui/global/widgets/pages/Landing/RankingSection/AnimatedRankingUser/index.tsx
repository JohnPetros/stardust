'use client'

import { motion, type Variants } from 'framer-motion'
import type { PropsWithChildren } from 'react'

const variants: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: (index: number) => ({
      delay: 0.05 * index,
    }),
  },
}

type AnimatedRankingUserProps = {
  index: number
}

export function AnimatedRankingUser({
  children,
  index,
}: PropsWithChildren<AnimatedRankingUserProps>) {
  return (
    <motion.li variants={variants} initial='hidden' animate='visible' custom={index}>
      {children}
    </motion.li>
  )
}
