import { type RefObject, useEffect } from 'react'

import { useInView } from '@/ui/global/hooks/useInView'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

export function useAnimatedBackground(
  containerRef: RefObject<HTMLDivElement>,
  animationRef: RefObject<AnimationRef>,
) {
  const isInView = useInView(containerRef, { shouldExecuteOnce: true })

  useEffect(() => {
    if (isInView) {
      animationRef.current?.restart()
    }
  }, [isInView, animationRef.current?.restart])
}
