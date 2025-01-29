'use client'

import Image, { type ImageProps } from 'next/image'
import type { RefObject } from 'react'
import { motion, useTransform, useScroll } from 'framer-motion'

type AnimatedItemProps = {
  containerRef: RefObject<HTMLDivElement>
} & ImageProps

export function AnimatedItem({ containerRef, ...props }: AnimatedItemProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
  })
  const itemPosition = useTransform(scrollYProgress, [0, 1], [0, 500])

  return (
    <motion.div style={{ y: itemPosition }}>
      <Image {...props} />
    </motion.div>
  )
}
