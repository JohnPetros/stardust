import { useTransform, useScroll, useSpring, type Variants } from 'framer-motion'
import type { RefObject } from 'react'

export function useAnimatedCard(containerRef: RefObject<HTMLDivElement>) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
  })
  const itemYPosition = useTransform(scrollYProgress, [0, 1], [0, 120])
  const springItemYPositioon = useSpring(itemYPosition)

  return {
    itemYPosition: springItemYPositioon,
  }
}
