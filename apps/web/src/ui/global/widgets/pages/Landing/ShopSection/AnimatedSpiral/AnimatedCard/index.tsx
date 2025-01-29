'use client'

import { motion, useTransform, useScroll, useSpring } from 'framer-motion'
import type { PropsWithChildren, RefObject } from 'react'

type AnimatedCardProps = {
  containerRef: RefObject<HTMLDivElement>
  className: string
}

export function AnimatedCard({
  containerRef,
  className,
  children,
}: PropsWithChildren<AnimatedCardProps>) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
  })
  const itemYPosition = useTransform(scrollYProgress, [0, 1], [0, 100])
  const springItemYPositioon = useSpring(itemYPosition)

  return (
    <motion.div style={{ y: springItemYPositioon }} className={className}>
      {children}
    </motion.div>
  )
}
