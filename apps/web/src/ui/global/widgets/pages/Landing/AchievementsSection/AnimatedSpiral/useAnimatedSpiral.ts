import { useEffect, type RefObject } from 'react'
import { useInView } from 'framer-motion'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

export function useAnimatedSpiral(
  containerRef: RefObject<HTMLDivElement>,
  animationRef: RefObject<AnimationRef>,
) {
  const isInView = useInView(containerRef)

  useEffect(() => {
    if (isInView) animationRef.current?.restart()
  }, [isInView, animationRef.current?.restart])

  return {
    isInView,
  }
}
