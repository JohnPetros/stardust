import { useTransform, useScroll, useSpring } from 'framer-motion'
import type { RefObject } from 'react'

export function useAnimatedCard(containerRef: RefObject<HTMLDivElement>) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
  })
  const itemYPosition = useTransform(scrollYProgress, [0, 1], [0, 100])
  const springItemYPositioon = useSpring(itemYPosition)

  return {
    itemYPosition: springItemYPositioon,
  }
}
