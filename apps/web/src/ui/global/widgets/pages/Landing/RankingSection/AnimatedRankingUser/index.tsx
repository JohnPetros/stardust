'use client'

import { motion, type Variants } from 'motion/react'
import type { PropsWithChildren } from 'react'

type AnimatedRankingUserProps = {
  index: number
}

export function AnimatedRankingUser({
  children,
  index,
}: PropsWithChildren<AnimatedRankingUserProps>) {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: 100,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 * index,
      },
    },
  }
  return (
    <motion.li variants={variants} initial='hidden' whileInView='visible' custom={index}>
      {children}
    </motion.li>
  )
}
