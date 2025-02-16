'use client'

import { useEffect, type RefObject } from 'react'

import { useInView } from '@/ui/global/hooks/useInView'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

const ANIMATION_DURATION = 2.15 // seconds

export function usePodiumAnimation(
  containerRef: RefObject<HTMLDivElement>,
  animationRef: RefObject<AnimationRef>,
) {
  const isInView = useInView(containerRef)

  useEffect(() => {
    if (!isInView) return

    animationRef.current?.restart()

    const timeout = setTimeout(() => {
      animationRef.current?.stopAt(ANIMATION_DURATION)
    }, ANIMATION_DURATION * 1000)

    return () => clearTimeout(timeout)
  }, [isInView, animationRef.current?.restart, animationRef.current?.stopAt])
}
