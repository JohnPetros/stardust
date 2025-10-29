import { useRef } from 'react'

import type { AnimatedProgressBarRef } from '@/ui/global/widgets/components/AnimatedProgressBar/types'
import { EndingPageView } from './EndingPageView'
import { useEndingPage } from './useEndingPage'
import type { NavigationProvider } from '@stardust/core/global/interfaces'

export const EndingPage = () => {
  const progressBarRef = useRef<AnimatedProgressBarRef | null>(null)
  const {
    activeThankIndex,
    lastThankIndex,
    handleProgressBarAnimationEnd,
    handleSkipTextButtonClick,
  } = useEndingPage(progressBarRef)

  return (
    <EndingPageView
      progressBarRef={progressBarRef}
      activeThankIndex={activeThankIndex}
      lastThankIndex={lastThankIndex}
      navigationProvider={{} as NavigationProvider}
      onProgressBarAnimationEnd={handleProgressBarAnimationEnd}
      onSkipTextButtonClick={handleSkipTextButtonClick}
    />
  )
}
