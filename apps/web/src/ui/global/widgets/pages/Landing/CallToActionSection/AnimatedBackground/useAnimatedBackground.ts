import { type RefObject, useEffect } from 'react'

import { useInView } from '@/ui/global/hooks/useInView'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

const ANIMATION_DURATION = 3.068 // seconds

export function useAnimatedBackground(
  containerRef: RefObject<HTMLDivElement>,
  animationRef: RefObject<AnimationRef>,
) {
  const isInView = useInView(containerRef, { shouldExecuteOnce: true })

  useEffect(() => {
    if (isInView) {
      animationRef.current?.setSpeed('2x')
      animationRef.current?.restart()

      const timeout = setTimeout(
        () => {
          animationRef.current?.stopAt(ANIMATION_DURATION)
        },
        ANIMATION_DURATION * 1000 - 500,
      )

      return () => clearTimeout(timeout)
    }
  }, [
    isInView,
    animationRef.current?.setSpeed,
    animationRef.current?.restart,
    animationRef.current?.stopAt,
  ])

  return {
    isInView,
    animationDuration: ANIMATION_DURATION,
  }
}
