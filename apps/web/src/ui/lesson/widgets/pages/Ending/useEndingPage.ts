import { type RefObject, useEffect, useState } from 'react'

import type { AnimatedProgressBarRef } from '@/ui/global/widgets/components/AnimatedProgressBar/types'
import { useSleep } from '@/ui/global/hooks/useSleep'

const ANIMATION_DURATION_BETWEEN_TEXTS = 30 // seconds
const LAST_THANK_INDEX = 3

export function useEndingPage(progressBarRef: RefObject<AnimatedProgressBarRef>) {
  const [activeThankIndex, setActiveThankIndex] = useState(0)
  const { sleep } = useSleep()

  async function nextText() {
    setActiveThankIndex(activeThankIndex + 1)
    await sleep(100)
  }

  function handleProgressBarAnimationEnd() {
    nextText()
  }

  function handleSkipTextButtonClick() {
    nextText()
  }

  useEffect(() => {
    progressBarRef.current?.fill(100, ANIMATION_DURATION_BETWEEN_TEXTS)
  }, [progressBarRef.current])

  return {
    activeThankIndex,
    lastThankIndex: LAST_THANK_INDEX,
    handleProgressBarAnimationEnd,
    handleSkipTextButtonClick,
  }
}
