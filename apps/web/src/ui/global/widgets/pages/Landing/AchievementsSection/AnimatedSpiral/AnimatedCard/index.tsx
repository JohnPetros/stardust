'use client'

import { motion, type Variants } from 'motion/react'
import type { PropsWithChildren, RefObject } from 'react'

import { useAnimatedCard } from './useAnimatedCard'

const variants: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
}

type AnimatedCardProps = {
  containerRef: RefObject<HTMLDivElement | null>
  className: string
}

export function AnimatedCard({
  containerRef,
  className,
  children,
}: PropsWithChildren<AnimatedCardProps>) {
  const { itemYPosition } = useAnimatedCard(containerRef)

  return (
    <motion.div
      style={{ y: itemYPosition }}
      variants={variants}
      initial='hidden'
      whileInView='visible'
      className={className}
    >
      {children}
    </motion.div>
  )
}
