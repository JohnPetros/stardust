import { type RefObject, useEffect, useState } from 'react'

import type { AnimatedProgressBarRef } from '@/ui/global/widgets/components/AnimatedProgressBar/types'

const ANIMATION_DURATION_BETWEEN_TEXTS = 30 // seconds
const LAST_THANK_INDEX = 3

export function useEndingPage(progressBarRef: RefObject<AnimatedProgressBarRef>) {
  const [activeThankIndex, setActiveThankIndex] = useState(0)

  function nextText() {
    setActiveThankIndex((activeThankIndex) => activeThankIndex + 1)
    setTimeout(() => {
      progressBarRef.current?.fill(100, ANIMATION_DURATION_BETWEEN_TEXTS)
    }, 100)
  }

  function handleProgressBarAnimationEnd() {
    nextText()
  }

  function handleSkipTextButtonClick() {
    nextText()
  }

  useEffect(() => {
    progressBarRef.current?.fill(100, ANIMATION_DURATION_BETWEEN_TEXTS)
  }, [progressBarRef.current?.fill])

  return {
    activeThankIndex,
    lastThankIndex: LAST_THANK_INDEX,
    handleProgressBarAnimationEnd,
    handleSkipTextButtonClick,
  }
}
