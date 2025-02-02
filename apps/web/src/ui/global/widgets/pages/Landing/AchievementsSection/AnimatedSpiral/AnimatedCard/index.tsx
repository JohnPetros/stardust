'use client'

import { motion, useTransform, useScroll, useSpring, type Variants } from 'framer-motion'
import type { PropsWithChildren, RefObject } from 'react'

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
    <motion.div
      style={{ y: springItemYPositioon }}
      variants={variants}
      initial='hidden'
      whileInView='visible'
      className={className}
    >
      {children}
    </motion.div>
  )
}
