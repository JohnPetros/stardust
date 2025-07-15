import { useEffect, type RefObject } from 'react'
import { useInView } from 'motion/react'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

export function useAnimatedSpiral(
  containerRef: RefObject<HTMLDivElement | null>,
  animationRef: RefObject<AnimationRef | null>,
) {
  const isInView = useInView(containerRef, { once: true })

  useEffect(() => {
    if (isInView) animationRef.current?.restart()
  }, [isInView, animationRef.current?.restart])

  return {
    isInView,
  }
}
