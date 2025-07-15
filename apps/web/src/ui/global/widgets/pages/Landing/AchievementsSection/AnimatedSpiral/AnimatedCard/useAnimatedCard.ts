import { useTransform, useScroll, useSpring } from 'motion/react'
import type { RefObject } from 'react'

export function useAnimatedCard(containerRef: RefObject<HTMLDivElement | null>) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
  })
  const itemYPosition = useTransform(scrollYProgress, [0, 1], [0, 100])
  const springItemYPositioon = useSpring(itemYPosition)

  return {
    itemYPosition: springItemYPositioon,
  }
}
