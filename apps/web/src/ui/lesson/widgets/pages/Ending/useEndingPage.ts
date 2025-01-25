import { type RefObject, useEffect, useState } from 'react'

import type { AnimatedProgressBarRef } from '@/ui/global/widgets/components/AnimatedProgressBar/types'

const ANIMATION_DURATION_BETWEEN_TEXTS = 5 // seconds

export function useEndingPage(progressBarRef: RefObject<AnimatedProgressBarRef>) {
  const [activeTextIndex, setActiveTextIndex] = useState(0)

  function handleProgressBarAnimationEnd() {
    setActiveTextIndex((activeTextIndex) => activeTextIndex + 1)
    progressBarRef.current?.fill(100, ANIMATION_DURATION_BETWEEN_TEXTS)
  }

  useEffect(() => {
    progressBarRef.current?.fill(100, ANIMATION_DURATION_BETWEEN_TEXTS)
  }, [progressBarRef.current?.fill])

  return {
    activeTextIndex,
    progressBarRef,
    handleProgressBarAnimationEnd,
  }
}
